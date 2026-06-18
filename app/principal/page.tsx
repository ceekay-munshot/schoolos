import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { benchmarks } from "@/data/metrics";
import { healthMetrics, type HealthMetric } from "@/data/principal-extra";
import { Sparkline, BenchmarkPlot } from "@/components/viz/charts";
import { ConfidenceBadge, Freshness } from "@/components/patterns/Signals";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

const SIGNAL_COLOR: Record<string, string> = {
  pace: "#37357A",
  "gap-debt": "#5E7C6A",
  retention: "#37357A",
  path: "#C0913A",
  usage: "#5E7C6A",
  parents: "#37357A",
};

function formatValue(m: HealthMetric) {
  return m.unit === "ratio" ? pct(m.value) : m.value.toFixed(1);
}

function formatDelta(m: HealthMetric) {
  const sign = m.momDelta >= 0 ? "+" : "";
  return m.unit === "ratio"
    ? `${sign}${(m.momDelta * 100).toFixed(0)} pts`
    : `${sign}${m.momDelta.toFixed(1)}`;
}

function SignalCard({ m }: { m: HealthMetric }) {
  const color = SIGNAL_COLOR[m.key] ?? "#37357A";
  // A move in the healthy direction reads as good, regardless of sign.
  const improving = m.goodWhenRising ? m.momDelta >= 0 : m.momDelta <= 0;
  const Arrow = m.momDelta >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{m.label}</p>
          <p className="mt-2 font-display text-[30px] leading-none tnum text-ink" style={{ color }}>
            {formatValue(m)}
            {m.unit === "pace" && <span className="ml-1 text-[13px] font-normal text-faint">/wk</span>}
          </p>
        </div>
        <Sparkline data={m.trend.map((d) => d.value)} width={92} height={40} color={color} />
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span
          className={
            "inline-flex items-center gap-0.5 text-[12px] font-medium tnum " +
            (improving ? "text-mastered" : "text-gap")
          }
        >
          <Arrow size={13} />
          {formatDelta(m)}
        </span>
        <span className="text-[12px] text-faint">vs last month</span>
      </div>

      <div className="mt-4 border-t border-line pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <SectionLabel>Needs attention</SectionLabel>
          <Badge tone={m.key === "gap-debt" ? "gap" : "saffron"}>{m.gradeNeedingAttention}</Badge>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.action}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12px] text-faint">
            Owner <span className="font-medium text-ink">{m.owner}</span>
          </span>
          <ConfidenceBadge level={m.confidence} />
        </div>
      </div>
    </Card>
  );
}

export default function PrincipalHealth() {
  const meanGap =
    benchmarks.reduce((a, b) => a + Math.abs(b.predicted - b.actual), 0) / benchmarks.length;

  return (
    <AppShell
      persona="principal"
      eyebrow="Dr. Meera Nambiar · Whitefield Campus"
      title="School health"
      actions={<Freshness state="today" />}
    >
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        An operator&apos;s cockpit — six leading signals, each with where it is heading, the grade
        that needs attention, and the one move to make. The headline: our leading metric is{" "}
        <em>real</em>, and it predicts the lagging board outcome.
      </p>

      <Section title="The six leading signals" description="Read against grade-expected pace — these move before the exam does.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {healthMetrics.map((m) => (
            <SignalCard key={m.key} m={m} />
          ))}
        </div>
      </Section>

      <Section
        title="Leading vs lagging — proven"
        description="The proof the leading metric is real: each cohort's prediction against its eventual ACER result."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="p-6 lg:col-span-3">
            <div className="flex items-center justify-between">
              <SectionLabel>Predicted vs ACER actual</SectionLabel>
              <Badge tone="mastered">±{meanGap.toFixed(1)} avg gap</Badge>
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

          <Card className="flex flex-col justify-center gap-5 p-6 lg:col-span-2">
            <div>
              <SectionLabel>What the cockpit is for</SectionLabel>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Every number here moves before a report card could. A dip surfaces months early,
                with a named owner and a single recommended move — not a wall of green, and never a
                ranking of teachers.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-muted">Cohorts validated against ACER</span>
                <span className="font-display text-2xl tnum text-ink">{benchmarks.length}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-[13px] text-muted">Mean prediction gap</span>
                <span className="font-display text-2xl tnum text-mastered">±{meanGap.toFixed(1)}</span>
              </div>
            </div>
            <ConfidenceBadge level="high" />
          </Card>
        </div>
      </Section>
    </AppShell>
  );
}
