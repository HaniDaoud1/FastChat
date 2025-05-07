import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string,
});

// CloudinaryStorage avec fonction pour params
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "posts", // autorisé via fonction
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
    transformation: [
      { width: 1920, height: 1080, crop: "limit", quality: "auto:best" },
    ],
  }),
});

const upload = multer({ storage });

export { cloudinary, upload };
