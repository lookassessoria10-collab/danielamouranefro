"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ListPlus, Play, RotateCcw } from "lucide-react";
import { VideoCard } from "@/components/cards/cards";
import { Cover } from "@/components/cards/cover";
import { discoveryIntro, discoveryPaths, type DiscoveryPath, type DiscoveryTopic } from "@/data/discovery";
import { site } from "@/data/site";
import { getVideo, getVideos } from "@/lib/catalog";
import { library } from "@/lib/library";
import { photos } from "@/lib/photos";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const STEPS = ["Assunto", "Tema", "Sua seleção"];

/**
 * "Por onde começar?" — duas escolhas curtas levam a uma seleção de vídeos reais.
 * A Dra. Daniela aparece como anfitriã; a trilha não pergunta sobre doenças,
 * exames ou dados pessoais — só assuntos de interesse.
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
  const host = photos.verde;
  const Title = variant === "page" ? "h1" : "h2";

  return (
    <section
      aria-labelledby="por-onde-comecar"
      className={cn("reveal", variant === "section" ? "shell py-8 md:py-12" : "shell pb-10 pt-20 md:pt-28")}
    >
      <div className="relative isolate overflow-hidden rounded-[28px] bg-surface ring-1 ring-white/[0.06]">
        <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.4fr)]">
          {/* Anfitriã */}
          <aside className="relative min-h-[300px] overflow-hidden sm:min-h-[340px] lg:min-h-[620px]">
            <Image
              src={host.src}
              alt={host.alt}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              placeholder="blur"
              className="object-cover [object-position:50%_16%] lg:[object-position:42%_20%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-surface" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent lg:from-ink/80" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="eyebrow text-orange-bright">Descubra sua próxima resposta</p>
              <Title id="por-onde-comecar" className="mt-2 text-display text-[2.4rem] text-snow sm:text-[3rem]">
                {discoveryIntro.title}
              </Title>
              <p className="mt-3 max-w-sm text-[1rem] leading-relaxed text-snow/85">{discoveryIntro.text}</p>
              <p className="mt-4 text-xs font-semibold text-mist">
                Com a {site.doctor.name} · {site.doctor.specialty}
              </p>
            </div>
          </aside>

          {/* Área interativa */}
          <div className="relative flex min-h-[480px] flex-col p-5 sm:p-8 lg:p-10" aria-live="polite">
            <ol className="flex items-center gap-2" aria-label="Etapas">
              {STEPS.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-2" aria-current={i === step ? "step" : undefined}>
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors duration-500",
                      i < step && "bg-orange text-ink",
                      i === step && "bg-snow text-ink",
                      i > step && "bg-white/[0.07] text-fog",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("hidden text-sm font-semibold transition-colors sm:inline", i === step ? "text-snow" : "text-fog")}>{label}</span>
                  {i < STEPS.length - 1 && (
                    <span className="relative h-px flex-1 overflow-hidden bg-white/10">
                      <motion.span className="absolute inset-0 origin-left bg-orange" initial={false} animate={{ scaleX: i < step ? 1 : 0 }} />
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-7 flex-1">
              <LayoutGroup>
                <AnimatePresence mode="wait" initial={false}>
                  {step === 0 && (
                    <StepFrame key="s0">
                      <h3 ref={headingRef} tabIndex={-1} className="text-[1.4rem] font-extrabold tracking-[-0.02em] text-snow focus:outline-none sm:text-[1.7rem]">
                        O que você quer entender hoje?
                      </h3>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {discoveryPaths.map((p, i) => {
                          const cover = getVideo(p.coverVideo);
                          return (
                            <motion.li key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 + i * 0.06 }}>
                              <motion.button
                                layoutId={`path-${p.id}`}
                                type="button"
                                onClick={() => setPath(p)}
                                className="group relative isolate flex aspect-[2/1] w-full flex-col justify-end overflow-hidden rounded-2xl p-4 text-left ring-1 ring-white/[0.08] transition-shadow duration-500 hover:shadow-lift sm:aspect-[16/10] sm:p-5"
                              >
                                {cover && (
                                  <Cover
                                    video={cover}
                                    shape="landscape"
                                    sizes="(min-width: 1024px) 26vw, (min-width: 640px) 45vw, 90vw"
                                    className="-z-10 transition-transform duration-700 ease-out-expo group-hover:scale-105"
                                  />
                                )}
                                <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 to-transparent transition-colors duration-500 group-hover:via-ink/25" />
                                <span className="flex items-end justify-between gap-3">
                                  <span className="text-[1.15rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-snow sm:text-[1.25rem]">{p.label}</span>
                                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-snow/15 text-snow backdrop-blur-md transition-colors duration-300 group-hover:bg-orange group-hover:text-ink">
                                    <ArrowRight size={17} aria-hidden />
                                  </span>
                                </span>
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
                      <motion.p
                        layoutId={`path-${path.id}`}
                        className="mt-4 inline-flex max-w-full rounded-full bg-orange/15 px-4 py-2 text-sm font-semibold text-orange-bright"
                      >
                        <span className="truncate">{path.label}</span>
                      </motion.p>
                      <h3 ref={headingRef} tabIndex={-1} className="mt-5 text-[1.6rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-snow focus:outline-none sm:text-[2rem]">
                        {path.prompt}
                      </h3>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {path.topics.map((t, i) => {
                          const main = getVideo(t.selection[0]);
                          return (
                            <motion.li
                              key={t.id}
                              initial={{ opacity: 0, y: 10, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: 0.1 + i * 0.05 }}
                            >
                              <button
                                type="button"
                                onClick={() => chooseTopic(t)}
                                className="group flex w-full items-center gap-3.5 rounded-2xl bg-raised/70 p-2 pr-4 text-left ring-1 ring-white/[0.06] transition-[background-color,box-shadow] hover:bg-raised hover:ring-orange/50"
                              >
                                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-ink">
                                  {main && <Cover video={main} shape="square" sizes="56px" />}
                                </span>
                                <span className="min-w-0 flex-1 font-bold leading-snug text-snow">{t.label}</span>
                                <ArrowRight size={17} aria-hidden className="shrink-0 text-fog transition-transform duration-300 group-hover:translate-x-1 group-hover:text-orange-bright" />
                              </button>
                            </motion.li>
                          );
                        })}
                      </ul>
                      <p className="mt-6 max-w-md text-xs leading-relaxed text-fog">
                        A trilha só aponta vídeos sobre o assunto escolhido. Ela não faz diagnóstico nem substitui a consulta.
                      </p>
                    </StepFrame>
                  )}

                  {step === 2 && topic && (
                    <StepFrame key="s2">
                      <BackLink onClick={() => setTopic(null)}>Escolher outro tema</BackLink>
                      <p className="eyebrow mt-5 text-orange-bright">Sua seleção Nefroflix</p>
                      <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-[1.6rem] font-extrabold leading-[1.1] tracking-[-0.025em] text-snow focus:outline-none sm:text-[2rem]">
                        Para começar: {topic.label.toLowerCase()}
                      </h3>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {selection.map((video, i) => (
                          <motion.li
                            key={video.id}
                            layout
                            initial={{ opacity: 0, y: 24, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.12 + i * 0.1, type: "spring", stiffness: 170, damping: 22 }}
                            className={cn(i === 0 && "sm:col-span-2")}
                          >
                            <VideoCard video={video} label={i === 0 ? "Comece por este" : undefined} />
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        {selection[0] && (
                          <Link
                            href={`/assistir/${selection[0].slug}`}
                            className="inline-flex h-12 items-center gap-2 rounded-full bg-orange pl-5 pr-6 font-bold text-ink transition-colors hover:bg-orange-bright"
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
                          className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.08] px-5 font-semibold text-snow transition-colors hover:bg-white/[0.14]"
                        >
                          <ListPlus size={18} aria-hidden /> Salvar seleção
                        </button>
                        <button
                          type="button"
                          onClick={restart}
                          className="inline-flex h-12 items-center gap-2 rounded-full px-4 font-semibold text-mist transition-colors hover:text-snow"
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
      </div>
    </section>
  );
}

function StepFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.38 }}>
      {children}
    </motion.div>
  );
}

function BackLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-mist transition-colors hover:text-snow">
      <ArrowLeft size={16} aria-hidden /> {children}
    </button>
  );
}
