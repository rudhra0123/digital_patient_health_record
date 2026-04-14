const express = require("express");
const axios = require("axios");
const { upload, uploadToS3 } = require("../middleware/upload");
const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Record = require("../models/Record");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const Patient = require("../models/Patient");
const Visit = require("../models/Visit");

const pdfParse = require("pdf-parse");
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const router = express.Router();

router.get("/debug/models", async (req, res) => {
  try {
    const modelList = await genAI.listModels();
    const models = [];
    for await (const model of modelList) {
      models.push({
        name: model.name,
        displayName: model.displayName,
        supportedGenerationMethods: model.supportedGenerationMethods
      });
    }
    res.json({ 
      availableModels: models,
      apiKeyPresent: !!process.env.GEMINI_API_KEY
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      hint: "Check if GEMINI_API_KEY is valid and API is enabled"
    });
  }
});


router.post("/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { patientUid, hospital, doctor, visitDate, reason } = req.body;

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const fileKey = await uploadToS3(req.file);

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      const record = await Record.create({
        patientUid,
        hospital,
        doctor,
        visitDate,
        reason,
        fileUrl,
        fileKey
      });
      console.log("fileUrl:", fileUrl);


      res.json({
        msg: "Record uploaded successfully",
        record
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ msg: "Upload failed" });
    }
  }
);
router.get("/history/:patientUid", async (req, res) => {
  try {
    const { patientUid } = req.params;

    const records = await Record.find({ patientUid });

    const recordsWithUrl = await Promise.all(
      records.map(async (record) => {

        const key = record.fileKey || (() => {
          try {
            const u = new URL(record.fileUrl);
            return u.pathname.replace(/^\//, "");
          } catch (e) {

            const parts = record.fileUrl.split('.amazonaws.com/');
            return parts[1] || record.fileUrl;
          }
        })();

        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, {
          expiresIn: 3600,
        });

        return {
          ...record.toObject(),
          signedUrl,
        };
      })
    );

    res.json(recordsWithUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch records" });
  }
});



router.post("/generate-summary/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ msg: "Record not found" });
    }

    // 1️⃣ Fetch PDF from S3
  
    const key = record.fileKey || (() => {
      try {
        const u = new URL(record.fileUrl);
        return u.pathname.replace(/^\//, "");
      } catch (e) {
        const parts = record.fileUrl.split('.amazonaws.com/');
        return parts[1] || record.fileUrl;
      }
    })();

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);

    const pdfBuffer = await streamToBuffer(response.Body);

    let textContent = "";
    
    try {
      const pdfData = await pdfParse(pdfBuffer);
      textContent = pdfData.text;
      console.log("✅ PDF parsed successfully");
    } catch (pdfError) {
      console.warn("⚠️ PDF parsing failed (corrupted file):", pdfError.message);
      console.warn("📄 Using fallback: record metadata only");
      

      textContent = `Doctor: ${record.doctor}\nHospital: ${record.hospital}\nVisit Date: ${record.visitDate}\nReason: ${record.reason}`;
    }

    let summary;
    
    try {
      if (textContent.length > 20) {
        const model = genAI.getGenerativeModel({
          model:"gemini-2.5-flash",
        });

        const result = await model.generateContent(
          `Summarize this medical report in 5 bullet points:\n\n${textContent.slice(0, 12000)}`
        );

        summary = result.response.text();
        console.log("✅ Gemini summary generated");
      } else {
        throw new Error("Insufficient text content");
      }
    } catch (geminiError) {
      console.warn("⚠️ Gemini API failed, using fallback summary:", geminiError.message);

      summary = generateFallbackSummary(textContent);
    }

    await Record.updateOne(
      { _id: record._id },
      { summary: summary }
    );

    res.json({ summary });

  } catch (error) {
    console.error("❌ Summary generation failed:", error.message);
    res.status(500).json({ 
      msg: error.message.includes("bad XRef") || error.message.includes("PDF") 
        ? "PDF file appears corrupted. Unable to generate summary from PDF content."
        : "Failed to generate summary. Please try again."
    });
  }
});


const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

const generateFallbackSummary = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 10);
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  const medicalKeywords = ['diagnosis', 'treatment', 'patient', 'symptom', 'disease', 
                          'medication', 'clinical', 'examination', 'result', 'prescription'];
  
  const keyLines = [];
  for (let i = 0; i < sentences.length && keyLines.length < 5; i++) {
    const sentence = sentences[i].trim();
    if (sentence.length > 15 && sentence.length < 200) {
      const hasMedicalTerm = medicalKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      );
      if (hasMedicalTerm || i < 5 || i % 3 === 0) {
        keyLines.push(`• ${sentence}`);
      }
    }
  }
  
  if (keyLines.length === 0) {
    keyLines.push(`• ${lines.slice(0, 5).join(' ')}`);
  }
  
  return keyLines.slice(0, 5).join('\n');
};

router.get("/patient-history/:patientUid", async (req, res) => {
  try {
    const { patientUid } = req.params;

    const patient = await Patient.findOne({ patientUid });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // ✅ get all visits
    const visits = await Visit.find({ patient: patient._id })
      .populate("doctor", "name specialization")
      .sort({ visitDate: -1 });

    // ✅ get all records with signed URLs
    const records = await Record.find({ patientUid });

    const recordsWithUrl = await Promise.all(
      records.map(async (record) => {
        const key = record.fileKey || (() => {
          try {
            const u = new URL(record.fileUrl);
            return u.pathname.replace(/^\//, "");
          } catch (e) {
            const parts = record.fileUrl.split('.amazonaws.com/');
            return parts[1] || record.fileUrl;
          }
        })();

        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { ...record.toObject(), signedUrl };
      })
    );

    // ✅ group records by visitId
    const groupedVisits = visits.map(visit => ({
      ...visit.toObject(),
      records: recordsWithUrl.filter(r =>
        r.visitId && r.visitId.toString() === visit._id.toString()
      )
    }));

    // ✅ old records with no visitId
    const unlinkedRecords = recordsWithUrl.filter(r => !r.visitId);

    res.json({ groupedVisits, unlinkedRecords });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
