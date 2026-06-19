"use client";

import * as React from "react";
import {
  Lightbulb,
  HelpCircle,
  Check,
  Flag,
  Hammer,
  NotebookPen,
  CornerDownRight,
  Sparkles,
} from "lucide-react";
import {
  learnModule,
  practiceItems,
  progressStateMeta,
  project,
  reflectionPrompts,
  type PracticeItem,
} from "@/data/student-extra";
import { pathDefs } from "@/data";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* Mahira's deeper Student-OS content, reused from data/student-extra.ts so her
   good work is surfaced rather than rebuilt: the tutor's retelling of the
   topic, her adaptive practice with the hint ladder (one item at a time,
   including the honest escalation), her PATH project, and her own reflection. */

function ProgressChip({ state }: { state: PracticeItem["state"] }) {
  const meta = progressStateMeta[state];
  return (
    <Badge tone={meta.tone}>
      {state === "mastered" && <Check size={12} />}
      {state === "needs-teacher" && <Flag size={12} />}
      {meta.label}
    </Badge>
  );
}

function PracticeWalkthrough() {
  const [index, setIndex] = React.useState(2); // she's reached the third item
  const item = practiceItems[index];

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <SectionLabel>Working through it, one at a time</SectionLabel>
        <ProgressChip state={item.state} />
      </div>

      {/* adaptive position */}
      <div className="mb-4 flex items-center gap-1.5">
        {practiceItems.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Question ${i + 1}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < index ? "bg-mastered" : i === index ? "bg-indigo" : "bg-line",
            )}
          />
        ))}
      </div>

      <p className="text-[11px] uppercase tracking-[0.12em] text-faint">
        Question {index + 1} of {practiceItems.length}
      </p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{item.question}</p>

      {/* hint ladder */}
      <div className="mt-4 space-y-2">
        {item.hints.map((h, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-saffron-soft text-saffron-deep">
              <Lightbulb size={13} />
            </span>
            <p className="rounded-xl border border-line bg-surface px-3 py-2 text-[12.5px] leading-relaxed text-muted shadow-soft">
              {h}
            </p>
          </div>
        ))}
        {item.attempt && (
          <div className="flex justify-end pt-1">
            <div className="max-w-[82%] rounded-2xl rounded-br-md bg-indigo-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-indigo-ink">
              {item.attempt}
            </div>
          </div>
        )}
      </div>

      {/* escalation OR confirmation */}
      {item.escalation ? (
        <div className="mt-4 rounded-xl border border-gap/25 bg-gap-soft/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-gap">
            <Flag size={12} /> Told your teacher
          </div>
          <p className="text-[13px] leading-relaxed text-ink">{item.escalation}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-mastered/20 bg-mastered-soft/50 p-4">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
            <Check size={15} className="mt-0.5 shrink-0 text-mastered" />
            {item.answer}
          </p>
        </div>
      )}
    </Card>
  );
}

function LearnRetell() {
  return (
    <Card className="p-5">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
        <Sparkles size={12} className="text-indigo" /> Another way to see it
      </span>
      <p className="mt-2.5 text-[14px] font-medium text-ink">{learnModule.retellTitle}</p>
      <div className="mt-2.5 space-y-2">
        {learnModule.retell.map((line, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-muted">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-4 space-y-2 rounded-xl bg-sand/60 p-3.5">
        <p className="flex items-start gap-2 text-[13px] font-medium leading-relaxed text-ink">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-saffron-deep" />
          {learnModule.simplerExample.prompt}
        </p>
        <ol className="space-y-1.5 pl-1">
          {learnModule.simplerExample.walkthrough.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
              <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-surface text-[10px] font-semibold text-muted tnum">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-3.5 rounded-xl border border-indigo/15 bg-indigo-soft/40 p-3.5">
        <SectionLabel className="text-indigo/70">The move, in one line</SectionLabel>
        <p className="mt-1 text-[13px] font-medium leading-relaxed text-indigo-ink">
          {learnModule.theMove}
        </p>
      </div>
    </Card>
  );
}

function GuidingQuestions() {
  return (
    <Card className="p-5">
      <SectionLabel className="mb-1">Questions to think about</SectionLabel>
      <p className="mb-3 text-[12px] leading-relaxed text-faint">
        Your tutor asks these to help you work it out — it won&rsquo;t just tell you.
      </p>
      <div className="space-y-2">
        {learnModule.guidingQuestions.map((q, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3"
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
              <HelpCircle size={13} />
            </span>
            <p className="text-[13px] leading-relaxed text-ink">{q}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectCard() {
  const def = pathDefs[project.path];
  const done = project.milestones.filter((m) => m.done).length;

  return (
    <Card className="p-5">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <Hammer size={15} className="text-saffron-deep" /> {project.title}
        </span>
        <Badge tone="saffron">
          <span className="text-[12px] leading-none">{def.glyph}</span> {project.pathLabel}
        </Badge>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{project.brief}</p>

      <div className="mt-3.5 rounded-xl border border-saffron/20 bg-saffron-soft/30 p-3.5">
        <SectionLabel className="text-saffron-deep/80">The big question</SectionLabel>
        <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-ink">{project.driving}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <SectionLabel>Your steps</SectionLabel>
        <span className="text-[12px] text-faint tnum">
          {done}/{project.milestones.length}
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {project.milestones.map((m, i) => (
          <div key={i} className="flex items-start gap-2.5 py-1">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                m.done ? "bg-mastered text-white" : "border border-line-strong bg-surface",
              )}
            >
              {m.done && <Check size={11} strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-[13px] font-medium", m.done ? "text-ink" : "text-muted")}>
                {m.label}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-faint">{m.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-sand/60 p-3.5">
        <Avatar name={project.mentor.name} size={32} />
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-ink">{project.mentor.name}</p>
          <p className="mt-0.5 text-[12.5px] italic leading-relaxed text-muted">
            &ldquo;{project.mentorFeedback.text}&rdquo;
          </p>
        </div>
      </div>
    </Card>
  );
}

function Reflection() {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-xl bg-indigo-soft text-indigo">
          <NotebookPen size={14} />
        </span>
        <SectionLabel>In your own words</SectionLabel>
      </div>
      <div className="space-y-3">
        {reflectionPrompts.map((p) => (
          <div key={p.id}>
            <p className="text-[13.5px] font-medium leading-snug text-ink">{p.prompt}</p>
            {p.answer ? (
              <p className="mt-1.5 rounded-xl bg-sand/70 px-3 py-2.5 text-[12.5px] leading-relaxed text-muted">
                {p.answer}
              </p>
            ) : (
              <p className="mt-1.5 flex items-center gap-1.5 rounded-xl border border-dashed border-line-strong bg-canvas px-3 py-2.5 text-[12.5px] text-faint">
                <CornerDownRight size={12} /> Write a line when you&rsquo;re ready…
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function MahiraDeepDive() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <LearnRetell />
        <GuidingQuestions />
      </div>
      <div className="space-y-4">
        <PracticeWalkthrough />
        <ProjectCard />
        <Reflection />
      </div>
    </div>
  );
}
