"use client";

import * as React from "react";
import {
  Home,
  BookOpen,
  Sprout,
  HeartHandshake,
  FileText,
  CalendarDays,
  Sparkles,
  Quote,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Download,
  Check,
  ShieldCheck,
} from "lucide-react";
import { DeviceFrame, Screen, type MobileTab } from "@/components/shell/DeviceFrame";
import { Card, Badge, SectionLabel, Divider } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { TrendLine } from "@/components/viz/charts";
import { CompetencyMap } from "@/components/viz/CompetencyMap";
import { studentById, educatorById, pathDefs } from "@/data";
import { relativeDays, cn } from "@/lib/utils";
import {
  PARENT_STUDENT_ID,
  subjectBridges,
  namedGap,
  monthlySummaries,
  whatHappensNext,
  pathEvidence,
  PATH_ARC,
  sharedPlan,
  progressSinceCheckIn,
  riyaCheckIn,
  riyaCoachNote,
  riyaGrowth,
  riyaArtifacts,
  type SubjectBridge,
} from "@/data/parent-extra";

const ACCENT = "#C8802E";
const STUDENT_ID = PARENT_STUDENT_ID;

const TABS: MobileTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "academics", label: "Academics", icon: BookOpen },
  { id: "paths", label: "PATHS", icon: Sprout },
  { id: "coach", label: "Coach", icon: HeartHandshake },
  { id: "reports", label: "Reports", icon: FileText },
];

const FLOOR_META: Record<
  SubjectBridge["floor"],
  { label: string; dot: string; text: string }
> = {
  "on-track": { label: "Going well", dot: "bg-mastered", text: "text-mastered" },
  building: { label: "Getting there", dot: "bg-practising", text: "text-practising" },
  "needs-support": { label: "Needs a hand", dot: "bg-gap", text: "text-gap" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

/* The persistent child header at the top of every screen. */
function ChildHeader() {
  const s = studentById(STUDENT_ID)!;
  return (
    <div className="mb-5 flex items-center gap-3">
      <Avatar name={s.name} size={44} />
      <div className="min-w-0">
        <p className="font-display text-[17px] leading-tight text-ink">{s.name}</p>
        <p className="text-[12px] text-muted">
          {s.grade} · {s.house} House
        </p>
      </div>
    </div>
  );
}

/* A small section heading inside the phone. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <SectionLabel className="mb-2.5 mt-7 first:mt-0">{children}</SectionLabel>;
}

/* A tiny signed-delta chip used beside mastery figures. */
function Delta({ value }: { value: number }) {
  const up = value > 0;
  const flat = value === 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[12px] font-medium tnum",
        up ? "text-mastered" : flat ? "text-faint" : "text-practising",
      )}
    >
      {!flat && <TrendingUp size={12} className={up ? "" : "-scale-y-100"} />}
      {up ? "+" : ""}
      {value}%
    </span>
  );
}

/* ---------------- Home — "This month" ---------------- */
function HomeTab() {
  const month = monthlySummaries[0];
  const checkIn = riyaCheckIn();
  const coach = educatorById("edu-rohan")!;
  const artist = pathEvidence.artist;
  const event = whatHappensNext.event;

  const floors = [
    { key: "on-track" as const, subjects: subjectBridges.filter((s) => s.floor === "on-track") },
    { key: "building" as const, subjects: subjectBridges.filter((s) => s.floor === "building") },
    {
      key: "needs-support" as const,
      subjects: subjectBridges.filter((s) => s.floor === "needs-support"),
    },
  ];
  const gapsClosed = subjectBridges.reduce((a, s) => a + s.gapsClosed, 0);

  return (
    <Screen>
      <ChildHeader />

      <Eyebrow>This month</Eyebrow>
      <Card className="p-5">
        <p className="text-[15px] leading-relaxed text-ink">{month.summary}</p>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-saffron-soft/60 p-3.5">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
          <p className="text-[13px] leading-relaxed text-muted">
            She isn&rsquo;t behind. There&rsquo;s just one clear step we&rsquo;re working on —
            and it&rsquo;s already being taught. We&rsquo;d always rather show you the real
            picture than a wall of green.
          </p>
        </div>
      </Card>

      <Eyebrow>How her subjects are going</Eyebrow>
      <Card className="p-5">
        <div className="space-y-3.5">
          {floors.map(({ key, subjects }) => {
            const meta = FLOOR_META[key];
            return (
              <div key={key} className="flex items-start gap-3">
                <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", meta.dot)} />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[13px] font-medium", meta.text)}>{meta.label}</p>
                  <p className="text-[13px] leading-relaxed text-muted">
                    {subjects.length
                      ? subjects.map((s) => s.subject).join(", ")
                      : "Nothing here this month."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Divider className="my-4" />
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-muted">
            <span className="font-medium text-ink tnum">{gapsClosed}</span> gaps sorted out this
            month
          </span>
          <span className="inline-flex items-center gap-1 text-mastered">
            <ArrowUpRight size={13} /> heading the right way
          </span>
        </div>
      </Card>

      <Eyebrow>PATH &amp; Mojo</Eyebrow>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <Badge tone="saffron">
            <span className="text-[13px] leading-none">{pathDefs.artist.glyph}</span>{" "}
            {pathDefs.artist.name} path
          </Badge>
          <span className="text-[11px] font-medium text-saffron-deep">
            Interest {artist.interestSignal.toLowerCase()}
          </span>
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink">
          A style of her own is starting to show in her Madhubani work — and she came back to
          it on her own to make it better.
        </p>
        <div className="mt-3.5 rounded-xl bg-sand/70 p-3">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-faint">
            <Quote size={12} /> Her mentor noticed
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{artist.mentorFeedback}</p>
        </div>
      </Card>

      <Eyebrow>What happens next</Eyebrow>
      <Card className="p-5">
        <div className="space-y-4">
          <NextRow label="At school" body={whatHappensNext.school} />
          <NextRow label="At home" body={whatHappensNext.parent} accent />
        </div>

        <Divider className="my-4" />

        {checkIn && (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-saffron-soft text-saffron-deep">
              <CalendarDays size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink">
                Next chat with her coach
                <span className="font-normal text-faint"> · {coach.name}</span>
              </p>
              <p className="text-[12px] text-muted">
                {relativeDays(checkIn.next)} · {formatDate(checkIn.next)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand text-muted">
            <Sprout size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-ink">{event.title}</p>
            <p className="text-[12px] text-muted">
              {relativeDays(event.date)} · {formatDate(event.date)}
            </p>
          </div>
        </div>
      </Card>
    </Screen>
  );
}

function NextRow({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div>
      <SectionLabel className={accent ? "text-saffron-deep" : undefined}>{label}</SectionLabel>
      <p className="mt-1 text-[13px] leading-relaxed text-ink">{body}</p>
    </div>
  );
}

/* ---------------- Academics — bridging the marks model ---------------- */
function SubjectCard({ s }: { s: SubjectBridge }) {
  const meta = FLOOR_META[s.floor];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-sand text-[16px] text-muted">
            {s.glyph}
          </span>
          <span className="text-[15px] font-medium text-ink">{s.subject}</span>
        </span>
        <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", meta.text)}>
          <span className={cn("size-2 rounded-full", meta.dot)} />
          {meta.label}
        </span>
      </div>

      {/* the bridge readout — mastery, movement, position, gaps */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-[28px] leading-none text-ink tnum">{s.mastery}%</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-faint">how much she&rsquo;s got</p>
        </div>
        <div className="text-right">
          <Delta value={s.change} />
          <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-faint">this month</p>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-[12px]">
        <div className="rounded-lg bg-sand/60 px-3 py-2">
          <span className="text-faint">Gaps sorted</span>
          <p className="mt-0.5 font-medium text-mastered tnum">{s.gapsClosed}</p>
        </div>
        <div className="rounded-lg bg-sand/60 px-3 py-2">
          <span className="text-faint">Working on</span>
          <p className="mt-0.5 font-medium text-ink tnum">{s.gapsInProgress}</p>
        </div>
      </div>

      <p className="mt-3.5 text-[12px] leading-relaxed text-faint">{s.position}.</p>

      {/* ALWAYS the plain language — what she can do, what's next */}
      <Divider className="my-4" />
      <div className="space-y-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
            <Check size={12} className="text-mastered" /> What she can do
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink">{s.canDo}</p>
        </div>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-faint">
            <ArrowRight size={12} className="text-saffron-deep" /> What she&rsquo;s learning next
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink">{s.next}</p>
        </div>
      </div>
    </Card>
  );
}

function AcademicsTab() {
  return (
    <Screen>
      <ChildHeader />

      <h2 className="font-display text-[22px] leading-snug text-ink">
        What she&rsquo;s learning — not just one number.
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        Each subject shows where she is, how she&rsquo;s moved, and — always — what she can do and what
        she&rsquo;s learning next.
      </p>

      <div className="mt-5 space-y-3.5">
        {subjectBridges.map((s) => (
          <SubjectCard key={s.subject} s={s} />
        ))}
      </div>

      <Eyebrow>The one gap we&rsquo;re working on, openly</Eyebrow>
      <Card className="border-gap/20 bg-gap-soft/40 p-5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-gap" />
          <p className="text-[14px] font-medium text-ink">{namedGap.title}</p>
          <Badge tone="neutral" className="ml-auto">
            {namedGap.subject}
          </Badge>
        </div>

        <div className="mt-4 space-y-3.5">
          <GapRow label="Why it matters" body={namedGap.whyItMatters} />
          <GapRow label="What the school is doing" body={namedGap.whatSchoolIsDoing} />
          <GapRow label="What&rsquo;s already better" body={namedGap.whatImproved} tone="mastered" />
          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3.5">
            <CalendarDays size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
            <p className="text-[13px] leading-relaxed text-ink">{namedGap.whenReviewed}</p>
          </div>
        </div>
      </Card>

      <Eyebrow>Her maths map</Eyebrow>
      <Card className="p-5 pb-4">
        <CompetencyMap studentId={STUDENT_ID} />
        <p className="mt-4 text-[12px] leading-relaxed text-faint">
          The circled step is the one she&rsquo;s working on. Everything after it is waiting on that
          one step — once it clicks, the rest opens up.
        </p>
      </Card>
    </Screen>
  );
}

function GapRow({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone?: "mastered";
}) {
  return (
    <div>
      <SectionLabel className={tone === "mastered" ? "text-mastered" : undefined}>
        {label}
      </SectionLabel>
      <p className="mt-1 text-[13px] leading-relaxed text-ink">{body}</p>
    </div>
  );
}

/* ---------------- PATHS — Mojo as evidence, never a score ---------------- */
function ArcIndicator({ stage }: { stage: string }) {
  const activeIndex = PATH_ARC.findIndex((a) => a.stage === stage);
  return (
    <div className="flex items-center">
      {PATH_ARC.map((a, i) => {
        const reached = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <React.Fragment key={a.stage}>
            <div className="flex flex-col items-center">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: reached ? ACCENT : "#ECEAE3" }}
              />
              <span
                className={cn(
                  "mt-1.5 text-[10px]",
                  isCurrent
                    ? "font-semibold text-saffron-deep"
                    : reached
                      ? "font-medium text-muted"
                      : "text-faint",
                )}
              >
                {a.label}
              </span>
            </div>
            {i < PATH_ARC.length - 1 && (
              <span
                className="mb-4 h-0.5 flex-1 rounded-full"
                style={{ backgroundColor: i < activeIndex ? ACCENT : "#ECEAE3" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PathsTab() {
  const s = studentById(STUDENT_ID)!;
  const artifacts = riyaArtifacts();

  return (
    <Screen>
      <ChildHeader />

      <h2 className="font-display text-[22px] leading-snug text-ink">
        Mojo, shown through her work.
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        Not a score — the things she&rsquo;s made, what she said about them, and what her
        mentors saw. At this age she tries lots of things; two are starting to catch her interest.
      </p>

      <div className="mt-5 space-y-3.5">
        {s.paths.map((enrolment) => {
          const def = pathDefs[enrolment.path];
          const ev = pathEvidence[enrolment.path];
          const artifact = artifacts.find((a) => a.path === enrolment.path);
          const primary = enrolment.focus === "primary";
          if (!ev) return null;
          return (
            <Card
              key={enrolment.path}
              className={primary ? "border-saffron/25 p-5" : "bg-sand/40 p-5"}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-2.5">
                  <span
                    className="grid size-10 place-items-center rounded-xl text-[18px]"
                    style={{
                      backgroundColor: primary ? "#F8EFE0" : "#F4F2EC",
                      color: primary ? "#A8651D" : "#9C988E",
                    }}
                  >
                    {def.glyph}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{def.name}</span>
                    <span className="block text-[12px] text-faint">{def.verb}</span>
                  </span>
                </span>
                <Badge tone={ev.interestSignal === "Rising" ? "saffron" : "neutral"}>
                  Interest {ev.interestSignal.toLowerCase()}
                </Badge>
              </div>

              {/* stage movement + standard over time */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px]">
                  <SectionLabel>How good her work is</SectionLabel>
                  <span className="font-medium text-ink tnum">{enrolment.standard}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-saffron-soft">
                  <div
                    className="h-full rounded-full bg-saffron"
                    style={{ width: `${enrolment.standard}%` }}
                  />
                </div>
                <div className="mt-3.5 border-t border-line pt-3">
                  <ArcIndicator stage={enrolment.stage} />
                </div>
              </div>

              {/* the evidence — concrete things she did */}
              <div className="mt-4">
                <SectionLabel>What she did</SectionLabel>
                <ul className="mt-1.5 space-y-1.5">
                  {ev.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
                      <Check size={14} className="mt-0.5 shrink-0 text-saffron-deep" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>

              {artifact && (
                <div className="mt-3.5 flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-saffron-soft text-saffron-deep">
                    <Sprout size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink">{artifact.title}</p>
                    <p className="text-[11px] text-faint">
                      {artifact.group} · {formatDate(artifact.date)}
                    </p>
                  </div>
                  <span className="shrink-0 text-[12px] font-medium text-saffron-deep tnum">
                    {artifact.standardRating}/5
                  </span>
                </div>
              )}

              {/* reflection + mentor feedback */}
              <div className="mt-3.5 space-y-2.5">
                <div className="rounded-xl bg-sand/70 p-3">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-faint">
                    <MessageSquare size={12} /> Riya&rsquo;s own words
                  </p>
                  <p className="mt-1 text-[13px] italic leading-relaxed text-muted">
                    &ldquo;{ev.reflection}&rdquo;
                  </p>
                </div>
                <div className="rounded-xl bg-sand/70 p-3">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-faint">
                    <Quote size={12} /> {ev.mentor}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{ev.mentorFeedback}</p>
                </div>
              </div>

              {/* what she wants to try next */}
              <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-saffron-soft/50 p-3">
                <ArrowRight size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
                <p className="text-[13px] leading-relaxed text-ink">
                  <span className="font-medium">What she&rsquo;ll try next — </span>
                  {ev.nextChallenge}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

/* ---------------- Coach — the relationship & the shared plan ---------------- */
function CoachTab() {
  const checkIn = riyaCheckIn();
  const note = riyaCoachNote();
  const coach = educatorById("edu-rohan")!;

  return (
    <Screen>
      <ChildHeader />

      <Eyebrow>Your link to her coach</Eyebrow>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name={coach.name} size={40} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium text-ink">{coach.name}</p>
            <p className="text-[12px] text-faint">{coach.title}</p>
          </div>
        </div>
        {checkIn && (
          <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-saffron-soft/60 p-3">
            <CalendarDays size={15} className="shrink-0 text-saffron-deep" />
            <p className="text-[13px] text-ink">
              Next chat{" "}
              <span className="font-medium">{relativeDays(checkIn.next)}</span>
              <span className="text-muted"> · {formatDate(checkIn.next)}</span>
            </p>
          </div>
        )}

        {/* secure-message affordance */}
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:bg-sand"
        >
          <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-ink">
            <span className="grid size-8 place-items-center rounded-lg bg-saffron-soft text-saffron-deep">
              <MessageSquare size={15} />
            </span>
            Send {coach.name.split(" ")[0]} a private message
          </span>
          <ArrowRight size={16} className="text-faint" />
        </button>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-faint">
          <ShieldCheck size={12} className="text-mastered" /> Just between you and her coach
        </p>
      </Card>

      {checkIn && (
        <>
          <Eyebrow>What this chat is for</Eyebrow>
          <Card className="p-5">
            <p className="text-[14px] leading-relaxed text-ink">{checkIn.prompt}</p>
          </Card>
        </>
      )}

      {note && (
        <>
          <Eyebrow>From your last chat</Eyebrow>
          <Card className="p-5">
            <p className="text-[11px] text-faint">{formatDate(note.date)}</p>

            {/* the SHARED plan only — split by who owns what */}
            <div className="mt-3 rounded-xl border border-line bg-canvas p-3.5">
              <SectionLabel>The plan you agreed on</SectionLabel>
              <div className="mt-2.5 space-y-2.5">
                <PlanLine owner="School" body={sharedPlan.school} />
                <PlanLine owner="Riya" body={sharedPlan.student} />
                <PlanLine owner="At home" body={sharedPlan.parent} accent />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="rounded-xl bg-sand/70 p-3">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-faint">
                  <MessageSquare size={12} /> Riya said
                </p>
                <p className="mt-1 text-[13px] italic leading-relaxed text-muted">
                  &ldquo;{note.studentVoice}&rdquo;
                </p>
              </div>
              <div className="rounded-xl bg-sand/70 p-3">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-medium text-faint">
                  <MessageSquare size={12} /> You said
                </p>
                <p className="mt-1 text-[13px] italic leading-relaxed text-muted">
                  &ldquo;{note.parentVoice}&rdquo;
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      <Eyebrow>What&rsquo;s gone well since then</Eyebrow>
      <Card className="p-5">
        <div className="space-y-3">
          {progressSinceCheckIn.map((p, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mastered-soft text-mastered">
                <Check size={12} />
              </span>
              <p className="text-[13px] leading-relaxed text-ink">
                <span className="font-medium">{p.label} — </span>
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Screen>
  );
}

function PlanLine({
  owner,
  body,
  accent,
}: {
  owner: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
          accent ? "bg-saffron-soft text-saffron-deep" : "bg-sand text-muted",
        )}
      >
        {owner}
      </span>
      <p className="text-[13px] leading-relaxed text-ink">{body}</p>
    </div>
  );
}

/* ---------------- Reports — the calm monthly archive ---------------- */
function ReportsTab() {
  const growth = riyaGrowth();

  return (
    <Screen>
      <ChildHeader />

      <h2 className="font-display text-[22px] leading-snug text-ink">
        Her months, told honestly.
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        A simple summary each month, with one thing worth doing at home. What she can do, growing
        over time — never just a single mark.
      </p>

      <Card className="mt-4 p-5">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Skills she&rsquo;s got for keeps</SectionLabel>
          <span className="font-display text-2xl text-ink tnum">
            {growth[growth.length - 1].value}
          </span>
        </div>
        <div className="mt-3">
          <TrendLine data={growth} color={ACCENT} format={(v) => `${v}`} />
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-faint">
          Skills she now has for good — the number that really adds up over time. It&rsquo;s levelled
          off a little this month while she works on the fractions step; it&rsquo;ll climb again once
          that clicks.
        </p>
      </Card>

      <Eyebrow>Month-by-month</Eyebrow>
      <div className="space-y-3.5">
        {monthlySummaries.map((m, i) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-[16px] leading-tight text-ink">{m.month}</p>
                <p className="text-[11px] text-faint">{m.range}</p>
              </div>
              <div className="flex items-center gap-2">
                {i === 0 && <Badge tone="saffron">Latest</Badge>}
                <button
                  type="button"
                  aria-label={`Download ${m.month} summary`}
                  className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-sand hover:text-ink"
                >
                  <Download size={15} />
                </button>
              </div>
            </div>

            <p className="mt-3.5 text-[13px] leading-relaxed text-ink">{m.summary}</p>

            {m.highlights.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {m.highlights.map((h, hi) => (
                  <span
                    key={hi}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sand/70 px-2.5 py-1 text-[11px] text-muted"
                  >
                    <span className="font-medium text-ink">{h.label}</span>
                    {h.detail}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-saffron-soft/55 p-3.5">
              <Sprout size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-saffron-deep">
                  One thing to try at home
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink">{m.atHome}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

export default function ParentApp() {
  const [active, setActive] = React.useState("home");
  return (
    <DeviceFrame tabs={TABS} active={active} onTab={setActive} accent={ACCENT} title="Parent">
      {active === "home" && <HomeTab />}
      {active === "academics" && <AcademicsTab />}
      {active === "paths" && <PathsTab />}
      {active === "coach" && <CoachTab />}
      {active === "reports" && <ReportsTab />}
    </DeviceFrame>
  );
}
