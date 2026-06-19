"use client";

import { useState } from "react";
import { Clock, MapPin, Users, LifeBuoy, FileText, Repeat, ChevronDown, Rocket } from "lucide-react";
import type { TeacherClass } from "@/data/teacher-profiles";
import { OverrideControl } from "@/components/patterns/OverrideControl";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const SECTION_TONE: Record<string, string> = {
  Instruction: "#37357A",
  "1:1 Talk-buddy": "#5E7C6A",
  "Self-work": "#C0913A",
  Activity: "#C8802E",
};
const DIFF_TONE = { support: "practising", core: "indigo", stretch: "mastered" } as const;
const PACE_META: Record<string, { label: string; tone: "mastered" | "neutral" | "practising" }> = {
  ahead: { label: "Ahead", tone: "mastered" },
  on: { label: "On pace", tone: "neutral" },
  behind: { label: "Needs support", tone: "practising" },
};

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="size-2 rounded-full" style={{ backgroundColor: i <= n ? "#C8802E" : "#ECEAE3" }} />
      ))}
    </span>
  );
}

/* ---- the calm minutes bar (concept: 20/10/20/10) ---- */
function PlanBar({ c }: { c: TeacherClass }) {
  const total = c.plan.reduce((a, s) => a + s.minutes, 0);
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {c.plan.map((s, i) => (
          <span
            key={i}
            className="h-full"
            style={{ width: `${(s.minutes / total) * 100}%`, backgroundColor: SECTION_TONE[s.kind] }}
            title={`${s.kind} · ${s.minutes} min`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-muted">
        {c.plan.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: SECTION_TONE[s.kind] }} />
            {s.kind} · {s.minutes}m
          </span>
        ))}
      </div>
    </div>
  );
}

function Worksheets({ c }: { c: TeacherClass }) {
  return (
    <div className="space-y-3">
      {c.worksheets.map((w) => (
        <Card key={w.title} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
                <FileText size={14} className="text-faint" /> {w.title}
              </p>
              <p className="mt-1 text-[12px] text-faint">Target skill · {w.targetSkill}</p>
            </div>
            <Badge tone={DIFF_TONE[w.difficulty]} className="shrink-0 capitalize">{w.difficulty}</Badge>
          </div>
          <ul className="mt-3 space-y-1.5">
            {w.questions.map((q, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-muted">
                <span className="tnum text-faint">{i + 1}.</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
            {w.reviewStatus === "needs-review" ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-practising">
                  <Repeat size={12} /> Needs your okay
                </span>
                <OverrideControl initial="pending" size="sm" />
              </>
            ) : (
              <OverrideControl initial="accepted" size="sm" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

function SupportCard({ c }: { c: TeacherClass }) {
  return (
    <Card className="border-gap/20 p-5">
      <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
        <LifeBuoy size={15} className="text-gap" /> Worth a small group
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-faint">
        {c.kind === "concept"
          ? "Children whose last worksheet didn't pass the skill yet."
          : "Children who need a nudge on their craft this term."}
      </p>
      <div className="mt-3 space-y-2.5">
        {c.support.map((s) => (
          <div key={s.name} className="flex items-start gap-2.5">
            <Avatar name={s.name} size={26} />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-ink">{s.name}</p>
              <p className="text-[12px] leading-snug text-muted">{s.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Roster({ c }: { c: TeacherClass }) {
  const [filter, setFilter] = useState("all");
  const list = c.roster.filter((p) => filter === "all" || p.pace === filter);
  const counts = {
    all: c.roster.length,
    behind: c.roster.filter((p) => p.pace === "behind").length,
    on: c.roster.filter((p) => p.pace === "on").length,
    ahead: c.roster.filter((p) => p.pace === "ahead").length,
  };
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <SectionLabel>The class · {c.roster.length} children</SectionLabel>
        <Segmented
          items={[
            { id: "all", label: "All" },
            { id: "behind", label: `Support ${counts.behind}` },
            { id: "ahead", label: `Ahead ${counts.ahead}` },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
        {list.map((p, i) => {
          const meta = PACE_META[p.pace];
          return (
            <div
              key={p.name}
              className={cn(
                "flex items-center gap-3 px-5 py-3",
                i % 2 === 1 && "sm:border-l sm:border-line",
              )}
            >
              <Avatar name={p.name} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium text-ink">{p.name}</p>
                <p className="truncate text-[12px] text-muted">{p.note}</p>
              </div>
              <Badge tone={meta.tone} className="shrink-0">{meta.label}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---- concept: 20/10/20/10 lesson plan ---- */
function LessonPlan({ c }: { c: TeacherClass }) {
  return (
    <Card>
      <div className="border-b border-line p-5">
        <SectionLabel className="mb-3">The hour · 20 / 10 / 20 / 10</SectionLabel>
        <PlanBar c={c} />
      </div>
      <div className="divide-y divide-line">
        {c.plan.map((sec) => (
          <div key={sec.kind} className="flex gap-4 p-5">
            <div className="flex w-14 shrink-0 flex-col items-center">
              <span
                className="grid size-9 place-items-center rounded-xl text-[13px] font-semibold text-white tnum"
                style={{ backgroundColor: SECTION_TONE[sec.kind] }}
              >
                {sec.minutes}
              </span>
              <span className="mt-1 text-[10px] text-faint">min</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-faint">{sec.kind}</p>
              <p className="mt-0.5 text-[15px] font-medium text-ink">{sec.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{sec.detail}</p>
              <p className="mt-2 rounded-lg bg-indigo-soft/60 px-2.5 py-1.5 text-[12px] text-indigo">{sec.aiNote}</p>
              <div className="mt-3">
                <OverrideControl initial={sec.decision} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line bg-canvas px-5 py-3 text-[12px] text-faint">
        Every section lets you accept, edit, or reject. You decide. The AI does the checking work, never the teaching.
      </div>
    </Card>
  );
}

/* ---- path: 60-min plan, same look minus the 20/10/20/10 label ---- */
function PathPlan({ c }: { c: TeacherClass }) {
  return (
    <Card>
      <div className="border-b border-line p-5">
        <SectionLabel className="mb-3">The hour</SectionLabel>
        <PlanBar c={c} />
      </div>
      <div className="divide-y divide-line">
        {c.plan.map((sec) => (
          <div key={sec.kind} className="flex gap-4 p-5">
            <div className="flex w-14 shrink-0 flex-col items-center">
              <span
                className="grid size-9 place-items-center rounded-xl text-[13px] font-semibold text-white tnum"
                style={{ backgroundColor: SECTION_TONE[sec.kind] }}
              >
                {sec.minutes}
              </span>
              <span className="mt-1 text-[10px] text-faint">min</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-faint">{sec.kind}</p>
              <p className="mt-0.5 text-[15px] font-medium text-ink">{sec.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{sec.detail}</p>
              <p className="mt-2 rounded-lg bg-saffron-soft/70 px-2.5 py-1.5 text-[12px] text-saffron-deep">{sec.aiNote}</p>
              <div className="mt-3">
                <OverrideControl initial={sec.decision} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Groups({ c }: { c: TeacherClass }) {
  if (!c.groups) return null;
  return (
    <Card className="p-5">
      <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
        <Users size={15} className="text-saffron-deep" /> Mixed-age groups
      </p>
      <p className="mt-1 text-[12px] text-faint">Grouped by level and interest, not by age.</p>
      <div className="mt-4 space-y-4">
        {c.groups.map((g) => (
          <div key={g.groupName}>
            <p className="text-[12.5px] font-medium text-ink">{g.groupName}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.members.map((m) => (
                <span key={m} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface py-0.5 pl-0.5 pr-2 text-[11.5px] text-ink">
                  <Avatar name={m} size={18} /> {m.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentWork({ c }: { c: TeacherClass }) {
  if (!c.recentWork) return null;
  return (
    <div className="space-y-3">
      {c.recentWork.map((w) => (
        <Card key={w.title} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar name={w.studentName} size={28} />
              <span className="text-[13px] font-medium text-ink">{w.studentName}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-[11px] text-faint">standard <Stars n={w.rating} /></span>
          </div>
          <p className="mt-3 font-display text-[16px] leading-snug text-ink">{w.title}</p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{w.note}</p>
        </Card>
      ))}
    </div>
  );
}

function OneMove({ c }: { c: TeacherClass }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo/15 bg-surface shadow-soft">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo via-indigo/70 to-saffron" />
      <div className="p-6">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo">
          <Users size={14} /> Your one move
        </p>
        <h2 className="mt-2.5 font-display text-[22px] leading-snug text-ink">{c.oneMove.headline}</h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {c.oneMove.names.map((n) => (
              <Avatar key={n} name={n} size={32} className="ring-2 ring-surface" />
            ))}
          </div>
          <span className="text-[13px] text-muted">{c.oneMove.names.join(", ")}</span>
        </div>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{c.oneMove.everyoneElse}</p>
        <button
          onClick={() => setOpen((s) => !s)}
          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo hover:text-indigo-ink"
        >
          {open ? "Hide the why" : "See the why"}
          <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="mt-3 rounded-xl border border-line bg-canvas p-4 text-[13.5px] leading-relaxed text-ink">
            {c.oneMove.why}
          </div>
        )}
      </div>
    </div>
  );
}

export function ClassDetail({ c }: { c: TeacherClass }) {
  const concept = c.kind === "concept";
  return (
    <div className="space-y-8">
      <OneMove c={c} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Rocket size={16} className="text-indigo" />
              <h2 className="font-display text-xl text-ink">{concept ? "Lesson plan the AI suggests" : "Today's session"}</h2>
            </div>
            {concept ? <LessonPlan c={c} /> : <PathPlan c={c} />}
          </div>

          {concept ? (
            <div>
              <h2 className="mb-3 font-display text-xl text-ink">The class</h2>
              <Roster c={c} />
            </div>
          ) : (
            <div>
              <h2 className="mb-3 font-display text-xl text-ink">Recent work & rising standard</h2>
              <RecentWork c={c} />
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <SupportCard c={c} />
          {!concept && <Groups c={c} />}
          <div>
            <h2 className="mb-3 font-display text-xl text-ink">Worksheets matched to each child</h2>
            <Worksheets c={c} />
          </div>
          {!concept && (
            <div>
              <h2 className="mb-3 font-display text-xl text-ink">The group</h2>
              <Roster c={c} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
