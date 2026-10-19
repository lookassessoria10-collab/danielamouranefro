"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { SaveButton } from "@/components/save-button";
import type { Category, PhotoKey, Video } from "@/data/types";
import { site } from "@/data/site";
import { photos } from "@/lib/photos";
import { cn, pad2 } from "@/lib/utils";

export type HeroSlide = { video: Video; category: Category; photo: PhotoKey };

const DURATION = 9000;

/**
 * Banner principal: fotografia real da Dra. Daniela à direita (no celular, em cima),
 * título curto e forte à esquerda e um vídeo real do catálogo como ação.
 * Troca sozinho a cada 9 s, pausa ao passar o mouse ou focar e tem botão de pausa.
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const [hidden, setHidden] = useState(false);
  const running = !paused && !holding && !hidden && !reduce && slides.length > 1;

  // Aba em segundo plano: não troca de destaque (quem volta encontra o mesmo vídeo).
  useEffect(() => {
    const onVisibility = () => setHidden(document.visibilityState === "hidden");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), DURATION);
    return () => window.clearTimeout(t);
  }, [index, running, slides.length]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques"
      className="relative isolate overflow-hidden"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHolding(true)}
      onPointerLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHolding(false)}
    >
      {/* Fotografia */}
      <div className="absolute inset-x-0 top-0 -z-10 aspect-[4/5] max-h-[78svh] w-full overflow-hidden sm:aspect-[4/3] md:inset-y-0 md:left-auto md:right-0 md:aspect-auto md:max-h-none md:w-[58%] lg:w-[64%] md:[mask-image:linear-gradient(to_right,transparent,black_38%)]">
        {/* Camadas sobrepostas com crossfade em CSS: a foto nunca depende de JavaScript para aparecer. */}
        {slides.map((s, i) => {
          const p = photos[s.photo];
          const active = i === index;
          return (
            <div
              key={s.video.id}
              aria-hidden={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                active ? "nf-hero-active opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={p.src}
                alt={active ? p.alt : ""}
                fill
                priority={i === 0}
                placeholder="blur"
                sizes="(min-width: 768px) 64vw, 100vw"
                className="object-cover [object-position:var(--pos-m)] md:[object-position:var(--pos)]"
                style={{ "--pos": p.position, "--pos-m": p.mobilePosition } as React.CSSProperties}
              />
            </div>
          );
        })}
        {/* Transição suave para o fundo: sem cortes bruscos, sem escurecer demais a foto. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent md:via-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      {/* Texto */}
      <div className="shell flex flex-col justify-end pb-8 pt-[min(76vw,64svh)] sm:pt-[56vw] md:min-h-[min(80svh,760px)] md:pb-14 md:pt-32">
        <div className="max-w-[34rem] md:max-w-[44%] lg:max-w-[34rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.video.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <p className="flex items-center gap-2.5 text-[0.78rem] font-semibold text-mist">
                <span className="eyebrow text-orange-bright">{slide.category.title}</span>
                <span aria-hidden className="size-1 rounded-full bg-mist/60" />
                <span>Nº {pad2(slide.video.number)}</span>
              </p>
              <h1 className="mt-3 text-display text-[clamp(2.05rem,10.5vw,2.6rem)] text-snow [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] [hyphens:manual] sm:text-[3.2rem] md:text-[3rem] lg:text-[4.4rem]">
                {slide.video.title}
              </h1>
              <p className="mt-4 text-[1.08rem] font-medium leading-snug text-snow/90 sm:text-[1.2rem]">{slide.video.question}</p>
              <p className="mt-2 text-sm text-mist">
                Com a {site.doctor.name}, {site.doctor.specialty.toLowerCase()}.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/assistir/${slide.video.slug}`}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-orange pl-5 pr-6 text-[0.98rem] font-bold text-ink transition-colors hover:bg-orange-bright"
                >
                  <Play size={18} fill="currentColor" aria-hidden /> Assistir
                </Link>
                <SaveButton videoId={slide.video.id} title={slide.video.title} variant="pill" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <div className="mt-8 flex items-center gap-2 md:mt-10">
            {slides.map((s, i) => (
              <button
                key={s.video.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Destaque ${i + 1} de ${slides.length}: ${s.video.title}`}
                aria-current={i === index ? "true" : undefined}
                className="group relative h-6 w-9 sm:w-12"
              >
                <span
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full transition-colors",
                    i === index ? "bg-white/25" : "bg-white/15 group-hover:bg-white/30",
                  )}
                >
                  {i === index && (
                    <span
                      key={`${index}-${running}`}
                      className="absolute inset-0 origin-left rounded-full bg-orange"
                      style={running ? { animation: `nf-progress ${DURATION}ms linear both` } : undefined}
                    />
                  )}
                </span>
              </button>
            ))}
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Retomar a troca automática de destaques" : "Pausar a troca automática de destaques"}
                className="ml-1 grid size-8 place-items-center rounded-full text-mist transition-colors hover:bg-white/10 hover:text-snow"
              >
                {paused ? <Play size={13} fill="currentColor" aria-hidden /> : <Pause size={13} fill="currentColor" aria-hidden />}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
