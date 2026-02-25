import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  // Don’t throw at import-time for local dev pages; throw only when uploading.
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export function assertCloudinaryEnv() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("Missing CLOUDINARY_CLOUD_NAME");
  if (!process.env.CLOUDINARY_API_KEY) throw new Error("Missing CLOUDINARY_API_KEY");
  if (!process.env.CLOUDINARY_API_SECRET) throw new Error("Missing CLOUDINARY_API_SECRET");
}

export async function uploadImageFile(params: {
  file: File;
  folder: string;
  publicId?: string;
}) {
  assertCloudinaryEnv();

  const { file, folder, publicId } = params;

  // Basic server-side validation
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are allowed");
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) throw new Error("Image too large (max 5MB)");

  const ab = await file.arrayBuffer();
  const buffer = Buffer.from(ab);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    resource_type: "image",
  });

  return {
    url: res.secure_url,
    publicId: res.public_id,
    width: res.width,
    height: res.height,
    format: res.format,
  };
}
