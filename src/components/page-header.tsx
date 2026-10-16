import { cn } from "@/lib/utils";

/** Cabeçalho editorial das páginas internas. */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  accent,
  icon,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  meta?: React.ReactNode;
  accent?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative isolate overflow-hidden pb-8 pt-28 md:pb-12 md:pt-36", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[460px] w-[900px] -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: accent ? `color-mix(in oklab, ${accent} 22%, transparent)` : "rgb(21 57 74 / 0.55)" }}
      />
      {icon && (
        <div aria-hidden className="pointer-events-none absolute -right-10 top-16 -z-10 opacity-[0.12] md:right-[6%]" style={{ color: accent }}>
          {icon}
        </div>
      )}
      <div className="shell">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.22em]" style={{ color: accent ?? "var(--color-caramel)" }}>
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl font-display text-[3rem] leading-[0.95] text-snow sm:text-[4.4rem] lg:text-[5.2rem]">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">{description}</p>}
        {meta && <div className="mt-6 flex flex-wrap items-center gap-2">{meta}</div>}
      </div>
    </header>
  );
}

export function MetaChip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-sm text-mist ring-1 ring-white/[0.07]">{children}</span>;
}
