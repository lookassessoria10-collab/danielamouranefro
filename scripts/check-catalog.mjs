// Valida o catálogo do Nefroflix: IDs únicos, relações existentes, categorias,
// coleções, trilha de descoberta e destaques dos perfis.
// Uso: npm run check:catalog
import { videos } from "../src/data/videos.ts";
import { categories, collections, seriesList } from "../src/data/taxonomy.ts";
import { discoveryPaths } from "../src/data/discovery.ts";
import { profiles } from "../src/data/profiles.ts";
import { existsSync } from "node:fs";

const PHOTOS = ["modelo-renal", "consultorio", "retrato", "verde", "sorriso"];

const errors = [];
const warn = [];
const ids = new Set(videos.map((v) => v.id));
const err = (msg) => errors.push(msg);

const dupes = (key) => {
  const seen = new Map();
  for (const v of videos) {
    const value = v[key];
    if (seen.has(value)) err(`${key} duplicado: "${value}" em ${seen.get(value)} e ${v.id}`);
    seen.set(value, v.id);
  }
};
["id", "slug", "driveId", "number"].forEach(dupes);

const categoryIds = new Set(categories.map((c) => c.id));
const collectionIds = new Set(collections.map((c) => c.id));
const seriesIds = new Set(seriesList.map((s) => s.id));

for (const v of videos) {
  if (!/^[A-Za-z0-9_-]{25,}$/.test(v.driveId)) err(`${v.id}: driveId com formato inesperado (${v.driveId})`);
  if (!/^[a-z0-9-]+$/.test(v.slug)) err(`${v.id}: slug inválido (${v.slug})`);
  if (!categoryIds.has(v.category)) err(`${v.id}: categoria inexistente (${v.category})`);
  if (!v.title.trim() || !v.question.trim()) err(`${v.id}: título ou pergunta vazios`);
  if (v.summary !== null && !v.summary.trim()) err(`${v.id}: resumo vazio — use null até validar`);
  if (!v.fileName.startsWith(`${v.number} `) && !v.fileName.startsWith(`${v.number}-`))
    warn.push(`${v.id}: número ${v.number} não confere com o arquivo "${v.fileName}"`);
  for (const r of v.related) {
    if (!ids.has(r)) err(`${v.id}: relacionado inexistente (${r})`);
    if (r === v.id) err(`${v.id}: relacionado a si mesmo`);
  }
  for (const c of v.collections) if (!collectionIds.has(c)) err(`${v.id}: coleção inexistente (${c})`);
  if (v.series && !seriesIds.has(v.series)) err(`${v.id}: série inexistente (${v.series})`);
  if (v.cover?.style === "frame") {
    if (!existsSync(`public/frames/${v.id}.jpg`)) err(`${v.id}: falta o quadro public/frames/${v.id}.jpg (rode scripts/fetch-frames.mjs)`);
    if (!(v.cover.faceY >= 0 && v.cover.faceY <= 100)) err(`${v.id}: faceY fora de 0–100`);
  } else if (v.cover?.style === "type") {
    if (!PHOTOS.includes(v.cover.photo)) err(`${v.id}: foto de capa inexistente (${v.cover.photo})`);
  } else err(`${v.id}: capa ausente`);
}
for (const c of categories) if (!ids.has(c.coverVideo)) err(`Categoria ${c.id}: vídeo de capa inexistente (${c.coverVideo})`);
for (const c of collections) if (c.photo && !PHOTOS.includes(c.photo)) err(`Coleção ${c.id}: foto inexistente (${c.photo})`);
for (const s of seriesList) if (!PHOTOS.includes(s.photo)) err(`Série ${s.id}: foto inexistente (${s.photo})`);
for (const path of discoveryPaths) if (!ids.has(path.coverVideo)) err(`Trilha ${path.id}: vídeo de capa inexistente (${path.coverVideo})`);
for (const p of profiles) {
  for (const h of p.hero) if (!PHOTOS.includes(h.photo)) err(`Perfil ${p.id}: foto de destaque inexistente (${h.photo})`);
  for (const sec of p.sections) {
    if (sec.kind === "rail" && sec.source.type === "videos") for (const id of sec.source.ids) if (!ids.has(id)) err(`Perfil ${p.id}: trilho "${sec.title}" com vídeo inexistente (${id})`);
    if (sec.kind === "banner" && !PHOTOS.includes(sec.photo)) err(`Perfil ${p.id}: banner com foto inexistente (${sec.photo})`);
  }
}

for (const c of categories) {
  if (!videos.some((v) => v.category === c.id)) err(`Categoria sem vídeos: ${c.title}`);
}
for (const c of collections) {
  const members = videos.filter((v) => v.collections.includes(c.id)).map((v) => v.id);
  if (members.length === 0) err(`Coleção vazia: ${c.title}`);
  for (const id of c.order ?? []) {
    if (!members.includes(id)) err(`Coleção ${c.id}: "${id}" está na ordem mas não tem a coleção no vídeo`);
  }
}
for (const path of discoveryPaths) {
  for (const t of path.topics) {
    if (t.selection.length < 2 || t.selection.length > 3) warn.push(`Trilha ${path.id}/${t.id}: seleção com ${t.selection.length} vídeos`);
    for (const id of t.selection) if (!ids.has(id)) err(`Trilha ${path.id}/${t.id}: vídeo inexistente (${id})`);
  }
}
for (const p of profiles) {
  for (const h of p.hero) if (!ids.has(h.videoId)) err(`Perfil ${p.id}: destaque inexistente (${h.videoId})`);
}

const perCategory = categories.map((c) => `${c.shortTitle}: ${videos.filter((v) => v.category === c.id).length}`).join(" · ");
const series = seriesList.map((s) => `${s.title}: ${videos.filter((v) => v.series === s.id).length}`).join(" · ");
console.log(`Vídeos cadastrados: ${videos.length}`);
console.log(`Por categoria — ${perCategory}`);
console.log(`Quadros — ${series}`);
console.log(`Resumos validados: ${videos.filter((v) => v.summary).length} de ${videos.length}`);
warn.forEach((w) => console.warn(`AVISO  ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`ERRO   ${e}`));
  console.error(`\n${errors.length} erro(s) no catálogo.`);
  process.exit(1);
}
console.log("\nCatálogo OK.");
