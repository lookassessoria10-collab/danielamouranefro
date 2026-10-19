// Gera as variações do LOGOTIPO OFICIAL a partir de src/assets/brand/nefroflix-logo-original.webp.
// Nada é redesenhado: todas as peças usam os pixels do arquivo enviado.
//
//  - nefroflix-logo.png        cores originais (fundos claros)
//  - nefroflix-logo-dark.png   versão negativa: só o "Nefro" marrom vira creme (fundos escuros)
//  - nefroflix-symbol.png      símbolo (rins + play)
//  - intro-kidney-left.webp / intro-kidney-right.webp / intro-play.webp
//                              as 3 formas do símbolo, separadas, na mesma moldura (abertura animada)
//  - intro-wordmark.webp       palavra "Nefroflix" da versão negativa
//  - src/app/icon.png, src/app/apple-icon.png, src/app/opengraph-image.jpg
//
// Uso: node scripts/brand-assets.mjs
import sharp from "sharp";
import { unlink } from "node:fs/promises";

const SRC = "src/assets/brand/nefroflix-logo-original.webp";
const OUT = "src/assets/brand";
const CREAM = [243, 238, 232]; // #F3EEE8
const INK = { r: 23, g: 19, b: 17 }; // #171311

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

// Limites medidos no arquivo oficial (colunas/linhas com pixels visíveis).
const BOX = { left: 137, top: 140, right: 1895, bottom: 505 };
const SYMBOL = { left: 137, right: 637 };
const NEFRO = { left: 650, right: 1452 }; // "Nefro" marrom; "flix" laranja começa em 1458

const toPng = (buffer, width, height) => sharp(buffer, { raw: { width, height, channels: 4 } }).png();

function crop(buffer, box) {
  const w = box.right - box.left + 1;
  const h = box.bottom - box.top + 1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const from = ((box.top + y) * W + box.left) * 4;
    buffer.copy(out, y * w * 4, from, from + w * 4);
  }
  return { out, w, h };
}

// 1) Original, recortado nas bordas.
const original = crop(data, BOX);
await toPng(original.out, original.w, original.h).toFile(`${OUT}/nefroflix-logo.png`);

// 2) Versão negativa: troca apenas a cor dos pixels do "Nefro", preservando a transparência.
const dark = Buffer.from(data);
for (let y = 0; y < H; y++) {
  for (let x = NEFRO.left; x <= NEFRO.right; x++) {
    const i = (y * W + x) * 4;
    if (dark[i + 3] === 0) continue;
    dark[i] = CREAM[0];
    dark[i + 1] = CREAM[1];
    dark[i + 2] = CREAM[2];
  }
}
const darkCrop = crop(dark, BOX);
await toPng(darkCrop.out, darkCrop.w, darkCrop.h).toFile(`${OUT}/nefroflix-logo-dark.png`);
const wordmark = crop(dark, { ...BOX, left: 650 });
await toPng(wordmark.out, wordmark.w, wordmark.h).toFile(`${OUT}/intro-wordmark.png`);

// 3) Símbolo e suas 3 formas (rótulos por componentes conectados).
const symBox = { left: SYMBOL.left, right: SYMBOL.right, top: BOX.top, bottom: BOX.bottom };
const sym = crop(data, symBox);
await toPng(sym.out, sym.w, sym.h).toFile(`${OUT}/nefroflix-symbol.png`);

const label = new Int32Array(sym.w * sym.h);
let count = 0;
for (let p = 0; p < sym.w * sym.h; p++) {
  if (label[p] || sym.out[p * 4 + 3] <= 60) continue;
  count++;
  const stack = [p];
  label[p] = count;
  while (stack.length) {
    const q = stack.pop();
    const qx = q % sym.w;
    const qy = (q / sym.w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = qx + dx;
      const ny = qy + dy;
      if (nx < 0 || ny < 0 || nx >= sym.w || ny >= sym.h) continue;
      const n = ny * sym.w + nx;
      if (!label[n] && sym.out[n * 4 + 3] > 60) {
        label[n] = count;
        stack.push(n);
      }
    }
  }
}
// Leva as bordas suavizadas (alpha baixo) para a forma vizinha.
for (let pass = 0; pass < 3; pass++) {
  const next = Int32Array.from(label);
  for (let p = 0; p < sym.w * sym.h; p++) {
    if (label[p] || sym.out[p * 4 + 3] === 0) continue;
    const px = p % sym.w;
    const py = (p / sym.w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = (py + dy) * sym.w + (px + dx);
      if (px + dx >= 0 && py + dy >= 0 && px + dx < sym.w && py + dy < sym.h && label[n]) {
        next[p] = label[n];
        break;
      }
    }
  }
  label.set(next);
}

// Identifica cada forma pela posição: esquerda, direita e o play (menor).
const stats = Array.from({ length: count + 1 }, () => ({ n: 0, sx: 0 }));
for (let p = 0; p < sym.w * sym.h; p++) {
  if (!label[p]) continue;
  stats[label[p]].n++;
  stats[label[p]].sx += p % sym.w;
}
const shapes = stats
  .map((s, id) => ({ id, n: s.n, cx: s.n ? s.sx / s.n : 0 }))
  .filter((s) => s.id > 0 && s.n > 500)
  .sort((a, b) => a.n - b.n);
if (shapes.length !== 3) throw new Error(`Esperava 3 formas no símbolo, encontrei ${shapes.length}`);
const play = shapes[0];
const [left, right] = shapes.slice(1).sort((a, b) => a.cx - b.cx);

for (const [name, shape] of [["intro-kidney-left", left], ["intro-kidney-right", right], ["intro-play", play]]) {
  const part = Buffer.alloc(sym.out.length);
  for (let p = 0; p < sym.w * sym.h; p++) {
    if (label[p] === shape.id) sym.out.copy(part, p * 4, p * 4, p * 4 + 4);
  }
  await toPng(part, sym.w, sym.h).toFile(`${OUT}/${name}.png`);
}

// 4) Ícones do app (símbolo oficial sobre o fundo grafite quente).
async function icon(size, file, radius) {
  const mark = await sharp(`${OUT}/nefroflix-symbol.png`).resize({ width: Math.round(size * 0.74) }).toBuffer();
  const meta = await sharp(mark).metadata();
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#171311"/></svg>`,
  );
  await sharp(bg)
    .composite([{ input: mark, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(file);
}
await icon(512, "src/app/icon.png", 112);
await icon(180, "src/app/apple-icon.png", 0);

// 5) Imagem de compartilhamento (WhatsApp, Instagram): logo negativo + foto real.
const photo = await sharp("src/assets/daniela/daniela-sorriso.jpg")
  .resize({ width: 560, height: 630, fit: "cover", position: "top" })
  .toBuffer();
const fade = Buffer.from(
  `<svg width="560" height="630"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#171311"/><stop offset=".45" stop-color="#171311" stop-opacity="0"/></linearGradient></defs><rect width="560" height="630" fill="url(#g)"/></svg>`,
);
const logo = await sharp(`${OUT}/nefroflix-logo-dark.png`).resize({ width: 560 }).toBuffer();
const logoMeta = await sharp(logo).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: INK } })
  .composite([
    { input: photo, left: 640, top: 0 },
    { input: fade, left: 640, top: 0 },
    { input: logo, left: 72, top: Math.round((630 - logoMeta.height) / 2) },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("src/app/opengraph-image.jpg");

console.log("Logotipo e ícones gerados a partir do arquivo oficial.");

// 6) Versões leves (WebP) das peças da abertura, para carregar rápido.
for (const name of ["intro-kidney-left", "intro-kidney-right", "intro-play"]) {
  await sharp(`${OUT}/${name}.png`).resize({ width: 480 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/${name}.webp`);
}
await sharp(`${OUT}/intro-wordmark.png`).resize({ width: 1100 }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/intro-wordmark.webp`);
for (const name of ["intro-kidney-left", "intro-kidney-right", "intro-play", "intro-wordmark"]) await unlink(`${OUT}/${name}.png`);
console.log("Peças da abertura em WebP geradas.");
