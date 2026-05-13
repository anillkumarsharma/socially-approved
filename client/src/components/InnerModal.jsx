import { useEffect, useState } from "react";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

export default function InnerModal({ videos, startIndex, onClose, onLikeChange }) {
  const [current, setCurrent] = useState(startIndex);
  const [muted, setMuted] = useState(true);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goPrev = () => setCurrent((i) => Math.max(0, i - 1));
  const goNext = () => setCurrent((i) => Math.min(videos.length - 1, i + 1));

  const prev = current > 0 ? videos[current - 1] : null;
  const active = videos[current];
  const next = current < videos.length - 1 ? videos[current + 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 text-white hover:text-pink-400 transition w-10 h-10 rounded-full bg-black/40 sm:bg-transparent flex items-center justify-center"
        aria-label="Close"
      >
        <X className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Prev arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        disabled={current === 0}
        className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl flex items-center justify-center disabled:opacity-30 hover:scale-110 transition"
        aria-label="Previous"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Next arrow */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        disabled={current === videos.length - 1}
        className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white shadow-xl flex items-center justify-center disabled:opacity-30 hover:scale-110 transition"
        aria-label="Next"
      >
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* 3-up carousel: prev (dim, small) | active (focused, large) | next (dim, small) */}
      <div
        className="relative flex items-center justify-center gap-3 lg:gap-6 w-full max-w-[1100px] h-[90vh] sm:h-[80vh] px-12 sm:px-16 md:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev video (small, muted preview) */}
        <div
          className="hidden md:block w-[180px] lg:w-[220px] h-[75%] rounded-3xl overflow-hidden opacity-50 hover:opacity-80 scale-95 transition cursor-pointer bg-black"
          onClick={goPrev}
        >
          {prev && (
            <video
              key={prev._id}
              src={prev.videoUrl}
              poster={prev.thumbnail}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover pointer-events-none"
            />
          )}
        </div>

        {/* Active focused card */}
        <div className="w-full max-w-[340px] md:max-w-[360px] lg:max-w-[380px] h-[90%] shadow-2xl ring-1 ring-white/10 rounded-3xl overflow-hidden">
          <VideoPlayer
            key={active._id}
            video={active}
            active
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            onLikeChange={onLikeChange}
          />
        </div>

        {/* Next video (small, muted preview) */}
        <div
          className="hidden md:block w-[180px] lg:w-[220px] h-[75%] rounded-3xl overflow-hidden opacity-50 hover:opacity-80 scale-95 transition cursor-pointer bg-black"
          onClick={goNext}
        >
          {next && (
            <video
              key={next._id}
              src={next.videoUrl}
              poster={next.thumbnail}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
