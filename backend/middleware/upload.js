const multer = require("multer");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToS3 = async (file) => {
  const fileName = `records/${Date.now()}-${file.originalname}`;

  const s3Upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    },
  });

  await s3Upload.done();
  return fileName;
};

module.exports = { upload, uploadToS3 };
