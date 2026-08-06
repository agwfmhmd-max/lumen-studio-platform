import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function createUploadSignature(folder = process.env.CLOUDINARY_FOLDER || "lumen-studio") {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { timestamp, folder };
  return { ...params, signature: cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET || ""), apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME };
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: "image" | "video" = "image") {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
}

export async function uploadFromUrl(url: string, resourceType: "image" | "video" = "image") {
  return cloudinary.uploader.upload(url, { resource_type: resourceType, folder: process.env.CLOUDINARY_FOLDER || "lumen-studio" });
}
