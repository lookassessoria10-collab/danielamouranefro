"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { VideoCard } from "@/components/cards/cards";
import { ProfileBadge } from "@/components/profile-badge";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { getProfile } from "@/data/profiles";
import type { ProfileId } from "@/data/types";
import { getVideos } from "@/lib/catalog";
import { library, useLibrary } from "@/lib/library";
import { recommendForYou } from "@/lib/recommend";

/** Ao abrir a home de um perfil, ele passa a ser o perfil salvo neste navegador. */
export function ProfileSync({ profile }: { profile: ProfileId }) {
  useEffect(() => {
    library.setProfile(profile);
  }, [profile]);
  return null;
}

export function ProfileNote({ profile }: { profile: ProfileId }) {
  const p = getProfile(profile);
  return (
    <div className="shell">
      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-fog">
        <ProfileBadge id={profile} size={24} />
        <span>
          Navegando como <strong className="font-semibold text-mist">{p.label}</strong>
          <span className="hidden sm:inline"> — {p.note}</span>
        </span>
        <Link href="/perfis" className="font-semibold text-mist underline decoration-white/20 underline-offset-4 hover:text-snow hover:decoration-orange">
          Trocar perfil
        </Link>
      </p>
    </div>
  );
}

/**
 * "Selecionados para você": regras transparentes (perfil + escolhas + histórico).
 * `avoid` tira da fileira os vídeos do trilho seguinte, para não repetir conteúdo lado a lado.
 */
export function ForYouRail({ profile, avoid = [] }: { profile: ProfileId; avoid?: string[] }) {
  const lib = useLibrary();
  const personalized = lib.ready && (lib.interests.length > 0 || lib.history.length > 0);
  const videos = useMemo(() => {
    const ranked = recommendForYou(
      {
        profile,
        interests: lib.interests,
        history: lib.history.map((h) => h.id),
        watched: lib.watched,
      },
      30,
    );
    return ranked.filter((v) => !avoid.includes(v.id)).slice(0, 10);
  }, [profile, lib.interests, lib.history, lib.watched, avoid]);

  return (
    <Rail
      key={videos.map((v) => v.id).join(",")}
      eyebrow="Para você"
      title="Selecionados para você"
      description={
        personalized
          ? `Pelo perfil ${getProfile(profile).label} e pelos assuntos que você escolheu ou abriu.`
          : `Pelo perfil ${getProfile(profile).label}. Use “Por onde começar?” para afinar as sugestões.`
      }
      itemClassName={railItem.landscape}
    >
      {videos.map((v, i) => (
        <VideoCard key={v.id} video={v} priority={i < 2} />
      ))}
    </Rail>
  );
}

/**
 * Vídeos abertos recentemente neste aparelho. O player do Google Drive não informa
 * o tempo assistido, então não há barra de progresso: só o atalho para voltar ao vídeo.
 */
export function ContinueRail() {
  const { ready, history } = useLibrary();
  if (!ready || history.length === 0) return null;
  const videos = getVideos(history.map((h) => h.id)).slice(0, 12);
  return (
    <Rail
      title="Continuar assistindo"
      description="Os últimos vídeos que você abriu neste aparelho."
      href="/minha-lista#vistos"
      hrefLabel="Histórico"
      itemClassName={railItem.landscape}
    >
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </Rail>
  );
}
