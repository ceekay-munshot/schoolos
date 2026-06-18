"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import type { OneMove } from "@/data/types";
import { studentById } from "@/data/students";
import { nodeById } from "@/data/competency";
import { Spark } from "@/components/shell/Brand";
import { Avatar } from "@/components/ui/avatar";
import { OverrideControl } from "./OverrideControl";
import { CompetencyMap } from "@/components/viz/CompetencyMap";
import { cn } from "@/lib/utils";

export function OneMoveCard({ oneMove, eyebrow }: { oneMove: OneMove; eyebrow?: string }) {
  const [showWhy, setShowWhy] = useState(false);
  const group = oneMove.studentIds.map((id) => studentById(id)!).filter(Boolean);
  const node = nodeById(oneMove.nodeId);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo/15 bg-surface shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-indigo/70 to-saffron" />
      <div className="p-7">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo">
            <Spark size={15} /> {eyebrow ?? "Your one move today"}
          </span>
          <OverrideControl initial="pending" />
        </div>

        <h2 className="mt-4 max-w-2xl font-display text-[30px] leading-[1.12] text-ink">
          {oneMove.headline}
        </h2>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {group.map((s) => (
                <Avatar key={s.id} name={s.name} size={36} className="ring-2 ring-surface" />
              ))}
            </div>
            <span className="ml-3 inline-flex items-center gap-1.5 text-[13px] text-muted">
              <Users size={14} className="text-faint" />
              {group.map((s) => s.name.split(" ")[0]).join(", ")}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-muted">
          {oneMove.everyoneElse}
        </p>

        <button
          onClick={() => setShowWhy((s) => !s)}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg text-[13px] font-medium text-indigo transition-colors hover:text-indigo-ink"
        >
          {showWhy ? "Hide the why" : "See the why"}
          <ChevronDown size={15} className={cn("transition-transform", showWhy && "rotate-180")} />
        </button>

        <AnimatePresence initial={false}>
          {showWhy && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 rounded-2xl border border-line bg-canvas p-5">
                <p className="text-[14px] leading-relaxed text-ink">{oneMove.why}</p>
                {node && (
                  <p className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] text-faint">
                    {node.id} · {node.statement}
                  </p>
                )}
                <div className="mt-5">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
                    Riya · walk back to the root
                  </p>
                  <CompetencyMap studentId="stu-riya" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
