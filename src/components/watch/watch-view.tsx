"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Circle, CircleCheck } from "lucide-react";
import { DrivePlayer } from "./drive-player";
import { ShareButton } from "./share-button";
import { CompactCard } from "@/components/cards/cards";
import { frameSrc } from "@/components/cards/cover";
import { CoffeeCupIcon } from "@/components/icons";
import { SaveButton } from "@/components/save-button";
import { useHomeHref } from "@/components/layout/site-header";
import { library, useLibrary } from "@/lib/library";
import { avatars, photos } from "@/lib/photos";
import { toast } from "@/lib/toast";
import { site } from "@/data/site";
import type { Category, Series, Video } from "@/data/types";
import { cn, durationText, pad2 } from "@/lib/utils";

type Props = {
  video: Video;
  category: Category;
  series: Series | null;
  episode: number | null;
  upNext: Video[];
  next: Video | null;
};

export function WatchView({ video, category, series, episode, upNext, next }: Props) {
  useEffect(() => {
    library.recordView(video.id);
  }, [video.id]);

  const ambient = video.cover.style === "frame" ? frameSrc(video) : photos[video.cover.photo].src;

  return (
    <div className="relative isolate">
      {/* Fundo ambiente: o próprio quadro do vídeo, bem desfocado */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] overflow-hidden">
        <Image src={ambient} alt="" fill sizes="40vw" className="scale-125 object-cover opacity-30 blur-3xl saturate-150" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" />
      </div>

      <div className="shell pt-[4.25rem] md:pt-24">
        <BackButton className="mb-3 inline-flex lg:hidden" />

        <div className="grid items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          {/* Player: protagonista da tela, na proporção original */}
          <div
            className={cn(
              "mx-auto w-full lg:sticky lg:top-24",
              video.orientation === "vertical"
                ? "max-w-[min(100%,calc((100svh_-_9rem)*9/16))] lg:w-[clamp(280px,calc((100svh_-_11rem)*9/16),440px)] lg:max-w-none"
                : "lg:w-[min(760px,55vw)]",
            )}
          >
            <DrivePlayer key={video.id} video={video} />
          </div>

          <div className="min-w-0 pb-6">
            <BackButton className="mb-7 hidden lg:inline-flex" />

            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-mist">
              <Link href={`/categoria/${category.id}`} className="eyebrow text-orange-bright hover:text-orange">
                {category.title}
              </Link>
              {series && (
                <Link href={`/serie/${series.id}`} className="inline-flex items-center gap-1.5 hover:text-snow">
                  <CoffeeCupIcon size={15} strokeWidth={2} />
                  {series.title}
                  {episode && <span className="text-fog">· Episódio {episode}</span>}
                </Link>
              )}
              <span className="text-fog">Nº {pad2(video.number)}</span>
            </p>

            <h1 className="mt-3 text-display text-[2.4rem] text-snow sm:text-[3.2rem] xl:text-[3.8rem]">{video.title}</h1>
            <p className="mt-4 max-w-xl text-[1.15rem] font-medium leading-snug text-snow/90">{video.question}</p>
            {video.summary && <p className="mt-4 max-w-xl leading-relaxed text-mist">{video.summary}</p>}

            <div className="mt-6 flex items-center gap-3">
              <Image src={avatars.retrato.src} alt="" width={44} height={44} className="size-11 rounded-full object-cover ring-2 ring-white/10" />
              <p className="text-sm leading-snug">
                <span className="block font-semibold text-snow">{site.doctor.name}</span>
                <span className="text-fog">
                  {site.doctor.specialty} · Vídeo vertical
                  {video.durationSeconds != null && ` · ${durationText(video.durationSeconds)}`}
                </span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <SaveButton videoId={video.id} title={video.title} variant="pill" />
              <WatchedToggle video={video} />
              <ShareButton path={`/assistir/${video.slug}`} title={`${video.title} · Nefroflix`} text={video.question} />
            </div>

            {next && <NextQuestion video={next} />}

            {upNext.length > 0 && (
              <section aria-labelledby="a-seguir" className="mt-10">
                <h2 id="a-seguir" className="text-lg font-extrabold tracking-[-0.02em] text-snow">
                  A seguir
                </h2>
                <div className="-mx-2 mt-2 space-y-0.5">
                  {upNext.map((v) => (
                    <CompactCard key={v.id} video={v} />
                  ))}
                </div>
              </section>
            )}

            <p className="mt-10 max-w-xl text-xs leading-relaxed text-fog">{site.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const home = useHomeHref();
  return (
    <button
      type="button"
      onClick={() => {
        const cameFromHere = document.referrer && new URL(document.referrer).origin === window.location.origin;
        if (cameFromHere && window.history.length > 1) router.back();
        else router.push(home);
      }}
      className={cn("items-center gap-2 rounded-full py-2 pr-3 text-sm font-semibold text-mist transition-colors hover:text-snow", className)}
    >
      <ArrowLeft size={18} aria-hidden /> Voltar
    </button>
  );
}

function WatchedToggle({ video }: { video: Video }) {
  const { watched, ready } = useLibrary();
  const marked = ready && watched.includes(video.id);
  return (
    <button
      type="button"
      aria-pressed={marked}
      onClick={() => {
        const now = library.toggleWatched(video.id);
        toast(now ? "Marcado como assistido" : "Marcação removida");
      }}
      className={cn(
        "inline-flex h-12 items-center gap-2 rounded-full px-5 text-[0.95rem] font-semibold backdrop-blur-md transition-colors",
        marked ? "bg-snow/15 text-snow ring-1 ring-orange/60" : "bg-snow/[0.12] text-snow hover:bg-snow/20",
      )}
    >
      {marked ? <CircleCheck size={18} className="text-orange-bright" aria-hidden /> : <Circle size={18} aria-hidden />}
      {marked ? "Assistido" : "Marcar como assistido"}
    </button>
  );
}

function NextQuestion({ video }: { video: Video }) {
  return (
    <Link
      href={`/assistir/${video.slug}`}
      className="group mt-10 flex items-center gap-5 overflow-hidden rounded-2xl bg-surface/80 p-5 ring-1 ring-white/[0.07] backdrop-blur-md transition-[background-color,box-shadow] duration-500 hover:bg-raised hover:shadow-lift sm:p-6"
    >
      <span className="min-w-0 flex-1">
        <span className="eyebrow block text-orange-bright">Próxima pergunta</span>
        <span className="mt-2 block text-[1.35rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-snow sm:text-[1.6rem]">
          {video.question}
        </span>
        <span className="mt-2 block text-sm text-mist">Assistir: {video.title}</span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-ink transition-transform duration-500 group-hover:translate-x-1">
        <ArrowRight size={19} aria-hidden />
      </span>
    </Link>
  );
}
