import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { getCategory } from "@/lib/catalog";
import type { Video } from "@/data/types";
import { pad2 } from "@/lib/utils";

/**
 * "Você já se perguntou?" — uma coleção tipográfica de perguntas.
 * Cada pergunta é um caminho para o vídeo da Dra. Daniela, não uma resposta do site.
 */
export function QuestionIndex({ videos }: { videos: Video[] }) {
  return (
    <section aria-labelledby="voce-ja-se-perguntou" className="reveal relative my-10 overflow-hidden bg-ink-deep py-16 md:my-14 md:py-24">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-petrol/60 blur-[140px]" />
      <div className="shell relative grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-16">
        <header className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-caramel">Perguntas que todo mundo faz</p>
          <h2 id="voce-ja-se-perguntou" className="mt-4 font-display text-[3.2rem] leading-[0.92] text-snow sm:text-[4.4rem]">
            Você já se <em className="text-caramel-soft">perguntou?</em>
          </h2>
          <p className="mt-5 max-w-sm leading-relaxed text-mist">
            Escolha uma pergunta e assista ao vídeo em que a Dra. Daniela fala sobre o assunto.
          </p>
          <Link
            href="/colecao/perguntas-frequentes"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-snow underline decoration-white/25 underline-offset-[6px] hover:decoration-caramel"
          >
            Ver todas as perguntas <ArrowUpRight size={15} aria-hidden />
          </Link>
        </header>

        <ol className="border-b border-white/[0.08]">
          {videos.map((video, i) => {
            const category = getCategory(video.category)!;
            return (
              <li key={video.id}>
                <Link
                  href={`/assistir/${video.slug}`}
                  className="group relative isolate grid grid-cols-[2.2rem_minmax(0,1fr)_auto] items-start gap-x-3 border-t border-white/[0.08] py-6 pr-1 focus-visible:outline-none sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:py-7"
                  style={{ "--q": category.color } as React.CSSProperties}
                >
                  {/* Fundo que "acende" ao passar o mouse ou focar */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-4 -right-4 -z-10 origin-left scale-x-0 rounded-2xl transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 sm:-left-6 sm:-right-6"
                    style={{ background: `linear-gradient(90deg, color-mix(in oklab, ${category.color} 16%, transparent), transparent 85%)` }}
                  />
                  <span className="pt-2 font-display text-xl text-fog transition-colors group-hover:text-[var(--q)] sm:pt-3">
                    {pad2(i + 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1.85rem] leading-[1.06] text-snow transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 sm:text-[2.5rem]">
                      {video.question}
                    </span>
                    <span
                      className="mt-3 flex items-center gap-2 text-sm transition-[opacity,translate] duration-500 ease-out-expo [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100"
                    >
                      <span className="font-medium" style={{ color: category.color }}>
                        Assistir: {video.title}
                      </span>
                      <span className="text-fog">· {category.title}</span>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-1.5 grid size-11 place-items-center rounded-full border border-white/15 text-snow transition-[background-color,border-color,color,rotate] duration-500 ease-out-expo group-hover:border-transparent group-hover:bg-snow group-hover:text-ink sm:size-12"
                  >
                    <ArrowUpRight size={19} className="group-hover:hidden" />
                    <Play size={17} fill="currentColor" className="hidden translate-x-px group-hover:block" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
