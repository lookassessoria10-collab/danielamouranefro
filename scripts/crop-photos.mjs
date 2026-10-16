// Gera recortes das fotografias reais (apenas recorte e redimensionamento,
// sem qualquer alteração de feições). Uso: node scripts/crop-photos.mjs
import sharp from "sharp";
import path from "node:path";

const dir = path.resolve("src/assets/daniela");
const crops = [
  // [origem, destino, { left, top, width, height }, largura final]
  ["daniela-retrato.jpg", "daniela-avatar.jpg", { left: 520, top: 500, width: 500, height: 500 }, 320],
  ["daniela-modelo-renal.jpg", "daniela-avatar-sorriso.jpg", { left: 560, top: 570, width: 480, height: 480 }, 320],
];

for (const [src, out, region, width] of crops) {
  await sharp(path.join(dir, src))
    .extract(region)
    .resize({ width })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(dir, out));
  console.log("ok", out);
}
