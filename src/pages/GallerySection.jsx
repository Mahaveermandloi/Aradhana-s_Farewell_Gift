import axios from "axios";
import { useEffect, useState } from "react";

export default function GallerySection() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =================================================
  // FETCH GALLERY
  // =================================================

  const fetchGallery = async () => {
    try {
      setError("");

      const response = await axios.get("/api/gallery");

      console.log("Gallery response:", response.data);

      setGalleryImages(response.data.images || []);

      setGalleryVideos(response.data.videos || []);
    } catch (error) {
      console.error("Gallery fetch error:", error);

      setError("Unable to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // FETCH WHEN COMPONENT LOADS
  // =================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <>
      <section
        className="
          relative
          min-h-screen
          rounded-t-[32px]
          bg-[#faf9f6]
          px-4
          py-8
          md:px-8
          lg:px-10
        "
      >
        {/* ================================================= */}
        {/* GALLERY HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex items-end justify-between font-awake">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
              The Gallery
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-800 md:text-3xl">
              Little moments ❤️
            </h2>
          </div>

          <p className="hidden text-sm text-gray-400 md:block">
            Click a memory to enlarge
          </p>
        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-gray-400">Loading memories... ❤️</p>
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY GALLERY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          galleryImages.length === 0 &&
          galleryVideos.length === 0 && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-gray-400">
                No memories uploaded yet ❤️
              </p>
            </div>
          )}

        {/* ================================================= */}
        {/* PINTEREST GALLERY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          (galleryImages.length > 0 || galleryVideos.length > 0) && (
            <div
              className="
                columns-2
                gap-4
                sm:columns-3
                lg:columns-4
                xl:columns-5
              "
            >
              {/* ================================================= */}
              {/* IMAGES */}
              {/* ================================================= */}

              {galleryImages.map((image, index) => (
                <div
                  key={`image-${image.name}`}
                  onClick={() => setSelectedImage(image.url)}
                  className="
                      group
                      mb-4
                      break-inside-avoid
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      bg-white
                    "
                >
                  <img
                    src={image.url}
                    alt={`Memory ${index + 1}`}
                    loading="lazy"
                    className="
                        block
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-110
                      "
                  />
                </div>
              ))}

              {/* ================================================= */}
              {/* VIDEOS */}
              {/* ================================================= */}

              {galleryVideos.map((video) => (
                <div
                  key={`video-${video.name}`}
                  className="
                      group
                      mb-4
                      break-inside-avoid
                      overflow-hidden
                      rounded-2xl
                      bg-white
                    "
                >
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    className="
                        block
                        w-full
                        rounded-2xl
                      "
                  />
                </div>
              ))}
            </div>
          )}
      </section>

      {/* ================================================= */}
      {/* IMAGE POPUP */}
      {/* ================================================= */}

      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-center
            justify-center
            bg-black/80
            p-4
            backdrop-blur-sm
          "
          onClick={() => setSelectedImage(null)}
        >
          {/* IMAGE CONTAINER */}

          <div
            className="
              relative
              inline-block
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* ================================================= */}
            {/* CLOSE BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
              className="
                absolute
                right-4
                top-4
                z-50
                inline-flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/30
                bg-white/15
                text-white
                shadow-lg
                backdrop-blur-xl
                transition-all
                duration-300
                hover:scale-105
                hover:bg-white/25
                focus:outline-none
                focus:ring-2
                focus:ring-white/40
              "
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>

            {/* ================================================= */}
            {/* ENLARGED IMAGE */}
            {/* ================================================= */}

            <img
              src={selectedImage}
              alt="Enlarged memory"
              className="
                block
                max-h-[90vh]
                max-w-[95vw]
                rounded-2xl
                object-contain
                shadow-2xl
              "
            />
          </div>
        </div>
      )}
    </>
  );
}
