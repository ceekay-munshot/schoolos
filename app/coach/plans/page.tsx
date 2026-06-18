import Link from "next/link";
import { Target, ArrowUpRight, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { studentById } from "@/data/students";
import { coachPlans, OWNER_LABEL, type Owner, type PlanStatus } from "@/data/coach-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { relativeDays } from "@/lib/utils";

const OWNER_TONE: Record<Owner, "indigo" | "saffron" | "mastered"> = {
  school: "indigo",
  student: "saffron",
  parent: "mastered",
};

const STATUS_META: Record<PlanStatus, { label: string; tone: "mastered" | "saffron" | "indigo" }> = {
  "on-track": { label: "On track", tone: "mastered" },
  "needs-review": { label: "Review due", tone: "saffron" },
  new: { label: "Just set", tone: "indigo" },
};

/** How many of each owner type a commitment-set carries, for the quick legend. */
function ownerCount(owner: Owner) {
  return coachPlans.reduce((a, p) => a + p.commitments.filter((c) => c.owner === owner).length, 0);
}

export default function CoachPlans() {
  const sorted = [...coachPlans].sort((a, b) => a.reviewDate.localeCompare(b.reviewDate));
  const reviewSoon = coachPlans.filter((p) => p.status === "needs-review").length;
  const totalCommitments = coachPlans.reduce((a, p) => a + p.commitments.length, 0);

  return (
    <AppShell persona="coach" eyebrow="Active across the caseload" title="Plans">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        A plan is small on purpose — never more than two or three commitments, and every one of
        them belongs to someone: the School, the Student, or the Parent. Shared ownership is what
        makes a plan move.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Active plans" value={coachPlans.length} accent="#37357A" foot="across the caseload" />
        <MetricTile label="Review due" value={reviewSoon} accent="#C8802E" foot="at the next check-in" />
        <MetricTile label="Commitments" value={totalCommitments} foot="kept deliberately few" />
        <MetricTile
          label="Shared ownership"
          value={`${ownerCount("school")} · ${ownerCount("student")} · ${ownerCount("parent")}`}
          foot="School · Student · Parent"
        />
      </div>

      <div className="space-y-4">
        {sorted.map((plan) => {
          const s = studentById(plan.studentId)!;
          const meta = STATUS_META[plan.status];
          return (
            <Card key={plan.id} className="p-5">
              {/* header */}
              <div className="flex flex-wrap items-start gap-3">
                <Link href={`/coach/${plan.studentId}`} className="group flex min-w-0 flex-1 items-center gap-3">
                  <Avatar name={s.name} size={40} />
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
                      {s.name}
                      <ArrowUpRight size={14} className="text-faint transition-colors group-hover:text-indigo" />
                    </p>
                    <p className="text-[12px] text-faint">{s.grade} · {s.house} House</p>
                  </div>
                </Link>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>

              {/* focus */}
              <p className="mt-3 flex items-start gap-2 text-[14px] leading-relaxed text-ink">
                <Target size={15} className="mt-0.5 shrink-0 text-indigo" />
                {plan.focus}
              </p>

              {/* commitments */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {plan.commitments.map((c, i) => (
                  <div key={i} className="rounded-xl border border-line bg-canvas p-3.5">
                    <Badge tone={OWNER_TONE[c.owner]}>{OWNER_LABEL[c.owner]}</Badge>
                    <p className="mt-2.5 text-[12.5px] leading-relaxed text-ink">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* progress + review */}
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="min-w-[200px] flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <SectionLabel>Progress this fortnight</SectionLabel>
                    <span className="text-[11px] font-medium text-muted tnum">
                      {Math.round(plan.progress * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-sand">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(plan.progress * 100)}%`,
                        backgroundColor: plan.status === "needs-review" ? "#C8802E" : "#5E7C6A",
                      }}
                    />
                  </div>
                </div>
                <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted">
                  <CalendarClock size={13} className="text-faint" />
                  Review {relativeDays(plan.reviewDate)}
                </p>
              </div>

              <p className="mt-3 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">
                {plan.note}
              </p>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
