import express, { json, static as expressStatic } from "express";
import cors from "cors";
import multer, { diskStorage } from "multer";
import {
  join,
  dirname,
  extname,
  basename,
} from "path";
import {
  existsSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { fileURLToPath } from "url";

// =====================================================
// ES MODULE __dirname
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =====================================================
// EXPRESS
// =====================================================

const app = express();

app.use(cors());
app.use(json());

// =====================================================
// FOLDERS
// =====================================================

const photosFolder = join(
  __dirname,
  "public",
  "photos"
);

const videosFolder = join(
  __dirname,
  "public",
  "videos"
);

// Create folders automatically
if (!existsSync(photosFolder)) {
  mkdirSync(photosFolder, {
    recursive: true,
  });
}

if (!existsSync(videosFolder)) {
  mkdirSync(videosFolder, {
    recursive: true,
  });
}

// =====================================================
// SERVE STATIC FILES
// =====================================================

app.use(
  "/photos",
  expressStatic(photosFolder)
);

app.use(
  "/videos",
  expressStatic(videosFolder)
);

// =====================================================
// MULTER STORAGE
// =====================================================

const storage = diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") {
      cb(null, photosFolder);
    } else if (file.fieldname === "videos") {
      cb(null, videosFolder);
    } else {
      cb(new Error("Invalid file field"));
    }
  },

  filename: (req, file, cb) => {
    const extension = extname(
      file.originalname
    );

    const originalName = basename(
      file.originalname,
      extension
    )
      .replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      );

    const filename =
      `${originalName}-${Date.now()}${extension}`;

    cb(null, filename);
  },
});

// =====================================================
// MULTER
// =====================================================

const upload = multer({
  storage,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    // -------------------------
    // IMAGES
    // -------------------------

    if (file.fieldname === "images") {
      const allowedImages = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        allowedImages.includes(
          file.mimetype
        )
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only JPG, PNG and WEBP images are allowed"
          )
        );
      }

      return;
    }

    // -------------------------
    // VIDEOS
    // -------------------------

    if (file.fieldname === "videos") {
      const allowedVideos = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ];

      if (
        allowedVideos.includes(
          file.mimetype
        )
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Only MP4, MOV and WEBM videos are allowed"
          )
        );
      }

      return;
    }

    cb(
      new Error(
        "Invalid file field"
      )
    );
  },
});

// =====================================================
// UPLOAD API
// =====================================================

app.post(
  "/api/upload",

  upload.fields([
    {
      name: "images",
      maxCount: 50,
    },
    {
      name: "videos",
      maxCount: 20,
    },
  ]),

  (req, res) => {
    try {
      const images =
        req.files?.images || [];

      const videos =
        req.files?.videos || [];

      console.log(
        `Images uploaded: ${images.length}`
      );

      console.log(
        `Videos uploaded: ${videos.length}`
      );

      const imagesResponse = images.map(
        (file) => ({
          name: file.filename,
          type: "image",
          url: `http://localhost:5000/photos/${encodeURIComponent(
            file.filename
          )}`,
        })
      );

      const videosResponse = videos.map(
        (file) => ({
          name: file.filename,
          type: "video",
          url: `http://localhost:5000/videos/${encodeURIComponent(
            file.filename
          )}`,
        })
      );

      res.status(200).json({
        success: true,

        message:
          "Memories uploaded successfully ❤️",

        images: imagesResponse,

        videos: videosResponse,
      });
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  }
);

// =====================================================
// GET ALL GALLERY FILES
// =====================================================

app.get(
  "/api/gallery",
  (req, res) => {
    try {
      const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
      ];

      const videoExtensions = [
        ".mp4",
        ".webm",
        ".mov",
      ];

      // -------------------------
      // GET IMAGES
      // -------------------------

      const photos =
        readdirSync(photosFolder)
          .filter((file) =>
            imageExtensions.includes(
              extname(file).toLowerCase()
            )
          )
          .map((file) => ({
            name: file,
            type: "image",
            url: `http://localhost:5000/photos/${encodeURIComponent(
              file
            )}`,
          }));

      // -------------------------
      // GET VIDEOS
      // -------------------------

      const videos =
        readdirSync(videosFolder)
          .filter((file) =>
            videoExtensions.includes(
              extname(file).toLowerCase()
            )
          )
          .map((file) => ({
            name: file,
            type: "video",
            url: `http://localhost:5000/videos/${encodeURIComponent(
              file
            )}`,
          }));

      // Sort newest-ish by filename
      photos.reverse();
      videos.reverse();

      res.json({
        success: true,
        images: photos,
        videos: videos,
      });
    } catch (error) {
      console.error(
        "Gallery error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to load gallery",
      });
    }
  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Server error:",
      error
    );

    res.status(400).json({
      success: false,

      message:
        error.message ||
        "Something went wrong",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(
  PORT,
  () => {
    console.log(
      "================================="
    );

    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );

    console.log(
      `📸 Photos: ${photosFolder}`
    );

    console.log(
      `🎥 Videos: ${videosFolder}`
    );

    console.log(
      "================================="
    );
  }
);