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
        "inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-snow backdrop-blur-md",
        className,
      )}
    >
      <CircleCheck size={12} className="text-orange-bright" aria-hidden /> Assistido
    </span>
  );
}
