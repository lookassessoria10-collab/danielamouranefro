import Image from "next/image";
import { photos } from "@/lib/photos";
import type { Video } from "@/data/types";
import { cn } from "@/lib/utils";

export type CoverShape = "landscape" | "poster" | "square";

const SHAPE_ASPECT: Record<CoverShape, number> = { landscape: 16 / 9, poster: 3 / 4, square: 1 };
/** Onde o rosto deve ficar dentro do recorte (0 = topo, 1 = base). */
const FACE_AT: Record<CoverShape, number> = { landscape: 0.42, poster: 0.36, square: 0.45 };
const FRAME_ASPECT = 9 / 16;

export const frameSrc = (video: Video) => `/frames/${video.id}.jpg`;

/**
 * Converte a altura do rosto no quadro (catálogo) em object-position para
 * qualquer proporção, deixando o rosto acima do título do card.
 */
export function framePosition(faceYPercent: number, shape: CoverShape) {
  const faceY = faceYPercent / 100;
  const band = Math.min(1, FRAME_ASPECT / SHAPE_ASPECT[shape]);
  if (band >= 1) return "50% 50%";
  const p = (faceY - FACE_AT[shape] * band) / (1 - band);
  return `50% ${Math.round(Math.min(1, Math.max(0, p)) * 100)}%`;
}

/**
 * Capa de um vídeo: o quadro real do próprio vídeo ou, quando ele não serve
 * (texto por cima, desfoque), uma capa tipográfica com fotografia real da Dra. Daniela.
 */
export function Cover({
  video,
  shape,
  sizes,
  priority = false,
  className,
}: {
  video: Video;
  shape: CoverShape;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (video.cover.style === "frame") {
    return (
      <Image
        src={frameSrc(video)}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
        style={{ objectPosition: framePosition(video.cover.faceY, shape) }}
      />
    );
  }

  const photo = photos[video.cover.photo];
  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-brown-deep", className)}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 85% 10%, rgb(232 106 0 / 0.55), transparent 55%), linear-gradient(160deg, #5a2b1b 0%, #231d1a 70%)",
        }}
      />
      <div
        className={cn("absolute inset-y-0 right-0", shape === "landscape" ? "left-[38%]" : "left-0")}
        style={{
          maskImage:
            shape === "landscape"
              ? "linear-gradient(to left, black 30%, transparent 92%)"
              : "linear-gradient(to top, transparent 8%, black 55%)",
        }}
      >
        <Image
          src={photo.src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: shape === "landscape" ? "50% 22%" : photo.mobilePosition }}
        />
      </div>
      <p
        aria-hidden
        className={cn(
          "absolute text-display text-snow/95",
          shape === "landscape"
            ? "left-[7%] top-[12%] w-[52%] text-[clamp(0.95rem,2.4vw,1.35rem)]"
            : "left-[8%] right-[20%] top-[8%] text-[clamp(1rem,3.4vw,1.4rem)]",
        )}
      >
        {video.question}
      </p>
    </div>
  );
}
