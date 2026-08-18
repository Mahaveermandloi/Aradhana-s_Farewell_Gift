import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedImages = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const allowedVideos = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

function sanitizeFilename(filename) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");
}

function getExtension(filename) {
  const match = filename.match(/\.[^/.]+$/);
  return match ? match[0].toLowerCase() : "";
}

export default async function handler(req, res) {
  // =================================================
  // ONLY POST
  // =================================================

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // =================================================
    // CHECK BLOB TOKEN
    // =================================================

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        success: false,
        message:
          "BLOB_READ_WRITE_TOKEN is not configured.",
      });
    }

    // =================================================
    // PARSE MULTIPART FORM DATA
    // =================================================

    const form = formidable({
      multiples: true,

      maxFileSize:
        100 * 1024 * 1024,

      keepExtensions: true,
    });

    const [, files] = await form.parse(req);

    // =================================================
    // NORMALIZE FILE ARRAYS
    // =================================================

    const imageFiles = files.images
      ? Array.isArray(files.images)
        ? files.images
        : [files.images]
      : [];

    const videoFiles = files.videos
      ? Array.isArray(files.videos)
        ? files.videos
        : [files.videos]
      : [];

    // =================================================
    // NO FILES
    // =================================================

    if (
      imageFiles.length === 0 &&
      videoFiles.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select at least one file.",
      });
    }

    // =================================================
    // RESPONSE ARRAYS
    // =================================================

    const uploadedImages = [];
    const uploadedVideos = [];

    // =================================================
    // UPLOAD IMAGES
    // =================================================

    for (const file of imageFiles) {
      // Validate MIME type
      if (!allowedImages.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid image type: ${file.originalFilename}`,
        });
      }

      const originalName =
        file.originalFilename ||
        "image";

      const safeName =
        sanitizeFilename(originalName);

      const extension =
        getExtension(originalName);

      const filename =
        `${safeName}-${Date.now()}${extension}`;

      const blobPath =
        `photos/${filename}`;

      // Read temporary uploaded file
      const fileBuffer =
        await fs.readFile(file.filepath);

      // Upload to Vercel Blob
      const blob = await put(
        blobPath,
        fileBuffer,
        {
          access: "public",

          contentType:
            file.mimetype,

          addRandomSuffix: false,
        }
      );

      uploadedImages.push({
        name: filename,
        type: "image",
        url: blob.url,
      });
    }

    // =================================================
    // UPLOAD VIDEOS
    // =================================================

    for (const file of videoFiles) {
      // Validate MIME type
      if (!allowedVideos.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid video type: ${file.originalFilename}`,
        });
      }

      const originalName =
        file.originalFilename ||
        "video";

      const safeName =
        sanitizeFilename(originalName);

      const extension =
        getExtension(originalName);

      const filename =
        `${safeName}-${Date.now()}${extension}`;

      const blobPath =
        `videos/${filename}`;

      // Read temporary uploaded file
      const fileBuffer =
        await fs.readFile(file.filepath);

      // Upload to Vercel Blob
      const blob = await put(
        blobPath,
        fileBuffer,
        {
          access: "public",

          contentType:
            file.mimetype,

          addRandomSuffix: false,
        }
      );

      uploadedVideos.push({
        name: filename,
        type: "video",
        url: blob.url,
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Memories uploaded successfully ❤️",

      images: uploadedImages,

      videos: uploadedVideos,
    });
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Upload failed.",
    });
  }
}