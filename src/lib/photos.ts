import modeloRenal from "@/assets/daniela/daniela-modelo-renal.jpg";
import consultorio from "@/assets/daniela/daniela-consultorio.jpg";
import retrato from "@/assets/daniela/daniela-retrato.jpg";
import avatar from "@/assets/daniela/daniela-avatar.jpg";
import avatarSorriso from "@/assets/daniela/daniela-avatar-sorriso.jpg";
import type { HeroPhoto } from "@/data/profiles";

/**
 * Fotografias reais da Dra. Daniela Moura Landim.
 * Apenas recorte, enquadramento e sobreposição de cor — nenhuma alteração de feições.
 * `position` controla o enquadramento (object-position) em cada uso.
 */
export const photos = {
  "modelo-renal": {
    src: modeloRenal,
    alt: "Dra. Daniela Moura Landim sorrindo no consultório, segurando um modelo anatômico de rim",
    position: "54% 38%",
  },
  consultorio: {
    src: consultorio,
    alt: "Dra. Daniela Moura Landim de jaleco, à mesa do consultório com um notebook",
    position: "48% 30%",
  },
  retrato: {
    src: retrato,
    alt: "Retrato da Dra. Daniela Moura Landim de jaleco branco, com os braços cruzados",
    position: "50% 30%",
  },
} satisfies Record<HeroPhoto, { src: typeof modeloRenal; alt: string; position: string }>;

export const avatars = {
  retrato: { src: avatar, alt: "Dra. Daniela Moura Landim" },
  sorriso: { src: avatarSorriso, alt: "Dra. Daniela Moura Landim" },
};
