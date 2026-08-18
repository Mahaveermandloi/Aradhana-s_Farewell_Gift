import axios from "axios";
import { useEffect, useState } from "react";

export default function UploadContent({ onClose }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =================================================
  // CLEAN UP PREVIEW URLS WHEN COMPONENT UNMOUNTS
  // =================================================

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });

      selectedVideos.forEach((video) => {
        URL.revokeObjectURL(video.url);
      });
    };
  }, []);

  // =================================================
  // IMAGE SELECTION
  // =================================================

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const imageUrls = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [
      ...prev,
      ...imageUrls,
    ]);

    setMessage("");
    setError("");

    // Allow selecting the same file again
    e.target.value = "";
  };

  // =================================================
  // VIDEO SELECTION
  // =================================================

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const videoUrls = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedVideos((prev) => [
      ...prev,
      ...videoUrls,
    ]);

    setMessage("");
    setError("");

    // Allow selecting the same file again
    e.target.value = "";
  };

  // =================================================
  // REMOVE IMAGE
  // =================================================

  const removeImage = (index) => {
    const image = selectedImages[index];

    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }

    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setMessage("");
  };

  // =================================================
  // REMOVE VIDEO
  // =================================================

  const removeVideo = (index) => {
    const video = selectedVideos[index];

    if (video?.url) {
      URL.revokeObjectURL(video.url);
    }

    setSelectedVideos((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setMessage("");
  };

  // =================================================
  // UPLOAD TO BACKEND USING AXIOS
  // =================================================

  const handleUpload = async () => {
    // No files selected
    if (
      selectedImages.length === 0 &&
      selectedVideos.length === 0
    ) {
      setError(
        "Please select at least one file."
      );
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      // =================================================
      // CREATE FORMDATA
      // =================================================

      const formData = new FormData();

      // =================================================
      // ADD IMAGES
      // =================================================

      selectedImages.forEach((image) => {
        formData.append(
          "images",
          image.file
        );
      });

      // =================================================
      // ADD VIDEOS
      // =================================================

      selectedVideos.forEach((video) => {
        formData.append(
          "videos",
          video.file
        );
      });

      // =================================================
      // SEND TO EXPRESS BACKEND
      // =================================================

      const response = await axios.post(
        "/api/upload",
        formData
      );

      console.log(
        "Upload response:",
        response.data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.data.success) {
        setMessage(
          "Memories uploaded successfully ❤️"
        );

        // Remove previews
        selectedImages.forEach((image) => {
          URL.revokeObjectURL(image.url);
        });

        selectedVideos.forEach((video) => {
          URL.revokeObjectURL(video.url);
        });

        // Clear selected files
        setSelectedImages([]);
        setSelectedVideos([]);

        // =================================================
        // WAIT A LITTLE THEN REFRESH
        // =================================================

        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        );

        // Refresh complete website
        window.location.reload();
      }
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      // Axios error response
      if (error.response) {
        setError(
          error.response.data?.message ||
            "Upload failed."
        );
      }

      // Backend not running / connection error
      else if (error.request) {
        setError(
          "Cannot connect to server. Please make sure the backend is running."
        );
      }

      // Other error
      else {
        setError(
          error.message ||
            "Something went wrong while uploading."
        );
      }

      // Stop loader if upload fails
      setUploading(false);
    }
  };

  return (
    <>
      {/* ================================================= */}
      {/* UPLOAD MODAL */}
      {/* ================================================= */}

      <div
        className="
          fixed
          inset-0
          z-[200]
          flex
          items-center
          justify-center
          bg-black/50
          px-4
          backdrop-blur-sm
        "
      >
        <div
          className="
            max-h-[90vh]
            w-full
            max-w-lg
            overflow-y-auto
            rounded-2xl
            bg-white
            p-8
            shadow-2xl
          "
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Add a Memory ❤️
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Upload photos or videos
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="
                text-xl
                text-gray-400
                transition
                hover:text-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              ✕
            </button>
          </div>

          {/* ================================================= */}
          {/* IMAGE UPLOAD */}
          {/* ================================================= */}

          <label
            className="
              mb-4
              block
              cursor-pointer
              rounded-2xl
              border-2
              border-dashed
              border-gray-300
              p-8
              text-center
              transition
              hover:border-gray-700
            "
          >
            <div className="text-4xl">
              📸
            </div>

            <p className="mt-3 font-medium text-gray-800">
              Upload Images
            </p>

            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG, WEBP
            </p>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          {/* ================================================= */}
          {/* VIDEO UPLOAD */}
          {/* ================================================= */}

          <label
            className="
              block
              cursor-pointer
              rounded-2xl
              border-2
              border-dashed
              border-gray-300
              p-8
              text-center
              transition
              hover:border-gray-700
            "
          >
            <div className="text-4xl">
              🎥
            </div>

            <p className="mt-3 font-medium text-gray-800">
              Upload Videos
            </p>

            <p className="mt-1 text-sm text-gray-500">
              MP4, MOV, WEBM
            </p>

            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              multiple
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploading}
            />
          </label>

          {/* ================================================= */}
          {/* SELECTED FILES */}
          {/* ================================================= */}

          {(selectedImages.length > 0 ||
            selectedVideos.length > 0) && (
            <div className="mt-6">

              <h3 className="mb-3 text-sm font-semibold text-gray-800">
                Selected Files
              </h3>

              {/* ================================================= */}
              {/* SELECTED IMAGES */}
              {/* ================================================= */}

              {selectedImages.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="
                      mb-2
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      bg-gray-100
                      p-2
                    "
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="
                        h-12
                        w-12
                        rounded-lg
                        object-cover
                      "
                    />

                    <p className="flex-1 truncate text-sm">
                      📸 {image.name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      disabled={uploading}
                      className="
                        px-2
                        text-gray-400
                        hover:text-red-500
                        disabled:opacity-50
                      "
                    >
                      ✕
                    </button>
                  </div>
                )
              )}

              {/* ================================================= */}
              {/* SELECTED VIDEOS */}
              {/* ================================================= */}

              {selectedVideos.map(
                (video, index) => (
                  <div
                    key={`${video.name}-${index}`}
                    className="
                      mb-2
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      bg-gray-100
                      p-2
                    "
                  >
                    <video
                      src={video.url}
                      className="
                        h-12
                        w-12
                        rounded-lg
                        object-cover
                      "
                      muted
                      preload="metadata"
                    />

                    <p className="flex-1 truncate text-sm">
                      🎥 {video.name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        removeVideo(index)
                      }
                      disabled={uploading}
                      className="
                        px-2
                        text-gray-400
                        hover:text-red-500
                        disabled:opacity-50
                      "
                    >
                      ✕
                    </button>
                  </div>
                )
              )}

              {/* ================================================= */}
              {/* SUCCESS MESSAGE */}
              {/* ================================================= */}

              {message && (
                <p
                  className="
                    mt-4
                    rounded-lg
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    text-green-600
                  "
                >
                  {message}
                </p>
              )}

              {/* ================================================= */}
              {/* ERROR MESSAGE */}
              {/* ================================================= */}

              {error && (
                <p
                  className="
                    mt-4
                    rounded-lg
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-500
                  "
                >
                  {error}
                </p>
              )}

              {/* ================================================= */}
              {/* UPLOAD BUTTON */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="
                  mt-4
                  w-full
                  rounded-xl
                  bg-gray-800
                  py-3
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-black
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Memories ❤️"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* FULL SCREEN UPLOAD LOADER */}
      {/* ================================================= */}

      {uploading && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            flex-col
            items-center
            justify-center
            bg-black/60
            px-6
            backdrop-blur-md
          "
        >
          {/* ================================================= */}
          {/* LOADER */}
          {/* ================================================= */}

          <div
            className="
              relative
              mb-6
              h-20
              w-20
            "
          >
            {/* Outer circle */}

            <div
              className="
                absolute
                inset-0
                rounded-full
                border-4
                border-white/20
              "
            />

            {/* Spinning circle */}

            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-full
                border-4
                border-transparent
                border-t-white
              "
            />

            {/* Cat */}

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                text-3xl
              "
            >
              🐱
            </div>
          </div>

          {/* ================================================= */}
          {/* LOADER TEXT */}
          {/* ================================================= */}

          <h3
            className="
              text-xl
              font-semibold
              text-white
            "
          >
            Uploading memories...
          </h3>

          <p
            className="
              mt-2
              text-center
              text-sm
              text-white/70
            "
          >
            Please wait while we save
            your photos ❤️
          </p>

          {/* ================================================= */}
          {/* ANIMATED DOTS */}
          {/* ================================================= */}

          <div className="mt-4 flex gap-1">
            <span
              className="
                animate-bounce
                text-xl
                text-white
              "
            >
              •
            </span>

            <span
              className="
                animate-bounce
                text-xl
                text-white
              "
              style={{
                animationDelay: "150ms",
              }}
            >
              •
            </span>

            <span
              className="
                animate-bounce
                text-xl
                text-white
              "
              style={{
                animationDelay: "300ms",
              }}
            >
              •
            </span>
          </div>
        </div>
      )}
    </>
  );
}