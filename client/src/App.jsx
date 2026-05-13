import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import OuterSlider from "./components/OuterSlider";
import InnerModal from "./components/InnerModal";
import { fetchVideos } from "./api/client";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (video) => {
    const idx = videos.findIndex((v) => v._id === video._id);
    if (idx >= 0) setModalIndex(idx);
  };

  const handleLikeChange = (videoId, newLikes) => {
    setVideos((vs) => vs.map((v) => (v._id === videoId ? { ...v, likes: newLikes } : v)));
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-red-600">Failed to load videos</h2>
        <p className="text-neutral-600 mt-2">{error}</p>
        <p className="text-neutral-500 text-sm mt-4">
          Make sure the backend is running on <code>http://localhost:5000</code> and MongoDB is connected.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <OuterSlider videos={videos} onCardClick={handleCardClick} />
      {modalIndex !== null && (
        <InnerModal
          videos={videos}
          startIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onLikeChange={handleLikeChange}
        />
      )}
    </div>
  );
}
