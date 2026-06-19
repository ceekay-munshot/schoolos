"use client";

import * as React from "react";
import {
  ShieldCheck,
  Sparkles,
  Lightbulb,
  RefreshCw,
  BookOpen,
  CornerDownRight,
  HelpCircle,
  Flag,
  Lock,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import type { TutorSection, TutorTurn } from "@/data/student-profiles";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* The AI tutor — a guard-railed practice panel on the topic just taught. It
   asks guiding questions, offers hints not answers, and hands the judgment
   calls back to the teacher. Bubbles + GuardRail style carried over from the
   original Student OS. Riya (elementary) sees a gentle locked state instead. */

/* ---- shared chrome ---- */
function GuardRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11.5px] leading-tight text-muted shadow-soft">
      <ShieldCheck size={13} className="shrink-0 text-mastered" />
      {children}
    </div>
  );
}

function TutorTag() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
      <Sparkles size={12} className="text-indigo" /> Your tutor
    </span>
  );
}

function Bubble({ turn }: { turn: TutorTurn }) {
  const isStudent = turn.from === "student";
  return (
    <div className={isStudent ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isStudent
            ? "max-w-[78%] rounded-2xl rounded-br-md bg-indigo-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-indigo-ink"
            : "max-w-[82%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-soft"
        }
      >
        {turn.text}
      </div>
    </div>
  );
}

/* the support controls a child can lean on — visual, calm, never the answer */
const SUPPORT: { label: string; icon: LucideIcon; escalate?: boolean }[] = [
  { label: "Give me a hint", icon: Lightbulb },
  { label: "Explain it another way", icon: RefreshCw },
  { label: "Show me an easier one", icon: BookOpen },
  { label: "Let me try again", icon: CornerDownRight },
  { label: "Ask my teacher", icon: HelpCircle, escalate: true },
];

export function TutorPanel({ tutor }: { tutor: TutorSection }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-sand/50 px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TutorTag />
            <Badge tone="indigo">Practice</Badge>
          </div>
          <p className="mt-1 text-[14px] font-medium text-ink">{tutor.topic}</p>
        </div>
        <GuardRail>{tutor.rail}</GuardRail>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr]">
        {/* the thread */}
        <div className="space-y-3 p-5 lg:border-r lg:border-line">
          {tutor.thread.map((turn, i) => (
            <Bubble key={i} turn={turn} />
          ))}

          {/* the judgment handed back to the teacher */}
          <div className="!mt-5 flex items-start gap-2 rounded-xl bg-practising-soft/60 p-3 text-[12.5px] leading-relaxed text-practising">
            <Flag size={14} className="mt-0.5 shrink-0" />
            <span>{tutor.defersToTeacher}</span>
          </div>
        </div>

        {/* the support rail */}
        <div className="bg-canvas/60 p-5">
          <SectionLabel className="mb-3">If you get stuck</SectionLabel>
          <div className="flex flex-col gap-2">
            {SUPPORT.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12.5px] font-medium transition-colors",
                    c.escalate
                      ? "border-gap/30 bg-gap-soft/50 text-gap hover:bg-gap-soft"
                      : "border-line bg-surface text-ink shadow-soft hover:bg-sand",
                  )}
                >
                  <Icon size={14} className={c.escalate ? "text-gap" : "text-indigo"} />
                  {c.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[11.5px] leading-relaxed text-faint">
            Your tutor only helps with today&rsquo;s topic. The bigger calls — and your marks —
            always stay with your teacher.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ---- the gentle locked state for elementary (paper-first) ---- */
export function TutorLocked() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-sand text-muted">
          <Lock size={20} />
        </span>
        <p className="mt-4 font-display text-[19px] leading-snug text-ink">
          Your AI tutor opens in Class 6
        </p>
        <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-muted">
          For now, your learning happens with your teacher and on paper. That is the best way to
          build strong fractions — folding, drawing, and talking it through together.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[12px] text-faint">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 shadow-soft">
            <PenLine size={13} className="text-indigo" /> Pencil and paper
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 shadow-soft">
            <ShieldCheck size={13} className="text-mastered" /> Learning with your teacher
          </span>
        </div>
      </div>
    </Card>
  );
}
