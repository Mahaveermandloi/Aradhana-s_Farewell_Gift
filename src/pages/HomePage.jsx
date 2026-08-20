import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LoginPage from "./LoginPage";
import GallerySection from "./GallerySection";

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false);

  const [heroImages, setHeroImages] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [loadingImages, setLoadingImages] = useState(true);

  const audioRef = useRef(null);

  // =================================================
  // FETCH GALLERY IMAGES
  // =================================================

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoadingImages(true);

        const response = await axios.get("/api/gallery");

        console.log("Gallery response:", response.data);

        const images = response.data.images || [];

        // Use gallery images for hero
        setHeroImages(images);

        // Start from first image
        setCurrentImage(0);
      } catch (error) {
        console.error("Hero gallery fetch error:", error);

        setHeroImages([]);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchGalleryImages();
  }, []);

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
    if (heroImages.length <= 1) {
      return;
    }

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

          {loadingImages ? (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-gray-200
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    mb-4
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-300
                    border-t-gray-800
                  "
                />

                <p className="text-sm text-gray-600">Loading memories...</p>
              </div>
            </div>
          ) : heroImages.length > 0 ? (
            heroImages.map((image, index) => (
              <img
                key={image.name || image.url || index}
                src={image.url}
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
                    ${currentImage === index ? "opacity-100" : "opacity-0"}
                  `}
              />
            ))
          ) : (
            // No images uploaded yet
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-gray-200
              "
            >
              <p className="text-sm text-gray-500">
                No memories uploaded yet ❤️
              </p>
            </div>
          )}

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
                aria-label={isPlaying ? "Pause sound" : "Play sound"}
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
                onClick={() => setShowMessage(true)}
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
                Aradhana a message for you 💖
              </button>

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

          {heroImages.length > 1 && (
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
          )}
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

      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}

      {/* ================================================= */}
      {/* ARADHANA MESSAGE MODAL */}
      {/* ================================================= */}

      {showMessage && (
        <div
          className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/60
      px-4
      backdrop-blur-sm
      animate-in
      fade-in
      duration-300
    "
          onClick={() => setShowMessage(false)}
        >
          <div
            className="
        relative
        w-full
        max-w-2xl
        max-h-[85vh]
        overflow-hidden
        rounded-[28px]
        bg-[#fffdf9]
        shadow-2xl
        animate-in
        zoom-in-95
        duration-300
      "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              className="
          absolute
          right-5
          top-5
          z-20
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          bg-black/5
          text-xl
          text-gray-600
          transition
          hover:bg-black/10
          hover:text-black
          active:scale-95
        "
              aria-label="Close message"
            >
              ×
            </button>

            {/* Decorative Top */}
            <div className="px-7 pb-3 pt-8 text-center md:px-12 md:pt-10">
              <div className="mb-3 text-3xl">🌸</div>

              <p
                className="
            text-xs
            uppercase
            tracking-[0.35em]
            text-gray-400
          "
              >
                A little message
              </p>

              <h2
                className="
            mt-2
            font-awake
            text-3xl
            font-medium
            tracking-wide
            text-[#172b43]
            md:text-4xl
          "
              >
                For Aradhana ✨
              </h2>

              <div className="mx-auto mt-4 h-px w-16 bg-gray-200" />
            </div>

            {/* Message */}
            <div
              className="
          max-h-[58vh]
          overflow-y-auto
          px-7
          pb-8
          pt-4
          md:px-12
          md:pb-10
        "
            >
              <div
                className="
            text-center
            text-[15px]
            leading-7
            text-gray-700
            md:text-base
            md:leading-8
          "
              >
                <p>
                  Some people start out as colleagues... and then, somewhere
                  between the deadlines and the laughter, they turn into the
                  cutest, most treasured memories. That's exactly what happened
                  with you. 💛
                </p>

                <p className="mt-5">
                  You're kind, brilliant, endlessly helpful, wildly ambitious —
                  and yet still such a giggly, curious little soul at heart
                  <span className="whitespace-nowrap"> 🐾</span>.
                </p>

                <p className="mt-5">
                  From deep work chats to deeper "let's just dance it out"
                  moments, from guitar strums 🎸 to movie nights 🎬 to your
                  absolute devotion to pubs and good vibes 🍹 — you've made
                  every single day a little more fun, a little more colorful,
                  and a lot more <i>you</i>.
                </p>

                <p className="mt-5">
                  You've been the best kind of colleague,friend, the mentor
                  everyone wishes they had, and honestly? Just a really
                  wonderful human to know.
                </p>

                <p className="mt-5">
                  Watching you grow and shine has been such a joy — like getting
                  a front-row seat to someone becoming even more amazing.
                </p>

                <p className="mt-5">
                  So here's to more laughing till it hurts, more spontaneous
                  dance breaks, more singing off-key and not caring, and more of
                  you being unapologetically, adorably you.
                </p>

                {/* Quote */}
                <div
                  className="
              my-8
              rounded-2xl
              bg-[#f8f4ee]
              px-6
              py-6
              text-center
            "
                >
                  <p
                    className="
                font-awake
                text-xl
                leading-8
                text-[#172b43]
                md:text-2xl
              "
                  >
                    Some people leave behind memories...
                    <br />
                    but you?
                    <br />
                    <span className="font-semibold">
                      You are the memory. 🌷✨
                    </span>
                  </p>
                </div>

                <p>
                  With all the love, all the giggles, and just a sprinkle of
                  mischief —
                </p>

                <p className="mt-4 font-medium text-[#172b43]">
                  stay exactly as wonderfully weird and wonderful as you are,
                  Aradhana. 🐣💫
                </p>

                {/* Bottom decoration */}
                <div className="mt-7 text-xl tracking-[0.5em]">✦ 🌸 ✦</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
