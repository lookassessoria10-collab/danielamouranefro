// Baixa um quadro real de cada vídeo (miniatura pública gerada pelo Google Drive)
// e salva em public/frames/<id>.jpg para as capas do catálogo.
// Uso: node --no-warnings scripts/fetch-frames.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { videos } from "../src/data/videos.ts";

const out = "public/frames";
await mkdir(out, { recursive: true });

for (const v of videos) {
  const res = await fetch(`https://drive.google.com/thumbnail?id=${v.driveId}&sz=w1080`, { redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || !type.startsWith("image/")) {
    console.error(`${v.id}: falhou (${res.status} ${type})`);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const info = await sharp(buffer)
    .resize({ width: 720, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${out}/${v.id}.jpg`);
  console.log(`${v.id} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}
