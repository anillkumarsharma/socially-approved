import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  X,
  Send,
  Copy,
  Check,
  Facebook,
  Twitter,
} from "lucide-react";
import { formatCount } from "../utils/format";
import { likeVideo, shareVideo, addComment, getUserId } from "../api/client";

export default function VideoPlayer({ video, active, muted, onToggleMute, onLikeChange }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(video.likes);
  const [liked, setLiked] = useState(() => (video.likedBy || []).includes(getUserId()));
  const [shares, setShares] = useState(video.shares);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentList, setCommentList] = useState(video.commentsList || []);
  const [commentCount, setCommentCount] = useState(video.comments || 0);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.muted = muted;
      const p = el.play();
      if (p && p.then) {
        p.then(() => setPlaying(true)).catch(() => {
          el.muted = true;
          el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        });
      }
    } else {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
      setProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setProgress((el.currentTime / el.duration) * 100);
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((n) => n + (nextLiked ? 1 : -1));
    try {
      const data = await likeVideo(video._id);
      setLikes(data.likes);
      setLiked(data.liked);
      onLikeChange?.(video._id, data.likes);
    } catch {
      setLiked(!nextLiked);
      setLikes((n) => n + (nextLiked ? -1 : 1));
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = commentText.trim();
    if (!text || posting) return;
    setPosting(true);
    try {
      const data = await addComment(video._id, text);
      setCommentList(data.commentsList);
      setCommentCount(data.comments);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const shareUrl = () => `${window.location.origin}/?v=${video._id}`;

  const trackShare = async (platform) => {
    try {
      const data = await shareVideo(video._id, platform);
      setShares(data.shares);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareTo = async (platform) => {
    const url = shareUrl();
    const text = `${video.title} — ${video.description}`;
    let target = "";
    switch (platform) {
      case "whatsapp":
        target = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "twitter":
        target = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        target = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "telegram":
        target = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
        trackShare(platform);
        return;
      default:
        return;
    }
    window.open(target, "_blank", "noopener,noreferrer");
    trackShare(platform);
    setShareOpen(false);
  };

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        defaultMuted
        muted={muted}
        autoPlay
        playsInline
        loop
        preload={active ? "auto" : "metadata"}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onLoadedData={() => setLoading(false)}
        onError={() => setLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />

      {loading && active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {!playing && !loading && active && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20"
          aria-label="Play"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-8 h-8 text-black ml-1" />
          </div>
        </button>
      )}

      {active && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 z-20"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}

      {active && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 text-white z-10">
          <button onClick={handleLike} className="flex flex-col items-center group">
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                liked ? "bg-pink-500" : "bg-black/60 group-hover:bg-black/80"
              }`}
            >
              <Heart className={`w-6 h-6 ${liked ? "fill-white" : ""}`} />
            </span>
            <span className="text-xs font-semibold mt-1 drop-shadow">{formatCount(likes)}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setCommentsOpen(true);
            }}
            className="flex flex-col items-center group"
          >
            <span className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-black/80">
              <MessageCircle className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold mt-1 drop-shadow">
              {formatCount(commentCount)}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen((v) => !v);
              }}
              className="flex flex-col items-center group"
            >
              <span className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-black/80">
                <Share2 className="w-6 h-6" />
              </span>
              <span className="text-xs font-semibold mt-1 drop-shadow">{formatCount(shares)}</span>
            </button>

            {shareOpen && (
              <div
                className="absolute right-14 top-0 bg-white rounded-2xl shadow-2xl p-2 flex flex-col gap-1 min-w-[160px] z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <SharePlatform
                  label="WhatsApp"
                  color="bg-green-500"
                  onClick={() => handleShareTo("whatsapp")}
                  iconText="W"
                />
                <SharePlatform
                  label="X (Twitter)"
                  color="bg-black"
                  onClick={() => handleShareTo("twitter")}
                  icon={<Twitter className="w-4 h-4 text-white" />}
                />
                <SharePlatform
                  label="Facebook"
                  color="bg-blue-600"
                  onClick={() => handleShareTo("facebook")}
                  icon={<Facebook className="w-4 h-4 text-white" />}
                />
                <SharePlatform
                  label="Telegram"
                  color="bg-sky-500"
                  onClick={() => handleShareTo("telegram")}
                  iconText="T"
                />
                <SharePlatform
                  label={copied ? "Copied!" : "Copy Link"}
                  color="bg-neutral-700"
                  onClick={() => handleShareTo("copy")}
                  icon={
                    copied ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      )}

      {active && (
        <div className="absolute inset-x-0 bottom-0 p-4 pr-20 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="text-lg font-bold leading-tight">{video.title}</h3>
          <p className="text-xs text-white/80 mt-1 line-clamp-3">{video.description}</p>
        </div>
      )}

      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-pink-500 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {commentsOpen && (
        <div
          className="absolute inset-0 z-40 flex flex-col bg-black/40 backdrop-blur-sm"
          onClick={() => setCommentsOpen(false)}
        >
          <div className="flex-1" />
          <div
            className="bg-white rounded-t-3xl max-h-[65%] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <h4 className="font-bold text-sm">
                Comments {commentCount > 0 && `(${commentCount})`}
              </h4>
              <button
                onClick={() => setCommentsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center"
                aria-label="Close comments"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[120px]">
              {commentList.length === 0 ? (
                <p className="text-center text-neutral-400 text-sm py-8">
                  No comments yet. Be the first!
                </p>
              ) : (
                commentList.map((c) => (
                  <div key={c._id || c.createdAt} className="flex gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {c.user.slice(-2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-neutral-700">{c.user}</div>
                      <div className="text-neutral-800 break-words">{c.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handlePostComment}
              className="px-4 py-3 border-t border-neutral-200 flex gap-2"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 px-3 py-2 rounded-full bg-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                maxLength={300}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || posting}
                className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-pink-600 transition"
                aria-label="Post comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SharePlatform({ label, color, onClick, icon, iconText }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-100 text-left transition w-full"
    >
      <span
        className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
      >
        {icon || iconText}
      </span>
      <span className="text-sm font-medium text-neutral-800">{label}</span>
    </button>
  );
}
