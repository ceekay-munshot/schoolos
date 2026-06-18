import { AppShell, Section } from "@/components/shell/AppShell";
import {
  parentEngagement,
  parentSummary,
  parentSentimentTrend,
  type ParentCohort,
} from "@/data/principal-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { InfoDrawer } from "@/components/patterns/InfoDrawer";
import { AnimatedTrend } from "@/components/viz/AnimatedTrend";
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
    <AppShell persona="principal" eyebrow="How parents are doing, and staying" title="Parents">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Parent trust is built on honesty — showing the gap we&apos;re working on, not a wall of green.
        These signs show how involved parents are and how they feel — early hints of who might stay,
        while there is still time to reach out.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Using the app" value={pct(parentSummary.active)} accent="#37357A" foot="this month" />
        <MetricTile label="Check-ins booked" value={pct(parentSummary.checkInsBooked)} foot="this term's window" />
        <MetricTile label="Feeling positive" value={pct(parentSummary.positiveSentiment)} accent="#5E7C6A" foot="from check-ins and messages" />
        <MetricTile label="Plan to re-enrol" value={pct(parentSummary.reEnrolmentIntent)} foot="an early sign of who might leave" />
      </div>

      <Section title="By year group" description="How much parents use the app, turn up for check-ins, and how they feel — with an early read on who might stay, for each grade.">
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-2">Year group</span>
            <span className="col-span-3">Using the app</span>
            <span className="col-span-3">Turned up for check-ins</span>
            <span className="col-span-2">How they feel</span>
            <span className="col-span-2 text-right">Likely to stay</span>
          </div>
          <div className="divide-y divide-line">
            {parentEngagement.map((c) => (
              <InfoDrawer
                key={c.cohort}
                eyebrow="Year group"
                title={`${c.cohort} parents`}
                className="grid w-full grid-cols-12 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-sand"
                panel={
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-canvas p-4">
                      <p className="font-display text-lg text-ink">{c.cohort} parents</p>
                      <Badge tone={RETENTION_TONE[c.retentionSignal]}>{c.retentionSignal}</Badge>
                    </div>
                    <div className="space-y-3.5">
                      {([
                        ["Using the app", c.appEngagement, "#37357A"],
                        ["Turned up for check-ins", c.checkInAttendance, "#5E7C6A"],
                        ["How they feel", c.sentiment, "#C0913A"],
                      ] as [string, number, string][]).map(([label, val, color]) => (
                        <div key={label}>
                          <div className="flex items-center justify-between text-[12.5px]">
                            <span className="text-muted">{label}</span>
                            <span className="tnum font-medium text-ink">{pct(val)}</span>
                          </div>
                          <div className="mt-1.5"><Bar value={val} color={color} /></div>
                        </div>
                      ))}
                    </div>
                    <p className="rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-muted">
                      {c.retentionSignal === "watch"
                        ? "Worth a personal call before the check-in window closes — a quiet drop in involvement is often the first sign a family may leave."
                        : "Involved and steady this term — no action needed right now."}
                    </p>
                  </div>
                }
              >
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
              </InfoDrawer>
            ))}
          </div>
        </Card>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Section className="lg:col-span-3" title="How they feel over time" description="6 months · steady and rising.">
          <Card className="p-6">
            <AnimatedTrend data={parentSentimentTrend} color="#5E7C6A" height={132} format="percent" />
          </Card>
        </Section>

        <Section className="lg:col-span-2" title="Worth a personal call">
          <Card className="p-6">
            <SectionLabel className="mb-3">Year groups to reach out to</SectionLabel>
            {watch.length === 0 ? (
              <p className="text-[13px] text-muted">Every year group is involved this term.</p>
            ) : (
              <div className="space-y-3">
                {watch.map((c) => (
                  <div key={c.cohort} className="rounded-xl border border-practising/25 bg-practising-soft/30 p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-medium text-ink">{c.cohort} parents</p>
                      <Badge tone="practising">watch</Badge>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      Using the app {pct(c.appEngagement)} of the time and the fewest turning up for
                      check-ins — the coach is calling the families who haven&apos;t booked, before the window closes.
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[12px] text-faint">
              A quiet drop in how involved a parent is can be the first sign they may leave — a call
              now is worth more than a survey later.
            </p>
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}
