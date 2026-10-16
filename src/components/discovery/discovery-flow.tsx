"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Activity, ArrowLeft, ArrowRight, Coffee, ListPlus, Pill, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { CardArt } from "@/components/cards/card-art";
import { CategoryIcon } from "@/components/icons";
import { SaveButton } from "@/components/save-button";
import { discoveryIntro, discoveryPaths, type DiscoveryPath, type DiscoveryTopic } from "@/data/discovery";
import { getCategory, getVideos } from "@/lib/catalog";
import { library } from "@/lib/library";
import { photos } from "@/lib/photos";
import { toast } from "@/lib/toast";
import type { Video } from "@/data/types";
import { cn, pad2 } from "@/lib/utils";

const PATH_ICONS = { signal: Activity, cup: Coffee, pill: Pill, shield: ShieldCheck };
const STEPS = ["Assunto", "Tema", "Sua seleção"];

/**
 * "Por onde começar?" — duas escolhas curtas levam a uma seleção de vídeos reais.
 * Não pergunta sobre doenças, exames ou dados pessoais: só assuntos de interesse.
 */
export function DiscoveryFlow({ variant = "section" }: { variant?: "section" | "page" }) {
  const [path, setPath] = useState<DiscoveryPath | null>(null);
  const [topic, setTopic] = useState<DiscoveryTopic | null>(null);
  const step = topic ? 2 : path ? 1 : 0;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Leva o foco para o título de cada etapa (teclado e leitores de tela).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const chooseTopic = (t: DiscoveryTopic) => {
    setTopic(t);
    library.addInterests(t.selection);
  };

  const restart = () => {
    setTopic(null);
    setPath(null);
  };

  const selection = topic ? getVideos(topic.selection) : [];

  return (
    <section
      aria-labelledby="por-onde-comecar"
      className={cn("reveal", variant === "section" ? "shell py-10 md:py-14" : "shell pb-10 pt-24 md:pt-32")}
    >
      <div className="relative isolate overflow-hidden rounded-[32px] bg-charcoal ring-1 ring-white/[0.07]">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[460px] w-[460px] rounded-full bg-petrol-2/50 blur-[110px]" />

        <div className="grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          {/* Coluna de apresentação */}
          <aside className="relative flex flex-col border-b border-white/[0.06] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex items-center gap-4 lg:block">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 lg:aspect-[4/5] lg:size-auto lg:w-full lg:rounded-3xl">
                <Image
                  src={photos.retrato.src}
                  alt={variant === "page" ? photos.retrato.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 300px, 64px"
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: "50% 24%" }}
                />
                <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-charcoal via-transparent to-transparent lg:block" />
              </div>
              <div className="lg:-mt-16 lg:relative">
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-caramel">Descubra sua próxima resposta</p>
                {variant === "page" ? (
                  <h1 id="por-onde-comecar" className="mt-2 font-display text-[2.4rem] leading-none text-snow sm:text-[3rem]">
                    {discoveryIntro.title}
                  </h1>
                ) : (
                  <h2 id="por-onde-comecar" className="mt-2 font-display text-[2.4rem] leading-none text-snow sm:text-[3rem]">
                    {discoveryIntro.title}
                  </h2>
                )}
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-mist">{discoveryIntro.text}</p>

            <ol className="mt-6 flex gap-2 lg:mt-auto lg:flex-col lg:gap-3 lg:pt-8" aria-label="Etapas">
              {STEPS.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-3 lg:flex-none" aria-current={i === step ? "step" : undefined}>
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold transition-colors duration-500",
                      i < step && "bg-caramel text-ink",
                      i === step && "bg-snow text-ink",
                      i > step && "bg-white/[0.06] text-fog",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("hidden text-sm transition-colors sm:inline", i === step ? "text-snow" : "text-fog")}>{label}</span>
                  {i < STEPS.length - 1 && (
                    <span className="relative h-px flex-1 overflow-hidden bg-white/10 lg:hidden">
                      <motion.span
                        className="absolute inset-0 origin-left bg-caramel"
                        initial={false}
                        animate={{ scaleX: i < step ? 1 : 0 }}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </aside>

          {/* Etapas */}
          <div className="relative min-h-[460px] p-6 sm:p-8 lg:p-10" aria-live="polite">
            <LayoutGroup>
              <AnimatePresence mode="wait" initial={false}>
                {step === 0 && (
                  <StepFrame key="s0">
                    <h3 ref={headingRef} tabIndex={-1} className="text-[1.35rem] font-semibold text-snow focus:outline-none sm:text-2xl">
                      O que você quer entender hoje?
                    </h3>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {discoveryPaths.map((p, i) => {
                        const Icon = PATH_ICONS[p.icon];
                        return (
                          <motion.li
                            key={p.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + i * 0.06 }}
                          >
                            <motion.button
                              layoutId={`path-${p.id}`}
                              type="button"
                              onClick={() => setPath(p)}
                              className="group flex h-full w-full flex-col gap-6 rounded-3xl bg-charcoal-2 p-5 text-left ring-1 ring-white/[0.07] transition-[background-color,box-shadow] duration-300 hover:bg-charcoal-3 hover:ring-white/20 sm:p-6"
                            >
                              <span className="flex items-center justify-between">
                                <span className="grid size-11 place-items-center rounded-2xl bg-caramel/12 text-caramel">
                                  <Icon size={21} aria-hidden />
                                </span>
                                <ArrowRight size={18} aria-hidden className="text-fog transition-transform duration-300 group-hover:translate-x-1 group-hover:text-snow" />
                              </span>
                              <span className="font-display text-[1.6rem] leading-[1.08] text-snow">{p.label}</span>
                            </motion.button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </StepFrame>
                )}

                {step === 1 && path && (
                  <StepFrame key="s1">
                    <BackLink onClick={() => setPath(null)}>Trocar assunto</BackLink>
                    <motion.div
                      layoutId={`path-${path.id}`}
                      className="mt-4 inline-flex max-w-full items-center gap-2.5 rounded-full bg-charcoal-2 py-2 pl-2 pr-4 ring-1 ring-caramel/40"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-caramel text-ink">
                        {(() => {
                          const Icon = PATH_ICONS[path.icon];
                          return <Icon size={16} aria-hidden />;
                        })()}
                      </span>
                      <span className="truncate text-sm text-snow">{path.label}</span>
                    </motion.div>
                    <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-[2rem] leading-[1.05] text-snow focus:outline-none sm:text-[2.6rem]">
                      {path.prompt}
                    </h3>
                    <ul className="mt-7 flex flex-wrap gap-2.5">
                      {path.topics.map((t, i) => (
                        <motion.li
                          key={t.id}
                          initial={{ opacity: 0, y: 12, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.12 + i * 0.05 }}
                        >
                          <button
                            type="button"
                            onClick={() => chooseTopic(t)}
                            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-[0.98rem] text-snow transition-colors hover:border-caramel/70 hover:bg-caramel/10"
                          >
                            {t.label}
                            <ArrowRight size={16} aria-hidden className="-ml-1 w-0 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:w-4 group-hover:opacity-100" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                    <p className="mt-8 max-w-md text-xs leading-relaxed text-fog">
                      A trilha só aponta vídeos sobre o assunto escolhido. Ela não faz diagnóstico nem substitui a consulta.
                    </p>
                  </StepFrame>
                )}

                {step === 2 && topic && (
                  <StepFrame key="s2">
                    <BackLink onClick={() => setTopic(null)}>Escolher outro tema</BackLink>
                    <p className="mt-5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-caramel">Sua seleção Nefroflix</p>
                    <h3 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-[2rem] leading-[1.05] text-snow focus:outline-none sm:text-[2.6rem]">
                      Para começar: {topic.label.toLowerCase()}
                    </h3>
                    <Selection videos={selection} />
                    <div className="mt-7 flex flex-wrap gap-2.5">
                      {selection[0] && (
                        <Link
                          href={`/assistir/${selection[0].slug}`}
                          className="inline-flex h-12 items-center gap-2 rounded-full bg-caramel pl-5 pr-6 font-semibold text-ink transition-colors hover:bg-caramel-soft"
                        >
                          <Play size={17} fill="currentColor" aria-hidden /> Assistir o primeiro
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const added = library.addManyToList(selection.map((v) => v.id));
                          toast(added ? `${added} ${added === 1 ? "vídeo salvo" : "vídeos salvos"} na sua lista` : "A seleção já está na sua lista");
                        }}
                        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 font-medium text-snow transition-colors hover:border-white/40"
                      >
                        <ListPlus size={18} aria-hidden /> Salvar seleção
                      </button>
                      <button
                        type="button"
                        onClick={restart}
                        className="inline-flex h-12 items-center gap-2 rounded-full px-4 font-medium text-mist transition-colors hover:text-snow"
                      >
                        <RotateCcw size={17} aria-hidden /> Refazer escolhas
                      </button>
                    </div>
                  </StepFrame>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-snow">
      <ArrowLeft size={16} aria-hidden /> {children}
    </button>
  );
}

/** Cards da seleção: o primeiro em destaque, os demais se organizam ao lado. */
function Selection({ videos }: { videos: Video[] }) {
  return (
    <ul className="mt-6 grid gap-3 md:grid-cols-[1.25fr_1fr]">
      {videos.map((video, i) => {
        const category = getCategory(video.category)!;
        const lead = i === 0;
        return (
          <motion.li
            key={video.id}
            layout
            initial={{ opacity: 0, y: 30, rotate: lead ? -2 : 2, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 160, damping: 20 }}
            className={cn(lead && "md:row-span-2")}
          >
            <article
              className={cn(
                "group relative isolate flex h-full overflow-hidden rounded-3xl ring-1 ring-white/[0.08] transition-shadow hover:shadow-lift has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-caramel",
                lead ? "min-h-[260px] flex-col justify-end p-6" : "min-h-[124px] items-end p-5",
              )}
              style={{
                background: `linear-gradient(150deg, color-mix(in oklab, ${category.color} ${lead ? 26 : 16}%, var(--color-charcoal-2)), var(--color-charcoal-2) 70%)`,
              }}
            >
              <CardArt icon={category.icon} color={category.color} seed={video.number} className="opacity-80" />
              <span
                aria-hidden
                className={cn("absolute font-display leading-none", lead ? "left-6 top-4 text-[4.5rem]" : "right-5 top-3 text-[2.4rem]")}
                style={{ color: category.color }}
              >
                {pad2(video.number)}
              </span>
              <div className={cn("relative min-w-0 pr-12", lead ? "mt-auto pt-20" : "flex-1")}>
                <p className="flex items-center gap-1.5 text-[0.64rem] font-medium uppercase tracking-[0.16em]" style={{ color: category.color }}>
                  <CategoryIcon icon={category.icon} size={12} strokeWidth={2} />
                  {lead ? "Comece por este" : category.shortTitle}
                </p>
                <h4 className={cn("mt-1.5 font-semibold leading-tight text-snow", lead ? "text-[1.6rem]" : "text-[1.1rem]")}>
                  <Link href={`/assistir/${video.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                    {video.title}
                  </Link>
                </h4>
                <p className={cn("mt-1 font-display italic text-mist", lead ? "text-[1.15rem]" : "line-clamp-1 text-base")}>{video.question}</p>
              </div>
              <SaveButton videoId={video.id} title={video.title} className="absolute bottom-5 right-5 z-10" />
            </article>
          </motion.li>
        );
      })}
    </ul>
  );
}
