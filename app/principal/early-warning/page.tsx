import { TriangleAlert, FileText, ArrowRight, UserCheck, CalendarClock } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { earlyWarning } from "@/data/metrics";
import { earlyWarningRows } from "@/data/principal-extra";
import { studentById } from "@/data/students";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { ConfidenceBadge } from "@/components/patterns/Signals";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, Divider } from "@/components/ui/primitives";
import { pct, relativeDays } from "@/lib/utils";
import { MasteryFlowBands } from "@/components/viz/MasteryFlowBands";

export default function EarlyWarning() {
  // The model surfaces the at-risk children; the operating detail (evidence,
  // owner, follow-up) is carried alongside and joined on the student.
  const base = earlyWarning();
  const riskById = new Map(base.map((r) => [r.student.id, r.risk]));

  const rows = earlyWarningRows
    .map((r) => ({ ...r, student: studentById(r.studentId)!, risk: riskById.get(r.studentId) ?? "watch" }))
    .filter((r) => r.student)
    .sort((a, b) => b.student.gapDebt - a.student.gapDebt);

  const elevated = rows.filter((r) => r.risk === "elevated").length;

  return (
    <AppShell persona="principal" eyebrow="Who might fall behind, or leave" title="Early warning">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Which children are building up missing basics that will show as failures — and as students
        leaving — months from now. Every warning comes with what we&apos;re seeing, how sure we are,
        the next step, who is on it, and when it gets checked. This is what a report card can never
        give you: time to act.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="On the watch-list" value={rows.length} accent="#C0913A" foot="children spotted early" />
        <MetricTile label="Needs attention soon" value={elevated} accent="#B25B43" foot="a missing basic breaking later work" />
        <MetricTile label="Has someone on it" value={rows.length} foot="every warning has a person" />
        <MetricTile label="Next check-in" value={relativeDays(rows.reduce((min, r) => (r.followUpDate < min ? r.followUpDate : min), rows[0].followUpDate))} foot="soonest one planned" />
      </div>

      <Section title="How skills have moved this term" description="From April to now — where children started, and where they are. The Gap band shows who fell behind.">
        <Card className="p-5">
          <MasteryFlowBands />
        </Card>
      </Section>

      <Section title="The watch-list" description="Tap any child for the full picture. None of this is a verdict — it is a head-start.">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {rows.map((r) => {
            const s = r.student;
            return (
              <Card key={s.id} className="flex flex-col p-5">
                <StudentInspector studentId={s.id} className="block w-full text-left">
                  <div className="flex items-start gap-4">
                    <Avatar name={s.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-medium text-ink">{s.name}</p>
                        <span className="text-[12px] text-faint">{s.grade} · {s.house}</span>
                        <Badge tone={r.risk === "elevated" ? "gap" : "practising"}>
                          <TriangleAlert size={11} /> {r.risk}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <span className="text-[12px] text-faint">
                          Missing basics <span className="font-medium tnum text-gap">{s.gapDebt}</span>
                        </span>
                        <span className="text-[12px] text-faint">
                          Sticking <span className="font-medium tnum text-ink">{pct(s.retentionIntegrity)}</span>
                        </span>
                        <span className="text-[12px] text-faint">
                          Pace <span className="font-medium tnum text-ink">{s.masteryVelocity.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={15} className="mt-1 shrink-0 text-faint" />
                  </div>
                </StudentInspector>

                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <FileText size={14} className="mt-0.5 shrink-0 text-muted" />
                    <p className="text-[13px] leading-relaxed text-muted">
                      <span className="font-medium text-ink">What we&apos;re seeing.</span> {r.evidence}
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ArrowRight size={14} className="mt-0.5 shrink-0 text-indigo" />
                    <p className="text-[13px] leading-relaxed text-muted">
                      <span className="font-medium text-ink">What to do next.</span> {r.nextStep}
                    </p>
                  </div>
                </div>

                <Divider className="my-3.5" />
                <div className="flex flex-wrap items-center justify-between gap-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
                    <UserCheck size={13} className="text-mastered" />
                    <span className="font-medium text-ink">{r.owner}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
                    <CalendarClock size={13} />
                    Next check <span className="font-medium text-ink">{relativeDays(r.followUpDate)}</span>
                  </span>
                  <ConfidenceBadge level={r.confidence} />
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </AppShell>
  );
}
