import type { CategoryId, ProfileId } from "./types";

export type HomeSection =
  | "for-you"
  | "recent"
  | "start-here"
  | "discovery"
  | "questions"
  | "kidneys"
  | "drinks"
  | "meds"
  | "habits"
  | "series"
  | "collections"
  | "categories"
  | "about";

export type HeroPhoto = "modelo-renal" | "consultorio" | "retrato";

export type Profile = {
  id: ProfileId;
  label: string;
  description: string;
  /** Frase curta exibida na home, explicando como o perfil organiza o acervo. */
  note: string;
  color: string;
  /** Destaques do hero (vídeos reais do catálogo) e a foto de cada um. */
  hero: { videoId: string; photo: HeroPhoto }[];
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
    color: "#E8846F",
    hero: [
      { videoId: "v20", photo: "modelo-renal" },
      { videoId: "v07", photo: "retrato" },
      { videoId: "v14", photo: "consultorio" },
    ],
    sections: [
      "for-you",
      "recent",
      "start-here",
      "discovery",
      "questions",
      "kidneys",
      "series",
      "meds",
      "drinks",
      "habits",
      "collections",
      "categories",
      "about",
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
    note: "Mesmo acervo educativo, com prioridade para exames, sinais e condições renais.",
    color: "#8FB6D6",
    hero: [
      { videoId: "v19", photo: "consultorio" },
      { videoId: "v04", photo: "modelo-renal" },
      { videoId: "v02", photo: "retrato" },
    ],
    sections: [
      "for-you",
      "recent",
      "kidneys",
      "meds",
      "questions",
      "discovery",
      "habits",
      "series",
      "drinks",
      "collections",
      "categories",
      "about",
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
    note: "As perguntas mais comuns primeiro: água, bebidas, hábitos e tendências.",
    color: "#E0A76C",
    hero: [
      { videoId: "v07", photo: "retrato" },
      { videoId: "v03", photo: "modelo-renal" },
      { videoId: "v17", photo: "consultorio" },
    ],
    sections: [
      "questions",
      "for-you",
      "recent",
      "discovery",
      "series",
      "drinks",
      "habits",
      "kidneys",
      "meds",
      "collections",
      "categories",
      "about",
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

export const DEFAULT_PROFILE: ProfileId = "curioso";

export const isProfileId = (value: unknown): value is ProfileId =>
  value === "paciente" || value === "residente" || value === "curioso";

export const getProfile = (id: ProfileId) => profiles.find((p) => p.id === id)!;

/** Chave do perfil no localStorage (lida também pelo script de redirecionamento da raiz). */
export const PROFILE_STORAGE_KEY = "nefroflix:perfil";
