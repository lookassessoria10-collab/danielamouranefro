import { KIDNEY_PATH } from "./icons";
import { cn } from "@/lib/utils";

/** Símbolo: rim com um "play" recortado — perguntas que viram vídeo. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="3.5 2 15 19.5" aria-hidden className={className}>
      <path d={KIDNEY_PATH} fill="var(--color-copper)" />
      <path d="M8.3 8.9 13.4 12l-5.1 3.1Z" fill="var(--color-ink)" />
    </svg>
  );
}

export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size === "lg" ? 34 : 24} />
      <span
        className={cn(
          "font-semibold tracking-[-0.045em] text-snow",
          size === "lg" ? "text-[1.9rem]" : "text-[1.3rem]",
        )}
      >
        nefro<span className="text-caramel">flix</span>
      </span>
    </span>
  );
}
