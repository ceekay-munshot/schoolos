import Link from "next/link";
import {
  ArrowRight,
  Flag,
  CalendarClock,
  Sparkle,
  Drama,
  Layers,
  MessageSquare,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { checkInSchedule } from "@/data/coach";
import { studentById } from "@/data/students";
import { caseReasonsFor, type CaseReasonKind } from "@/data/coach-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";
import { CheckinGantt } from "@/components/viz/CheckinGantt";
import { RetentionCurves } from "@/components/viz/RetentionCurves";

/* Each gentle reason has a quiet icon. None of these are alarming — they name
   what this round's conversation is for, not a verdict on the child. */
const REASON_ICON: Record<CaseReasonKind, LucideIcon> = {
  "check-in-due": CalendarClock,
  "new-pattern": Sparkle,
  "path-dropping": Drama,
  "unresolved-foundation": Layers,
  "parent-input": MessageSquare,
  "plan-review": ClipboardCheck,
};

export default function CoachCaseload() {
  const sorted = [...checkInSchedule].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return a.next.localeCompare(b.next);
  });
  const highCount = checkInSchedule.filter((c) => c.priority === "high").length;

  return (
    <AppShell persona="coach" eyebrow="Rohan D'Souza · Executive Coach" title="Caseload">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Forty students, each a whole child across school work and PATH. The system puts the
        picture together; your time goes to understanding each child and building the relationship.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Your students" value="40" foot="students, 1 to 40" />
        <MetricTile label="Next two weeks" value={checkInSchedule.length} accent="#37357A" foot="check-ins planned" />
        <MetricTile label="Needs attention" value={highCount} accent="#B25B43" foot="next two weeks, gently sorted" />
        <MetricTile label="Notes saved" value="92%" accent="#5E7C6A" foot="put back in as signal" />
      </div>

      <Section title="Check-in rhythm" description="Each row is a student. Blocks show check-ins. A gap wider than four weeks lights up — it means someone may have slipped through.">
        <Card className="overflow-x-auto p-5">
          <CheckinGantt />
        </Card>
      </Section>

      <Section
        title="Next two weeks"
        description="A gentle order — who this round's check-in matters most for, and why."
      >
        <div className="space-y-3">
          {sorted.map((c) => {
            const s = studentById(c.studentId)!;
            const why = caseReasonsFor(c.studentId);
            return (
              <Link key={c.studentId} href={`/coach/${c.studentId}`}>
                <Card hover className="flex items-center gap-4 p-4">
                  <Avatar name={s.name} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-medium text-ink">{s.name}</p>
                      <span className="text-[12px] text-faint">{s.grade}</span>
                      {c.priority === "high" && (
                        <Badge tone="gap">
                          <Flag size={11} /> Needs attention
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-muted">{c.prompt}</p>
                    {why.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {why.map((r) => {
                          const Icon = REASON_ICON[r.kind];
                          return (
                            <span
                              key={r.kind}
                              className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted"
                            >
                              <Icon size={11} className="text-faint" />
                              {r.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-[12px] font-medium text-ink">Check-in {relativeDays(c.next)}</p>
                    <p className="text-[11px] text-faint">last {relativeDays(c.last)}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-faint" />
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>
      <Section title="Skills at risk of fading" description="Once a child masters something, they can still forget it. These curves show which mastered skills are at the edge of the safe zone.">
        <Card className="p-5">
          <RetentionCurves />
        </Card>
      </Section>
    </AppShell>
  );
}
