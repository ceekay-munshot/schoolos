"use client";

import * as React from "react";
import { Home, TrendingUp, Sprout, HeartHandshake, CalendarDays, Sparkles, Quote, MessageSquare } from "lucide-react";
import { DeviceFrame, Screen, type MobileTab } from "@/components/shell/DeviceFrame";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { TrendLine } from "@/components/viz/charts";
import { CompetencyMap } from "@/components/viz/CompetencyMap";
import {
  studentById,
  growthFor,
  insightsForStudent,
  coachNotesForStudent,
  checkInFor,
  pathList,
  educatorById,
} from "@/data";
import { relativeDays } from "@/lib/utils";

const ACCENT = "#C8802E";
const STUDENT_ID = "stu-riya";

const TABS: MobileTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "mojo", label: "Mojo", icon: Sprout },
  { id: "coach", label: "Coach", icon: HeartHandshake },
];

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

/* ---------------- Home — "Where Riya is" ---------------- */
function HomeTab() {
  const insight = insightsForStudent(STUDENT_ID).find(
    (i) => i.status === "confirmed" && i.evidence.includes("Artist"),
  );
  const checkIn = checkInFor(STUDENT_ID);
  const coach = educatorById("edu-rohan")!;

  return (
    <Screen>
      <ChildHeader />

      <Eyebrow>Where Riya is</Eyebrow>
      <Card className="p-5">
        <p className="text-[15px] leading-relaxed text-ink">
          Secure on what a fraction <em>means</em> — she reads{" "}
          <span className="whitespace-nowrap">three-quarters</span> as three of four equal
          parts, not &ldquo;three and four.&rdquo; Now working on{" "}
          <span className="font-medium text-saffron-deep">equivalent fractions</span> — the
          one step that unlocks adding them.
        </p>
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-saffron-soft/60 p-3.5">
          <Sparkles size={15} className="mt-0.5 shrink-0 text-saffron-deep" />
          <p className="text-[13px] leading-relaxed text-muted">
            She isn&rsquo;t behind — this is one specific, named thing, and it&rsquo;s already
            being worked. Her teacher is pulling a small group on it this week.
          </p>
        </div>
      </Card>

      {insight && (
        <>
          <Eyebrow>This fortnight we noticed</Eyebrow>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <Badge tone="saffron">
                <Sprout size={12} /> Artist path
              </Badge>
              <span className="text-[11px] text-faint">{relativeDays(insight.date)}</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink">{insight.text}</p>
            <p className="mt-2 text-[12px] text-faint">{insight.evidence}.</p>
          </Card>
        </>
      )}

      {checkIn && (
        <>
          <Eyebrow>Next check-in</Eyebrow>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-saffron-soft text-saffron-deep">
                <CalendarDays size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-ink">
                  with {coach.name}
                  <span className="font-normal text-faint"> · {coach.title}</span>
                </p>
                <p className="text-[12px] text-muted">
                  {relativeDays(checkIn.next)} ·{" "}
                  {new Date(checkIn.next).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </Screen>
  );
}

/* ---------------- Progress — month on month ---------------- */
function ProgressTab() {
  const growth = growthFor(STUDENT_ID);
  const note = coachNotesForStudent(STUDENT_ID)[0];

  return (
    <Screen>
      <ChildHeader />

      <h2 className="font-display text-[22px] leading-snug text-ink">
        Growth over time, not a single mark.
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        Capabilities she now holds for keeps — the count that actually compounds.
      </p>

      <Card className="mt-4 p-5">
        <div className="flex items-baseline justify-between">
          <SectionLabel>Secure competencies</SectionLabel>
          <span className="font-display text-2xl text-ink tnum">
            {growth[growth.length - 1].value}
          </span>
        </div>
        <div className="mt-3">
          <TrendLine data={growth} color={ACCENT} format={(v) => `${v}`} />
        </div>
      </Card>

      <Eyebrow>What we&rsquo;re working on, openly</Eyebrow>
      <Card className="border-gap/20 bg-gap-soft/40 p-5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-gap" />
          <p className="text-[14px] font-medium text-ink">Equivalent fractions</p>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          The honest one. Her adding has been wobbling — but the cause isn&rsquo;t addition,
          it&rsquo;s this step underneath it. We&rsquo;d rather show you the real gap than a
          wall of green.
        </p>
        {note && (
          <div className="mt-4 rounded-xl border border-line bg-surface p-3.5">
            <SectionLabel>The plan</SectionLabel>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{note.plan}</p>
          </div>
        )}
      </Card>

      <Eyebrow>Her maths map</Eyebrow>
      <Card className="p-5 pb-4">
        <CompetencyMap studentId={STUDENT_ID} />
        <p className="mt-4 text-[12px] leading-relaxed text-faint">
          The ringed step is where the work is. Everything after it waits on that one
          unlock — repair it, and the rest opens up.
        </p>
      </Card>
    </Screen>
  );
}

/* ---------------- Mojo — the PATH taster menu ---------------- */
function MojoTab() {
  const s = studentById(STUDENT_ID)!;
  const enrolmentFor = (key: string) => s.paths.find((p) => p.path === key);

  return (
    <Screen>
      <ChildHeader />

      <h2 className="font-display text-[22px] leading-snug text-ink">
        From the taster menu, toward her thing.
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        In elementary she samples all six. Two are starting to pull — the rest she&rsquo;s
        still tasting.
      </p>

      <div className="mt-4 space-y-2.5">
        {pathList.map((p) => {
          const e = enrolmentFor(p.key);
          const enrolled = !!e && e.focus !== "sampling";
          return (
            <Card
              key={p.key}
              className={enrolled ? "border-saffron/25 p-4" : "bg-sand/40 p-4"}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-[18px]"
                  style={{
                    backgroundColor: enrolled ? "#F8EFE0" : "#F4F2EC",
                    color: enrolled ? "#A8651D" : "#9C988E",
                  }}
                >
                  {p.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={
                        enrolled
                          ? "text-[15px] font-medium text-ink"
                          : "text-[15px] font-medium text-muted"
                      }
                    >
                      {p.name}
                    </p>
                    {enrolled ? (
                      <Badge tone="saffron" className="capitalize">
                        {e!.focus}
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-faint">sampling</span>
                    )}
                  </div>
                  <p className="text-[12px] text-faint">{p.verb}</p>

                  {enrolled && e && (
                    <>
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-saffron-soft">
                        <div
                          className="h-full rounded-full bg-saffron"
                          style={{ width: `${e.standard}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[12px] leading-relaxed text-muted">
                        {e.headline}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

/* ---------------- Coach — connection ---------------- */
function CoachTab() {
  const checkIn = checkInFor(STUDENT_ID);
  const note = coachNotesForStudent(STUDENT_ID)[0];
  const coach = educatorById("edu-rohan")!;

  return (
    <Screen>
      <ChildHeader />

      <Eyebrow>Your line to the coach</Eyebrow>
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
              Next check-in{" "}
              <span className="font-medium">{relativeDays(checkIn.next)}</span>
              <span className="text-muted">
                {" "}
                ·{" "}
                {new Date(checkIn.next).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </p>
          </div>
        )}
        {checkIn && (
          <p className="mt-3 text-[13px] leading-relaxed text-muted">{checkIn.prompt}</p>
        )}
      </Card>

      {note && (
        <>
          <Eyebrow>From the last conversation</Eyebrow>
          <Card className="p-5">
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
              <Quote size={15} className="mt-0.5 shrink-0 text-faint" />
              {note.context}
            </p>

            <div className="mt-4 rounded-xl border border-line bg-canvas p-3.5">
              <SectionLabel>The plan</SectionLabel>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{note.plan}</p>
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
    </Screen>
  );
}

export default function ParentApp() {
  const [active, setActive] = React.useState("home");
  return (
    <DeviceFrame tabs={TABS} active={active} onTab={setActive} accent={ACCENT} title="Parent">
      {active === "home" && <HomeTab />}
      {active === "progress" && <ProgressTab />}
      {active === "mojo" && <MojoTab />}
      {active === "coach" && <CoachTab />}
    </DeviceFrame>
  );
}
