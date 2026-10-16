import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { CardArt } from "./card-art";
import { WatchedBadge } from "./watched-badge";
import { CategoryIcon } from "@/components/icons";
import { SaveButton } from "@/components/save-button";
import { getCategory } from "@/lib/catalog";
import type { Category, Collection, Video } from "@/data/types";
import { cn, pad2, pluralize } from "@/lib/utils";

const watchHref = (video: Video) => `/assistir/${video.slug}`;

/* ───────────── Card de vídeo (pôster vertical, como os Reels) ───────────── */

export function PosterCard({ video, className }: { video: Video; className?: string }) {
  const category = getCategory(video.category)!;
  return (
    <article
      className={cn(
        "group relative isolate aspect-[3/4] overflow-hidden rounded-2xl bg-charcoal-2 ring-1 ring-white/[0.07]",
        "transition-[translate,box-shadow,--tw-ring-color] duration-500 ease-out-expo",
        "hover:-translate-y-1.5 hover:shadow-lift hover:ring-white/20 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-caramel",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 75% at 100% 0%, color-mix(in oklab, ${category.color} 24%, transparent), transparent 62%)`,
        }}
      />
      <CardArt
        icon={category.icon}
        color={category.color}
        seed={video.number}
        className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.07]"
      />
      <span
        aria-hidden
        className="absolute left-4 top-2.5 font-display text-[3.25rem] leading-none tracking-tight"
        style={{ color: category.color }}
      >
        {pad2(video.number)}
      </span>

      <span
        aria-hidden
        className="absolute left-1/2 top-[42%] grid size-12 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-snow/95 text-ink opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100"
      >
        <Play size={19} fill="currentColor" className="translate-x-px" />
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-3.5 pt-16 sm:p-4 sm:pt-16">
        <p
          className="flex items-center gap-1.5 text-[0.64rem] font-medium uppercase tracking-[0.16em]"
          style={{ color: category.color }}
        >
          <CategoryIcon icon={category.icon} size={12} strokeWidth={2} />
          {category.shortTitle}
        </p>
        <h3 className="mt-1.5 text-[0.98rem] font-semibold leading-snug text-snow sm:text-[1.05rem]">
          <Link
            href={watchHref(video)}
            className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
          >
            {video.title}
          </Link>
        </h3>
        <p className="mt-1 hidden text-[0.8rem] leading-snug text-mist [@media(hover:hover)]:line-clamp-2">
          {video.question}
        </p>
        <WatchedBadge videoId={video.id} className="mt-2" />
      </div>

      <SaveButton videoId={video.id} title={video.title} className="absolute right-3 top-3 z-20" />
    </article>
  );
}

/* ───────────── Card largo (horizontal), para trilhos temáticos ───────────── */

export function WideCard({ video, className }: { video: Video; className?: string }) {
  const category = getCategory(video.category)!;
  return (
    <article
      className={cn(
        "group relative isolate flex aspect-[16/10] flex-col overflow-hidden rounded-2xl p-5 ring-1 ring-white/[0.07]",
        "transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift hover:ring-white/20",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-caramel",
        className,
      )}
      style={{
        background: `linear-gradient(140deg, color-mix(in oklab, ${category.color} 15%, var(--color-charcoal)) 0%, var(--color-charcoal) 58%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-6 -top-6 opacity-[0.16] transition-transform duration-700 ease-out-expo group-hover:-rotate-6 group-hover:scale-110"
        style={{ color: category.color }}
      >
        <CategoryIcon icon={category.icon} size={150} strokeWidth={0.9} />
      </div>

      <div className="flex items-center justify-between text-[0.66rem] font-medium uppercase tracking-[0.16em]">
        <span style={{ color: category.color }}>{category.shortTitle}</span>
        <span className="font-display text-xl normal-case tracking-normal text-mist">{pad2(video.number)}</span>
      </div>

      <div className="mt-auto pr-12">
        <h3 className="text-[1.25rem] font-semibold leading-tight text-snow">
          <Link
            href={watchHref(video)}
            className="after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
          >
            {video.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 font-display text-[1.05rem] italic leading-snug text-mist">{video.question}</p>
        <WatchedBadge videoId={video.id} className="mt-2" />
      </div>

      <SaveButton videoId={video.id} title={video.title} className="absolute bottom-5 right-5 z-20" />
    </article>
  );
}

/* ───────────── Linha compacta (relacionados, resultados, listas) ───────────── */

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
        "group relative flex items-center gap-4 rounded-2xl p-2 pr-3 transition-colors hover:bg-white/[0.04] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-caramel",
        className,
      )}
    >
      <div
        aria-hidden
        className="relative aspect-[3/4] w-[72px] shrink-0 overflow-hidden rounded-xl bg-charcoal-2 ring-1 ring-white/[0.07]"
        style={{
          background: `radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, ${category.color} 26%, var(--color-charcoal-2)), var(--color-charcoal-2) 70%)`,
        }}
      >
        <CardArt icon={category.icon} color={category.color} seed={video.number} />
        <span className="absolute left-2 top-1 font-display text-2xl leading-none" style={{ color: category.color }}>
          {pad2(video.number)}
        </span>
        <span className="absolute bottom-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-snow/90 text-ink">
          <Play size={11} fill="currentColor" className="translate-x-px" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.64rem] font-medium uppercase tracking-[0.16em]" style={{ color: category.color }}>
          {category.shortTitle}
        </p>
        <h3 className="mt-0.5 font-semibold leading-snug text-snow">
          <Link
            href={watchHref(video)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
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

/* ───────────── Card de coleção (pilha de vídeos) ───────────── */

export function CollectionCard({
  collection,
  videos,
  className,
}: {
  collection: Collection;
  videos: Video[];
  className?: string;
}) {
  const layers = videos.slice(0, 3).map((v) => getCategory(v.category)!.color);
  return (
    <Link
      href={`/colecao/${collection.id}`}
      className={cn("group relative block aspect-[4/5] rounded-3xl focus-visible:outline-none", className)}
    >
      {layers
        .slice(1)
        .reverse()
        .map((color, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "absolute inset-x-3 top-0 bottom-3 rounded-3xl ring-1 ring-white/10 transition-transform duration-500 ease-out-expo",
              i === 0
                ? "origin-bottom-left -rotate-[5deg] group-hover:-rotate-[9deg]"
                : "origin-bottom-right rotate-[4deg] group-hover:rotate-[8deg]",
            )}
            style={{ background: `color-mix(in oklab, ${color} 26%, var(--color-charcoal-2))` }}
          />
        ))}
      <span
        className="absolute inset-0 top-4 flex flex-col rounded-3xl bg-charcoal-2 p-5 ring-1 ring-white/10 transition-[translate,box-shadow] duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-caramel"
        style={{
          background: `linear-gradient(170deg, color-mix(in oklab, ${layers[0] ?? "#888"} 18%, var(--color-charcoal-2)), var(--color-charcoal-2) 55%)`,
        }}
      >
        <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-caramel">{collection.eyebrow}</span>
        <span className="mt-2 font-display text-[1.9rem] leading-[1.05] text-snow">{collection.title}</span>
        <span className="mt-auto space-y-1.5">
          {videos.slice(0, 3).map((v) => (
            <span key={v.id} className="flex items-center gap-2 text-[0.82rem] text-mist">
              <span className="font-display text-base text-fog">{pad2(v.number)}</span>
              <span className="truncate">{v.title}</span>
            </span>
          ))}
        </span>
        <span className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-sm text-snow">
          {pluralize(videos.length, "vídeo", "vídeos")}
          <ArrowRight size={17} aria-hidden className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  );
}

/* ───────────── Tile de categoria ───────────── */

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
  return (
    <Link
      href={`/categoria/${category.id}`}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-3xl p-5 ring-1 ring-white/[0.07] transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift sm:p-6",
        large ? "min-h-[280px] md:min-h-[360px]" : "min-h-[200px]",
        className,
      )}
      style={{
        background: `linear-gradient(160deg, color-mix(in oklab, ${category.color} 22%, var(--color-charcoal)) 0%, var(--color-charcoal) 70%)`,
      }}
    >
      <CardArt icon={category.icon} color={category.color} seed={category.driveFolder.order * 5} className="opacity-70" />
      <span
        aria-hidden
        className="absolute -bottom-8 -right-8 transition-transform duration-700 ease-out-expo group-hover:-rotate-12 group-hover:scale-110"
        style={{ color: category.color, opacity: 0.22 }}
      >
        <CategoryIcon icon={category.icon} size={large ? 220 : 150} strokeWidth={0.8} />
      </span>
      <span className="flex items-center gap-2 text-sm text-mist">
        <span className="font-display text-xl text-snow">{pad2(category.driveFolder.order)}</span>
        <span className="h-px w-6 bg-white/20" />
        {pluralize(count, "vídeo", "vídeos")}
      </span>
      <span className="relative mt-auto">
        <span className={cn("block font-display leading-[1.02] text-snow", large ? "text-[2.6rem] md:text-[3.2rem]" : "text-[2rem]")}>
          {category.title}
        </span>
        <span className="mt-2 block max-w-sm text-sm leading-relaxed text-mist">{category.description}</span>
      </span>
      <span
        className="relative mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium"
        style={{ color: category.color }}
      >
        Ver vídeos <ArrowUpRight size={16} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* ───────────── Card de destaque (fotografia + texto + botão) ───────────── */

export function FeatureCard({
  eyebrow,
  title,
  description,
  href,
  cta,
  photo,
  photoPosition,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  photo: { src: StaticImageData; alt: string };
  photoPosition: string;
  reverse?: boolean;
}) {
  return (
    <article className="group relative isolate grid overflow-hidden rounded-[28px] bg-petrol ring-1 ring-white/[0.07] md:grid-cols-2">
      <div className={cn("relative aspect-[4/3] md:aspect-auto md:min-h-[420px]", reverse && "md:order-2")}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          placeholder="blur"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]"
          style={{ objectPosition: photoPosition }}
        />
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-petrol via-petrol/10 to-transparent",
            reverse ? "md:bg-gradient-to-l" : "md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-petrol",
          )}
        />
      </div>
      <div className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-14">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-caramel">{eyebrow}</p>
        <h3 className="mt-3 font-display text-[2.4rem] leading-[1.02] text-snow sm:text-[3rem]">{title}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-mist">{description}</p>
        <Link
          href={href}
          className="mt-7 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-caramel px-6 font-medium text-ink transition-colors hover:bg-caramel-soft"
        >
          {cta} <ArrowRight size={18} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
