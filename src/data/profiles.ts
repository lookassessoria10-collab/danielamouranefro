import type { CategoryId, CollectionId, PhotoKey, ProfileId } from "./types";

/** Origem dos vídeos de um trilho. Sempre vídeos reais do catálogo. */
export type RailSource =
  | { type: "collection"; id: CollectionId }
  | { type: "category"; id: CategoryId }
  | { type: "videos"; ids: string[] };

export type BannerId = "aprenda" | "respostas" | "selecao";

/** Módulos da home. A ordem é editorial e muda por perfil; o acervo é o mesmo para todos. */
export type HomeSection =
  | { kind: "continue" }
  | { kind: "for-you" }
  | {
      kind: "rail";
      title: string;
      eyebrow?: string;
      href?: string;
      source: RailSource;
      /** "landscape" = card 16:9 (trilhos principais); "poster" = pôster 3:4. */
      card: "landscape" | "poster";
    }
  | { kind: "discovery" }
  | { kind: "questions"; title: string; eyebrow: string }
  | { kind: "series" }
  | { kind: "banner"; id: BannerId; photo: PhotoKey }
  | { kind: "browse" }
  | { kind: "about" };

export type Banner = {
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href: string };
};

/** Banners intermediários (blocos promocionais internos). */
export const banners: Record<BannerId, Banner> = {
  aprenda: {
    eyebrow: "Quem fala com você",
    title: "Aprenda com a Dra. Daniela",
    text: "Vídeos curtos, em linguagem simples, sobre as dúvidas que mais aparecem quando o assunto é saúde renal.",
    cta: { label: "Conhecer a Dra. Daniela", href: "/sobre" },
  },
  respostas: {
    eyebrow: "Busca por assunto",
    title: "Encontre respostas para suas dúvidas",
    text: "Digite uma palavra do dia a dia, como xixi, água ou remédio, e veja os vídeos sobre o assunto.",
    cta: { label: "Buscar um assunto", href: "/busca" },
  },
  selecao: {
    eyebrow: "Por onde começar?",
    title: "Uma seleção de vídeos para você",
    text: "Duas escolhas rápidas e o Nefroflix separa os vídeos sobre o assunto que você quer entender.",
    cta: { label: "Montar minha seleção", href: "/por-onde-comecar" },
  },
};

export type Profile = {
  id: ProfileId;
  label: string;
  description: string;
  /** Frase curta exibida na home, explicando como o perfil organiza o acervo. */
  note: string;
  /** Tom do perfil (paleta quente). */
  color: string;
  /** Destaques do hero (vídeos reais do catálogo) e a fotografia de cada um. */
  hero: { videoId: string; photo: PhotoKey }[];
  /** Ordem dos módulos da home. Todos os perfis veem o acervo completo. */
  sections: HomeSection[];
  /** Peso de cada categoria nas recomendações "Selecionados para você". */
  weights: Record<CategoryId, number>;
};

export const profiles: Profile[] = [
  {
    id: "paciente",
    label: "Paciente",
    description: "Quero entender melhor minha saúde renal.",
    note: "Começamos pelos sinais do corpo, pelos exames e pelos cuidados do dia a dia.",
    color: "#E86A00",
    hero: [
      { videoId: "v20", photo: "modelo-renal" },
      { videoId: "v16", photo: "consultorio" },
      { videoId: "v07", photo: "retrato" },
    ],
    sections: [
      { kind: "continue" },
      { kind: "for-you" },
      {
        kind: "rail",
        eyebrow: "Sinais e sintomas",
        title: "Sinais do corpo",
        href: "/colecao/sinais-do-corpo",
        source: { type: "collection", id: "sinais-do-corpo" },
        card: "landscape",
      },
      { kind: "discovery" },
      {
        kind: "rail",
        eyebrow: "Exames e prevenção",
        title: "Para acompanhar seus rins",
        href: "/categoria/entenda-seus-rins",
        source: { type: "videos", ids: ["v20", "v04", "v02", "v19"] },
        card: "poster",
      },
      { kind: "banner", id: "aprenda", photo: "retrato" },
      { kind: "series" },
      {
        kind: "rail",
        eyebrow: "Cuidados diários",
        title: "No dia a dia",
        href: "/categoria/habitos-e-duvidas",
        source: { type: "category", id: "habitos-e-duvidas" },
        card: "landscape",
      },
      { kind: "questions", eyebrow: "Perguntas frequentes", title: "Você já se perguntou?" },
      { kind: "browse" },
      { kind: "about" },
    ],
    weights: {
      "entenda-seus-rins": 3,
      "habitos-e-duvidas": 2.2,
      "medicamentos-e-tratamentos": 2,
      "agua-e-hidratacao": 1.6,
      "bebidas-e-chas": 1.2,
    },
  },
  {
    id: "residente",
    label: "Residente",
    description: "Quero estudar e aprofundar conhecimentos.",
    note: "Mesmo acervo educativo, com prioridade para função renal, exames, medicamentos e condições renais.",
    color: "#CFC5BB",
    hero: [
      { videoId: "v19", photo: "retrato" },
      { videoId: "v04", photo: "consultorio" },
      { videoId: "v02", photo: "modelo-renal" },
    ],
    sections: [
      { kind: "continue" },
      { kind: "for-you" },
      {
        kind: "rail",
        eyebrow: "Função renal e exames",
        title: "Do exame à função renal",
        href: "/categoria/entenda-seus-rins",
        source: { type: "videos", ids: ["v19", "v04", "v20", "v07"] },
        card: "landscape",
      },
      {
        kind: "rail",
        eyebrow: "Medicamentos e tratamentos",
        title: "Medicamentos em pauta",
        href: "/categoria/medicamentos-e-tratamentos",
        source: { type: "category", id: "medicamentos-e-tratamentos" },
        card: "poster",
      },
      { kind: "discovery" },
      {
        kind: "rail",
        eyebrow: "Condições renais",
        title: "Sinais e condições",
        href: "/colecao/sinais-do-corpo",
        source: { type: "videos", ids: ["v02", "v10", "v16", "v14"] },
        card: "landscape",
      },
      { kind: "banner", id: "aprenda", photo: "modelo-renal" },
      { kind: "series" },
      { kind: "browse" },
      { kind: "about" },
    ],
    weights: {
      "entenda-seus-rins": 3.2,
      "medicamentos-e-tratamentos": 2.6,
      "habitos-e-duvidas": 1.6,
      "agua-e-hidratacao": 1.2,
      "bebidas-e-chas": 1.1,
    },
  },
  {
    id: "curioso",
    label: "Curioso",
    description: "Quero aprender e tirar dúvidas.",
    note: "As perguntas do dia a dia primeiro: água, bebidas, hábitos e tendências.",
    color: "#F29B55",
    hero: [
      { videoId: "v07", photo: "retrato" },
      { videoId: "v03", photo: "consultorio" },
      { videoId: "v17", photo: "verde" },
    ],
    sections: [
      { kind: "continue" },
      { kind: "questions", eyebrow: "Perguntas do dia a dia", title: "Você já se perguntou?" },
      { kind: "for-you" },
      {
        kind: "rail",
        eyebrow: "Água e hidratação",
        title: "Tudo sobre água",
        href: "/categoria/agua-e-hidratacao",
        source: { type: "category", id: "agua-e-hidratacao" },
        card: "landscape",
      },
      { kind: "discovery" },
      {
        kind: "rail",
        eyebrow: "Bebidas e alimentação",
        title: "O que você bebe também importa",
        href: "/categoria/bebidas-e-chas",
        source: { type: "category", id: "bebidas-e-chas" },
        card: "poster",
      },
      { kind: "series" },
      { kind: "banner", id: "respostas", photo: "modelo-renal" },
      {
        kind: "rail",
        eyebrow: "Hábitos",
        title: "Hábitos e dúvidas comuns",
        href: "/categoria/habitos-e-duvidas",
        source: { type: "category", id: "habitos-e-duvidas" },
        card: "landscape",
      },
      { kind: "browse" },
      { kind: "about" },
    ],
    weights: {
      "agua-e-hidratacao": 3,
      "bebidas-e-chas": 2.8,
      "habitos-e-duvidas": 2.2,
      "entenda-seus-rins": 1.6,
      "medicamentos-e-tratamentos": 1.6,
    },
  },
];

export const isProfileId = (value: unknown): value is ProfileId =>
  value === "paciente" || value === "residente" || value === "curioso";

export const getProfile = (id: ProfileId) => profiles.find((p) => p.id === id)!;

/** Chave do perfil no localStorage (lida também pelo script de redirecionamento da raiz). */
export const PROFILE_STORAGE_KEY = "nefroflix:perfil";

/** Chave da abertura animada no sessionStorage (uma vez por sessão do navegador). */
export const INTRO_STORAGE_KEY = "nefroflix:abertura";
