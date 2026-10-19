import type { Category, Collection, Series } from "./types";

/** As cinco categorias espelham as pastas originais do Google Drive. */
export const categories: Category[] = [
  {
    id: "entenda-seus-rins",
    driveFolder: { order: 1, name: "01 - Entenda seus rins", id: "1Nv7_SMFoPXjGCt2558dgHRpMEO9sXI2V" },
    coverVideo: "v19",
    title: "Entenda seus rins",
    shortTitle: "Seus rins",
    description: "Sinais do corpo, exames e condições que envolvem os rins.",
    color: "#E86A00",
    icon: "kidney",
  },
  {
    id: "agua-e-hidratacao",
    driveFolder: { order: 2, name: "02 - Água e hidratação", id: "1u5aNSAeCWTB6F85PM5KW-D3zCKhg2O9t" },
    coverVideo: "v03",
    title: "Água e hidratação",
    shortTitle: "Água",
    description: "Garrafinha, água alcalina, com limão, de coco, com sal: as dúvidas sobre o que você bebe todo dia.",
    color: "#E2B48A",
    icon: "droplet",
  },
  {
    id: "bebidas-e-chas",
    driveFolder: { order: 3, name: "03 - Bebidas e chás", id: "1DIjeoD30PI5x9E0PrS4udZPRgR-MYsWB" },
    coverVideo: "v13",
    title: "Bebidas e chás",
    shortTitle: "Bebidas",
    description: "Álcool, cerveja, energéticos e chá diurético: as bebidas que mais geram perguntas.",
    color: "#D98A4A",
    icon: "cup",
  },
  {
    id: "habitos-e-duvidas",
    driveFolder: { order: 4, name: "04 - Hábitos e dúvidas comuns", id: "1m8PaO8cNivOg9uShHsjNPReesnD1xqvC" },
    coverVideo: "v14",
    title: "Hábitos e dúvidas comuns",
    shortTitle: "Hábitos",
    description: "Sono, idas ao banheiro, gravidez, inverno e verão: dúvidas que aparecem na rotina.",
    color: "#CFC5BB",
    icon: "sun-moon",
  },
  {
    id: "medicamentos-e-tratamentos",
    driveFolder: { order: 5, name: "05 - Medicamentos e tratamentos", id: "1bH4pbt-Z8RxJVgJSyfZMvWlVCgSktVSe" },
    coverVideo: "v18",
    title: "Medicamentos e tratamentos",
    shortTitle: "Medicamentos",
    description: "Canetas e remédios para emagrecer, vitamina D, anti-inflamatórios e outros tratamentos em pauta.",
    color: "#F29B55",
    icon: "pill",
  },
];

/**
 * Coleções editoriais. Um vídeo entra numa coleção pelo campo `collections`
 * do próprio vídeo — nenhum arquivo é duplicado.
 */
export const collections: Collection[] = [
  {
    id: "comece-por-aqui",
    eyebrow: "Primeiros passos",
    title: "Comece por aqui",
    description: "Uma seleção para quem está chegando agora ao Nefroflix.",
    order: ["v20", "v07", "v19", "v04", "v14", "v01"],
    photo: "modelo-renal",
  },
  {
    id: "perguntas-frequentes",
    eyebrow: "Perguntas",
    title: "Perguntas que todo mundo faz",
    description: "Os assuntos que mais aparecem quando o tema é saúde renal.",
    order: ["v07", "v16", "v03", "v15", "v20", "v17", "v14", "v05"],
  },
  {
    id: "sinais-do-corpo",
    eyebrow: "Coleção",
    title: "Sinais do corpo",
    description: "Espuma na urina, idas noturnas ao banheiro, sinais no rosto e a função dos rins.",
    order: ["v07", "v16", "v10", "v19"],
  },
  {
    id: "tudo-sobre-agua",
    eyebrow: "Coleção",
    title: "Tudo sobre água",
    description: "Seis vídeos sobre a bebida mais importante do dia.",
    order: ["v01", "v03", "v05", "v06", "v12", "v22"],
  },
  {
    id: "noite-e-rotina",
    eyebrow: "Coleção",
    title: "Noite, sono e banheiro",
    description: "Dormir mal, acordar para urinar e segurar o xixi.",
    order: ["v16", "v09", "v14"],
  },
  {
    id: "emagrecimento-em-pauta",
    eyebrow: "Coleção",
    title: "Emagrecimento em pauta",
    description: "Canetas, remédios para emagrecer e o projeto verão.",
    order: ["v17", "v27", "v25"],
  },
];

/**
 * Séries/quadros. Os episódios são identificados pelo nome original do arquivo
 * ("cafezinho" no nome) — nenhum episódio foi criado.
 */
export const seriesList: Series[] = [
  {
    id: "cafezinho-com-a-nefro",
    title: "Cafezinho com a Nefro",
    description: "O quadro de conversas rápidas sobre água, bebidas e hábitos do dia a dia.",
    photo: "sorriso",
  },
];
