import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { Cover } from "@/components/cards/cover";
import { getCategory } from "@/lib/catalog";
import type { Video } from "@/data/types";
import { pad2 } from "@/lib/utils";

/**
 * "Você já se perguntou?" — perguntas como caminho para os vídeos.
 * A pergunta é tipográfica; ao passar o mouse (ou sempre, no toque) aparece o vídeo.
 */
export function QuestionIndex({ videos, eyebrow, title }: { videos: Video[]; eyebrow: string; title: string }) {
  return (
    <section aria-labelledby="perguntas" className="reveal shell py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-orange-bright">{eyebrow}</p>
          <h2 id="perguntas" className="mt-2 text-display text-[2.1rem] text-snow sm:text-[2.8rem]">
            {title}
          </h2>
        </div>
        <Link
          href="/colecao/perguntas-frequentes"
          className="inline-flex items-center gap-1 text-sm font-semibold text-mist transition-colors hover:text-snow"
        >
          Ver todas <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>

      <ol className="mt-6 grid gap-x-8 md:grid-cols-2">
        {videos.map((video, i) => {
          const category = getCategory(video.category)!;
          return (
            <li key={video.id} className="border-t border-white/[0.08]">
              <Link
                href={`/assistir/${video.slug}`}
                className="group relative isolate flex items-center gap-4 py-4 pr-1 focus-visible:outline-none sm:py-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-1 -left-3 -right-3 -z-10 rounded-xl bg-white/[0.045] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
                <span className="w-7 shrink-0 text-sm font-bold tabular-nums text-fog transition-colors group-hover:text-orange-bright">
                  {pad2(i + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[1.15rem] font-bold leading-snug tracking-[-0.015em] text-snow sm:text-[1.3rem]">
                    {video.question}
                  </span>
                  <span className="mt-1 block text-sm text-fog">
                    Assistir: <span className="font-semibold text-mist">{video.title}</span> · {category.shortTitle}
                  </span>
                </span>
                <span className="relative hidden aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-white/[0.06] sm:block">
                  <Cover video={video} shape="landscape" sizes="96px" className="transition-transform duration-500 group-hover:scale-110" />
                  <span aria-hidden className="absolute inset-0 grid place-items-center bg-ink/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Play size={16} fill="currentColor" className="text-snow" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
