import "dotenv/config";
import fs from "fs";
import path from "path";

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error("❌ YOUTUBE_API_KEY nahi mili.");
  process.exit(1);
}

const filePath = path.resolve("src/data/songsData.js");
let code = fs.readFileSync(filePath, "utf8");

const songRegex =
  /(\{\s*id:\s*(\d+),[\s\S]*?title:\s*"([^"]+)"[\s\S]*?movie:\s*"([^"]+)"[\s\S]*?youtubeId:\s*")([^"]*)(")/g;

const songs = [...code.matchAll(songRegex)];

console.log(`🎵 ${songs.length} songs found\n`);

async function findEmbeddableVideo(title, movie) {
  const query = `${title} ${movie}`;

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: "10",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    key: API_KEY,
  });

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params}`
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ YouTube API error:", data.error?.message);
    return null;
  }

  return data.items?.[0]?.id?.videoId || null;
}

for (const match of songs) {
  const id = match[2];
  const title = match[3];
  const movie = match[4];
  const oldId = match[5];

  console.log(`🔎 ${id}. ${title}`);

  const newId = await findEmbeddableVideo(title, movie);

  if (newId) {
    console.log(`   ✅ ${oldId} → ${newId}`);

    code = code.replace(
      `youtubeId: "${oldId}"`,
      `youtubeId: "${newId}"`
    );
  } else {
    console.log("   ⚠️ No suitable video found");
  }

  // small delay
  await new Promise((resolve) => setTimeout(resolve, 300));
}

fs.writeFileSync(filePath, code, "utf8");

console.log("\n================================");
console.log("✅ songsData.js updated!");
console.log("================================");