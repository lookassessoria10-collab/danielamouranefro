import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { CoffeeCupIcon } from "@/components/icons";
import { getCategory, getSeries, videosInSeries } from "@/lib/catalog";
import { photos } from "@/lib/photos";
import { pad2, pluralize } from "@/lib/utils";

/** Card de série: o quadro "Cafezinho com a Nefro", agrupado pelos nomes originais dos arquivos. */
export function SeriesSpotlight() {
  const series = getSeries("cafezinho-com-a-nefro")!;
  const episodes = videosInSeries(series.id);

  return (
    <section aria-labelledby="serie-cafezinho" className="reveal shell py-10 md:py-14">
      <div className="relative isolate grid overflow-hidden rounded-[32px] bg-petrol ring-1 ring-white/[0.07] lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="relative min-h-[420px] lg:min-h-[560px]">
          <Image
            src={photos["modelo-renal"].src}
            alt={photos["modelo-renal"].alt}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-petrol via-petrol/50 to-transparent lg:via-petrol/30" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-caramel">
              <CoffeeCupIcon size={16} strokeWidth={1.8} /> Quadro
            </p>
            <h2 id="serie-cafezinho" className="mt-3 font-display text-[2.8rem] leading-[0.95] text-snow sm:text-[3.4rem]">
              {series.title}
            </h2>
            <p className="mt-3 max-w-xs leading-relaxed text-mist">{series.description}</p>
            <Link
              href={`/serie/${series.id}`}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-snow px-5 text-sm font-semibold text-ink transition-colors hover:bg-caramel-soft"
            >
              Ver o quadro · {pluralize(episodes.length, "vídeo", "vídeos")}
            </Link>
          </div>
        </div>

        <ol className="grid content-center gap-x-6 p-4 sm:grid-cols-2 sm:p-8 lg:p-10">
          {episodes.map((video) => {
            const category = getCategory(video.category)!;
            return (
              <li key={video.id}>
                <Link
                  href={`/assistir/${video.slug}`}
                  className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="w-9 shrink-0 font-display text-[1.7rem] leading-none text-frost/80">{pad2(video.number)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-snow">{video.title}</span>
                    <span className="block truncate text-sm text-fog">{category.title}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-snow transition-colors group-hover:border-transparent group-hover:bg-caramel group-hover:text-ink">
                    <Play size={14} fill="currentColor" className="translate-x-px" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="sm:col-span-2">
            <Link href={`/serie/${series.id}`} className="mt-2 inline-flex items-center gap-1.5 px-3 text-sm text-mist hover:text-snow">
              Abrir página do quadro <ArrowRight size={15} aria-hidden />
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
