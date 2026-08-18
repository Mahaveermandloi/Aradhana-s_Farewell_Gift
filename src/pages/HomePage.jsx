import { useEffect, useRef, useState } from "react";
import LoginPage from "./LoginPage";
import GallerySection from "./GallerySection";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const heroImages = [
    "/photos/img1.jpeg",
    "/photos/img2.jpeg",
    "/photos/img3.jpeg",
    "/photos/img4.jpeg",
    "/photos/img5.jpeg",
  ];

  // =================================================
  // AUDIO
  // =================================================

  useEffect(() => {
    const audio = new Audio("/sounds/meow.mp3");

    audio.volume = 0.5;
    audio.loop = true;

    audioRef.current = audio;

    // Try autoplay
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        setIsPlaying(false);
        console.log("Autoplay blocked. Click play.");
      });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // =================================================
  // PLAY / PAUSE
  // =================================================

  const toggleSound = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  // =================================================
  // IMAGE SLIDER
  // =================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-[#faf9f6]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative h-[75vh] px-4 py-5 md:px-8 lg:px-10">
        <div className="relative h-full w-full overflow-hidden rounded-[28px]">

          {/* ================================================= */}
          {/* HERO IMAGES */}
          {/* ================================================= */}

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

          {/* ================================================= */}
          {/* DARK OVERLAY */}
          {/* ================================================= */}

          <div className="absolute inset-0 bg-black/20" />

          {/* ================================================= */}
          {/* TOP BAR */}
          {/* ================================================= */}

          <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between p-5 md:p-7">

            {/* TITLE */}

            <div className="text-white">
              <h1 className="text-xl font-awake tracking-wide md:text-2xl">
                Our Memories with Aradhana❤️
              </h1>

              <p className="mt-1 text-xs text-white/80 md:text-sm">
                A little collection of our BSR memories
              </p>
            </div>

            {/* ================================================= */}
            {/* RIGHT BUTTONS */}
            {/* ================================================= */}

            <div className="flex items-center gap-2">

              {/* SOUND BUTTON */}

              <button
                type="button"
                onClick={toggleSound}
                aria-label={
                  isPlaying ? "Pause sound" : "Play sound"
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/40
                  bg-white/10
                  text-white
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:bg-white/25
                  active:scale-95
                "
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>

              {/* UPLOAD BUTTON */}

              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="
                  rounded-full
                  border
                  border-white/40
                  bg-white/10
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  backdrop-blur-md
                  transition
                  duration-300
                  hover:bg-white/25
                  active:scale-95
                "
              >
                + Upload
              </button>

            </div>
          </div>

          {/* ================================================= */}
          {/* CENTER QUOTE */}
          {/* ================================================= */}

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center">

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
                  drop-shadow-lg
                  md:text-7xl
                  lg:text-4xl
                "
              >
                Some moments are meant
                <br />
                to be remembered forever.
              </h2>

            </div>
          </div>

          {/* ================================================= */}
          {/* SLIDER INDICATORS */}
          {/* ================================================= */}

          <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-2">

            {heroImages.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentImage(index)}
                aria-label={`Go to image ${index + 1}`}
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

      <main className="relative z-10">
        <GallerySection />
      </main>

      {/* ================================================= */}
      {/* LOGIN MODAL */}
      {/* ================================================= */}

      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
        />
      )}

    </div>
  );
}