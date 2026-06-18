"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUpDown, Check } from "lucide-react";
import { personas } from "@/data";
import type { Persona } from "@/data/types";
import { PERSONA_ICONS } from "@/lib/icons";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function PersonaSwitcher({ current }: { current: Persona }) {
  const [open, setOpen] = useState(false);
  const active = personas.find((p) => p.id === current)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface px-2.5 py-2 text-left transition-colors hover:bg-sand",
        )}
      >
        <Avatar name={active.person} size={34} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-medium text-ink">{active.person}</span>
          <span className="block truncate text-[11px] text-faint">{active.label}</span>
        </span>
        <ChevronsUpDown size={15} className="shrink-0 text-faint" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-72 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-lift"
            >
              <p className="px-2.5 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
                Switch interface
              </p>
              {personas.map((p) => {
                const Icon = PERSONA_ICONS[p.icon];
                const isActive = p.id === current;
                return (
                  <Link
                    key={p.id}
                    href={p.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors",
                      isActive ? "bg-indigo-soft" : "hover:bg-sand",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-lg",
                        isActive ? "bg-indigo text-white" : "bg-sand text-muted",
                      )}
                    >
                      {Icon && <Icon size={16} />}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[13px] font-medium text-ink">{p.label}</span>
                      <span className="block truncate text-[11px] text-faint">{p.person}</span>
                    </span>
                    {isActive && <Check size={15} className="text-indigo" />}
                  </Link>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
