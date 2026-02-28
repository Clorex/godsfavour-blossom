import { v2 as cloudinary } from "cloudinary";

export function assertCloudinaryEnv() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("Missing CLOUDINARY_CLOUD_NAME");
  if (!process.env.CLOUDINARY_API_KEY) throw new Error("Missing CLOUDINARY_API_KEY");
  if (!process.env.CLOUDINARY_API_SECRET) throw new Error("Missing CLOUDINARY_API_SECRET");
}

export function cloudinaryClient() {
  assertCloudinaryEnv();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });
  return cloudinary;
}

export async function uploadImageFile(params: { file: File; folder: string; publicId?: string }) {
  const cld = cloudinaryClient();
  const { file, folder, publicId } = params;

  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are allowed");
  const maxBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxBytes) throw new Error("Image too large (max 5MB)");

  const ab = await file.arrayBuffer();
  const buffer = Buffer.from(ab);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const res = await cld.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    resource_type: "image",
    overwrite: true,
  });

  return { url: res.secure_url, publicId: res.public_id };
}
