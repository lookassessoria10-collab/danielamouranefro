"use client";

import { CircleCheck } from "lucide-react";
import { useLibrary } from "@/lib/library";
import { cn } from "@/lib/utils";

/** Selo "Assistido" — só aparece quando a pessoa marcou o vídeo manualmente. */
export function WatchedBadge({ videoId, className }: { videoId: string; className?: string }) {
  const { watched, ready } = useLibrary();
  if (!ready || !watched.includes(videoId)) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-sage/15 px-2 py-0.5 text-[0.66rem] font-medium uppercase tracking-[0.12em] text-sage",
        className,
      )}
    >
      <CircleCheck size={12} aria-hidden /> Assistido
    </span>
  );
}
