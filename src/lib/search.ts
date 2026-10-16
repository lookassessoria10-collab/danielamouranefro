import { allVideos, getCategory, getSeries } from "./catalog";
import type { Video } from "@/data/types";

/** Busca local sobre o catálogo: títulos, perguntas, categorias, tags e palavras-chave. */

export const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "na", "no", "nas", "nos",
  "um", "uma", "para", "pra", "com", "que", "por", "se", "eu", "meu", "minha", "faz", "sobre",
]);

/** Termos populares que devem encontrar o mesmo assunto. */
const SYNONYMS: Record<string, string[]> = {
  remedio: ["medicamento", "remedio"],
  remedios: ["medicamento", "remedio"],
  medicacao: ["medicamento"],
  xixi: ["urina", "xixi"],
  urinar: ["urina", "urinar"],
  rim: ["rins", "renal", "rim"],
  rins: ["rins", "renal"],
  renal: ["renal", "rins"],
  bebida: ["bebida", "agua", "cha", "cerveja", "alcool", "energetico"],
  bebidas: ["bebida", "agua", "cha", "cerveja", "alcool", "energetico"],
  cafe: ["cafezinho", "cafeina"],
  sono: ["sono", "dormir"],
  dormir: ["dormir", "sono"],
  checkup: ["check-up", "checkup"],
  emagrecer: ["emagrec"],
  emagrecimento: ["emagrec"],
  gestacao: ["gravidez", "gestacao"],
  gravida: ["gravidez", "gravida"],
  hidratar: ["hidratacao", "agua"],
};

type Field = { label: string; weight: number; text: string };

const FIELD_LABELS = {
  title: "título",
  question: "pergunta",
  tags: "assunto",
  keywords: "palavra-chave",
  category: "categoria",
  series: "quadro",
} as const;

type Indexed = { video: Video; fields: Field[] };

const index: Indexed[] = allVideos.map((video) => ({
  video,
  fields: [
    { label: FIELD_LABELS.title, weight: 6, text: normalize(video.title) },
    { label: FIELD_LABELS.tags, weight: 4, text: normalize(video.tags.join(" | ")) },
    { label: FIELD_LABELS.question, weight: 3, text: normalize(video.question) },
    { label: FIELD_LABELS.keywords, weight: 3, text: normalize(video.keywords.join(" | ")) },
    { label: FIELD_LABELS.category, weight: 2, text: normalize(getCategory(video.category)?.title ?? "") },
    {
      label: FIELD_LABELS.series,
      weight: 2,
      text: normalize(video.series ? getSeries(video.series)?.title ?? "" : ""),
    },
  ],
}));

/** Casa pelo início das palavras ("urina" não deve encontrar "taurina"). */
const fieldMatches = (fieldText: string, variant: string) => {
  if (!fieldText) return false;
  if (/[\s-]/.test(variant)) return fieldText.includes(variant);
  return fieldText.split(/[\s-]+/).some((word) => word.startsWith(variant));
};

export type SearchResult = { video: Video; score: number; matchedIn: string[] };

export function searchVideos(query: string): SearchResult[] {
  const tokens = normalize(query)
    .split(" ")
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];

  for (const { video, fields } of index) {
    let score = 0;
    const matchedIn = new Set<string>();
    let everyTokenMatched = true;

    for (const token of tokens) {
      const variants = Array.from(new Set([token, ...(SYNONYMS[token] ?? [])]));
      let best = 0;
      for (const field of fields) {
        if (variants.some((variant) => fieldMatches(field.text, variant))) {
          matchedIn.add(field.label);
          best = Math.max(best, field.weight);
        }
      }
      if (best === 0) {
        everyTokenMatched = false;
        break;
      }
      score += best;
    }

    if (everyTokenMatched) {
      results.push({ video, score: score + video.featured * 0.05, matchedIn: Array.from(matchedIn) });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.video.number - b.video.number);
}

export const searchSuggestions = [
  "espuma",
  "água",
  "remédio",
  "chá",
  "check-up",
  "xixi",
  "sono",
  "cerveja",
  "gravidez",
  "vitamina D",
];
