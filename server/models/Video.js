import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    creator: { type: String, required: true },
    avatar: { type: String, default: "" },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    commentsList: { type: [CommentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
