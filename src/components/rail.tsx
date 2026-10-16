"use client";

import Link from "next/link";
import { Children, useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RailProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  /** Classe aplicada a cada item (largura do card). */
  itemClassName?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Trilho horizontal: no celular desliza com o dedo (scroll-snap nativo);
 * no desktop ganha controles de anterior/próximo.
 */
export function Rail({ title, eyebrow, description, href, hrefLabel = "Ver tudo", itemClassName, className, children }: RailProps) {
  const headingId = useId();
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby={headingId} className={cn("reveal py-6 md:py-8", className)}>
      <div className="shell flex items-end gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-caramel">{eyebrow}</p>}
          <h2 id={headingId} className="text-[1.35rem] font-semibold tracking-[-0.02em] text-snow sm:text-[1.6rem]">
            {title}
          </h2>
          {description && <p className="mt-1 max-w-xl text-sm text-fog">{description}</p>}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {href && (
            <Link
              href={href}
              className="group inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm text-mist transition-colors hover:text-snow"
            >
              {hrefLabel}
              <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          <div className="hidden gap-1.5 md:flex">
            <RailButton label={`Voltar em ${title}`} disabled={edges.start} onClick={() => page(-1)}>
              <ChevronLeft size={19} aria-hidden />
            </RailButton>
            <RailButton label={`Avançar em ${title}`} disabled={edges.end} onClick={() => page(1)}>
              <ChevronRight size={19} aria-hidden />
            </RailButton>
          </div>
        </div>
      </div>

      <ul
        ref={scroller}
        className="rail-pad no-scrollbar mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-3 sm:gap-4"
      >
        {Children.map(children, (child) =>
          child ? <li className={cn("shrink-0 snap-start", itemClassName)}>{child}</li> : null,
        )}
      </ul>
    </section>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full border border-white/12 text-snow transition-[opacity,background-color,border-color] hover:border-white/30 hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
