"use client";

import { useState } from "react";
import { Check, Pencil, X, Sparkle } from "lucide-react";
import type { Insight } from "@/data/types";
import { cn } from "@/lib/utils";

/** AI insight digest item. The human never receives raw model output as truth —
 *  they curate it (confirm / edit / dismiss). The annotation becomes signal. */
export function InsightCard({ insight }: { insight: Insight }) {
  const [status, setStatus] = useState(insight.status);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-surface p-5 transition-colors",
        status === "dismissed" ? "border-line opacity-60" : "border-line",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
          <Sparkle size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-[14px] leading-relaxed text-ink", status === "dismissed" && "line-through decoration-faint/50")}>
            {insight.text}
          </p>
          <p className="mt-2 text-[12px] text-faint">{insight.evidence}</p>

          <div className="mt-3.5 flex items-center justify-between gap-3">
            {status === "raw" ? (
              <div className="inline-flex items-center gap-1.5">
                <button
                  onClick={() => setStatus("confirmed")}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-mastered/30 bg-mastered-soft px-2.5 text-[12px] font-medium text-mastered transition-colors hover:bg-mastered/15"
                >
                  <Check size={13} /> Confirm
                </button>
                <button className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[12px] font-medium text-muted transition-colors hover:bg-sand hover:text-ink">
                  <Pencil size={12} /> Add context
                </button>
                <button
                  onClick={() => setStatus("dismissed")}
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-line bg-surface px-2 text-[12px] font-medium text-faint transition-colors hover:bg-gap-soft hover:text-gap"
                >
                  <X size={13} /> Dismiss
                </button>
              </div>
            ) : (
              <button
                onClick={() => setStatus("raw")}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[12px] font-medium",
                  status === "confirmed" ? "text-mastered" : "text-faint",
                )}
              >
                {status === "confirmed" ? <Check size={13} /> : <X size={13} />}
                {status === "confirmed" ? "Confirmed by coach" : "Dismissed"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
