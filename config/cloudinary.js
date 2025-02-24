import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (optional)
});

// Upload to cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "student_folder", resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(error.message || "Cloudinary upload failed");
        }
        resolve(result.secure_url); // ✅ Make sure to return the correct URL
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export { upload, uploadToCloudinary };
