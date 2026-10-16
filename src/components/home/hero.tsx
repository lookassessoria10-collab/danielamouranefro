"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { CategoryIcon } from "@/components/icons";
import { SaveButton } from "@/components/save-button";
import type { HeroPhoto } from "@/data/profiles";
import type { Category, Video } from "@/data/types";
import { site } from "@/data/site";
import { photos } from "@/lib/photos";
import { cn, pad2 } from "@/lib/utils";

export type HeroSlide = { video: Video; category: Category; photo: HeroPhoto };

const DURATION = 9000;

/**
 * Destaque principal: a pergunta em primeiro plano, a fotografia real da
 * Dra. Daniela ao fundo e um vídeo real do catálogo como ação.
 * Gira sozinho a cada 9 s, pausa ao passar o mouse/focar e tem botão de pausa.
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const running = !paused && !holding && !reduce && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), DURATION);
    return () => window.clearTimeout(t);
  }, [index, running, slides.length]);

  const slide = slides[index];
  const photo = photos[slide.photo];

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
      <div className="absolute inset-x-0 top-0 -z-10 h-[78%] overflow-hidden md:inset-y-0 md:left-[34%] md:h-auto">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.video.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1 }, scale: { duration: 6, ease: "linear" } }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority={index === 0}
              placeholder="blur"
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          </motion.div>
        </AnimatePresence>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/40 md:to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      </div>

      {/* Texto */}
      <div className="shell flex min-h-[620px] flex-col justify-end pb-10 pt-28 h-[88svh] max-h-[980px] md:h-[90svh] md:min-h-[640px] md:pb-16">
        <div className="max-w-[44rem]" aria-live={running ? "off" : "polite"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.video.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55 }}
            >
              <p className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.2em]">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                  style={{
                    color: slide.category.color,
                    background: `color-mix(in oklab, ${slide.category.color} 14%, rgb(16 19 23 / .6))`,
                  }}
                >
                  <CategoryIcon icon={slide.category.icon} size={13} strokeWidth={2} />
                  {slide.category.title}
                </span>
                <span className="text-mist">Nº {pad2(slide.video.number)}</span>
              </p>
              <h1 className="mt-5 font-display text-[3.1rem] leading-[0.95] text-snow [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:text-[4.4rem] lg:text-[5.4rem]">
                {slide.video.question}
              </h1>
              <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-mist">
                <span className="text-snow">{slide.video.title}</span> — vídeo com a {site.doctor.name}, {site.doctor.specialty.toLowerCase()}.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/assistir/${slide.video.slug}`}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-caramel pl-5 pr-6 text-[0.98rem] font-semibold text-ink transition-colors hover:bg-caramel-soft"
                >
                  <Play size={18} fill="currentColor" aria-hidden /> Assistir
                </Link>
                <SaveButton videoId={slide.video.id} title={slide.video.title} variant="pill" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-2.5">
            {slides.map((s, i) => (
              <button
                key={s.video.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Destaque ${i + 1} de ${slides.length}: ${s.video.title}`}
                aria-current={i === index ? "true" : undefined}
                className="group relative h-6 w-12 sm:w-16"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 transition-colors group-hover:bg-white/35">
                  {i === index && (
                    <span
                      key={`${index}-${running}`}
                      className="absolute inset-0 origin-left rounded-full bg-caramel"
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
                className={cn(
                  "ml-1 grid size-8 place-items-center rounded-full border border-white/15 text-mist transition-colors hover:border-white/40 hover:text-snow",
                )}
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
