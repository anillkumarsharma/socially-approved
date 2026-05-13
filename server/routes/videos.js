import express from "express";
import Video from "../models/Video.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/like", async (req, res) => {
  try {
    const { videoId, userId } = req.body;
    if (!videoId || !userId) {
      return res.status(400).json({ error: "videoId and userId required" });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const alreadyLiked = video.likedBy.includes(userId);
    if (alreadyLiked) {
      video.likedBy = video.likedBy.filter((id) => id !== userId);
      video.likes = Math.max(0, video.likes - 1);
    } else {
      video.likedBy.push(userId);
      video.likes += 1;
    }
    await video.save();

    res.json({ likes: video.likes, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/share", async (req, res) => {
  try {
    const { videoId, platform } = req.body;
    if (!videoId) return res.status(400).json({ error: "videoId required" });

    const video = await Video.findByIdAndUpdate(
      videoId,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json({ shares: video.shares, platform: platform || "copy-link" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { videoId, user, text } = req.body;
    if (!videoId || !user || !text?.trim()) {
      return res.status(400).json({ error: "videoId, user, text required" });
    }
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.commentsList.push({ user, text: text.trim() });
    video.comments = video.commentsList.length;
    await video.save();

    res.json({
      comments: video.comments,
      commentsList: video.commentsList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).select("commentsList");
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json({ commentsList: video.commentsList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
