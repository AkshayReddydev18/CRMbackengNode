const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_photos", // optional folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `user_${timestamp}`;
    },
  },
});

const upload = multer({ storage });

module.exports = upload;
