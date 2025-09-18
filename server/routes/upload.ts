import { RequestHandler } from "express";
import { v2 as cloudinary } from "cloudinary";

function ensureConfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary not configured");
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export const uploadFromUrl: RequestHandler = async (req, res) => {
  try {
    ensureConfigured();
    const { url, folder } = req.body as { url: string; folder?: string };
    if (!url) return res.status(400).json({ error: "url required" });
    const result = await cloudinary.uploader.upload(url, { folder: folder || "tiros" });
    res.json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Upload failed" });
  }
};
