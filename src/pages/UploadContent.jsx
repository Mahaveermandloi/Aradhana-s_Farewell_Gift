import { useState } from "react";

export default function UploadContent({ onClose }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const imageUrls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...imageUrls]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);

    const videoUrls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setSelectedVideos((prev) => [...prev, ...videoUrls]);
  };

  const handleUpload = () => {
    alert("Files selected successfully!");

    // Later connect this to:
    // Supabase / Firebase / Backend API
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">

        {/* HEADER */}
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
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-800"
          >
            ✕
          </button>

        </div>

        {/* IMAGE UPLOAD */}
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
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />

        </label>

        {/* VIDEO UPLOAD */}
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
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideoUpload}
          />

        </label>

        {/* SELECTED FILES */}
        {(selectedImages.length > 0 ||
          selectedVideos.length > 0) && (
          <div className="mt-6">

            <h3 className="mb-3 text-sm font-semibold">
              Selected Files
            </h3>

            {/* IMAGES */}
            {selectedImages.map((image, index) => (
              <div
                key={index}
                className="mb-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
              >
                📸 {image.name}
              </div>
            ))}

            {/* VIDEOS */}
            {selectedVideos.map((video, index) => (
              <div
                key={index}
                className="mb-2 rounded-lg bg-gray-100 px-3 py-2 text-sm"
              >
                🎥 {video.name}
              </div>
            ))}

            {/* UPLOAD */}
            <button
              onClick={handleUpload}
              className="mt-4 w-full rounded-xl bg-gray-800 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Upload Memories
            </button>

          </div>
        )}

      </div>
    </div>
  );
}