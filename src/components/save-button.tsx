"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { library, useLibrary } from "@/lib/library";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Props = { videoId: string; title: string; variant?: "icon" | "pill"; className?: string };

export function SaveButton({ videoId, title, variant = "icon", className }: Props) {
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
        {saved ? <Check size={variant === "pill" ? 18 : 17} strokeWidth={2.4} /> : <Plus size={variant === "pill" ? 19 : 18} strokeWidth={2} />}
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
          "inline-flex h-12 items-center gap-2 rounded-full border px-5 text-[0.95rem] font-medium transition-colors",
          saved
            ? "border-caramel/50 bg-caramel/10 text-caramel-soft"
            : "border-white/20 bg-white/[0.04] text-snow hover:border-white/40 hover:bg-white/[0.08]",
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
        "grid size-9 place-items-center rounded-full border backdrop-blur-md transition-colors",
        saved
          ? "border-caramel/60 bg-caramel text-ink"
          : "border-white/25 bg-ink/50 text-snow hover:border-white/60 hover:bg-ink/70",
        className,
      )}
    >
      {icon}
    </button>
  );
}
