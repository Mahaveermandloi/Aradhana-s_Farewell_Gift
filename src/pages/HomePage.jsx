import { useEffect, useState } from "react";
import LoginPage from "./LoginPage";
import GallerySection from "./GallerySection";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Images from public/photos
  const heroImages = [
    "/photos/img1.jpeg",
    "/photos/img2.jpeg",
    "/photos/img3.jpeg",
    "/photos/img4.jpeg",
    "/photos/img5.jpeg",
  ];

  // Change poster image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6]">

      {/* ================================================= */}
      {/* STICKY POSTER */}
      {/* ================================================= */}

      <section className="sticky top-0 z-0 h-[75vh] px-4 py-5 md:px-8 lg:px-10">
        <div className="relative h-full w-full overflow-hidden rounded-[28px]">

          {/* HERO IMAGES */}
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt={`Featured memory ${index + 1}`}
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-opacity
                duration-1000
                ease-in-out
                ${
                  currentImage === index
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />
          ))}

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* TOP BAR */}
          <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-5 md:p-7">

            <div className="text-white">
              <h1 className="text-xl font-awake tracking-wide md:text-2xl">
                Our Memories ❤️
              </h1>

              <p className="mt-1 text-xs text-white/80 md:text-sm">
                A little collection of our KPMG memories
              </p>
            </div>

            {/* UPLOAD BUTTON */}
            <button
              onClick={() => setShowLogin(true)}
              className="
                rounded-full
                border border-white/40
                bg-white/10
                px-5 py-2.5
                text-sm font-medium text-white
                backdrop-blur-md
                transition duration-300
                hover:bg-white/25
              "
            >
              + Upload
            </button>
          </div>

          {/* CENTER QUOTE */}
      {/* CENTER QUOTE */}
<div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
  <div className="max-w-4xl text-white">

    <p className="font-awake text-lg tracking-[0.25em] text-white/90 md:text-2xl">
      Memories that stay
    </p>

    <h2
      className="
        mt-4
     font-awake
        text-5xl
        font-medium
        leading-[0.9]
        tracking-wide
        md:text-7xl
        lg:text-4xl
        drop-shadow-lg
      "
    >
      Some moments are meant
      <br />
      to be remembered forever.
    </h2>

  </div>
</div>

          {/* SLIDER INDICATORS */}
          <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2">

            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-500
                  ${
                    currentImage === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }
                `}
              />
            ))}

          </div>

        </div>
      </section>

      {/* ================================================= */}
      {/* GALLERY */}
      {/* ================================================= */}

      <main
        className="
          relative
          z-10
          -mt-[100vh]
          pt-[100vh]
        "
      >
        <GallerySection />
      </main>

      {/* ================================================= */}
      {/* LOGIN */}
      {/* ================================================= */}

      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
        />
      )}

    </div>
  );
}