"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VideoCard } from "@/components/cards/cards";
import { allVideos, categories } from "@/lib/catalog";
import type { CategoryId } from "@/data/types";
import { cn } from "@/lib/utils";

/** Acervo completo com filtro por tema. */
export function AllVideos() {
  const [filter, setFilter] = useState<CategoryId | "todos">("todos");
  const videos = filter === "todos" ? allVideos : allVideos.filter((v) => v.category === filter);

  return (
    <section id="todos" aria-labelledby="todos-titulo" className="reveal shell scroll-mt-24 py-10">
      <h2 id="todos-titulo" className="text-[1.5rem] font-extrabold tracking-[-0.025em] text-snow">
        Todos os vídeos <span className="font-semibold text-fog">{videos.length}</span>
      </h2>
      <div role="group" aria-label="Filtrar por tema" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <FilterChip active={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.shortTitle}
          </FilterChip>
        ))}
      </div>
      <motion.ul layout className="mt-6 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {videos.map((v) => (
            <motion.li
              key={v.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <VideoCard video={v} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors",
        active ? "bg-snow text-ink" : "bg-white/[0.07] text-mist hover:bg-white/[0.12] hover:text-snow",
      )}
    >
      {children}
    </button>
  );
}
