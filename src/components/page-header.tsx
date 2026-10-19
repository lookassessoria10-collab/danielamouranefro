import { cn } from "@/lib/utils";

/**
 * Cabeçalho das páginas internas. `media` (quadro de vídeo ou fotografia)
 * ocupa a lateral direita no desktop e o fundo no celular, com transição suave.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  media,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  meta?: React.ReactNode;
  media?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative isolate overflow-hidden", className)}>
      {media ? (
        <div aria-hidden className="absolute inset-0 -z-10 md:left-auto md:w-[58%]">
          {media}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30 md:bg-gradient-to-r md:from-ink md:via-ink/55 md:to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute -top-40 left-[10%] -z-10 h-[420px] w-[620px] rounded-full bg-orange/10 blur-[130px]" />
      )}
      <div className={cn("shell pb-8 pt-28 md:pb-12 md:pt-36", Boolean(media) && "md:min-h-[440px] md:pt-40")}>
        <p className="eyebrow text-orange-bright">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-display text-[2.6rem] text-snow sm:text-[3.6rem] lg:text-[4.4rem]">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-mist">{description}</p>}
        {meta && <div className="mt-6 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
    </header>
  );
}

export function MetaChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/[0.07] px-3 py-1.5 text-sm font-semibold text-mist backdrop-blur-md">{children}</span>;
}
