import Link from "next/link";
import { ArrowLeft, CalendarClock, ListChecks } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { students, studentById } from "@/data/students";
import { insightsForStudent } from "@/data/insights";
import { checkInFor } from "@/data/coach";
import { Student360 } from "@/components/patterns/Student360";
import { InsightCard } from "@/components/patterns/InsightCard";
import { Card, Button, SectionLabel } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

export const dynamicParams = false;
export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

export default async function CoachStudent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = studentById(id);
  if (!s) {
    return (
      <AppShell persona="coach" title="Not found">
        <Link href="/coach" className="text-indigo">← Back to caseload</Link>
      </AppShell>
    );
  }
  const insights = insightsForStudent(id);
  const checkIn = checkInFor(id);

  return (
    <AppShell
      persona="coach"
      eyebrow={
        <Link href="/coach" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> Caseload
        </Link>
      }
      title={s.name}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <Student360 studentId={id} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {checkIn && (
            <Card className="overflow-hidden">
              <div className="bg-indigo-soft/50 p-5">
                <SectionLabel>Next check-in</SectionLabel>
                <p className="mt-1.5 font-display text-lg text-ink">
                  {relativeDays(checkIn.next)} · with student + parents
                </p>
                <p className="mt-2 flex items-start gap-2 text-[13px] text-muted">
                  <ListChecks size={15} className="mt-0.5 shrink-0 text-indigo" />
                  {checkIn.prompt}
                </p>
                <Link href="/coach/checkins">
                  <Button size="sm" className="mt-4">
                    <CalendarClock size={14} /> Open check-in workflow
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">AI insight digest</h2>
            </div>
            <p className="mb-3 text-[12px] text-faint">
              Drafted by the system. You never receive raw model output as truth — confirm,
              add context, or dismiss.
            </p>
            <div className="space-y-3">
              {insights.length ? (
                insights.map((i) => <InsightCard key={i.id} insight={i} />)
              ) : (
                <Card className="p-5 text-[13px] text-muted">Nothing flagged this fortnight — a quiet, healthy picture.</Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
