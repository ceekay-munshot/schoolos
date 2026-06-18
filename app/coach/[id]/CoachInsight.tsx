"use client";

import { useState } from "react";
import { Check, Pencil, X, Sparkle, EyeOff, Eye } from "lucide-react";
import type { Insight } from "@/data/types";
import { relativeDays, cn } from "@/lib/utils";

/**
 * The coach's version of an insight digest item. The coach is the sense-maker,
 * not a data-entry clerk: the system drafts, the coach confirms, rewrites, or
 * dismisses — and decides, per item, whether it is suitable to surface to a
 * parent. Nothing here is shown to a family until the coach says so.
 */
export function CoachInsight({
  insight,
  defaultParentSafe = true,
}: {
  insight: Insight;
  defaultParentSafe?: boolean;
}) {
  const [status, setStatus] = useState<Insight["status"] | "rewriting">(insight.status);
  const [draft, setDraft] = useState(insight.text);
  const [parentSafe, setParentSafe] = useState(defaultParentSafe);
  const dismissed = status === "dismissed";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-surface p-5 transition-colors",
        dismissed ? "border-line opacity-60" : "border-line",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
          <Sparkle size={15} />
        </span>
        <div className="min-w-0 flex-1">
          {status === "rewriting" ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              autoFocus
              className="w-full resize-none rounded-xl border border-indigo/30 bg-surface p-2.5 text-[14px] leading-relaxed text-ink outline-none focus:border-indigo/50"
            />
          ) : (
            <p
              className={cn(
                "text-[14px] leading-relaxed text-ink",
                dismissed && "line-through decoration-faint/50",
              )}
            >
              {draft}
            </p>
          )}
          <p className="mt-2 text-[12px] text-faint">
            {insight.evidence} · {relativeDays(insight.date)}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
            {status === "rewriting" ? (
              <div className="inline-flex items-center gap-1.5">
                <button
                  onClick={() => setStatus("confirmed")}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-mastered/30 bg-mastered-soft px-2.5 text-[12px] font-medium text-mastered transition-colors hover:bg-mastered/15"
                >
                  <Check size={13} /> Save in my words
                </button>
                <button
                  onClick={() => {
                    setDraft(insight.text);
                    setStatus("raw");
                  }}
                  className="inline-flex h-7 items-center gap-1 rounded-lg border border-line bg-surface px-2 text-[12px] font-medium text-faint transition-colors hover:bg-sand hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : status === "raw" ? (
              <div className="inline-flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setStatus("confirmed")}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-mastered/30 bg-mastered-soft px-2.5 text-[12px] font-medium text-mastered transition-colors hover:bg-mastered/15"
                >
                  <Check size={13} /> Confirm
                </button>
                <button
                  onClick={() => setStatus("rewriting")}
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[12px] font-medium text-muted transition-colors hover:bg-sand hover:text-ink"
                >
                  <Pencil size={12} /> Rewrite
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
                {status === "confirmed"
                  ? draft === insight.text
                    ? "Confirmed by coach"
                    : "Rewritten by coach"
                  : "Dismissed"}
              </button>
            )}

            {!dismissed && (
              <button
                onClick={() => setParentSafe((p) => !p)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
                  parentSafe
                    ? "text-faint hover:text-muted"
                    : "bg-practising-soft text-practising",
                )}
                title="Toggle whether this can be surfaced to the family"
              >
                {parentSafe ? <Eye size={12} /> : <EyeOff size={12} />}
                {parentSafe ? "Can be shared with parent" : "Not suitable for parent sharing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
