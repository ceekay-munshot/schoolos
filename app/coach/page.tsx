import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { checkInSchedule } from "@/data/coach";
import { studentById } from "@/data/students";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

export default function CoachCaseload() {
  const sorted = [...checkInSchedule].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return a.next.localeCompare(b.next);
  });
  const highCount = checkInSchedule.filter((c) => c.priority === "high").length;

  return (
    <AppShell persona="coach" eyebrow="Rohan D'Souza · Executive Coach" title="Caseload">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Forty students, each a whole child across Concept and PATH. The system assembles the
        picture; your time goes to judgment and the relationship.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Caseload" value="40" foot="students, 1:40 ratio" />
        <MetricTile label="This fortnight" value={checkInSchedule.length} accent="#37357A" foot="check-ins scheduled" />
        <MetricTile label="Priority" value={highCount} accent="#B25B43" foot="matter most right now" />
        <MetricTile label="Feedback logged" value="92%" accent="#5E7C6A" foot="re-entered as signal" />
      </div>

      <Section title="This fortnight" description="Gentle priority — who this round's check-in matters most for.">
        <div className="space-y-3">
          {sorted.map((c) => {
            const s = studentById(c.studentId)!;
            return (
              <Link key={c.studentId} href={`/coach/${c.studentId}`}>
                <Card hover className="flex items-center gap-4 p-4">
                  <Avatar name={s.name} size={42} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-medium text-ink">{s.name}</p>
                      <span className="text-[12px] text-faint">{s.grade}</span>
                      {c.priority === "high" && (
                        <Badge tone="gap"><Flag size={11} /> Priority</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-muted">{c.prompt}</p>
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
    </AppShell>
  );
}
