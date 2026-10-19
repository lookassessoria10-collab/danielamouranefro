import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { CompactCard, VideoCard } from "@/components/cards/cards";
import { CoffeeCupIcon } from "@/components/icons";
import { MetaChip } from "@/components/page-header";
import { getSeries, seriesList, videosInSeries } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import { site } from "@/data/site";
import { pluralize } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return seriesList.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: PageProps<"/serie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) return {};
  return { title: series.title, description: series.description, alternates: { canonical: `/serie/${slug}` } };
}

export default async function SeriesPage({ params }: PageProps<"/serie/[slug]">) {
  const { slug } = await params;
  const series = getSeries(slug);
  if (!series) notFound();
  const episodes = videosInSeries(series.id);
  const photo = photos[series.photo];

  return (
    <>
      <header className="relative isolate overflow-hidden">
        <div className="relative aspect-[4/5] max-h-[72svh] w-full md:absolute md:inset-y-0 md:right-0 md:-z-10 md:aspect-auto md:max-h-none md:w-[64%]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 64vw, 100vw"
            className="object-cover [object-position:50%_40%] md:[object-position:50%_50%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30 md:bg-gradient-to-r md:from-ink md:via-ink/45 md:to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="shell relative -mt-16 flex flex-col justify-end pb-10 md:mt-0 md:min-h-[min(82svh,700px)] md:pb-16 md:pt-32">
          <p className="flex items-center gap-2 eyebrow text-orange-bright">
            <CoffeeCupIcon size={18} strokeWidth={2} /> Quadro
          </p>
          <h1 className="mt-3 max-w-xl text-display text-[3rem] text-snow sm:text-[4.4rem] lg:text-[5.2rem]">{series.title}</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-snow/85">{series.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <MetaChip>{pluralize(episodes.length, "episódio", "episódios")}</MetaChip>
            <MetaChip>Com a {site.doctor.name}</MetaChip>
          </div>
          {episodes[0] && (
            <Link
              href={`/assistir/${episodes[0].slug}`}
              className="mt-8 inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-orange pl-5 pr-6 font-bold text-ink transition-colors hover:bg-orange-bright"
            >
              <Play size={18} fill="currentColor" aria-hidden /> Começar pelo episódio 1
            </Link>
          )}
        </div>
      </header>

      <section aria-labelledby="episodios" className="shell mt-4">
        <h2 id="episodios" className="text-[1.5rem] font-extrabold tracking-[-0.025em] text-snow">
          Episódios
        </h2>
        <ol className="-mx-2 mt-3 space-y-1 sm:hidden">
          {episodes.map((v, i) => (
            <li key={v.id}>
              <CompactCard video={v} meta={<p className="mt-1 text-xs font-semibold text-mist">Episódio {i + 1}</p>} />
            </li>
          ))}
        </ol>
        <ol className="mt-5 hidden gap-x-4 gap-y-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {episodes.map((v, i) => (
            <li key={v.id}>
              <VideoCard video={v} label={`Episódio ${i + 1}`} priority={i < 4} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
