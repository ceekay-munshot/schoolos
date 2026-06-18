import { AppShell, Section } from "@/components/shell/AppShell";
import { velocityByCohort, gapDebtTrend, benchmarks } from "@/data/metrics";
import {
  boardReadiness,
  gradeMapStanding,
  gapsByGradeSubject,
} from "@/data/principal-extra";
import { BarRow, TrendLine, BenchmarkPlot } from "@/components/viz/charts";
import { ConfidenceBadge } from "@/components/patterns/Signals";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

function StandingBar() {
  const { ahead, onTrack, behind } = gradeMapStanding;
  const seg = [
    { label: "Ahead of the map", value: ahead, color: "#5E7C6A" },
    { label: "On track", value: onTrack, color: "#37357A" },
    { label: "Behind", value: behind, color: "#B25B43" },
  ];
  return (
    <div>
      <div className="flex h-3.5 w-full overflow-hidden rounded-full">
        {seg.map((s) => (
          <div key={s.label} style={{ width: `${s.value * 100}%`, backgroundColor: s.color }} title={`${s.label}: ${pct(s.value)}`} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {seg.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[12px] text-muted">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
            <span className="tnum font-medium text-ink">{pct(s.value)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const SUBJECTS = [
  { key: "maths", label: "Maths" },
  { key: "english", label: "English" },
  { key: "science", label: "Science" },
  { key: "social", label: "Social" },
] as const;

export default function PrincipalLearning() {
  const meanGap =
    benchmarks.reduce((a, b) => a + Math.abs(b.predicted - b.actual), 0) / benchmarks.length;

  return (
    <AppShell persona="principal" eyebrow="Where every cohort sits on the map" title="Learning">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Who is ahead of, on, or behind the grade map; where foundational gaps still sit; and — for
        the board years — readiness alongside the mastery that drives it.
      </p>

      <Section title="Standing against the grade map" description="School-wide, by leading competency placement — not by marks.">
        <Card className="p-6">
          <SectionLabel className="mb-4">Students on / ahead of / behind the map</SectionLabel>
          <StandingBar />
        </Card>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Learning pace by cohort" description="Nodes / week · the marker is grade-expected pace.">
          <Card className="p-6">
            <div className="space-y-3.5">
              {velocityByCohort.map((c) => (
                <BarRow key={c.label} label={c.label} value={c.value} expected={c.expected} max={3} />
              ))}
            </div>
          </Card>
        </Section>

        <Section title="Foundational gap trend" description="8 weeks · falling is healthy.">
          <Card className="p-6">
            <TrendLine data={gapDebtTrend} color="#5E7C6A" format={(v) => v.toFixed(1)} />
            <p className="mt-2 text-[12px] text-faint">
              Residual gap-debt is down a third over the window as the Class 5 cluster clears.
            </p>
          </Card>
        </Section>
      </div>

      <Section title="Unresolved foundational gaps" description="Open root gaps by grade and subject — candidate small-groups, not a scorecard.">
        <Card>
          <div className="grid grid-cols-12 gap-3 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-4">Grade</span>
            {SUBJECTS.map((s) => (
              <span key={s.key} className="col-span-2 text-right">{s.label}</span>
            ))}
          </div>
          <div className="divide-y divide-line">
            {gapsByGradeSubject.map((row) => (
              <div key={row.grade} className="grid grid-cols-12 items-center gap-3 px-5 py-3">
                <span className="col-span-4 text-[14px] font-medium text-ink">{row.grade}</span>
                {SUBJECTS.map((s) => {
                  const v = row[s.key];
                  const heavy = v >= 10;
                  return (
                    <span key={s.key} className="col-span-2 text-right">
                      <span
                        className={
                          "inline-block min-w-7 rounded-md px-1.5 py-0.5 text-[13px] font-medium tnum " +
                          (heavy ? "bg-gap-soft text-gap" : v >= 6 ? "bg-saffron-soft text-saffron-deep" : "text-muted")
                        }
                      >
                        {v}
                      </span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-[12px] text-faint">
          Class 5 Maths carries the heaviest cluster — the equivalent-fractions root that surfaces
          across the early-warning roster.
        </p>
      </Section>

      <Section
        title="Board-readiness alongside mastery"
        description="Classes 9–12 · readiness is the leading read on the board exam; mastery is the competency coverage beneath it."
      >
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-3">Grade</span>
            <span className="col-span-4">Mastery (competency coverage)</span>
            <span className="col-span-4">Board-readiness (leading)</span>
            <span className="col-span-1 text-right">n</span>
          </div>
          <div className="divide-y divide-line">
            {boardReadiness.map((b) => (
              <div key={b.grade} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                <div className="col-span-3">
                  <p className="text-[14px] font-medium text-ink">{b.grade}</p>
                  <p className="text-[12px] text-faint">{b.stream}</p>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-sand">
                    <div className="h-full rounded-full" style={{ width: `${b.mastery * 100}%`, backgroundColor: "#5E7C6A" }} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(b.mastery)}</span>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-sand">
                    <div className="h-full rounded-full" style={{ width: `${b.readiness * 100}%`, backgroundColor: "#37357A" }} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(b.readiness)}</span>
                </div>
                <span className="col-span-1 text-right text-[13px] tnum text-muted">{b.students}</span>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-[12px] text-faint">
          Readiness tracks just below mastery in every board cohort — the gap is the work still to
          consolidate before the exam, surfaced now while there is time to act.
        </p>
      </Section>

      <Section
        title="Predicted vs actual vs ACER"
        description="The proof the leading read is real — prediction against the eventual external result."
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Cohort predictions vs ACER actual</SectionLabel>
            <div className="flex items-center gap-2">
              <Badge tone="mastered">±{meanGap.toFixed(1)} avg gap</Badge>
              <ConfidenceBadge level="high" />
            </div>
          </div>
          <div className="mt-4 grid place-items-center">
            <BenchmarkPlot
              data={benchmarks.map((b) => ({ predicted: b.predicted, actual: b.actual, label: `${b.cohort} · ${b.term}` }))}
              size={300}
            />
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
