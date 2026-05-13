import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Stable per-browser pseudo user id (used for likes)
function getUserId() {
  let id = localStorage.getItem("sa_user_id");
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("sa_user_id", id);
  }
  return id;
}

export const fetchVideos = () => api.get("/videos").then((r) => r.data);

export const likeVideo = (videoId) =>
  api.post("/videos/like", { videoId, userId: getUserId() }).then((r) => r.data);

export const shareVideo = (videoId, platform = "copy-link") =>
  api.post("/videos/share", { videoId, platform }).then((r) => r.data);

export const addComment = (videoId, text) =>
  api.post("/videos/comment", { videoId, user: getUserId(), text }).then((r) => r.data);

export const fetchComments = (videoId) =>
  api.get(`/videos/${videoId}/comments`).then((r) => r.data.commentsList);

export { getUserId };
export default api;
