"use client";

import * as React from "react";
import {
  Sun,
  BookOpen,
  Target,
  Hammer,
  NotebookPen,
  ShieldCheck,
  Flag,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  HelpCircle,
  Check,
  Sparkles,
  Upload,
  CornerDownRight,
  type LucideIcon,
} from "lucide-react";
import { DeviceFrame, Screen, type MobileTab } from "@/components/shell/DeviceFrame";
import { Card, Badge, SectionLabel, Button } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import {
  studentById,
  tutorSessionsByStudent,
  pathDefs,
} from "@/data";
import {
  todayTopic,
  learnModule,
  practiceItems,
  progressStateMeta,
  project,
  reflectionPrompts,
} from "@/data/student-extra";
import { pct, cn } from "@/lib/utils";

const ACCENT = "#37357A";
const STUDENT_ID = "stu-mahira";

const TABS: MobileTab[] = [
  { id: "today", label: "Today", icon: Sun },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Target },
  { id: "projects", label: "Projects", icon: Hammer },
  { id: "reflect", label: "Reflect", icon: NotebookPen },
];

/* A small, consistent eyebrow heading inside the phone. */
function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <SectionLabel className={cn("mb-2.5 mt-6", className)}>{children}</SectionLabel>;
}

/* The calm guard-rail chip that reminds the child what the tutor is for. */
function GuardRail({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] leading-tight text-muted shadow-soft">
      <ShieldCheck size={13} className="shrink-0 text-mastered" />
      {children}
    </div>
  );
}

/* A single chat bubble — tutor on the left, student on the right. */
function Bubble({ from, children }: { from: "tutor" | "student"; children: React.ReactNode }) {
  const isStudent = from === "student";
  return (
    <div className={isStudent ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isStudent
            ? "max-w-[80%] rounded-2xl rounded-br-md bg-indigo-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-indigo-ink"
            : "max-w-[84%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-soft"
        }
      >
        {children}
      </div>
    </div>
  );
}

/* The tutor's name tag, used above its first message in a thread. */
function TutorTag() {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
      <Sparkles size={12} className="text-indigo" /> Your tutor
    </div>
  );
}

/* =====================================================================
   TODAY — what was just taught, today's move, the path highlight
   ===================================================================== */
function TodayTab() {
  const s = studentById(STUDENT_ID)!;
  const scholar = s.paths.find((p) => p.path === "scholar");

  return (
    <Screen>
      <div className="mb-1 mt-1 flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">
          Wednesday · 18 June
        </p>
        <Badge tone="indigo">Class 6</Badge>
      </div>
      <h1 className="font-display text-[28px] leading-tight text-ink">Hi, Mahira</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        One thing to get sharper at today, on the topic you just learnt.
      </p>

      <Eyebrow>Just learnt in class</Eyebrow>
      <Card className="border-indigo/15 p-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-soft text-indigo">
            <Sun size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-ink">{todayTopic.title}</p>
            <p className="text-[12px] text-faint">
              with {todayTopic.taughtBy} · {todayTopic.taughtWhen}
            </p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          The trick is turning the words into a picture before you touch any numbers
          &mdash; like &ldquo;three-quarters of 12 laddoos.&rdquo;
        </p>
      </Card>

      <Eyebrow>What to do today</Eyebrow>
      <Card className="p-5">
        <p className="text-[14px] leading-relaxed text-ink">{todayTopic.todo}</p>
        {todayTopic.selfWorkPlanned && (
          <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-indigo-soft/60 p-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface text-indigo shadow-soft">
              <Sparkles size={14} />
            </span>
            <p className="text-[12.5px] leading-snug text-muted">
              You&rsquo;ve got practice time with your tutor today &mdash;{" "}
              <span className="font-medium text-ink">{todayTopic.selfWorkWindow}</span>. Your
              tutor is all ready to help with this exact topic.
            </p>
          </div>
        )}
        <div className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo">
          Open Practice <ArrowRight size={15} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="font-display text-[26px] leading-none text-ink tnum">
            {pct(s.independentWorkRatio)}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted">worked on your own this week</p>
        </Card>
        <Card className="p-4">
          <p className="font-display text-[26px] leading-none text-ink tnum">6</p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted">days in a row on your own</p>
        </Card>
      </div>

      {scholar && (
        <>
          <Eyebrow>Your path this week</Eyebrow>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[15px] font-medium text-ink">
                <span className="text-saffron-deep">{pathDefs.scholar.glyph}</span>{" "}
                {pathDefs.scholar.name}
              </span>
              <Badge tone="saffron">Olympiad track</Badge>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{scholar.headline}</p>
            <p className="mt-2 text-[12px] text-faint">
              Today&rsquo;s fraction work goes straight into your &ldquo;{project.title}&rdquo;
              project.
            </p>
          </Card>
        </>
      )}
    </Screen>
  );
}

/* =====================================================================
   LEARN — the tutor explains the just-taught concept another way and
   asks guiding questions. Calm, one concept, no answers handed over.
   ===================================================================== */
function GuidingQuestion({ q }: { q: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="flex w-full items-start gap-2.5 rounded-xl border border-line bg-surface p-3.5 text-left transition-colors hover:bg-sand/60"
    >
      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
        <HelpCircle size={14} />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-relaxed text-ink">{q}</span>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-faint">
          {open ? "Take your time — there's no rush" : "Think it through"}
        </span>
      </span>
    </button>
  );
}

function LearnTab() {
  return (
    <Screen>
      <GuardRail>Sticks to today&rsquo;s topic &middot; your teacher helps with the bigger questions</GuardRail>

      <div className="mb-1">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Learn</p>
      </div>
      <h1 className="font-display text-[24px] leading-tight text-ink">{learnModule.topic}</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{learnModule.recap}</p>

      {/* The tutor's alternative explanation */}
      <Card className="mt-5 p-5">
        <TutorTag />
        <p className="text-[14px] font-medium text-ink">{learnModule.retellTitle}</p>
        <div className="mt-3 space-y-2.5">
          {learnModule.retell.map((line, i) => (
            <p key={i} className="text-[13px] leading-relaxed text-muted">
              {line}
            </p>
          ))}
        </div>
      </Card>

      {/* A simpler example to build footing */}
      <Eyebrow>A smaller example first</Eyebrow>
      <Card className="p-5">
        <p className="flex items-start gap-2 text-[13.5px] font-medium leading-relaxed text-ink">
          <Lightbulb size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
          {learnModule.simplerExample.prompt}
        </p>
        <ol className="mt-3 space-y-2">
          {learnModule.simplerExample.walkthrough.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
              <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-sand text-[11px] font-semibold text-muted tnum">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-xl bg-mastered-soft/70 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-mastered">
          {learnModule.simplerExample.answer}
        </p>
      </Card>

      {/* Guiding questions — the tutor asks, the student thinks */}
      <Eyebrow>Questions to think about</Eyebrow>
      <p className="-mt-1 mb-3 text-[12px] leading-relaxed text-faint">
        Your tutor won&rsquo;t just give you the answer &mdash; it&rsquo;ll help you work it out.
      </p>
      <div className="space-y-2.5">
        {learnModule.guidingQuestions.map((q, i) => (
          <GuidingQuestion key={i} q={q} />
        ))}
      </div>

      <Card className="mt-6 border-indigo/15 bg-indigo-soft/40 p-4">
        <SectionLabel className="text-indigo/70">The move, in one line</SectionLabel>
        <p className="mt-1.5 text-[13.5px] font-medium leading-relaxed text-indigo-ink">
          {learnModule.theMove}
        </p>
      </Card>

      <div className="mt-5 mb-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo">
        Try it in Practice <ArrowRight size={15} />
      </div>
    </Screen>
  );
}

/* =====================================================================
   PRACTICE — adaptive, one question at a time, hint history, support
   controls, a progress state chip, and the escalation moment.
   ===================================================================== */
const SUPPORT_CONTROLS: { label: string; icon: LucideIcon }[] = [
  { label: "Give me a hint", icon: Lightbulb },
  { label: "Explain it another way", icon: RefreshCw },
  { label: "Show me an easier example", icon: BookOpen },
  { label: "Let me try again", icon: CornerDownRight },
  { label: "Ask my teacher", icon: HelpCircle },
];

function ProgressChip({ state }: { state: keyof typeof progressStateMeta }) {
  const meta = progressStateMeta[state];
  return (
    <Badge tone={meta.tone}>
      {state === "mastered" && <Check size={12} />}
      {state === "needs-teacher" && <Flag size={12} />}
      {meta.label}
    </Badge>
  );
}

function PracticeTab() {
  // Adaptive practice walks one item at a time; she's reached the third.
  const [index, setIndex] = React.useState(2);
  const item = practiceItems[index];
  const sessions = tutorSessionsByStudent(STUDENT_ID);
  const unlock = sessions.find((t) => t.nodeId === "MATH.FRAC.WORD.04")?.unlockedBy;

  return (
    <Screen className="pb-2">
      <GuardRail>One question at a time &middot; hints, never the answer</GuardRail>

      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Practice</p>
          <h1 className="mt-0.5 font-display text-[22px] leading-tight text-ink">
            {todayTopic.title}
          </h1>
        </div>
        <ProgressChip state={item.state} />
      </div>

      {/* Adaptive position — one at a time */}
      <div className="mb-3 flex items-center gap-1.5">
        {practiceItems.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Question ${i + 1}`}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < index
                ? "bg-mastered"
                : i === index
                  ? "bg-indigo"
                  : "bg-line",
            )}
          />
        ))}
      </div>

      {/* The question */}
      <Card className="p-5">
        <SectionLabel>Question {index + 1} of {practiceItems.length}</SectionLabel>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{item.question}</p>
      </Card>

      {/* Hint history */}
      <Eyebrow>Hints so far</Eyebrow>
      <div className="space-y-2">
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

      {/* Escalation OR confirmation, depending on the item's state */}
      {item.escalation ? (
        <Card className="mt-4 border-gap/25 bg-gap-soft/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-gap">
            <Flag size={12} /> Told your teacher
          </div>
          <p className="text-[13px] leading-relaxed text-ink">{item.escalation}</p>
        </Card>
      ) : (
        <Card className="mt-4 border-mastered/20 bg-mastered-soft/50 p-4">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
            <Check size={15} className="mt-0.5 shrink-0 text-mastered" />
            {item.answer}
          </p>
        </Card>
      )}

      {/* Support controls */}
      <Eyebrow>If you&rsquo;re stuck</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {SUPPORT_CONTROLS.map((c) => {
          const Icon = c.icon;
          const isEscalate = c.label === "Ask my teacher";
          return (
            <button
              key={c.label}
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                isEscalate
                  ? "border-gap/30 bg-gap-soft/60 text-gap hover:bg-gap-soft"
                  : "border-line bg-surface text-ink shadow-soft hover:bg-sand",
              )}
            >
              <Icon size={13} className={isEscalate ? "text-gap" : "text-indigo"} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* How the tutor reads her progress — the L2/L3 capture, in plain words */}
      {unlock && (
        <Card className="mt-6 p-4">
          <SectionLabel>What helped it click</SectionLabel>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{unlock}.</p>
        </Card>
      )}
    </Screen>
  );
}

/* =====================================================================
   PROJECTS — brief, milestones, artifacts, rubric + exemplars, mentor
   feedback, reflection, and a bounded tutor offer that defers judgment.
   ===================================================================== */
function ProjectsTab() {
  const def = pathDefs[project.path];
  const doneCount = project.milestones.filter((m) => m.done).length;

  return (
    <Screen>
      <div className="mb-1 mt-1 flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Project</p>
        <Badge tone="saffron">
          <span className="text-[13px] leading-none">{def.glyph}</span> {project.pathLabel}
        </Badge>
      </div>
      <h1 className="font-display text-[24px] leading-tight text-ink">{project.title}</h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{project.brief}</p>

      <Card className="mt-4 border-saffron/20 bg-saffron-soft/30 p-4">
        <SectionLabel className="text-saffron-deep/80">The big question</SectionLabel>
        <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-ink">
          {project.driving}
        </p>
      </Card>

      {/* Mentor line */}
      <Eyebrow>Your mentor</Eyebrow>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={project.mentor.name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-ink">{project.mentor.name}</p>
            <p className="text-[12px] text-faint">
              {project.mentor.title} · {project.group}
            </p>
          </div>
        </div>
      </Card>

      {/* Milestones */}
      <Eyebrow className="flex items-center justify-between">
        <span>Your steps</span>
        <span className="font-normal tracking-normal text-faint tnum">
          {doneCount}/{project.milestones.length}
        </span>
      </Eyebrow>
      <Card className="p-2">
        {project.milestones.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3 p-3",
              i < project.milestones.length - 1 && "border-b border-line",
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                m.done ? "bg-mastered text-white" : "border border-line-strong bg-surface",
              )}
            >
              {m.done && <Check size={12} strokeWidth={3} />}
            </span>
            <div className="min-w-0">
              <p className={cn("text-[13.5px] font-medium", m.done ? "text-ink" : "text-muted")}>
                {m.label}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-faint">{m.detail}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Artifacts + upload affordance */}
      <Eyebrow>Your work</Eyebrow>
      <div className="space-y-2">
        {project.artifacts.map((a, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3",
              a.uploaded ? "border-line bg-surface shadow-soft" : "border-dashed border-line-strong bg-sand/40",
            )}
          >
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-lg",
                a.uploaded ? "bg-indigo-soft text-indigo" : "bg-surface text-faint",
              )}
            >
              {a.uploaded ? <Check size={16} /> : <Upload size={16} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-[13px] font-medium", a.uploaded ? "text-ink" : "text-muted")}>
                {a.label}
              </p>
              <p className="text-[11.5px] text-faint">{a.meta}</p>
            </div>
            {!a.uploaded && (
              <span className="shrink-0 text-[12px] font-medium text-indigo">Add</span>
            )}
          </div>
        ))}
      </div>

      {/* Rubric with anchored exemplars */}
      <Eyebrow>How your work is looked at</Eyebrow>
      <div className="space-y-2">
        {project.rubric.map((r) => (
          <Card
            key={r.level}
            className={cn(
              "p-3.5",
              r.current && "border-indigo/30 bg-indigo-soft/30 ring-1 ring-inset ring-indigo/15",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-medium text-ink">{r.level}</p>
              {r.current && <Badge tone="indigo">You&rsquo;re here</Badge>}
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{r.descriptor}</p>
            <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-sand/70 px-2.5 py-2 text-[12px] italic leading-relaxed text-faint">
              <CornerDownRight size={12} className="mt-0.5 shrink-0" />
              {r.exemplar}
            </p>
          </Card>
        ))}
      </div>

      {/* Mentor feedback */}
      <Eyebrow>From your mentor</Eyebrow>
      <Card className="p-5">
        <p className="text-[13.5px] leading-relaxed text-ink">{project.mentorFeedback.text}</p>
        <p className="mt-2.5 text-[11px] text-faint">
          {project.mentor.name} · 17 June
        </p>
      </Card>

      {/* Bounded tutor support — and the judgment it hands back */}
      <Eyebrow>Where your tutor can help</Eyebrow>
      <Card className="p-5">
        <TutorTag />
        <p className="text-[13px] leading-relaxed text-muted">{project.tutorSupport.offer}</p>
        <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-practising-soft/70 p-3 text-[12.5px] leading-relaxed text-practising">
          <Flag size={14} className="mt-0.5 shrink-0" />
          <span>{project.tutorSupport.defers}</span>
        </div>
      </Card>

      {/* Her own reflection on the project */}
      <Eyebrow>In your words</Eyebrow>
      <Card className="bg-sand/50 p-4">
        <p className="text-[13px] italic leading-relaxed text-muted">
          &ldquo;{project.studentReflection}&rdquo;
        </p>
      </Card>
    </Screen>
  );
}

/* =====================================================================
   REFLECTION — what was hard, what changed, what to try next.
   ===================================================================== */
function ReflectTab() {
  const s = studentById(STUDENT_ID)!;

  return (
    <Screen>
      <div className="mb-1 mt-1">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Reflection</p>
      </div>
      <h1 className="font-display text-[24px] leading-tight text-ink">
        How did today actually go?
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        A quiet minute for yourself &mdash; no marks, no one watching. Just noticing.
      </p>

      <div className="mt-5 space-y-3.5">
        {reflectionPrompts.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-xl bg-indigo-soft text-indigo">
                <NotebookPen size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-medium leading-snug text-ink">{p.prompt}</p>
                <p className="mt-0.5 text-[12px] text-faint">{p.hint}</p>
              </div>
            </div>

            {p.answer ? (
              <p className="mt-3.5 rounded-xl bg-sand/70 px-3.5 py-3 text-[13px] leading-relaxed text-muted">
                {p.answer}
              </p>
            ) : (
              <div className="mt-3.5 rounded-xl border border-dashed border-line-strong bg-canvas px-3.5 py-3 text-[13px] text-faint">
                Write a line when you&rsquo;re ready&hellip;
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-indigo/15 bg-indigo-soft/40 p-5">
        <div className="flex items-center gap-2.5">
          <Avatar name={s.name} size={36} />
          <div>
            <p className="text-[13.5px] font-medium text-ink">{s.name}</p>
            <p className="text-[12px] text-faint">{s.grade} · {s.house} House</p>
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
          What you notice here is yours. If you&rsquo;d like, your coach can read it before your
          next chat &mdash; only if you choose to share it.
        </p>
        <div className="mt-3.5 flex gap-2">
          <Button size="sm" variant="primary">Save for myself</Button>
          <Button size="sm" variant="outline">Share with my coach</Button>
        </div>
      </Card>
    </Screen>
  );
}

export default function StudentApp() {
  const [active, setActive] = React.useState("today");
  return (
    <DeviceFrame tabs={TABS} active={active} onTab={setActive} accent={ACCENT} title="Student">
      {active === "today" && <TodayTab />}
      {active === "learn" && <LearnTab />}
      {active === "practice" && <PracticeTab />}
      {active === "projects" && <ProjectsTab />}
      {active === "reflect" && <ReflectTab />}
    </DeviceFrame>
  );
}
