"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LoaderCircle, TriangleAlert } from "lucide-react";
import { frameSrc } from "@/components/cards/cover";
import { drivePreviewUrl, driveThumbnailUrl, driveViewUrl, mediaSrc } from "@/lib/drive";
import type { Video } from "@/data/types";
import { cn } from "@/lib/utils";

type Access = "checking" | "public" | "restricted";
type Mode = "native" | "embed";

/** Depois do play, quanto esperar o vídeo começar antes de trocar para o player do Drive. */
const STALL_MS = 12000;

/**
 * Player do Nefroflix. O arquivo continua hospedado no Google Drive.
 *
 * 1. "native": <video> do próprio navegador, com o arquivo entregue em /media/<id>.mp4
 *    (ver next.config.ts). Um único conjunto de controles, inclusive no iPhone e no Android,
 *    na resolução original e com a capa do catálogo.
 * 2. "embed": se o arquivo não carregar (erro, cota do Drive, rede), troca sozinho para o
 *    player incorporado do Drive (/file/d/ID/preview), que era o comportamento anterior.
 *
 * Sem autoplay. Respeita a proporção original: 9:16 para Reels, 16:9 para vídeos horizontais.
 */
export function DrivePlayer({ video, className }: { video: Video; className?: string }) {
  const [mode, setMode] = useState<Mode>("native");
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [access, setAccess] = useState<Access>("checking");
  const stallTimer = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // A miniatura pública indica se o arquivo está compartilhado como "Qualquer pessoa com o link".
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

  // O <video> vem pronto do servidor e começa a carregar antes do React: um erro que
  // aconteça nesse intervalo não chega ao onError, então conferimos ao montar.
  useEffect(() => {
    const el = videoRef.current;
    if (el && (el.error || el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) setMode("embed");
    return () => clearStall();
  }, []);

  function clearStall() {
    if (stallTimer.current) window.clearTimeout(stallTimer.current);
    stallTimer.current = null;
  }

  const fallBack = () => {
    clearStall();
    setMode("embed");
  };

  const onPlay = () => {
    clearStall();
    stallTimer.current = window.setTimeout(() => {
      const el = videoRef.current;
      if (el && el.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) fallBack();
    }, STALL_MS);
  };

  const vertical = video.orientation === "vertical";

  return (
    <div className={className}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[22px] bg-black shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)] ring-1 ring-white/10",
          vertical ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        {mode === "native" ? (
          <video
            ref={videoRef}
            src={mediaSrc(video)}
            poster={frameSrc(video)}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            aria-label={`Vídeo: ${video.title}`}
            onError={fallBack}
            onPlay={onPlay}
            onPlaying={clearStall}
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />
        ) : (
          <>
            {!embedLoaded && (
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
              onLoad={() => setEmbedLoaded(true)}
              className={cn(
                "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
                embedLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        )}
      </div>

      {access === "restricted" ? (
        <div role="note" className="mt-3 flex gap-3 rounded-2xl border border-orange/25 bg-orange/[0.07] p-3.5 text-sm leading-relaxed text-mist">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-orange" aria-hidden />
          <p>
            Não foi possível confirmar o acesso público a este vídeo. Se o player pedir login,{" "}
            <a
              href={driveViewUrl(video.driveId)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-orange-bright underline decoration-orange/50 underline-offset-4 hover:decoration-orange"
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
