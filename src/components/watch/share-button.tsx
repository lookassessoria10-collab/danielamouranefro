"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "@/lib/toast";

/** Compartilhar: usa o menu nativo do aparelho; sem ele, oferece copiar link e WhatsApp. */
export function ShareButton({ path, title, text }: { path: string; title: string; text: string }) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => !wrapper.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const url = () => `${window.location.origin}${path}`;

  const onShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url: url() });
      } catch {
        // compartilhamento cancelado
      }
      return;
    }
    setOpen((v) => !v);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      toast("Link copiado");
    } catch {
      toast("Não foi possível copiar o link");
    }
    setOpen(false);
  };

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={onShare}
        aria-expanded={open}
        className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 text-[0.95rem] font-medium text-snow transition-colors hover:border-white/40 hover:bg-white/[0.08]"
      >
        <Share2 size={18} aria-hidden /> Compartilhar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-30 mt-2 w-60 rounded-2xl border border-white/10 bg-charcoal-2 p-1.5 shadow-lift"
          >
            <button
              type="button"
              onClick={copy}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-snow hover:bg-white/[0.05]"
            >
              <Link2 size={17} aria-hidden /> Copiar link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-snow hover:bg-white/[0.05]"
            >
              <MessageCircle size={17} aria-hidden /> Enviar pelo WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
