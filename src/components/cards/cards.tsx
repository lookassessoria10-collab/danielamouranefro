import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Cover, framePosition, frameSrc } from "./cover";
import { WatchedBadge } from "./watched-badge";
import { SaveButton } from "@/components/save-button";
import { getCategory, getVideo } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import type { Category, Collection, Video } from "@/data/types";
import { cn, durationText, formatDuration, pluralize } from "@/lib/utils";

function Meta({ label, video }: { label: string; video: Video }) {
  const duration = formatDuration(video.durationSeconds);
  return (
    <p className="eyebrow flex items-center gap-1.5 text-[0.6rem]">
      <span className="text-orange-bright">{label}</span>
      {duration && (
        <span className="font-semibold tracking-normal text-mist" aria-label={durationText(video.durationSeconds) ?? undefined}>
          · {duration}
        </span>
      )}
    </p>
  );
}

const watchHref = (video: Video) => `/assistir/${video.slug}`;

/* ─────────── Card horizontal 16:9 — trilhos principais ─────────── */

export function VideoCard({
  video,
  label,
  className,
  priority = false,
}: {
  video: Video;
  /** Rótulo acima do título (padrão: categoria). Ex.: "Episódio 3". */
  label?: string;
  className?: string;
  priority?: boolean;
}) {
  const category = getCategory(video.category)!;
  return (
    <article className={cn("group/card relative", className)}>
      <Link href={watchHref(video)} className="block rounded-xl focus-visible:outline-none" aria-label={`${video.title} — ${category.title}`}>
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-xl bg-surface shadow-[0_14px_30px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.06]",
            "transition-[scale,box-shadow] duration-500 ease-out-expo [@media(hover:hover)]:group-hover/card:scale-[1.04]",
            "group-hover/card:shadow-lift group-focus-visible/card:ring-2 group-focus-visible/card:ring-orange-bright",
          )}
        >
          <Cover video={video} shape="landscape" priority={priority} sizes="(min-width: 1024px) 360px, (min-width: 640px) 340px, 78vw" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/45 opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover/card:opacity-100"
          />
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
            <Meta label={label ?? category.shortTitle} video={video} />
            <h3 className="mt-1 text-[1.02rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-snow sm:text-[1.12rem]">
              {video.title}
            </h3>
            <p className="mt-1 hidden text-[0.8rem] leading-snug text-mist transition-[opacity,translate] duration-500 ease-out-expo [@media(hover:hover)]:line-clamp-1 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100">
              {video.question}
            </p>
          </div>
          <span
            aria-hidden
            className="absolute right-3.5 top-1/2 grid size-11 -translate-y-1/2 scale-75 place-items-center rounded-full bg-snow text-ink opacity-0 shadow-lg transition duration-500 ease-out-expo [@media(hover:hover)]:group-hover/card:scale-100 [@media(hover:hover)]:group-hover/card:opacity-100"
          >
            <Play size={17} fill="currentColor" className="translate-x-px" />
          </span>
        </div>
      </Link>
      <WatchedBadge videoId={video.id} className="pointer-events-none absolute left-2.5 top-2.5" />
      <SaveButton videoId={video.id} title={video.title} reveal className="absolute right-2.5 top-2.5 z-10" />
    </article>
  );
}

/* ─────────── Pôster vertical 3:4 — coleções e seleções ─────────── */

export function PosterCard({ video, className }: { video: Video; className?: string }) {
  const category = getCategory(video.category)!;
  return (
    <article className={cn("group/card relative", className)}>
      <Link href={watchHref(video)} className="block rounded-xl focus-visible:outline-none" aria-label={`${video.title} — ${category.title}`}>
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden rounded-xl bg-surface shadow-[0_14px_30px_-18px_rgb(0_0_0/0.9)] ring-1 ring-white/[0.06]",
            "transition-[scale,box-shadow] duration-500 ease-out-expo [@media(hover:hover)]:group-hover/card:scale-[1.04]",
            "group-hover/card:shadow-lift group-focus-visible/card:ring-2 group-focus-visible/card:ring-orange-bright",
          )}
        >
          <Cover video={video} shape="poster" sizes="(min-width: 1024px) 230px, (min-width: 640px) 210px, 44vw" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
            <Meta label={category.shortTitle} video={video} />
            <h3 className="mt-1 text-[1.08rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-snow sm:text-[1.2rem]">{video.title}</h3>
            <span className="mt-2 hidden items-center gap-1.5 text-xs font-semibold text-snow [@media(hover:hover)]:inline-flex [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover/card:opacity-100">
              <Play size={12} fill="currentColor" aria-hidden /> Assistir
            </span>
          </div>
        </div>
      </Link>
      <WatchedBadge videoId={video.id} className="pointer-events-none absolute left-2.5 top-2.5" />
      <SaveButton videoId={video.id} title={video.title} reveal className="absolute right-2.5 top-2.5 z-10" />
    </article>
  );
}

/* ─────────── Linha compacta (a seguir, histórico, resultados) ─────────── */

export function CompactCard({
  video,
  meta,
  action,
  className,
}: {
  video: Video;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const category = getCategory(video.category)!;
  return (
    <article
      className={cn(
        "group/card relative flex items-center gap-3.5 rounded-xl p-2 pr-3 transition-colors hover:bg-white/[0.04] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-orange-bright",
        className,
      )}
    >
      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-white/[0.06] sm:w-36">
        <Cover video={video} shape="landscape" sizes="144px" />
        <span aria-hidden className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-snow/90 text-ink">
          <Play size={11} fill="currentColor" className="translate-x-px" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <Meta label={category.shortTitle} video={video} />
        <h3 className="mt-0.5 font-bold leading-snug text-snow">
          <Link href={watchHref(video)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {video.title}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-fog">{video.question}</p>
        {meta}
      </div>
      <div className="relative z-10 flex shrink-0 items-center gap-2">
        {action ?? <SaveButton videoId={video.id} title={video.title} />}
      </div>
    </article>
  );
}

/* ─────────── Capa de coleção ─────────── */

export function CollectionCard({
  collection,
  videos,
  className,
}: {
  collection: Collection;
  videos: Video[];
  className?: string;
}) {
  const photo = collection.photo ? photos[collection.photo] : null;
  const strips = videos.filter((v) => v.cover.style === "frame").slice(0, 3);
  return (
    <Link
      href={`/colecao/${collection.id}`}
      className={cn("group/card relative block rounded-2xl focus-visible:outline-none", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface ring-1 ring-white/[0.07] transition-[scale,box-shadow] duration-500 ease-out-expo group-hover/card:shadow-lift group-focus-visible/card:ring-2 group-focus-visible/card:ring-orange-bright [@media(hover:hover)]:group-hover/card:scale-[1.03]">
        {photo ? (
          <Image
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 640px) 280px, 66vw"
            className="object-cover"
            style={{ objectPosition: photo.mobilePosition }}
          />
        ) : (
          <div aria-hidden className="absolute inset-0 grid grid-cols-3 gap-px bg-ink">
            {strips.map((v) => (
              <div key={v.id} className="relative overflow-hidden">
                <Image
                  src={frameSrc(v)}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover/card:scale-105"
                  style={{ objectPosition: v.cover.style === "frame" ? framePosition(v.cover.faceY, "poster") : undefined }}
                />
              </div>
            ))}
          </div>
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/5" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="eyebrow text-[0.62rem] text-orange-bright">{collection.eyebrow}</p>
          <h3 className="mt-1.5 text-[1.55rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-snow">{collection.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-snug text-mist">{collection.description}</p>
          <p className="mt-3 flex items-center justify-between text-sm font-semibold text-snow">
            {pluralize(videos.length, "vídeo", "vídeos")}
            <ArrowRight size={17} aria-hidden className="transition-transform group-hover/card:translate-x-1" />
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─────────── Tile de categoria ─────────── */

export function CategoryTile({
  category,
  count,
  large = false,
  className,
}: {
  category: Category;
  count: number;
  large?: boolean;
  className?: string;
}) {
  const cover = getVideo(category.coverVideo);
  return (
    <Link
      href={`/categoria/${category.id}`}
      className={cn(
        "group/card relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-surface p-5 ring-1 ring-white/[0.07] transition-shadow duration-500 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-bright sm:p-6",
        large ? "min-h-[300px] md:min-h-[380px]" : "aspect-[16/10] min-h-[190px]",
        className,
      )}
    >
      {cover && (
        <Cover
          video={cover}
          shape="landscape"
          sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 80vw"}
          className="-z-10 transition-transform duration-700 ease-out-expo group-hover/card:scale-[1.04]"
        />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      <p className="eyebrow text-[0.62rem] text-orange-bright">
        Tema {String(category.driveFolder.order).padStart(2, "0")} · {pluralize(count, "vídeo", "vídeos")}
      </p>
      <h3 className={cn("mt-1.5 font-extrabold leading-[1.02] tracking-[-0.03em] text-snow", large ? "text-[2.2rem] md:text-[2.8rem]" : "text-[1.55rem]")}>
        {category.title}
      </h3>
      <p className={cn("mt-2 max-w-md text-sm leading-relaxed text-mist", !large && "line-clamp-2")}>{category.description}</p>
    </Link>
  );
}
