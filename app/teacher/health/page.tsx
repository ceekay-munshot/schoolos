import { Users2, ArrowRight, TrendingDown, Rocket, Hourglass } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { heroClassStudents } from "@/data/students";
import { masteryAt, gapClusters, classDistribution, FRACTION_PATH } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { DistributionBar } from "@/components/viz/charts";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Delta, MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { statusColor } from "@/lib/status";
import { pct } from "@/lib/utils";

function Chip({ id, name }: { id: string; name: string }) {
  return (
    <StudentInspector
      studentId={id}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 text-[12px] text-ink transition-colors hover:bg-sand"
    >
      <Avatar name={name} size={22} /> {name.split(" ")[0]}
    </StudentInspector>
  );
}

export default function ClassHealth() {
  const n = heroClassStudents.length;
  const avgVel = heroClassStudents.reduce((a, s) => a + s.masteryVelocity, 0) / n;
  const avgRet = heroClassStudents.reduce((a, s) => a + s.retentionIntegrity, 0) / n;
  const avgIndep = heroClassStudents.reduce((a, s) => a + s.independentWorkRatio, 0) / n;
  const clusters = gapClusters();
  const dist = classDistribution();
  const topCluster = clusters[0];

  const stalling = heroClassStudents.filter((s) => s.masteryVelocity < s.expectedVelocity - 0.05);
  const extension = heroClassStudents.filter((s) => s.masteryVelocity >= 2.4);
  const fading = heroClassStudents.filter((s) => s.retentionIntegrity < 0.75);

  const WATCH = [
    { title: "Starting to slip", note: "pace has dipped below grade. Catch it before a test would.", Icon: TrendingDown, cls: "text-gap", list: stalling },
    { title: "Ready for more", note: "racing ahead. Give them deeper work, not more of the same.", Icon: Rocket, cls: "text-mastered", list: extension },
    { title: "Starting to forget", note: "had it down, but it's fading. Mix in a little review.", Icon: Hourglass, cls: "text-practising", list: fading },
  ];

  return (
    <AppShell persona="teacher" eyebrow="Class 5 Kaveri · 22 students" title="Class health">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Spot who&apos;s slipping <em>early</em>, before a test would show it. The report card comes
        later. This is what helps you act now.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile label="Learning pace" value={avgVel.toFixed(1)} accent="#37357A" foot={<Delta value={avgVel} expected={2.0} unit="" />} />
        <MetricTile label="What's sticking" value={pct(avgRet)} foot="how much they still remember later" />
        <MetricTile label="Independent work" value={pct(avgIndep)} foot="how settled the class is" />
        <MetricTile label="Work captured" value="96%" accent="#5E7C6A" foot="worksheets scanned this week" />
      </div>

      <Section title="This week — who to watch" description="A short, honest list. Not a wall of alerts.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {WATCH.map((w) => (
            <Card key={w.title} className="p-5">
              <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
                <w.Icon size={15} className={w.cls} /> {w.title}
                <span className="tnum text-[12px] text-faint">· {w.list.length}</span>
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-faint">{w.note}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {w.list.length ? w.list.map((s) => <Chip key={s.id} id={s.id} name={s.name} />) : (
                  <span className="text-[12px] text-faint">No one this week.</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Section title="Missing basics" description="Where children share the same gap. A good small group to pull this week.">
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
                    The one group worth pulling. Fix this root skill and the addition work that builds on it
                    opens up for all four.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {topCluster.studentIds.map((sid) => {
                      const s = heroClassStudents.find((x) => x.id === sid)!;
                      return <Chip key={sid} id={sid} name={s.name} />;
                    })}
                  </div>
                </div>
              </Card>
            )}
          </Section>
        </div>

        <div className="lg:col-span-2">
          <Section title="How the class is spread out">
            <Card className="p-5">
              <SectionLabel className="mb-4">Where the class sits on Fractions</SectionLabel>
              <DistributionBar counts={dist} />
            </Card>
          </Section>
        </div>
      </div>

      <Section title="The class list" description="Each child's path through Fractions. Tap any name for the full picture.">
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
