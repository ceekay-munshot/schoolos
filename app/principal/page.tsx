import { AppShell, Section } from "@/components/shell/AppShell";
import { benchmarks } from "@/data/metrics";
import { healthMetrics } from "@/data/principal-extra";
import { SignalBoard } from "@/components/principal/SignalBoard";
import { BenchmarkPlot } from "@/components/viz/charts";
import { ConfidenceBadge, Freshness } from "@/components/patterns/Signals";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { Reveal, CountUp } from "@/components/motion";

export default function PrincipalHealth() {
  const meanGap = benchmarks.reduce((a, b) => a + Math.abs(b.predicted - b.actual), 0) / benchmarks.length;

  return (
    <AppShell
      persona="principal"
      eyebrow="Dr. Meera Nambiar · Whitefield Campus"
      title="School health"
      actions={<Freshness state="today" />}
    >
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        A simple control room — six signs worth watching. Tap any one for the full story: where
        it&apos;s going, which grade needs attention, and the one thing to do. The big point: the
        number we watch early is <em>real</em>, and it tells us how the board exam will go.
      </p>

      <Section>
        <SignalBoard metrics={healthMetrics} />
      </Section>

      <Reveal>
        <Section
          title="Spot it early — and here's the proof"
          description="What we predicted for each year group against the ACER result it actually got."
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="p-6 lg:col-span-3">
              <div className="flex items-center justify-between">
                <SectionLabel>Predicted vs ACER actual</SectionLabel>
                <Badge tone="mastered">±{meanGap.toFixed(1)} average gap</Badge>
              </div>
              <div className="mt-4 grid place-items-center">
                <BenchmarkPlot
                  data={benchmarks.map((b) => ({
                    predicted: b.predicted,
                    actual: b.actual,
                    label: `${b.cohort} · ${b.term}`,
                  }))}
                />
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted">
                Each dot is a year group: what we predicted against the result they actually got. The
                dots sitting close to the line is what sets us apart — not &ldquo;we have data,&rdquo;
                but proof the system gets the result right.
              </p>
            </Card>

            <Card className="flex flex-col justify-center gap-5 p-6 lg:col-span-2">
              <div>
                <SectionLabel>What this control room is for</SectionLabel>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  Every number here moves before a report card could. A dip shows up months early,
                  with a person named to act and one thing to do — not a wall of green, and never a
                  ranking of teachers.
                </p>
              </div>
              <div className="border-t border-line pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] text-muted">Year groups checked against ACER</span>
                  <span className="font-display text-2xl tnum text-ink"><CountUp value={benchmarks.length} /></span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[13px] text-muted">Average gap in our prediction</span>
                  <span className="font-display text-2xl tnum text-mastered">±{meanGap.toFixed(1)}</span>
                </div>
              </div>
              <ConfidenceBadge level="high" />
            </Card>
          </div>
        </Section>
      </Reveal>
    </AppShell>
  );
}
