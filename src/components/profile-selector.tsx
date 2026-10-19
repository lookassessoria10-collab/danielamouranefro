"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "./brand";
import { ProfileGlyph } from "./profile-badge";
import { profiles } from "@/data/profiles";
import { site } from "@/data/site";
import type { ProfileId } from "@/data/types";
import { library, useLibrary } from "@/lib/library";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";

/**
 * "Quem está assistindo?" — perfis sem cadastro. Funcionam como modos de navegação:
 * mudam a ordem da home e das sugestões, nunca escondem vídeos.
 */
export function ProfileSelector({ mode }: { mode: "entry" | "manage" }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { profile, ready } = useLibrary();
  const [chosen, setChosen] = useState<ProfileId | null>(null);

  // Quem já escolheu um perfil vai direto para a home (navegação interna).
  useEffect(() => {
    if (mode === "entry" && ready && profile && !chosen) router.replace(`/${profile}`);
  }, [mode, ready, profile, chosen, router]);

  const choose = (id: ProfileId) => {
    if (chosen) return;
    setChosen(id);
    library.setProfile(id);
    router.prefetch(`/${id}`);
    window.setTimeout(() => router.push(`/${id}`), reduce ? 0 : 420);
  };

  const current = mode === "manage" && ready ? profile : null;
  const photo = photos.sorriso;

  return (
    <main id="conteudo" className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* Fotografia discreta ao fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-0 w-full opacity-35 md:w-[52%] md:opacity-60">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 52vw, 100vw"
            className="object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos)]"
            style={{ "--pos": "50% 45%", "--pos-m": "50% 30%" } as React.CSSProperties}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink md:bg-gradient-to-r md:from-ink md:via-ink/90 md:to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
        <div className="absolute -left-40 top-1/3 size-[520px] rounded-full bg-orange/10 blur-[140px]" />
      </div>

      <header className="shell flex items-center justify-between py-5 sm:py-7">
        <Logo priority />
        {mode === "manage" && ready && profile && (
          <Link href={`/${profile}`} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-mist hover:text-snow">
            <ArrowLeft size={17} aria-hidden /> Voltar
          </Link>
        )}
      </header>

      <section className="shell flex flex-1 flex-col justify-center pb-14 pt-2 md:pb-20">
        <p className="rise eyebrow text-orange-bright">{site.tagline}</p>
        <h1 className="rise mt-3 max-w-2xl text-display text-[2.7rem] text-snow sm:text-[4rem] lg:text-[4.8rem]" style={{ animationDelay: "60ms" }}>
          Quem está assistindo?
        </h1>
        <p className="rise mt-4 max-w-lg text-[1.05rem] leading-relaxed text-mist" style={{ animationDelay: "120ms" }}>
          Escolha como quer navegar. Sem cadastro e sem senha: o perfil só muda a ordem das sugestões, e todos os vídeos
          ficam disponíveis para todos.
        </p>

        <ul className="mt-9 grid w-full max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {profiles.map((p, i) => {
            const isChosen = chosen === p.id;
            const dimmed = chosen !== null && !isChosen;
            const active = isChosen || current === p.id;
            return (
              <motion.li
                key={p.id}
                initial={false}
                animate={{ opacity: dimmed ? 0.3 : 1, scale: isChosen ? 1.03 : dimmed ? 0.97 : 1 }}
                className="rise"
                style={{ animationDelay: `${180 + i * 70}ms` }}
              >
                <button
                  type="button"
                  onClick={() => choose(p.id)}
                  aria-pressed={current === p.id}
                  className={cn(
                    "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-surface/80 p-4 text-left ring-1 backdrop-blur-md transition-[background-color,box-shadow,translate] duration-500 ease-out-expo",
                    "hover:-translate-y-1 hover:bg-raised/90 sm:flex-col sm:items-start sm:gap-10 sm:p-6",
                    active ? "ring-2 ring-orange" : "ring-white/[0.08] hover:ring-white/20",
                  )}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
                    style={{ background: p.color }}
                  />
                  <span
                    className="relative grid size-14 shrink-0 place-items-center rounded-2xl sm:size-16"
                    style={{ color: p.color, background: `color-mix(in oklab, ${p.color} 16%, var(--color-ink))` }}
                  >
                    <ProfileGlyph id={p.id} size={30} strokeWidth={1.5} />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-3 text-xl font-extrabold tracking-[-0.02em] text-snow sm:text-2xl">
                      {p.label}
                      <ArrowRight size={20} aria-hidden className="text-mist transition-transform duration-300 group-hover:translate-x-1 group-hover:text-snow" />
                    </span>
                    <span className="mt-1 block text-[0.95rem] leading-snug text-mist">{p.description}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <p className="rise mt-10 text-sm text-fog" style={{ animationDelay: "420ms" }}>
          Vídeos educativos da <span className="font-semibold text-mist">{site.doctor.name}</span>, {site.doctor.specialty.toLowerCase()}.
        </p>
      </section>
    </main>
  );
}
