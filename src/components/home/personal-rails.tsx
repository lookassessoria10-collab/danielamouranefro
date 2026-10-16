"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { PosterCard } from "@/components/cards/cards";
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
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-charcoal/70 px-4 py-3 text-sm text-mist ring-1 ring-white/[0.06]">
        <ProfileBadge id={profile} size={28} />
        <span>
          Navegando como <strong className="font-medium text-snow">{p.label}</strong>. {p.note}
        </span>
        <Link href="/perfis" className="ml-auto text-snow underline decoration-white/25 underline-offset-4 hover:decoration-caramel">
          Trocar perfil
        </Link>
      </p>
    </div>
  );
}

export function ForYouRail({ profile }: { profile: ProfileId }) {
  const lib = useLibrary();
  const personalized = lib.ready && (lib.interests.length > 0 || lib.history.length > 0);
  const videos = useMemo(
    () =>
      recommendForYou({
        profile,
        interests: lib.interests,
        history: lib.history.map((h) => h.id),
        watched: lib.watched,
      }),
    [profile, lib.interests, lib.history, lib.watched],
  );

  return (
    <Rail
      eyebrow="Para você"
      title="Selecionados para você"
      description={
        personalized
          ? `Pelo perfil ${getProfile(profile).label} e pelos assuntos que você escolheu ou abriu.`
          : `Pelo perfil ${getProfile(profile).label}. Use “Por onde começar?” para afinar as sugestões.`
      }
      itemClassName={railItem.poster}
    >
      {videos.map((v) => (
        <PosterCard key={v.id} video={v} />
      ))}
    </Rail>
  );
}

export function RecentRail() {
  const { ready, history } = useLibrary();
  if (!ready || history.length === 0) return null;
  const videos = getVideos(history.map((h) => h.id)).slice(0, 12);
  return (
    <Rail
      title="Vistos recentemente"
      description="Vídeos que você abriu neste navegador."
      href="/minha-lista#vistos"
      hrefLabel="Histórico"
      itemClassName={railItem.poster}
    >
      {videos.map((v) => (
        <PosterCard key={v.id} video={v} />
      ))}
    </Rail>
  );
}
