// Gera o vercel.json com as rotas /media/<id>.mp4 a partir do catálogo.
// O arquivo continua hospedado no Google Drive; a Vercel só repassa o vídeo pelo
// próprio domínio (o Drive recusa pedidos de vídeo feitos diretamente por outro site).
// Rode sempre que cadastrar um vídeo:  npm run sync:media
import { writeFileSync } from "node:fs";
import { videos } from "../src/data/videos.ts";

const config = {
  $schema: "https://openapi.vercel.sh/vercel.json",
  rewrites: videos.map((v) => ({
    source: `/media/${v.id}.mp4`,
    destination: `https://drive.usercontent.google.com/download?id=${v.driveId}&export=download`,
  })),
};

writeFileSync("vercel.json", JSON.stringify(config, null, 2) + "\n");
console.log(`vercel.json: ${config.rewrites.length} rotas de vídeo.`);
