import { Users2, ArrowRight, LifeBuoy, Rocket, Check } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { heroClassStudents } from "@/data/students";
import { masteryFor, masteryAt, gapClusters, classDistribution, FRACTION_PATH } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { DistributionBar } from "@/components/viz/charts";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Delta, MetricTile } from "@/components/patterns/atoms";
import { Avatar } from "@/components/ui/avatar";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { statusColor } from "@/lib/status";
import { ClassConstellation } from "@/components/viz/ClassConstellation";
import { SkillHeatCalendar } from "@/components/viz/SkillHeatCalendar";
import { GapRadar } from "@/components/viz/GapRadar";

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

  // three honest bands, with names
  const needSupport = heroClassStudents.filter((s) => masteryFor(s.id).some((m) => m.status === "gap"));
  const readyForMore = heroClassStudents.filter(
    (s) => s.masteryVelocity >= 2.3 && !needSupport.includes(s),
  );
  const atPar = heroClassStudents.filter((s) => !needSupport.includes(s) && !readyForMore.includes(s));

  const clusters = gapClusters();
  const dist = classDistribution();
  const topCluster = clusters[0];

  const BANDS = [
    { title: "Need support", list: needSupport, Icon: LifeBuoy, cls: "text-gap", tone: "gap" as const, note: "last worksheet didn't pass the skill yet" },
    { title: "At par", list: atPar, Icon: Check, cls: "text-mastered", tone: "mastered" as const, note: "moving with the class" },
    { title: "Ready for more", list: readyForMore, Icon: Rocket, cls: "text-indigo", tone: "indigo" as const, note: "give them a harder challenge" },
  ];

  return (
    <AppShell persona="teacher" eyebrow="Class 5 Kaveri · 22 students" title="Class health">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Spot who&apos;s slipping <em>early</em>, before a test would show it. The report card comes
        later. This is what helps you act now.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile label="Learning pace" value="On time" accent="#5E7C6A" foot="Fractions unit on schedule — no need to speed up" />
        <MetricTile label="What's sticking" value="85%" accent="#37357A" foot="of the class keeping up with the content" />
        <MetricTile label="Work captured" value="96%" foot="worksheets scanned this week" />
      </div>

      <Section title="Where the class stands" description="Every child in one of three honest bands — with names, so you know exactly who.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {BANDS.map((b) => (
            <Card key={b.title} className="p-5">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
                  <b.Icon size={15} className={b.cls} /> {b.title}
                </p>
                <Badge tone={b.tone}>
                  {Math.round((b.list.length / n) * 100)}% · {b.list.length}
                </Badge>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-faint">{b.note}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {b.list.length ? b.list.map((s) => <Chip key={s.id} id={s.id} name={s.name} />) : (
                  <span className="text-[12px] text-faint">No one here this week.</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="The class at a glance" description="Each dot is a child. Left and up means fast pace with few gaps. Down and right means the opposite.">
        <Card className="p-5">
          <ClassConstellation />
        </Card>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Section title="Sub-skill picture">
            <Card className="p-5">
              <p className="mb-4 text-[12px] text-muted">Solid = class today. Dashed = where they should be.</p>
              <GapRadar />
            </Card>
          </Section>
        </div>
        <div className="lg:col-span-3">
          <Section title="How skills have moved" description="Week by week — which skills the class is working on and how many have it secure.">
            <Card className="overflow-x-auto p-5">
              <SkillHeatCalendar />
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
