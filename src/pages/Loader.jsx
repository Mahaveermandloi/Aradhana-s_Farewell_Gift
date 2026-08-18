import { useEffect, useState } from "react";
import { FaCat } from "react-icons/fa";

const cats = [
  "/cats/cat-1.jpg",
  "/cats/cat-2.jpg",
  "/cats/cat-3.jpg",
  "/cats/cat-4.jpg",
  "/cats/cat-5.jpg",
  "/cats/cat-6.jpg",
  "/cats/cat-7.jpg",
  "/cats/cat-8.jpg",
  "/cats/cat-9.jpg",
  "/cats/cat-10.jpg",
  "/cats/cat-11.jpg",
  "/cats/cat-12.jpg",
  "/cats/cat-13.jpg",
  "/cats/cat-14.jpg",
  "/cats/cat-15.jpg",
  "/cats/cat-16.jpg",
  "/cats/cat-17.jpg",
  "/cats/cat-18.jpg",
  "/cats/cat-19.jpg",
  "/cats/cat-20.jpg",
  "/cats/cat-21.jpg",
];

export default function Loader() {
  const [current, setCurrent] = useState(0);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const sound = new Audio("/cats/meow.mp3");

    sound.volume = 1.0;
    sound.preload = "auto";

    setAudio(sound);

    // Try autoplay
    sound
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        console.log("Autoplay blocked. Click the button to play.");
      });

    sound.onended = () => {
      setIsPlaying(false);
    };

    // Cat animation
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % cats.length);
    }, 700);

    return () => {
      clearInterval(interval);
      sound.pause();
      sound.currentTime = 0;
    };
  }, []);

  const playMeow = () => {
    if (!audio) return;

    audio.currentTime = 0;

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log("Audio error:", error);
      });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#252432] px-6">
      <div className="flex w-full max-w-4xl flex-col items-center">

        {/* CAT IMAGES */}
        <div className="relative flex h-56 w-full items-center justify-center overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${current * 180}px)`,
            }}
          >
            {[...cats, ...cats].map((image, index) => (
              <div
                key={index}
                className="h-48 w-40 shrink-0 overflow-hidden rounded-3xl bg-white/10 shadow-2xl"
              >
                <img
                  src={image}
                  alt={`Cat ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* MESSAGE */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-3 text-center">
            <FaCat className="text-3xl text-white" />

            <p className="font-[Awake] text-2xl font-semibold tracking-wide text-white md:text-3xl">
              Wait Aradhana, wait..... meow
            </p>

            <FaCat className="text-3xl text-white" />
          </div>

          {/* PLAY BUTTON */}
          <button
            onClick={playMeow}
            className="mt-5 flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 active:scale-95"
          >
            <span className="text-lg">
              {isPlaying ? "🐱" : "▶️"}
            </span>

            {isPlaying ? "Meowing..." : "Play Meow"}
          </button>
        </div>

        {/* LOADING DOTS */}
        <div className="mt-5 flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />

          <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}