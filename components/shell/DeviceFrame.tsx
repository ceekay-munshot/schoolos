"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { TomoMark } from "./TomoLogo";
import { cn } from "@/lib/utils";

export interface MobileTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** A premium phone frame for the Parent and Student apps (mobile-first surfaces).
 *  Renders a status bar, a scrollable screen, and a bottom tab bar. */
export function DeviceFrame({
  tabs,
  active,
  onTab,
  accent = "#37357A",
  title,
  children,
}: {
  tabs: MobileTab[];
  active: string;
  onTab: (id: string) => void;
  accent?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-sand px-4 py-8">
      <div className="mb-6 flex w-full max-w-[390px] items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} /> All interfaces
        </Link>
        <span className="inline-flex items-center gap-2 text-[12px] font-medium text-faint">
          <TomoMark size={20} /> {title}
        </span>
      </div>

      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[44px] border-[10px] border-ink/90 bg-canvas shadow-lift">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-ink/90" />
        {/* status bar */}
        <div className="flex items-center justify-between px-7 pb-1 pt-3 text-[11px] font-medium text-ink">
          <span className="tnum">9:41</span>
          <span className="flex items-center gap-1 text-faint">
            <span className="tnum">5G</span>
            <span className="inline-block h-2.5 w-5 rounded-[3px] border border-faint/60" />
          </span>
        </div>

        {/* screen */}
        <div className="h-[720px] overflow-y-auto overscroll-contain pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* bottom tab bar */}
        <div className="absolute inset-x-0 bottom-0 border-t border-line bg-canvas/90 px-2 pb-5 pt-2 backdrop-blur-md">
          <div className="flex items-center justify-around">
            {tabs.map((t) => {
              const isActive = t.id === active;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onTab(t.id)}
                  className="flex flex-1 flex-col items-center gap-1 py-1"
                >
                  <Icon size={21} style={{ color: isActive ? accent : "#9C988E" }} strokeWidth={isActive ? 2.4 : 2} />
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isActive ? accent : "#9C988E" }}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Standard padded screen container for the phone. */
export function Screen({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pt-3", className)}>{children}</div>;
}
