"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Decision = "pending" | "accepted" | "edited" | "rejected";

/** The override surface — accept / edit / reject on every AI suggestion (rule #2).
 *  The human is the decider of record; we show who decided. */
export function OverrideControl({
  initial = "pending",
  decider = "you",
  size = "md",
}: {
  initial?: Decision;
  decider?: string;
  size?: "sm" | "md";
}) {
  const [decision, setDecision] = useState<Decision>(initial);

  if (decision !== "pending") {
    const map = {
      accepted: { label: "Accepted", cls: "text-mastered", Icon: Check },
      edited: { label: "Edited", cls: "text-indigo", Icon: Pencil },
      rejected: { label: "Rejected", cls: "text-gap", Icon: X },
      pending: { label: "", cls: "", Icon: Check },
    }[decision];
    const Icon = map.Icon;
    return (
      <button
        onClick={() => setDecision("pending")}
        className="group inline-flex items-center gap-1.5 text-[12px] font-medium"
        title="Change decision"
      >
        <span className={cn("inline-flex items-center gap-1", map.cls)}>
          <Icon size={14} /> {map.label}
        </span>
        <span className="text-faint">· by {decider}</span>
      </button>
    );
  }

  const btn = cn(
    "inline-flex items-center gap-1.5 rounded-lg border font-medium transition-colors",
    size === "sm" ? "h-7 px-2 text-[12px]" : "h-8 px-2.5 text-[13px]",
  );

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        onClick={() => setDecision("accepted")}
        className={cn(btn, "border-mastered/30 bg-mastered-soft text-mastered hover:bg-mastered/15")}
      >
        <Check size={14} /> Accept
      </button>
      <button
        onClick={() => setDecision("edited")}
        className={cn(btn, "border-line bg-surface text-muted hover:bg-sand hover:text-ink")}
      >
        <Pencil size={13} /> Edit
      </button>
      <button
        onClick={() => setDecision("rejected")}
        className={cn(btn, "border-line bg-surface text-faint hover:bg-gap-soft hover:text-gap")}
        aria-label="Reject"
      >
        <X size={14} />
      </button>
    </div>
  );
}
