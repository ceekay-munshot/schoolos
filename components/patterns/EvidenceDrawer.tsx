"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  FileText,
  ClipboardCheck,
  PenLine,
  MessageCircle,
  Palette,
  Quote,
  type LucideIcon,
} from "lucide-react";
import type { EvidenceItem, EvidenceKind } from "@/data/types";
import { relativeDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ICON: Record<EvidenceKind, LucideIcon> = {
  worksheet: FileText,
  assessment: ClipboardCheck,
  "teacher-note": PenLine,
  "tutor-session": MessageCircle,
  "path-artifact": Palette,
  "coach-note": Quote,
};

/** Expandable source evidence (Design Brief §12). Default shows the action;
 *  the reasoning sits one tap below. */
export function EvidenceDrawer({
  items,
  label = "Evidence",
  className,
}: {
  items: EvidenceItem[];
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  return (
    <div className={className}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition-colors hover:text-ink"
      >
        {label}
        <span className="tnum text-faint">{items.length}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-2.5 space-y-2 overflow-hidden"
          >
            {items.map((e, i) => {
              const Icon = ICON[e.kind];
              return (
                <li key={i} className="flex items-start gap-2.5 rounded-xl border border-line bg-canvas p-2.5">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-sand text-muted">
                    <Icon size={13} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] text-ink">{e.label}</p>
                    <p className="text-[11.5px] leading-relaxed text-muted">{e.detail}</p>
                  </div>
                  <span className="shrink-0 text-[10.5px] text-faint">{relativeDays(e.date)}</span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
