"use client";

import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle, TriangleAlert } from "lucide-react";
import { drivePreviewUrl, driveThumbnailUrl, driveViewUrl } from "@/lib/drive";
import type { Video } from "@/data/types";
import { cn } from "@/lib/utils";

type Access = "checking" | "public" | "restricted";

/**
 * Player incorporado do Google Drive (/file/d/ID/preview), sem autoplay.
 * Respeita a proporção original: 9:16 para Reels, 16:9 para vídeos horizontais.
 *
 * O Drive não informa erros de dentro do iframe. Para orientar o visitante,
 * testamos a miniatura pública do arquivo: se ela não carrega, o arquivo
 * provavelmente não está compartilhado como "Qualquer pessoa com o link".
 */
export function DrivePlayer({ video, className }: { video: Video; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [access, setAccess] = useState<Access>("checking");

  useEffect(() => {
    let active = true;
    const probe = new Image();
    probe.referrerPolicy = "no-referrer";
    probe.onload = () => active && setAccess("public");
    probe.onerror = () => active && setAccess("restricted");
    probe.src = driveThumbnailUrl(video.driveId, 16);
    return () => {
      active = false;
      probe.onload = probe.onerror = null;
    };
  }, [video.driveId]);

  const vertical = video.orientation === "vertical";

  return (
    <div className={className}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[22px] bg-black shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/10",
          vertical ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        {!loaded && (
          <div className="skeleton absolute inset-0 grid place-items-center" aria-hidden>
            <div className="flex flex-col items-center gap-3 text-fog">
              <LoaderCircle size={28} className="animate-spin motion-reduce:animate-none" />
              <span className="text-sm">Carregando vídeo…</span>
            </div>
          </div>
        )}
        <iframe
          src={drivePreviewUrl(video.driveId)}
          title={`Vídeo: ${video.title}`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {access === "restricted" ? (
        <div role="note" className="mt-3 flex gap-3 rounded-2xl border border-caramel/25 bg-caramel/[0.07] p-3.5 text-sm leading-relaxed text-mist">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-caramel" aria-hidden />
          <p>
            Não foi possível confirmar o acesso público a este vídeo. Se o player pedir login,{" "}
            <a
              href={driveViewUrl(video.driveId)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-caramel-soft underline decoration-caramel/50 underline-offset-4 hover:decoration-caramel"
            >
              abra no Google Drive
            </a>
            .
          </p>
        </div>
      ) : (
        <p className="mt-3 text-center text-[0.8rem] text-fog">
          Problemas para assistir?{" "}
          <a
            href={driveViewUrl(video.driveId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-mist underline decoration-white/20 underline-offset-4 hover:text-snow"
          >
            Abrir no Google Drive <ExternalLink size={12} aria-hidden />
          </a>
        </p>
      )}
    </div>
  );
}
