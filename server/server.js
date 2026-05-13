import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import videoRoutes from "./routes/videos.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*")
      ? "*"
      : (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
          if (/\.vercel\.app$/.test(new URL(origin).hostname)) return cb(null, true);
          cb(new Error("Not allowed by CORS"));
        },
  })
);
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok", service: "socially-approved-api" }));
app.use("/api/videos", videoRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
