import { AppShell } from "@/components/shell/AppShell";
import {
  schoolHealth,
  velocityByCohort,
  gapDebtTrend,
  retentionTrend,
  benchmarks,
} from "@/data/metrics";
import { MetricTile } from "@/components/patterns/atoms";
import { BarRow, TrendLine, BenchmarkPlot } from "@/components/viz/charts";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

export default function PrincipalHealth() {
  const meanGap =
    benchmarks.reduce((a, b) => a + Math.abs(b.predicted - b.actual), 0) / benchmarks.length;

  return (
    <AppShell persona="principal" eyebrow="Dr. Meera Nambiar · Whitefield Campus" title="School health">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        An operator&apos;s cockpit — a few decisive, leading numbers. The headline: our leading
        metric is <em>real</em>, and it predicts the lagging outcome.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Comprehension" value={pct(schoolHealth.comprehensionRate)} accent="#37357A" foot="school-wide, leading" />
        <MetricTile label="Retention integrity" value={pct(schoolHealth.retentionIntegrity)} foot="concepts holding over time" />
        <MetricTile label="Predicted vs ACER" value={`±${meanGap.toFixed(1)}`} accent="#5E7C6A" foot="avg gap, predicted to actual" />
        <MetricTile label="Parent engagement" value={pct(schoolHealth.parentEngagement)} foot="active on the app" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card className="p-6">
            <SectionLabel>Mastery velocity by cohort</SectionLabel>
            <p className="mb-5 mt-1 text-[12px] text-faint">nodes / week · marker shows grade-expected pace</p>
            <div className="space-y-3.5">
              {velocityByCohort.map((c) => (
                <BarRow key={c.label} label={c.label} value={c.value} expected={c.expected} max={3} />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <SectionLabel>Grade-level gap-debt trend</SectionLabel>
            <p className="mb-2 mt-1 text-[12px] text-faint">8 weeks · falling is healthy</p>
            <TrendLine data={gapDebtTrend} color="#5E7C6A" format={(v) => v.toFixed(1)} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <SectionLabel>Leading vs lagging — proven</SectionLabel>
              <Badge tone="mastered">tight fit</Badge>
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
              Each point is a cohort: our leading-metric prediction against their eventual{" "}
              {"ACER"} result. The tight fit to the diagonal is the moat — not &ldquo;we have
              data,&rdquo; but proof the engine predicts the outcome.
            </p>
          </Card>

          <Card className="p-6">
            <SectionLabel>Retention integrity</SectionLabel>
            <p className="mb-2 mt-1 text-[12px] text-faint">8 weeks · rising</p>
            <TrendLine data={retentionTrend} color="#37357A" height={96} format={(v) => pct(v)} />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
