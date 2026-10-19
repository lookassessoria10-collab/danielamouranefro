import modeloRenal from "@/assets/daniela/daniela-modelo-renal.jpg";
import consultorio from "@/assets/daniela/daniela-consultorio.jpg";
import retrato from "@/assets/daniela/daniela-retrato.jpg";
import verde from "@/assets/daniela/daniela-verde.jpg";
import sorriso from "@/assets/daniela/daniela-sorriso.jpg";
import avatar from "@/assets/daniela/daniela-avatar.jpg";
import avatarSorriso from "@/assets/daniela/daniela-avatar-sorriso.jpg";
import type { StaticImageData } from "next/image";
import type { PhotoKey } from "@/data/types";

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** Enquadramento em telas largas (object-position). */
  position: string;
  /** Enquadramento no celular, mantendo o rosto visível. */
  mobilePosition: string;
};

/**
 * Fotografias reais da Dra. Daniela Moura Landim.
 * Apenas recorte, enquadramento e sobreposição de cor — nenhuma alteração de feições.
 */
export const photos: Record<PhotoKey, Photo> = {
  "modelo-renal": {
    src: modeloRenal,
    alt: "Dra. Daniela Moura Landim sorrindo no consultório, segurando um modelo anatômico de rim",
    position: "50% 55%",
    mobilePosition: "50% 28%",
  },
  consultorio: {
    src: consultorio,
    alt: "Dra. Daniela Moura Landim de jaleco, à mesa do consultório com um notebook",
    position: "50% 34%",
    mobilePosition: "50% 22%",
  },
  retrato: {
    src: retrato,
    alt: "Retrato da Dra. Daniela Moura Landim de jaleco branco, com os braços cruzados",
    position: "50% 46%",
    mobilePosition: "50% 26%",
  },
  verde: {
    src: verde,
    alt: "Dra. Daniela Moura Landim de pé, com roupa verde, em uma varanda",
    position: "42% 30%",
    mobilePosition: "42% 18%",
  },
  sorriso: {
    src: sorriso,
    alt: "Dra. Daniela Moura Landim sorrindo, com a mão no queixo, apoiada em uma mesa",
    position: "50% 68%",
    mobilePosition: "50% 40%",
  },
};

export const avatars = {
  retrato: { src: avatar, alt: "Dra. Daniela Moura Landim" },
  sorriso: { src: avatarSorriso, alt: "Dra. Daniela Moura Landim" },
};
