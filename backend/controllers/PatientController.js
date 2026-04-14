const { uploadToS3 } = require("../middleware/upload");

exports.uploadRecord = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const key = await uploadToS3(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      fileKey: key,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};
