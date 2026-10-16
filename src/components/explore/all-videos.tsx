"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PosterCard } from "@/components/cards/cards";
import { CategoryIcon } from "@/components/icons";
import { allVideos, categories } from "@/lib/catalog";
import type { CategoryId } from "@/data/types";
import { cn } from "@/lib/utils";

/** Acervo completo com filtro por tema. */
export function AllVideos() {
  const [filter, setFilter] = useState<CategoryId | "todos">("todos");
  const videos = filter === "todos" ? allVideos : allVideos.filter((v) => v.category === filter);

  return (
    <section id="todos" aria-labelledby="todos-titulo" className="reveal shell scroll-mt-24 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="todos-titulo" className="text-[1.6rem] font-semibold tracking-[-0.02em] text-snow">
          Todos os vídeos <span className="font-display text-2xl font-normal text-fog">{videos.length}</span>
        </h2>
      </div>
      <div role="group" aria-label="Filtrar por tema" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <FilterChip active={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} color={c.color}>
            <CategoryIcon icon={c.icon} size={14} strokeWidth={2} /> {c.shortTitle}
          </FilterChip>
        ))}
      </div>
      <motion.ul layout className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {videos.map((v) => (
            <motion.li
              key={v.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
            >
              <PosterCard video={v} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm transition-colors",
        active ? "bg-snow font-medium text-ink" : "bg-white/[0.05] text-mist ring-1 ring-white/[0.08] hover:text-snow",
      )}
      style={!active && color ? { color } : undefined}
    >
      {children}
    </button>
  );
}
