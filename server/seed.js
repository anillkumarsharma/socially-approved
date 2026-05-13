import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "./models/Video.js";

dotenv.config();

const VIDEO_POOL = [
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
  "https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://videos.pexels.com/video-files/1093662/1093662-hd_1280_720_30fps.mp4",
  "https://videos.pexels.com/video-files/2933375/2933375-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/2278095/2278095-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/3015527/3015527-hd_1920_1080_24fps.mp4",
];

const ITEMS = [
  { title: "DripTrip Premium Bottle 1", description: "Premium quality lifestyle reel showcase with immersive social shopping experience." },
  { title: "Urban Drip Lookbook 2026", description: "Capture the vibe with stylish drops curated for everyday explorers." },
  { title: "Streetwear Adventures Vol. 3", description: "Outdoor adventures meet premium fashion in this trending reel." },
  { title: "Cozy Vibes Collection", description: "Cozy streetwear vibes for the modern wanderer." },
  { title: "Studio Glow Sessions", description: "Bold portraits and even bolder fits — studio shots that radiate confidence." },
  { title: "Travel Diary: Tokyo Mornings", description: "Travel diaries told through fabric and color." },
  { title: "Crisp Silhouettes Lookbook", description: "Crisp silhouettes paired with relaxed details." },
  { title: "Layered Looks Edit", description: "Layered looks for unpredictable weather." },
  { title: "Pastel Hour Showcase", description: "Pastel tones and golden hours captured in motion." },
  { title: "Bold Portraits Collective", description: "Statement fits and unfiltered attitude." },
  { title: "Modern Wanderer Drop", description: "A trip you'd want to live in, stitched together in one reel." },
  { title: "Trail Ready Outfits", description: "Functional meets fashionable for every terrain." },
  { title: "Coastal Drift Edit", description: "Salt air, golden light, and pastel-perfect fits." },
  { title: "Neon Nights Collection", description: "Late-night looks lit by city neon and bass-heavy beats." },
  { title: "Minimal Drip Edition", description: "Less is more — clean lines and intentional palettes." },
  { title: "Vintage Revival Pack", description: "Throwback silhouettes, modern textures." },
  { title: "Athleisure Essentials", description: "Studio-to-street pieces built for movement." },
  { title: "Festival Ready Looks", description: "Standout fits for the front row crowd." },
  { title: "Office to Evening", description: "Versatile layers that transition with you." },
  { title: "Rainy Day Edit", description: "Tech-fabric meets editorial finish for grey days." },
  { title: "Summer Glow Diaries", description: "Lightweight layers tuned for golden hour." },
  { title: "Monochrome Statements", description: "All-tonal storytelling in fabric and form." },
  { title: "Workwear Reimagined", description: "Heritage cuts with a contemporary remix." },
  { title: "Festival Layers 2026", description: "Layered looks for unpredictable festival weather." },
  { title: "Heritage Streetwear Reel", description: "Classics that hit harder in 2026." },
  { title: "Capsule Drop Preview", description: "A first look at next season's must-haves." },
  { title: "Premium Bottle Edition X", description: "Limited drop — premium fabrics and exclusive cuts." },
  { title: "Closing Showcase Edit", description: "Editorial finale to the season's best fits." },
  { title: "After-hours Wardrobe", description: "Soft glow, soft fabrics, sharp silhouettes." },
  { title: "Signature Series Final", description: "Hero pieces from the signature collection drop." },
];

const THUMBS = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
  "https://images.unsplash.com/photo-1492288991661-058aa541ff43?w=600&q=80",
  "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&q=80",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600&q=80",
  "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=600&q=80",
  "https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80",
  "https://picsum.photos/seed/sa01/600/800",
  "https://picsum.photos/seed/sa02/600/800",
  "https://picsum.photos/seed/sa03/600/800",
  "https://picsum.photos/seed/sa04/600/800",
  "https://picsum.photos/seed/sa05/600/800",
  "https://picsum.photos/seed/sa06/600/800",
  "https://picsum.photos/seed/sa07/600/800",
  "https://picsum.photos/seed/sa08/600/800",
  "https://picsum.photos/seed/sa09/600/800",
  "https://picsum.photos/seed/sa10/600/800",
  "https://picsum.photos/seed/sa11/600/800",
  "https://picsum.photos/seed/sa12/600/800",
  "https://picsum.photos/seed/sa13/600/800",
  "https://picsum.photos/seed/sa14/600/800",
  "https://picsum.photos/seed/sa15/600/800",
  "https://picsum.photos/seed/sa16/600/800",
  "https://picsum.photos/seed/sa17/600/800",
  "https://picsum.photos/seed/sa18/600/800",
];

const SAMPLE_VIDEOS = ITEMS.map((item, i) => ({
  ...item,
  creator: `official_creator_${i + 1}`,
  avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
  thumbnail: THUMBS[i],
  videoUrl: VIDEO_POOL[i % VIDEO_POOL.length],
}));

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Clearing existing videos...");
  await Video.deleteMany({});
  const docs = SAMPLE_VIDEOS.map((v) => ({
    ...v,
    likes: 0,
    comments: 0,
    shares: 0,
    likedBy: [],
    commentsList: [],
  }));
  await Video.insertMany(docs);
  console.log(`Inserted ${docs.length} videos.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
