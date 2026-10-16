"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, History, Sparkles, X } from "lucide-react";
import { CompactCard, PosterCard } from "@/components/cards/cards";
import { getVideo, getVideos } from "@/lib/catalog";
import { library, useLibrary } from "@/lib/library";
import { toast } from "@/lib/toast";
import { relativeDay } from "@/lib/utils";

export function MyListView() {
  const lib = useLibrary();
  const saved = getVideos(lib.list);
  const watched = getVideos(lib.watched);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="shell pb-10 pt-24 md:pt-32">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-caramel">Neste navegador</p>
      <h1 className="mt-3 font-display text-[3rem] leading-[0.95] text-snow sm:text-[4.4rem]">Minha lista</h1>
      <p className="mt-4 max-w-xl text-mist">
        Sem conta e sem cadastro: sua lista e seu histórico ficam salvos apenas neste aparelho.
      </p>

      {/* Minha lista */}
      <section aria-labelledby="salvos" className="mt-12">
        <h2 id="salvos" className="flex items-center gap-2 text-[1.35rem] font-semibold text-snow">
          <Bookmark size={20} aria-hidden className="text-caramel" /> Salvos para assistir
          {lib.ready && <span className="font-display text-2xl font-normal text-fog">{saved.length}</span>}
        </h2>
        {!lib.ready ? (
          <SkeletonGrid />
        ) : saved.length > 0 ? (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {saved.map((v) => (
              <li key={v.id}>
                <PosterCard video={v} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Sua lista está vazia"
            text="Toque no + de qualquer vídeo para guardar e assistir depois."
            cta={{ href: "/por-onde-comecar", label: "Descobrir vídeos" }}
          />
        )}
      </section>

      {/* Histórico */}
      <section id="vistos" aria-labelledby="vistos-titulo" className="mt-16 scroll-mt-24">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="vistos-titulo" className="flex items-center gap-2 text-[1.35rem] font-semibold text-snow">
            <History size={20} aria-hidden className="text-frost" /> Vistos recentemente
          </h2>
          {lib.ready && lib.history.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              {confirmClear ? (
                <>
                  <span className="text-sm text-mist">Apagar histórico deste navegador?</span>
                  <button
                    type="button"
                    onClick={() => {
                      library.clearHistory();
                      setConfirmClear(false);
                      toast("Histórico apagado");
                    }}
                    className="rounded-full bg-snow px-3.5 py-1.5 text-sm font-medium text-ink"
                  >
                    Apagar
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)} className="rounded-full px-3 py-1.5 text-sm text-mist hover:text-snow">
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="rounded-full px-3 py-1.5 text-sm text-mist ring-1 ring-white/12 hover:text-snow"
                >
                  Limpar histórico
                </button>
              )}
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-fog">Registramos os vídeos que você abriu. O Drive não informa quanto tempo foi assistido.</p>
        {lib.ready && lib.history.length > 0 ? (
          <ul className="mt-4 grid gap-x-6 gap-y-1 md:grid-cols-2">
            {lib.history.map((entry) => {
              const video = getVideo(entry.id);
              if (!video) return null;
              return (
                <li key={entry.id} className="-mx-2">
                  <CompactCard video={video} meta={<p className="mt-1 text-xs text-fog">Aberto {relativeDay(entry.at)}</p>} />
                </li>
              );
            })}
          </ul>
        ) : (
          lib.ready && <p className="mt-4 rounded-2xl bg-charcoal px-5 py-4 text-sm text-mist ring-1 ring-white/[0.06]">Nenhum vídeo aberto ainda.</p>
        )}
      </section>

      {/* Assistidos */}
      {lib.ready && watched.length > 0 && (
        <section aria-labelledby="assistidos" className="mt-16">
          <h2 id="assistidos" className="text-[1.35rem] font-semibold text-snow">
            Marcados como assistidos <span className="font-display text-2xl font-normal text-fog">{watched.length}</span>
          </h2>
          <ul className="mt-4 grid gap-x-6 gap-y-1 md:grid-cols-2">
            {watched.map((v) => (
              <li key={v.id} className="-mx-2">
                <CompactCard
                  video={v}
                  action={
                    <button
                      type="button"
                      onClick={() => {
                        library.toggleWatched(v.id);
                        toast("Marcação removida");
                      }}
                      aria-label={`Desmarcar “${v.title}” como assistido`}
                      className="grid size-9 place-items-center rounded-full border border-white/20 text-mist hover:border-white/50 hover:text-snow"
                    >
                      <X size={16} aria-hidden />
                    </button>
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function EmptyState({ title, text, cta }: { title: string; text: string; cta: { href: string; label: string } }) {
  return (
    <div className="mt-5 flex flex-col items-start gap-4 rounded-3xl bg-charcoal p-6 ring-1 ring-white/[0.06] sm:flex-row sm:items-center sm:p-8">
      <div className="flex-1">
        <p className="text-lg font-semibold text-snow">{title}</p>
        <p className="mt-1 text-mist">{text}</p>
      </div>
      <Link
        href={cta.href}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-caramel px-6 font-semibold text-ink hover:bg-caramel-soft"
      >
        <Sparkles size={18} aria-hidden /> {cta.label}
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="skeleton aspect-[3/4] rounded-2xl" />
      ))}
    </ul>
  );
}
