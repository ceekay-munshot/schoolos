import * as React from "react";
import { Sparkles, FileCheck2 } from "lucide-react";
import type { PastWorkItem } from "@/data/student-profiles";
import { Card, SectionLabel } from "@/components/ui/primitives";
import { Reveal, Stagger, staggerItem } from "@/components/motion";
import { motion } from "framer-motion";

/* AI insights on past work. Each card is anchored to one real piece the child
   handed in, with a warm, specific observation and the evidence it rests on —
   never a score, always something they can do more of. */

function InsightCard({ item }: { item: PastWorkItem }) {
  return (
    <motion.div variants={staggerItem}>
      <Card hover className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-medium leading-snug text-ink">{item.title}</p>
            <p className="mt-0.5 text-[12px] text-faint">
              {item.subject} · {item.date}
            </p>
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-indigo-soft text-indigo">
            <Sparkles size={15} />
          </span>
        </div>

        <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-muted">{item.aiInsight}</p>

        <div className="mt-4 flex items-start gap-1.5 border-t border-line pt-3 text-[11.5px] leading-snug text-faint">
          <FileCheck2 size={13} className="mt-px shrink-0 text-mastered" />
          <span>From your {item.evidence}</span>
        </div>
      </Card>
    </motion.div>
  );
}

export function InsightCards({ items }: { items: PastWorkItem[] }) {
  return (
    <div>
      <Reveal>
        <div className="mb-4">
          <SectionLabel>What your work is showing</SectionLabel>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
            A few things we noticed in the work you handed in this week — the good habits worth
            keeping.
          </p>
        </div>
      </Reveal>
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <InsightCard key={item.id} item={item} />
        ))}
      </Stagger>
    </div>
  );
}
