"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Circle } from "lucide-react";
import { DrivePlayer } from "./drive-player";
import { ShareButton } from "./share-button";
import { CompactCard } from "@/components/cards/cards";
import { CategoryIcon, CoffeeCupIcon } from "@/components/icons";
import { SaveButton } from "@/components/save-button";
import { useHomeHref } from "@/components/layout/site-header";
import { library, useLibrary } from "@/lib/library";
import { avatars } from "@/lib/photos";
import { toast } from "@/lib/toast";
import { site } from "@/data/site";
import type { Category, Series, Video } from "@/data/types";
import { cn, pad2 } from "@/lib/utils";

type Props = {
  video: Video;
  category: Category;
  series: Series | null;
  related: Video[];
  next: Video | null;
};

export function WatchView({ video, category, series, related, next }: Props) {
  useEffect(() => {
    library.recordView(video.id);
  }, [video.id]);

  return (
    <div className="shell pt-[4.5rem] md:pt-24">
      <BackButton className="mb-3 inline-flex lg:hidden" />

      <div className="grid items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        {/* Player: protagonista da tela */}
        <div
          className={cn(
            "mx-auto w-full lg:sticky lg:top-24",
            video.orientation === "vertical"
              ? "max-w-[min(100%,calc((100svh_-_9.5rem)*9/16))] lg:w-[min(440px,calc((100svh_-_12rem)*9/16))] lg:max-w-none"
              : "lg:w-[min(760px,55vw)]",
          )}
        >
          <DrivePlayer key={video.id} video={video} />
        </div>

        {/* Informações e próximos passos */}
        <div className="min-w-0 pb-6">
          <BackButton className="mb-8 hidden lg:inline-flex" />

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/categoria/${category.id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white/[0.06]"
              style={{ color: category.color, boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${category.color} 40%, transparent)` }}
            >
              <CategoryIcon icon={category.icon} size={14} strokeWidth={2} /> {category.title}
            </Link>
            {series && (
              <Link
                href={`/serie/${series.id}`}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-caramel ring-1 ring-inset ring-caramel/35 transition-colors hover:bg-white/[0.06]"
              >
                <CoffeeCupIcon size={14} strokeWidth={2} /> {series.title}
              </Link>
            )}
            <span className="font-display text-lg text-fog">Nº {pad2(video.number)}</span>
          </div>

          <h1 className="mt-4 font-display text-[2.6rem] leading-[1] text-snow sm:text-[3.4rem] xl:text-[4rem]">
            {video.title}
          </h1>

          <div className="mt-6 border-l-2 pl-4" style={{ borderColor: category.color }}>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-fog">Pergunta associada</p>
            <p className="mt-1 font-display text-[1.45rem] italic leading-snug text-snow/90">{video.question}</p>
          </div>

          {video.summary && <p className="mt-6 max-w-xl leading-relaxed text-mist">{video.summary}</p>}

          <div className="mt-6 flex items-center gap-3">
            <Image
              src={avatars.retrato.src}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover ring-2 ring-white/10"
            />
            <p className="text-sm leading-snug">
              <span className="block text-snow">{site.doctor.name}</span>
              <span className="text-fog">{site.doctor.specialty}</span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <SaveButton videoId={video.id} title={video.title} variant="pill" />
            <WatchedToggle video={video} />
            <ShareButton path={`/assistir/${video.slug}`} title={`${video.title} · Nefroflix`} text={video.question} />
          </div>

          {next && <NextQuestion video={next} />}

          {related.length > 0 && (
            <section aria-labelledby="relacionados" className="mt-12">
              <h2 id="relacionados" className="text-lg font-semibold text-snow">
                Relacionados
              </h2>
              <div className="mt-3 -mx-2 space-y-1">
                {related.map((v) => (
                  <CompactCard key={v.id} video={v} />
                ))}
              </div>
            </section>
          )}

          <p className="mt-10 max-w-xl text-xs leading-relaxed text-fog">{site.disclaimer}</p>
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
      className={cn(
        "items-center gap-2 rounded-full py-2 pr-3 text-sm text-mist transition-colors hover:text-snow",
        className,
      )}
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
        "inline-flex h-12 items-center gap-2 rounded-full border px-5 text-[0.95rem] font-medium transition-colors",
        marked
          ? "border-sage/50 bg-sage/10 text-sage"
          : "border-white/20 bg-white/[0.04] text-snow hover:border-white/40 hover:bg-white/[0.08]",
      )}
    >
      {marked ? <CircleCheck size={18} aria-hidden /> : <Circle size={18} aria-hidden />}
      {marked ? "Assistido" : "Marcar como assistido"}
    </button>
  );
}

function NextQuestion({ video }: { video: Video }) {
  return (
    <Link
      href={`/assistir/${video.slug}`}
      className="group mt-10 block overflow-hidden rounded-3xl bg-petrol p-6 ring-1 ring-white/[0.08] transition-[background-color,box-shadow] duration-500 hover:bg-petrol-2 hover:shadow-lift sm:p-7"
    >
      <span className="flex items-center justify-between text-[0.68rem] font-medium uppercase tracking-[0.2em] text-frost">
        Próxima pergunta
        <span className="grid size-10 place-items-center rounded-full bg-frost/15 text-frost transition-transform duration-500 group-hover:translate-x-1">
          <ArrowRight size={18} aria-hidden />
        </span>
      </span>
      <span className="mt-3 block font-display text-[1.9rem] leading-[1.08] text-snow sm:text-[2.2rem]">
        {video.question}
      </span>
      <span className="mt-3 block text-sm text-mist">Assistir: {video.title}</span>
    </Link>
  );
}
