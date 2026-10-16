import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WideCard } from "@/components/cards/cards";
import { CoffeeCupIcon } from "@/components/icons";
import { MetaChip } from "@/components/page-header";
import { getSeries, seriesList, videosInSeries } from "@/lib/catalog";
import { photos } from "@/lib/photos";
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

  return (
    <>
      <header className="relative isolate overflow-hidden bg-petrol">
        <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[55%]">
          <Image
            src={photos["modelo-renal"].src}
            alt={photos["modelo-renal"].alt}
            fill
            priority
            placeholder="blur"
            sizes="(min-width: 768px) 55vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 32%" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/60 to-petrol/10 md:bg-gradient-to-r md:from-petrol md:via-petrol/40 md:to-transparent" />
        </div>
        <div className="shell flex min-h-[560px] flex-col justify-end pb-12 pt-32 md:min-h-[620px] md:pb-16">
          <p className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-caramel">
            <CoffeeCupIcon size={18} strokeWidth={1.8} /> Quadro
          </p>
          <h1 className="mt-4 max-w-xl font-display text-[3.4rem] leading-[0.92] text-snow sm:text-[5rem]">{series.title}</h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">{series.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <MetaChip>{pluralize(episodes.length, "vídeo", "vídeos")}</MetaChip>
            <MetaChip>Com a Dra. Daniela Moura Landim</MetaChip>
          </div>
        </div>
      </header>

      <section aria-label={`Vídeos do quadro ${series.title}`} className="shell mt-10">
        <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {episodes.map((v) => (
            <li key={v.id}>
              <WideCard video={v} />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
