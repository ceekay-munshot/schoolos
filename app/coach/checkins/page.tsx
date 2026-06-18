import Link from "next/link";
import { ListChecks, PenLine, Target, ArrowRight, MessageSquare } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { checkInSchedule, checkInFor, coachNotesForStudent } from "@/data/coach";
import { insightsForStudent } from "@/data/insights";
import { studentById } from "@/data/students";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

const STAGES = [
  { id: "prep", label: "Prep", icon: ListChecks, hint: "What to raise" },
  { id: "capture", label: "Capture", icon: PenLine, hint: "Notes from the hour" },
  { id: "plan", label: "Plan", icon: Target, hint: "Writes back into the system" },
];

export default function CheckIns() {
  const focusId = "stu-riya";
  const s = studentById(focusId)!;
  const checkIn = checkInFor(focusId)!;
  const note = coachNotesForStudent(focusId)[0];
  const prep = insightsForStudent(focusId).filter((i) => i.status === "confirmed");

  return (
    <AppShell persona="coach" eyebrow="Every 15 days · student + parents" title="Check-in workflow">
      {/* featured check-in */}
      <Card className="mb-6 p-5">
        <div className="flex items-center gap-4">
          <Avatar name={s.name} size={48} />
          <div className="flex-1">
            <p className="font-display text-xl text-ink">{s.name}</p>
            <p className="text-[13px] text-muted">{s.grade} · {s.house} House</p>
          </div>
          <Badge tone="indigo">Check-in {relativeDays(checkIn.next)}</Badge>
        </div>
      </Card>

      {/* the three-stage workflow */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          return (
            <Card key={stage.id} className="flex flex-col">
              <div className="flex items-center gap-2.5 border-b border-line p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-indigo-soft text-indigo">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-[14px] font-medium text-ink">{stage.label}</p>
                  <p className="text-[11px] text-faint">{stage.hint}</p>
                </div>
              </div>
              <div className="flex-1 p-4">
                {stage.id === "prep" && (
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
                  </ul>
                )}
                {stage.id === "capture" && (
                  <div className="space-y-3">
                    <p className="rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-ink">
                      {note.context}
                    </p>
                    <textarea
                      defaultValue={`${note.studentVoice}`}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[13px] text-ink outline-none focus:border-indigo/40"
                    />
                    <div className="space-y-2 text-[12px]">
                      <p className="rounded-lg bg-canvas p-2.5 text-muted">
                        <MessageSquare size={12} className="mr-1 inline text-faint" /> Parent: &ldquo;{note.parentVoice}&rdquo;
                      </p>
                    </div>
                  </div>
                )}
                {stage.id === "plan" && (
                  <div className="space-y-3">
                    <p className="rounded-xl border border-mastered/20 bg-mastered-soft/50 p-3 text-[13px] leading-relaxed text-ink">
                      {note.plan}
                    </p>
                    <p className="text-[12px] text-faint">
                      This plan re-enters the system as a first-class signal — it shapes what
                      {" "}{s.name.split(" ")[0]} gets next, and the teacher sees it too.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
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
