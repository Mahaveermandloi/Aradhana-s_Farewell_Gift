import { list } from "@vercel/blob";

export default async function handler(req, res) {
  // =================================================
  // ONLY GET
  // =================================================

  if (req.method !== "GET") {
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
    // GET PHOTOS
    // =================================================

    const photoResult = await list({
      prefix: "photos/",
    });

    // =================================================
    // GET VIDEOS
    // =================================================

    const videoResult = await list({
      prefix: "videos/",
    });

    // =================================================
    // FORMAT PHOTOS
    // =================================================

    const images = photoResult.blobs
      .map((blob) => ({
        name: blob.pathname
          .replace("photos/", ""),

        type: "image",

        url: blob.url,
      }))
      .sort(
        (a, b) =>
          b.name.localeCompare(a.name)
      );

    // =================================================
    // FORMAT VIDEOS
    // =================================================

    const videos = videoResult.blobs
      .map((blob) => ({
        name: blob.pathname
          .replace("videos/", ""),

        type: "video",

        url: blob.url,
      }))
      .sort(
        (a, b) =>
          b.name.localeCompare(a.name)
      );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      images,

      videos,
    });
  } catch (error) {
    console.error(
      "Gallery error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load gallery.",
    });
  }
}