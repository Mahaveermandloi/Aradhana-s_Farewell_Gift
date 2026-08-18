import { useEffect, useState } from "react";

export default function UploadContent({ onClose }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Clean up preview URLs
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

    const imageUrls = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...imageUrls]);
    setMessage("");
    setError("");

    e.target.value = "";
  };

  // =================================================
  // VIDEO SELECTION
  // =================================================

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const videoUrls = files.map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedVideos((prev) => [...prev, ...videoUrls]);
    setMessage("");
    setError("");

    e.target.value = "";
  };

  // =================================================
  // REMOVE IMAGE
  // =================================================

  const removeImage = (index) => {
    URL.revokeObjectURL(selectedImages[index].url);

    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =================================================
  // REMOVE VIDEO
  // =================================================

  const removeVideo = (index) => {
    URL.revokeObjectURL(selectedVideos[index].url);

    setSelectedVideos((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =================================================
  // UPLOAD TO BACKEND
  // =================================================

  const handleUpload = async () => {
    if (
      selectedImages.length === 0 &&
      selectedVideos.length === 0
    ) {
      setError("Please select at least one file.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      // Add images
      selectedImages.forEach((image) => {
        formData.append("images", image.file);
      });

      // Add videos
      selectedVideos.forEach((video) => {
        formData.append("videos", video.file);
      });

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      setMessage("Memories uploaded successfully ❤️");

      setSelectedImages([]);
      setSelectedVideos([]);

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

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
            className="text-xl text-gray-400 transition hover:text-gray-800"
          >
            ✕
          </button>

        </div>

        {/* ================================================= */}
        {/* IMAGE UPLOAD */}
        {/* ================================================= */}

        <label className="mb-4 block cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-700">

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
          />

        </label>

        {/* ================================================= */}
        {/* VIDEO UPLOAD */}
        {/* ================================================= */}

        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-700">

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

            {/* IMAGES */}

            {selectedImages.map((image, index) => (

              <div
                key={`${image.name}-${index}`}
                className="mb-2 flex items-center gap-3 rounded-lg bg-gray-100 p-2"
              >

                <img
                  src={image.url}
                  alt={image.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />

                <p className="flex-1 truncate text-sm">
                  📸 {image.name}
                </p>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-2 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>

              </div>

            ))}

            {/* VIDEOS */}

            {selectedVideos.map((video, index) => (

              <div
                key={`${video.name}-${index}`}
                className="mb-2 flex items-center gap-3 rounded-lg bg-gray-100 p-2"
              >

                <video
                  src={video.url}
                  className="h-12 w-12 rounded-lg object-cover"
                />

                <p className="flex-1 truncate text-sm">
                  🎥 {video.name}
                </p>

                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="px-2 text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>

              </div>

            ))}

            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            {message && (
              <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
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
  );
}