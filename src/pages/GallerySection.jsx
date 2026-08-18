import { useState } from "react";

const galleryImages = [
  "/photos/img1.jpeg",
  "/photos/img2.jpeg",
  "/photos/img3.jpeg",
  "/photos/img4.jpeg",
  "/photos/img5.jpeg",
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState(null);

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
        {/* GALLERY HEADER */}
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

        {/* PINTEREST GALLERY */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
          {galleryImages.map((image, index) => (
            <div
              key={image}
              onClick={() => setSelectedImage(image)}
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
                src={image}
                alt={`Memory ${index + 1}`}
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
        </div>
      </section>

      {/* IMAGE POPUP */}
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
            className="relative inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
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

            {/* ENLARGED IMAGE */}
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