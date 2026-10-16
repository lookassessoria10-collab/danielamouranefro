"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check } from "lucide-react";
import { useToasts } from "@/lib/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
      {children}
      <Toaster />
    </MotionConfig>
  );
}

function Toaster() {
  const toasts = useToasts();
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem_+_env(safe-area-inset-bottom))] z-[70] flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-charcoal-3/95 px-4 py-2.5 text-sm text-snow shadow-lift backdrop-blur"
          >
            <span className="grid size-5 place-items-center rounded-full bg-caramel text-ink">
              <Check size={13} strokeWidth={3} aria-hidden />
            </span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
