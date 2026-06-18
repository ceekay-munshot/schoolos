import { Users2, ArrowRight } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { heroClassStudents } from "@/data/students";
import { masteryAt, gapClusters, classDistribution, FRACTION_PATH } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { DistributionBar } from "@/components/viz/charts";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Delta } from "@/components/patterns/atoms";
import { MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { statusColor } from "@/lib/status";
import { pct } from "@/lib/utils";

export default function ClassHealth() {
  const n = heroClassStudents.length;
  const avgVel = heroClassStudents.reduce((a, s) => a + s.masteryVelocity, 0) / n;
  const avgRet = heroClassStudents.reduce((a, s) => a + s.retentionIntegrity, 0) / n;
  const avgIndep = heroClassStudents.reduce((a, s) => a + s.independentWorkRatio, 0) / n;
  const clusters = gapClusters();
  const dist = classDistribution();
  const topCluster = clusters[0];

  return (
    <AppShell persona="teacher" eyebrow="Class 5 Kaveri · 22 students" title="Class health">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Leading, not lagging — this is who is stalling <em>before</em> any exam would show it.
        The report card is the output; this is the instrument.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Class velocity" value={avgVel.toFixed(1)} accent="#37357A" foot={<Delta value={avgVel} expected={2.0} unit="" />} />
        <MetricTile label="Retention integrity" value={pct(avgRet)} foot="mastered nodes still passing recall" />
        <MetricTile label="Independent work" value={pct(avgIndep)} foot="the calm-room signal" />
        <MetricTile label="Capture compliance" value="96%" accent="#5E7C6A" foot="worksheets scanned this week" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* the one group */}
        <div className="lg:col-span-3">
          <Section title="Gap-clusters" description="Where children share a broken node — your candidate small-groups.">
            {topCluster && (
              <Card className="border-gap/20">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <Badge tone="gap">
                      <Users2 size={12} /> {topCluster.studentIds.length} share this gap
                    </Badge>
                    <span className="font-mono text-[11px] text-faint">{topCluster.nodeId}</span>
                  </div>
                  <p className="mt-3 font-display text-lg text-ink">{topCluster.label}</p>
                  <p className="mt-1 text-[13px] text-muted">
                    This is your one group to pull — repair the root and the downstream addition work
                    unblocks for all four.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {topCluster.studentIds.map((sid) => {
                      const s = heroClassStudents.find((x) => x.id === sid)!;
                      return (
                        <StudentInspector
                          key={sid}
                          studentId={sid}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[12px] text-ink transition-colors hover:bg-sand"
                        >
                          <Avatar name={s.name} size={22} /> {s.name}
                        </StudentInspector>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </Section>
        </div>

        {/* distribution */}
        <div className="lg:col-span-2">
          <Section title="Distribution across the map">
            <Card className="p-5">
              <SectionLabel className="mb-4">Where the class sits on Fractions</SectionLabel>
              <DistributionBar counts={dist} />
            </Card>
          </Section>
        </div>
      </div>

      {/* roster heat strip */}
      <Section title="The roster" description="Each child's path through the Fractions strand. Tap any name for the full 360.">
        <Card>
          <div className="divide-y divide-line">
            {heroClassStudents.map((s) => (
              <StudentInspector
                key={s.id}
                studentId={s.id}
                className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-sand"
              >
                <Avatar name={s.name} size={34} />
                <span className="w-40 shrink-0 truncate text-[14px] font-medium text-ink">{s.name}</span>
                <span className="flex flex-1 items-center gap-1.5">
                  {FRACTION_PATH.map((nid) => {
                    const st = masteryAt(s.id, nid);
                    return (
                      <span
                        key={nid}
                        className="size-3 rounded-full ring-1 ring-black/5"
                        style={{ backgroundColor: statusColor(st?.status ?? "not-introduced") }}
                        title={`${nodeById(nid)?.statement}: ${st?.status}`}
                      />
                    );
                  })}
                </span>
                <span className="hidden w-24 shrink-0 sm:block"><Delta value={s.masteryVelocity} expected={s.expectedVelocity} /></span>
                <ArrowRight size={15} className="shrink-0 text-faint" />
              </StudentInspector>
            ))}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
