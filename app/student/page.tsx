"use client";

import * as React from "react";
import {
  Sparkles,
  MessageCircle,
  Compass,
  Send,
  ShieldCheck,
  Flag,
  ArrowRight,
} from "lucide-react";
import { DeviceFrame, Screen, type MobileTab } from "@/components/shell/DeviceFrame";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import {
  studentById,
  tutorSessionsByStudent,
  pathDefs,
  nodeById,
} from "@/data";
import { pct } from "@/lib/utils";

const ACCENT = "#37357A";
const STUDENT_ID = "stu-mahira";

const TABS: MobileTab[] = [
  { id: "today", label: "Today", icon: Sparkles },
  { id: "tutor", label: "Tutor", icon: MessageCircle },
  { id: "paths", label: "Paths", icon: Compass },
];

const PATH_ARC: { stage: string; label: string }[] = [
  { stage: "sample", label: "Sample" },
  { stage: "specialise", label: "Specialise" },
  { stage: "master", label: "Master" },
];

/* ---------------- Today ---------------- */
function TodayTab() {
  const s = studentById(STUDENT_ID)!;
  const sessions = tutorSessionsByStudent(STUDENT_ID);
  const wordSession = sessions.find((t) => t.nodeId === "MATH.FRAC.WORD.04");
  const topic = wordSession ? wordSession.topic : "Fraction word problems";
  const scholar = s.paths.find((p) => p.path === "scholar");

  return (
    <Screen>
      <div className="mb-1 mt-1 flex items-center justify-between">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Today</p>
        <Badge tone="indigo">Class 6</Badge>
      </div>
      <h1 className="font-display text-[28px] leading-tight text-ink">Hi, Mahira</h1>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        Here&rsquo;s what you can sharpen on your own today.
      </p>

      <SectionLabel className="mb-2.5 mt-6">Today&rsquo;s focus</SectionLabel>
      <Card className="border-indigo/15 p-5">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-soft text-indigo">
            <Sparkles size={17} />
          </span>
          <p className="text-[15px] font-medium text-ink">{topic}</p>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          Just taught in class. The trick is turning the words into a picture before you
          touch any numbers &mdash; like &ldquo;three-quarters of 12 laddoos.&rdquo;
        </p>
      </Card>

      <SectionLabel className="mb-2.5 mt-6">Practise this</SectionLabel>
      <Card className="p-5">
        <p className="text-[14px] leading-relaxed text-ink">
          Try three more &ldquo;fraction-of-a-quantity&rdquo; problems, drawing the bar
          model each time.
        </p>
        <p className="mt-2 text-[12px] text-faint">
          Your tutor is warmed up and waiting on this exact topic.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo">
          Open the tutor <ArrowRight size={15} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="font-display text-[26px] leading-none text-ink tnum">
            {pct(s.independentWorkRatio)}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted">
            worked on your own this week
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-display text-[26px] leading-none text-ink tnum">6</p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted">
            day self-work streak
          </p>
        </Card>
      </div>

      {scholar && (
        <>
          <SectionLabel className="mb-2.5 mt-6">Your path</SectionLabel>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[15px] font-medium text-ink">
                <span className="text-saffron-deep">{pathDefs.scholar.glyph}</span>{" "}
                {pathDefs.scholar.name}
              </span>
              <Badge tone="saffron">Olympiad track</Badge>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{scholar.headline}</p>
          </Card>
        </>
      )}
    </Screen>
  );
}

/* ---------------- Tutor chat ---------------- */
type Turn = { from: "tutor" | "student"; text: React.ReactNode };

function Bubble({ from, children }: { from: "tutor" | "student"; children: React.ReactNode }) {
  const isStudent = from === "student";
  return (
    <div className={isStudent ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isStudent
            ? "max-w-[80%] rounded-2xl rounded-br-md bg-indigo-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-indigo-ink"
            : "max-w-[82%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-soft"
        }
      >
        {children}
      </div>
    </div>
  );
}

function TutorTab() {
  const sessions = tutorSessionsByStudent(STUDENT_ID);
  const flagged = sessions.find((t) => t.flaggedForTeacher);
  const topic = nodeById("MATH.FRAC.WORD.04")?.statement ?? "Fraction word problems";

  // The tutor thread for today's topic: the bar-model unlock, then the tutor
  // deferring the "does my ending land?" question to the teacher.
  const thread: Turn[] = [
    {
      from: "tutor",
      text: (
        <>
          Hey Mahira &mdash; we&rsquo;re on today&rsquo;s topic, <em>{topic.toLowerCase()}</em>.
          What problem are you stuck on?
        </>
      ),
    },
    {
      from: "student",
      text: "“Three-quarters of 12 laddoos are gone. How many is that?” I don't know what to do with the 3/4.",
    },
    {
      from: "tutor",
      text: "Don't reach for the numbers yet. Can you draw a bar for all 12 laddoos first?",
    },
    { from: "student", text: "Okay, one long bar = 12." },
    {
      from: "tutor",
      text: (
        <>
          Now the denominator, 4, tells you how many <em>equal</em> pieces to split that bar
          into. Split your bar of 12 into 4 equal parts. How many in each part?
        </>
      ),
    },
    { from: "student", text: "12 ÷ 4… 3 in each part." },
    {
      from: "tutor",
      text: (
        <>
          And the numerator, 3, says <em>take 3 of those parts</em>. So three-quarters of 12
          is&hellip;?
        </>
      ),
    },
    { from: "student", text: "3 + 3 + 3 = 9! Nine laddoos. Ohh, the picture made it obvious." },
    {
      from: "tutor",
      text: "That's the move every time: bar first, split by the bottom, take the top. Want another to lock it in?",
    },
    {
      from: "student",
      text: "In a sec. Different thing — is the ending of my story good? The one where the banyan tree finally speaks?",
    },
    {
      from: "tutor",
      text: (
        <>
          That&rsquo;s a question for Ms. Rao &mdash; whether your ending <em>lands</em> is her
          call, not mine. I&rsquo;ve flagged it for her so she sees it. I can help with the
          mechanical bits, but the heart of the story is hers to judge. Want to keep
          sharpening the word problems meanwhile?
        </>
      ),
    },
    { from: "student", text: "Yeah, give me a harder one." },
  ];

  return (
    <Screen className="pb-2">
      {/* guard-rail chip */}
      <div className="sticky top-0 z-10 -mx-5 mb-3 bg-canvas/85 px-5 pb-2 pt-1 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] leading-tight text-muted shadow-soft">
          <ShieldCheck size={13} className="shrink-0 text-mastered" />
          Stays on today&rsquo;s topic · your teacher owns the bigger questions
        </div>
      </div>

      <div className="space-y-2.5">
        {thread.map((t, i) => {
          const showFlag =
            flagged &&
            t.from === "tutor" &&
            typeof t.text !== "string" &&
            i === thread.length - 2;
          return (
            <React.Fragment key={i}>
              <Bubble from={t.from}>{t.text}</Bubble>
              {showFlag && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-practising-soft px-2.5 py-1.5 text-[11px] font-medium text-practising">
                    <Flag size={11} /> Flagged for Ms. Rao &mdash; never scored by the tutor
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* decorative, non-functional input bar */}
      <div className="sticky bottom-0 -mx-5 mt-4 border-t border-line bg-canvas/90 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center rounded-full border border-line bg-surface px-4 text-[13px] text-faint">
            Ask about today&rsquo;s topic&hellip;
          </div>
          <button
            type="button"
            aria-label="Send"
            className="grid size-11 shrink-0 place-items-center rounded-full text-white shadow-soft"
            style={{ backgroundColor: ACCENT }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </Screen>
  );
}

/* ---------------- Paths ---------------- */
function ArcIndicator({ stage }: { stage: string }) {
  const activeIndex = PATH_ARC.findIndex((a) => a.stage === stage);
  return (
    <div className="mt-3.5 flex items-center">
      {PATH_ARC.map((a, i) => {
        const reached = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <React.Fragment key={a.stage}>
            <div className="flex flex-col items-center">
              <span
                className="size-2.5 rounded-full ring-2 ring-offset-2 ring-offset-surface"
                style={{
                  backgroundColor: reached ? ACCENT : "#ECEAE3",
                  // @ts-expect-error -- CSS custom prop for ring colour
                  "--tw-ring-color": isCurrent ? "rgba(55,53,122,0.25)" : "transparent",
                }}
              />
              <span
                className={
                  isCurrent
                    ? "mt-1.5 text-[10px] font-semibold text-indigo"
                    : reached
                      ? "mt-1.5 text-[10px] font-medium text-muted"
                      : "mt-1.5 text-[10px] text-faint"
                }
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

  return (
    <Screen>
      <div className="mb-1 mt-1">
        <p className="text-[12px] uppercase tracking-[0.14em] text-faint">Your paths</p>
      </div>
      <h1 className="font-display text-[24px] leading-tight text-ink">
        Two forms you&rsquo;re going deep on.
      </h1>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        You&rsquo;ve moved past sampling. Both of these are in the{" "}
        <span className="font-medium text-indigo">Specialise</span> stage now &mdash; building
        real craft.
      </p>

      <div className="mt-5 space-y-3.5">
        {s.paths.map((e) => {
          const def = pathDefs[e.path];
          return (
            <Card key={e.path} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-2.5">
                  <span className="grid size-10 place-items-center rounded-xl bg-saffron-soft text-[18px] text-saffron-deep">
                    {def.glyph}
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{def.name}</span>
                    <span className="block text-[12px] text-faint">{def.verb}</span>
                  </span>
                </span>
                <Badge tone={e.focus === "primary" ? "indigo" : "neutral"} className="capitalize">
                  {e.focus}
                </Badge>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-muted">{e.headline}</p>

              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <SectionLabel>Standard of work</SectionLabel>
                  <span className="font-medium text-ink tnum">{e.standard}</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-saffron"
                    style={{ width: `${e.standard}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-line pt-1">
                <ArcIndicator stage={e.stage} />
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

export default function StudentApp() {
  const [active, setActive] = React.useState("today");
  return (
    <DeviceFrame tabs={TABS} active={active} onTab={setActive} accent={ACCENT} title="Student">
      {active === "today" && <TodayTab />}
      {active === "tutor" && <TutorTab />}
      {active === "paths" && <PathsTab />}
    </DeviceFrame>
  );
}
