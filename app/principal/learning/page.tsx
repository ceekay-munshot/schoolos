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
    { label: "Ahead of where they should be", value: ahead, color: "#5E7C6A" },
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
    <AppShell persona="principal" eyebrow="Where every year group sits" title="Learning">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Who is ahead, on track, or behind for their grade; where missing basics still sit; and — for
        the board years — how ready they are, next to the skills that drive that readiness.
      </p>

      <Section title="How they sit for their grade" description="Across the whole school, by where each child's skills sit — not by marks.">
        <Card className="p-6">
          <SectionLabel className="mb-4">Students on track, ahead, or behind for their grade</SectionLabel>
          <StandingBar />
        </Card>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Section title="Learning pace by year group" description="Topics a week · the marker is the pace expected for the grade.">
          <Card className="p-6">
            <div className="space-y-3.5">
              {velocityByCohort.map((c) => (
                <BarRow key={c.label} label={c.label} value={c.value} expected={c.expected} max={3} />
              ))}
            </div>
          </Card>
        </Section>

        <Section title="Missing basics over time" description="8 weeks · going down is good.">
          <Card className="p-6">
            <TrendLine data={gapDebtTrend} color="#5E7C6A" format={(v) => v.toFixed(1)} />
            <p className="mt-2 text-[12px] text-faint">
              Missing basics are down by a third over this window as the Class 5 group clears them.
            </p>
          </Card>
        </Section>
      </div>

      <Section title="Missing basics still open" description="Basics not yet filled in, by grade and subject — ideas for small groups, not a scorecard.">
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
          Class 5 Maths has the most to clear — the equivalent-fractions basic that shows up across
          the early-warning list.
        </p>
      </Section>

      <Section
        title="How ready for the boards, next to skills covered"
        description="Classes 9–12 · readiness is the early read on the board exam; skills covered is what sits beneath it."
      >
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-3">Grade</span>
            <span className="col-span-4">Skills covered</span>
            <span className="col-span-4">Ready for the boards</span>
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
          Readiness sits just below skills covered in every board year group — that gap is the work
          still to firm up before the exam, shown now while there is time to act.
        </p>
      </Section>

      <Section
        title="What we predicted vs what they got vs ACER"
        description="Proof the early read is real — what we predicted against the outside result they actually got."
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>What we predicted for each year group vs the ACER result</SectionLabel>
            <div className="flex items-center gap-2">
              <Badge tone="mastered">±{meanGap.toFixed(1)} average gap</Badge>
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
