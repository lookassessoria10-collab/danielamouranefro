"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, Sparkles, X } from "lucide-react";
import { CategoryTile, VideoCard } from "@/components/cards/cards";
import { categories, videosInCategory } from "@/lib/catalog";
import { normalize, searchSuggestions, searchVideos } from "@/lib/search";

export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mantém o endereço (?q=) atualizado para a busca poder ser compartilhada.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const q = query.trim();
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [query, pathname, router]);

  const results = useMemo(() => searchVideos(query), [query]);
  const matchedCategories = useMemo(() => {
    const q = normalize(query);
    if (q.length < 3) return [];
    return categories.filter((c) => normalize(c.title).includes(q) || normalize(c.shortTitle).startsWith(q));
  }, [query]);
  const hasQuery = query.trim().length >= 2;

  return (
    <div className="shell pb-10 pt-24 md:pt-32">
      <p className="eyebrow text-orange-bright">Encontrar</p>
      <h1 className="mt-2 text-display text-[2.6rem] text-snow sm:text-[3.6rem]">Buscar</h1>
      <p className="mt-3 text-mist">Procure por assunto, pergunta, tema ou palavra do dia a dia.</p>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-7 max-w-3xl">
        <label htmlFor="busca" className="sr-only">
          Buscar vídeos
        </label>
        <div className="flex h-16 items-center gap-3 rounded-2xl bg-surface px-5 ring-1 ring-white/10 transition-shadow focus-within:ring-2 focus-within:ring-orange">
          <Search size={22} className="shrink-0 text-fog" aria-hidden />
          <input
            ref={inputRef}
            id="busca"
            type="search"
            autoFocus
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: espuma, água, remédio, xixi…"
            className="h-full min-w-0 flex-1 bg-transparent text-lg font-medium text-snow placeholder:text-fog focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Limpar busca"
              className="grid size-9 place-items-center rounded-full text-fog hover:bg-white/[0.06] hover:text-snow"
            >
              <X size={18} aria-hidden />
            </button>
          )}
        </div>
      </form>

      <div className="mt-5">
        <p className="eyebrow text-fog">{hasQuery ? "Outras buscas" : "Sugestões"}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {searchSuggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full bg-white/[0.07] px-4 py-2 text-sm font-semibold text-mist transition-colors hover:bg-white/[0.12] hover:text-snow"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10" aria-live="polite">
        {!hasQuery && (
          <section aria-labelledby="temas-busca">
            <h2 id="temas-busca" className="text-[1.3rem] font-extrabold tracking-[-0.02em] text-snow">
              Ou navegue por tema
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <CategoryTile category={c} count={videosInCategory(c.id).length} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <p className="text-sm text-fog">
              {results.length} {results.length === 1 ? "vídeo encontrado" : "vídeos encontrados"} para{" "}
              <span className="font-semibold text-snow">“{query.trim()}”</span>
            </p>
            {matchedCategories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {matchedCategories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categoria/${c.id}`}
                    className="rounded-full bg-orange/15 px-3.5 py-1.5 text-sm font-semibold text-orange-bright transition-colors hover:bg-orange/25"
                  >
                    Tema: {c.title}
                  </Link>
                ))}
              </div>
            )}
            <ul className="mt-6 grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false} mode="popLayout">
                {results.map(({ video, matchedIn }) => (
                  <motion.li
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <VideoCard video={video} />
                    <p className="mt-2 text-xs text-fog">Encontrado em: {matchedIn.join(", ")}</p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}

        {hasQuery && results.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl bg-surface px-6 py-14 text-center ring-1 ring-white/[0.06]">
            <span className="grid size-16 place-items-center rounded-2xl bg-orange/15 text-orange-bright">
              <Search size={28} aria-hidden />
            </span>
            <h2 className="mt-6 text-xl font-extrabold text-snow">Nenhum vídeo encontrado para “{query.trim()}”</h2>
            <p className="mt-2 max-w-md text-mist">
              Tente uma palavra mais simples, como as sugestões acima, ou deixe o Nefroflix sugerir por onde começar.
            </p>
            <Link
              href="/por-onde-comecar"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-orange px-6 font-bold text-ink hover:bg-orange-bright"
            >
              <Sparkles size={18} aria-hidden /> Por onde começar?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
