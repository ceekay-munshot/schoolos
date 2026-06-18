import Link from "next/link";
import {
  ListChecks,
  MessagesSquare,
  Target,
  Share2,
  CalendarCheck,
  ArrowRight,
  MessageSquare,
  Check,
  Eye,
  EyeOff,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { checkInSchedule, checkInFor, coachNotesForStudent } from "@/data/coach";
import { insightsForStudent } from "@/data/insights";
import { studentById } from "@/data/students";
import {
  planFor,
  followUpsForStudent,
  OWNER_LABEL,
  IMPACT_LABEL,
  type Owner,
  type Impact,
} from "@/data/coach-extra";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

const STEPS: { id: string; n: number; label: string; icon: LucideIcon; hint: string }[] = [
  { id: "prepare", n: 1, label: "Prepare", icon: ListChecks, hint: "What the system assembled to raise" },
  { id: "conversation", n: 2, label: "Conversation", icon: MessagesSquare, hint: "What student and parents said" },
  { id: "plan", n: 3, label: "Simple plan", icon: Target, hint: "2–3 commitments, each with an owner" },
  { id: "share", n: 4, label: "Share", icon: Share2, hint: "Who sees what" },
  { id: "follow-up", n: 5, label: "Follow up", icon: CalendarCheck, hint: "Did it change anything?" },
];

const OWNER_TONE: Record<Owner, "indigo" | "saffron" | "mastered"> = {
  school: "indigo",
  student: "saffron",
  parent: "mastered",
};

const IMPACT_STYLE: Record<Impact, { tone: "mastered" | "saffron" | "neutral" }> = {
  changed: { tone: "mastered" },
  partial: { tone: "saffron" },
  "not-yet": { tone: "neutral" },
};

/* What each audience sees out of a check-in — the Share step made concrete. */
const SHARE_AUDIENCES: { who: string; icon: LucideIcon; sees: string; tone: string }[] = [
  {
    who: "Student",
    icon: Eye,
    sees: "“Your fractions are clicking again — keep the fraction wall going, and bring one art piece you're proud of.”",
    tone: "bg-saffron-soft text-saffron-deep",
  },
  {
    who: "Parent",
    icon: Eye,
    sees: "The named gap and the plan to fix it; the rising Artist work; the request to keep maths low-pressure at home.",
    tone: "bg-mastered-soft text-mastered",
  },
  {
    who: "Teacher",
    icon: Eye,
    sees: "The small-group commitment and the context note, so the room and the plan stay in step.",
    tone: "bg-indigo-soft text-indigo",
  },
  {
    who: "Stays private",
    icon: Lock,
    sees: "The detail of the mother's night-rotation schedule — held as coach context, never surfaced.",
    tone: "bg-sand text-muted",
  },
];

function StepHead({ step }: { step: (typeof STEPS)[number] }) {
  const Icon = step.icon;
  return (
    <div className="flex items-center gap-3 border-b border-line p-4">
      <span className="grid size-9 place-items-center rounded-xl bg-indigo-soft font-display text-[15px] text-indigo">
        {step.n}
      </span>
      <div className="flex-1">
        <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
          <Icon size={14} className="text-indigo" /> {step.label}
        </p>
        <p className="text-[11px] text-faint">{step.hint}</p>
      </div>
    </div>
  );
}

export default function CheckIns() {
  const focusId = "stu-riya";
  const s = studentById(focusId)!;
  const checkIn = checkInFor(focusId)!;
  const note = coachNotesForStudent(focusId)[0];
  const prep = insightsForStudent(focusId).filter((i) => i.status === "confirmed");
  const plan = planFor(focusId)!;
  const follows = followUpsForStudent(focusId);

  return (
    <AppShell persona="coach" eyebrow="Every 15 days · student + parents" title="Check-in workflow">
      {/* featured check-in */}
      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={s.name} size={48} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl text-ink">{s.name}</p>
            <p className="text-[13px] text-muted">
              {s.grade} · {s.house} House · {s.guardian.relation} {s.guardian.name}
            </p>
          </div>
          <Badge tone="indigo">Check-in {relativeDays(checkIn.next)}</Badge>
        </div>
      </Card>

      {/* progress rail across the five steps */}
      <div className="mb-7 flex items-center gap-2 overflow-x-auto pb-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted">
                <Icon size={13} className="text-indigo" /> {step.label}
              </span>
              {i < STEPS.length - 1 && <ArrowRight size={13} className="text-faint" />}
            </div>
          );
        })}
      </div>

      {/* the five-step workflow */}
      <div className="space-y-4">
        {/* steps 1 + 2 side by side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 1 — Prepare */}
          <Card className="flex flex-col">
            <StepHead step={STEPS[0]} />
            <div className="flex-1 p-4">
              <SectionLabel className="mb-2.5">Assembled for this hour</SectionLabel>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-[13px] text-ink">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-indigo" />
                  {checkIn.prompt}
                </li>
                {prep.map((i) => (
                  <li key={i.id} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mastered" />
                    {i.text}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-[13px] text-muted">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-saffron" />
                  Carry forward last fortnight’s plan and check what actually moved.
                </li>
              </ul>
            </div>
          </Card>

          {/* 2 — Conversation */}
          <Card className="flex flex-col">
            <StepHead step={STEPS[1]} />
            <div className="flex-1 space-y-3 p-4">
              <p className="rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-ink">{note.context}</p>
              <div className="space-y-2 text-[12.5px]">
                <p className="rounded-lg bg-canvas p-2.5 text-muted">
                  <MessageSquare size={12} className="mr-1 inline text-faint" /> Student: &ldquo;{note.studentVoice}&rdquo;
                </p>
                <p className="rounded-lg bg-canvas p-2.5 text-muted">
                  <MessageSquare size={12} className="mr-1 inline text-faint" /> Parent: &ldquo;{note.parentVoice}&rdquo;
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 3 — Simple plan */}
        <Card className="flex flex-col">
          <StepHead step={STEPS[2]} />
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-[12px] text-faint">
              <span>No more than three commitments. Each one is owned by someone.</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {plan.commitments.map((c, i) => (
                <div key={i} className="rounded-xl border border-line bg-canvas p-3.5">
                  <Badge tone={OWNER_TONE[c.owner]}>{OWNER_LABEL[c.owner]}</Badge>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink">{c.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-faint">
              This plan re-enters the system as a first-class signal — it shapes what{" "}
              {s.name.split(" ")[0]} gets next, and the teacher sees it too. Review set for{" "}
              {relativeDays(plan.reviewDate)}.
            </p>
          </div>
        </Card>

        {/* 4 — Share */}
        <Card className="flex flex-col">
          <StepHead step={STEPS[3]} />
          <div className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-faint">
              <span className="inline-flex items-center gap-1">
                <Eye size={12} /> shared deliberately
              </span>
              <span className="inline-flex items-center gap-1">
                <EyeOff size={12} /> held as private context
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SHARE_AUDIENCES.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.who} className="rounded-xl border border-line bg-canvas p-3.5">
                    <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                      <span className={`grid size-6 place-items-center rounded-lg ${a.tone}`}>
                        <Icon size={12} />
                      </span>
                      {a.who} sees
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{a.sees}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* 5 — Follow up */}
        <Card className="flex flex-col">
          <StepHead step={STEPS[4]} />
          <div className="p-4">
            <SectionLabel className="mb-2.5">Did the last plan change anything?</SectionLabel>
            <div className="space-y-2.5">
              {follows.map((f) => (
                <div key={f.id} className="flex items-start gap-3 rounded-xl bg-canvas p-3">
                  <span className="mt-0.5 shrink-0">
                    {f.impact === "changed" ? (
                      <span className="grid size-6 place-items-center rounded-full bg-mastered-soft text-mastered">
                        <Check size={13} />
                      </span>
                    ) : (
                      <span className="grid size-6 place-items-center rounded-full bg-sand text-faint">
                        <span className="size-1.5 rounded-full bg-current" />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-medium text-ink">{f.action}</p>
                      <Badge tone={OWNER_TONE[f.owner]}>{OWNER_LABEL[f.owner]}</Badge>
                      <Badge tone={IMPACT_STYLE[f.impact].tone}>{IMPACT_LABEL[f.impact]}</Badge>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">{f.read}</p>
                    <p className="mt-1 text-[11px] text-faint">review by {relativeDays(f.due)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/coach/follow-ups"
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-indigo hover:text-indigo-ink"
            >
              Open the follow-up tracker <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      </div>

      <Section className="mt-10" title="Upcoming check-ins">
        <Card>
          <div className="divide-y divide-line">
            {checkInSchedule
              .filter((c) => c.studentId !== focusId)
              .map((c) => {
                const st = studentById(c.studentId)!;
                return (
                  <Link
                    key={c.studentId}
                    href={`/coach/${c.studentId}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-sand"
                  >
                    <Avatar name={st.name} size={34} />
                    <span className="w-40 shrink-0 truncate text-[14px] font-medium text-ink">{st.name}</span>
                    <span className="hidden flex-1 truncate text-[13px] text-muted sm:block">{c.prompt}</span>
                    <span className="shrink-0 text-[12px] text-faint">{relativeDays(c.next)}</span>
                    <ArrowRight size={15} className="shrink-0 text-faint" />
                  </Link>
                );
              })}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
