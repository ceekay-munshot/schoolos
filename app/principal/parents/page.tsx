import { AppShell, Section } from "@/components/shell/AppShell";
import {
  parentEngagement,
  parentSummary,
  parentSentimentTrend,
  type ParentCohort,
} from "@/data/principal-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { TrendLine } from "@/components/viz/charts";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

const RETENTION_TONE: Record<ParentCohort["retentionSignal"], "mastered" | "indigo" | "practising"> = {
  strong: "mastered",
  steady: "indigo",
  watch: "practising",
};

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-sand">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, backgroundColor: color }} />
    </div>
  );
}

export default function PrincipalParents() {
  const watch = parentEngagement.filter((c) => c.retentionSignal === "watch");

  return (
    <AppShell persona="principal" eyebrow="Engagement, sentiment & retention" title="Parents">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Parent trust is built on honesty — the gap being worked, not a wall of green. These signals
        read engagement and sentiment as the early indicators of retention, while there is still
        time to reach out.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Active on the app" value={pct(parentSummary.active)} accent="#37357A" foot="this month" />
        <MetricTile label="Check-ins booked" value={pct(parentSummary.checkInsBooked)} foot="this term's window" />
        <MetricTile label="Positive sentiment" value={pct(parentSummary.positiveSentiment)} accent="#5E7C6A" foot="from check-ins & messages" />
        <MetricTile label="Re-enrolment intent" value={pct(parentSummary.reEnrolmentIntent)} foot="the attrition early signal" />
      </div>

      <Section title="By cohort" description="App engagement, check-in attendance and sentiment — with the retention read for each grade.">
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-2">Cohort</span>
            <span className="col-span-3">App engagement</span>
            <span className="col-span-3">Check-in attendance</span>
            <span className="col-span-2">Sentiment</span>
            <span className="col-span-2 text-right">Retention</span>
          </div>
          <div className="divide-y divide-line">
            {parentEngagement.map((c) => (
              <div key={c.cohort} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                <span className="col-span-2 text-[14px] font-medium text-ink">{c.cohort}</span>
                <div className="col-span-3 flex items-center gap-3">
                  <Bar value={c.appEngagement} color="#37357A" />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(c.appEngagement)}</span>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <Bar value={c.checkInAttendance} color="#5E7C6A" />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(c.checkInAttendance)}</span>
                </div>
                <span className="col-span-2 text-[13px] tnum text-muted">{pct(c.sentiment)}</span>
                <span className="col-span-2 text-right">
                  <Badge tone={RETENTION_TONE[c.retentionSignal]}>{c.retentionSignal}</Badge>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Section className="lg:col-span-3" title="Sentiment trend" description="6 months · steady and rising.">
          <Card className="p-6">
            <TrendLine data={parentSentimentTrend} color="#5E7C6A" height={120} format={(v) => pct(v)} />
          </Card>
        </Section>

        <Section className="lg:col-span-2" title="Worth a personal call">
          <Card className="p-6">
            <SectionLabel className="mb-3">Cohorts to reach out to</SectionLabel>
            {watch.length === 0 ? (
              <p className="text-[13px] text-muted">Every cohort is engaged this term.</p>
            ) : (
              <div className="space-y-3">
                {watch.map((c) => (
                  <div key={c.cohort} className="rounded-xl border border-practising/25 bg-practising-soft/30 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-medium text-ink">{c.cohort} parents</p>
                      <Badge tone="practising">watch</Badge>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      App engagement at {pct(c.appEngagement)} and the lowest check-in attendance —
                      the coach is calling the unbooked families before the window closes.
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[12px] text-faint">
              A quiet dip in engagement is the earliest attrition signal — a call now is worth more
              than a survey later.
            </p>
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}
