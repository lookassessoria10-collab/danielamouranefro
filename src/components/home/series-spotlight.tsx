import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { VideoCard } from "@/components/cards/cards";
import { CoffeeCupIcon } from "@/components/icons";
import { Rail } from "@/components/rail";
import { railItem } from "@/components/rail-items";
import { getSeries, videosInSeries } from "@/lib/catalog";
import { photos } from "@/lib/photos";

/** Capa do quadro "Cafezinho com a Nefro" + episódios reais (arquivos com "cafezinho" no nome). */
export function SeriesSpotlight() {
  const series = getSeries("cafezinho-com-a-nefro")!;
  const episodes = videosInSeries(series.id);
  const photo = photos[series.photo];
  const first = episodes[0];

  return (
    <section aria-labelledby="serie-cafezinho" className="reveal py-8 md:py-12">
      <div className="shell">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-brown-deep">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] md:absolute md:inset-y-0 md:right-0 md:-z-10 md:aspect-auto md:w-[62%]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              placeholder="blur"
              className="object-cover [object-position:50%_42%] md:[object-position:50%_52%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brown-deep via-transparent to-transparent md:bg-gradient-to-r md:from-brown-deep md:via-brown-deep/40 md:to-transparent" />
          </div>
          <div className="relative flex flex-col justify-end p-6 pt-2 sm:p-10 md:min-h-[420px] md:max-w-[52%] md:pt-10 lg:p-14">
            <p className="flex items-center gap-2 eyebrow text-orange-bright">
              <CoffeeCupIcon size={16} strokeWidth={2} /> Quadro · {episodes.length} episódios
            </p>
            <h2 id="serie-cafezinho" className="mt-3 text-display text-[2.6rem] text-snow sm:text-[3.4rem] lg:text-[4rem]">
              {series.title}
            </h2>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-snow/85">{series.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {first && (
                <Link
                  href={`/assistir/${first.slug}`}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-orange pl-5 pr-6 font-bold text-ink transition-colors hover:bg-orange-bright"
                >
                  <Play size={17} fill="currentColor" aria-hidden /> Começar a assistir
                </Link>
              )}
              <Link
                href={`/serie/${series.id}`}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-snow/[0.12] px-5 font-semibold text-snow backdrop-blur-md transition-colors hover:bg-snow/20"
              >
                Ver episódios <ArrowRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Rail title="Episódios" eyebrow={series.title} href={`/serie/${series.id}`} itemClassName={railItem.landscape} className="pt-2 md:pt-4">
        {episodes.map((v, i) => (
          <VideoCard key={v.id} video={v} label={`Episódio ${i + 1}`} />
        ))}
      </Rail>
    </section>
  );
}
