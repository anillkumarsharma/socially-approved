import { useEffect, useRef, useState } from "react";
import useInView from "../hooks/useInView";

export default function VideoCard({ video, onClick }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Lazy attach + autoplay/pause based on viewport
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      if (!el.src && el.dataset.src) {
        el.src = el.dataset.src;
      }
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView]);

  return (
    <button
      ref={ref}
      onClick={() => onClick(video)}
      className="group relative shrink-0 w-[200px] h-[340px] sm:w-[240px] sm:h-[400px] md:w-[280px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Thumbnail (always present for instant paint) */}
      <img
        src={video.thumbnail}
        alt={video.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Lazy preview video (muted, looping, plays in viewport) */}
      <video
        ref={videoRef}
        data-src={video.videoUrl}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loaded && inView ? "opacity-100" : "opacity-0"
        }`}
      />

    </button>
  );
}
