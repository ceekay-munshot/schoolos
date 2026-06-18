"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

/** Right-side drawer — the "depth one tap away" surface. */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  width = 520,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex max-w-[92vw] flex-col bg-canvas shadow-lift"
            style={{ width }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2 className="mt-1 truncate font-display text-xl text-ink">{title}</h2>
                )}
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-muted",
                  "transition-colors hover:bg-sand hover:text-ink",
                )}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
