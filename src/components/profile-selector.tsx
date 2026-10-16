"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./brand";
import { ProfileGlyph } from "./profile-badge";
import { profiles } from "@/data/profiles";
import { site } from "@/data/site";
import type { ProfileId } from "@/data/types";
import { library, useLibrary } from "@/lib/library";
import { avatars } from "@/lib/photos";
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

  return (
    <main id="conteudo" className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-30%] h-[80vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-petrol/70 blur-[120px]" />
        <svg className="absolute left-1/2 top-1/2 h-[140vh] w-[140vh] -translate-x-1/2 -translate-y-1/2 text-white/[0.035]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth=".15">
          {[18, 26, 34, 42, 50].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} />
          ))}
        </svg>
      </div>

      <header className="shell flex items-center justify-between py-5 sm:py-7">
        <Logo />
        {mode === "manage" && ready && profile && (
          <Link href={`/${profile}`} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-mist hover:text-snow">
            <ArrowLeft size={17} aria-hidden /> Voltar
          </Link>
        )}
      </header>

      <section className="shell flex flex-1 flex-col items-center justify-center pb-14 pt-4 text-center">
        <p className="rise text-[0.72rem] font-medium uppercase tracking-[0.24em] text-caramel">{site.tagline}</p>
        <h1
          className="rise mt-4 font-display text-[3rem] leading-[0.95] text-snow sm:text-[4.6rem] lg:text-[5.6rem]"
          style={{ animationDelay: "60ms" }}
        >
          Quem está assistindo?
        </h1>

        <ul className="mt-10 grid w-full max-w-[920px] gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {profiles.map((p, i) => {
            const isChosen = chosen === p.id;
            const dimmed = chosen !== null && !isChosen;
            return (
              <motion.li
                key={p.id}
                initial={false}
                animate={{ opacity: dimmed ? 0.25 : 1, scale: isChosen ? 1.04 : dimmed ? 0.96 : 1 }}
                className="rise"
                style={{ animationDelay: `${140 + i * 70}ms` }}
              >
                <button
                  type="button"
                  onClick={() => choose(p.id)}
                  aria-pressed={current === p.id}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-[26px] p-3 text-left transition-colors sm:flex-col sm:gap-5 sm:p-5 sm:text-center",
                    "hover:bg-white/[0.035]",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-[76px] shrink-0 place-items-center rounded-[22px] transition-[translate,box-shadow] duration-500 ease-out-expo sm:size-[148px] sm:rounded-[32px]",
                      "group-hover:-translate-y-1 group-focus-visible:-translate-y-1",
                      (isChosen || current === p.id) && "-translate-y-1",
                    )}
                    style={{
                      color: p.color,
                      background: `linear-gradient(150deg, color-mix(in oklab, ${p.color} 26%, var(--color-charcoal-2)), var(--color-charcoal) 75%)`,
                      boxShadow:
                        isChosen || current === p.id
                          ? `0 0 0 2px var(--color-caramel), 0 24px 60px -24px color-mix(in oklab, ${p.color} 60%, transparent)`
                          : `inset 0 0 0 1px color-mix(in oklab, ${p.color} 30%, transparent)`,
                    }}
                  >
                    <span className="sm:hidden">
                      <ProfileGlyph id={p.id} size={38} strokeWidth={1.4} />
                    </span>
                    <span className="hidden sm:block">
                      <ProfileGlyph id={p.id} size={68} strokeWidth={1.1} />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-semibold text-snow sm:text-2xl">{p.label}</span>
                    <span className="mt-1 block text-[0.95rem] leading-snug text-mist">{p.description}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <p className="rise mt-10 max-w-md text-sm leading-relaxed text-fog" style={{ animationDelay: "420ms" }}>
          Sem cadastro e sem senha. O perfil só muda a ordem das sugestões: todos os vídeos ficam disponíveis para todos.
        </p>

        <div
          className="rise mt-8 flex items-center gap-3 rounded-full bg-white/[0.04] py-1.5 pl-1.5 pr-5 ring-1 ring-white/[0.07]"
          style={{ animationDelay: "500ms" }}
        >
          <Image src={avatars.sorriso.src} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />
          <span className="text-left text-sm leading-tight">
            <span className="block text-snow">{site.doctor.name}</span>
            <span className="text-fog">{site.doctor.specialty}</span>
          </span>
        </div>
      </section>
    </main>
  );
}
