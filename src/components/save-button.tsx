"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { library, useLibrary } from "@/lib/library";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Props = {
  videoId: string;
  title: string;
  variant?: "icon" | "pill";
  /** Nos cards: no desktop só aparece ao passar o mouse (sempre visível se já estiver salvo). */
  reveal?: boolean;
  className?: string;
};

export function SaveButton({ videoId, title, variant = "icon", reveal = false, className }: Props) {
  const { list, ready } = useLibrary();
  const saved = ready && list.includes(videoId);

  const onClick = () => {
    const added = library.toggleList(videoId);
    toast(added ? `“${title}” está na sua lista` : `“${title}” saiu da sua lista`);
  };

  const icon = (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="grid place-items-center"
      >
        {saved ? <Check size={variant === "pill" ? 18 : 16} strokeWidth={2.6} /> : <Plus size={variant === "pill" ? 19 : 17} strokeWidth={2.2} />}
      </motion.span>
    </AnimatePresence>
  );

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-12 items-center gap-2 rounded-full px-5 text-[0.95rem] font-semibold backdrop-blur-md transition-colors",
          saved ? "bg-snow/15 text-snow ring-1 ring-orange/60" : "bg-snow/[0.12] text-snow hover:bg-snow/20",
          className,
        )}
      >
        {icon}
        {saved ? "Na minha lista" : "Minha lista"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remover “${title}” da Minha lista` : `Salvar “${title}” na Minha lista`}
      title={saved ? "Remover da Minha lista" : "Salvar na Minha lista"}
      className={cn(
        "grid size-8 place-items-center rounded-full backdrop-blur-md transition-[background-color,opacity,color] duration-300",
        saved ? "bg-orange text-ink" : "bg-ink/55 text-snow ring-1 ring-white/25 hover:bg-ink/80",
        reveal &&
          !saved &&
          "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:group-focus-within/card:opacity-100",
        className,
      )}
    >
      {icon}
    </button>
  );
}
