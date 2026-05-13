# Socially Approved Carousel

A MERN-stack video carousel (Outer slider + Inner modal) inspired by saadaa.in / driptrip.in.

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Axios + lucide-react
- **Backend:** Express + Mongoose + MongoDB Atlas

## Folder Structure
```
socially-approved/
├── client/   # React + Vite (port 5173)
└── server/   # Express + MongoDB (port 5000)
```

## Setup

### 1. MongoDB Atlas connection string
Edit `server/.env` and paste your Atlas URI:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/socially_approved?retryWrites=true&w=majority
```

### 2. Seed the database (run once)
```bash
cd server
npm run seed
```
This inserts 12 dummy videos.

### 3. Start backend
```bash
cd server
npm run dev      # or: npm start
```
Backend runs on http://localhost:5000

### 4. Start frontend
```bash
cd client
npm run dev
```
Open http://localhost:5173

## API Endpoints
- `GET  /api/videos`         → list of videos
- `POST /api/videos/like`    → body: `{ videoId, userId }` → toggles like
- `POST /api/videos/share`   → body: `{ videoId, platform }` → increments share count

## Features Implemented
**Outer slider**
- Horizontal scroll, 20–40 cards smoothly
- Each card: lazy video preview (autoplay in viewport, pause out of view) + creator badge
- Left/Right navigation buttons + visible scrollbar
- IntersectionObserver-based lazy load (only attaches `<video src>` when card enters viewport)

**Inner modal**
- 3-up layout: previous/next thumbnails dimmed on the sides, center video focused
- Keyboard nav: ← → arrows, Esc to close
- Click backdrop to close
- Full controls: play/pause toggle, mute/unmute, progress bar, loading spinner
- Like button (optimistic + persisted), comment count, share (copies link, increments count)
- Auto-pauses neighbor videos when switching

**Performance**
- Thumbnails on cards (instant paint); video only loads when in view
- Modal switches → previous video paused + currentTime reset (only the focused `<video>` actively decodes)
