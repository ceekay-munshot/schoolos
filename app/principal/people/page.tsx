import { Sparkles, HeartHandshake } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { peopleSections, type PeopleSection } from "@/data/principal-extra";
import { MetricTile } from "@/components/patterns/atoms";
import { InfoDrawer } from "@/components/patterns/InfoDrawer";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-sand">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, backgroundColor: color }} />
    </div>
  );
}

function avg(key: keyof Pick<PeopleSection, "adoption" | "independence" | "followThrough">) {
  return peopleSections.reduce((a, s) => a + s[key], 0) / peopleSections.length;
}

export default function PrincipalPeople() {
  const trainingSection = peopleSections.find((s) => s.support);

  return (
    <AppShell persona="principal" eyebrow="The system carries it, not heroics" title="People">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        The promise is that the model works through the <em>system</em>, not through any one
        teacher&apos;s brilliance. These signs show how well the system is supporting each room — read
        them as where to offer help, never as a ranking.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile label="System adoption" value={pct(avg("adoption"))} accent="#37357A" foot="rooms using the system" />
        <MetricTile label="Classroom independence" value={pct(avg("independence"))} accent="#5E7C6A" foot="children working on their own in the block" />
        <MetricTile label="Recommended-action follow-through" value={pct(avg("followThrough"))} foot="suggested next moves being done" />
      </div>

      <Section title="By section" description="How the system is landing in each room — and where a little support is already under way.">
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-3">Section</span>
            <span className="col-span-3">System adoption</span>
            <span className="col-span-3">Classroom independence</span>
            <span className="col-span-3">Recommended-action follow-through</span>
          </div>
          <div className="divide-y divide-line">
            {peopleSections.map((s) => (
              <InfoDrawer
                key={s.section}
                eyebrow="Section"
                title={s.section}
                className="grid w-full grid-cols-12 items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-sand"
                panel={
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-canvas p-4">
                      <Avatar name={s.teacher} size={40} />
                      <div>
                        <p className="font-display text-lg text-ink">{s.section}</p>
                        <p className="text-[12px] text-faint">{s.teacher} · {s.assistant}</p>
                      </div>
                    </div>
                    <div className="space-y-3.5">
                      {([
                        ["System adoption", s.adoption, "#37357A"],
                        ["Classroom independence", s.independence, "#5E7C6A"],
                        ["Recommended-action follow-through", s.followThrough, "#C0913A"],
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
                    {s.support ? (
                      <div className="rounded-xl border border-indigo/20 bg-indigo-soft/30 p-4">
                        <Badge tone="indigo"><Sparkles size={11} /> Training opportunity</Badge>
                        <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.support}</p>
                      </div>
                    ) : (
                      <p className="rounded-xl bg-canvas p-3 text-[13px] leading-relaxed text-muted">
                        The system is landing well here — no extra support needed right now.
                      </p>
                    )}
                  </div>
                }
              >
                <div className="col-span-3">
                  <p className="inline-flex flex-wrap items-center gap-2 text-[14px] font-medium text-ink">
                    {s.section}
                    {s.support && (
                      <Badge tone="indigo">
                        <Sparkles size={11} /> Training opportunity
                      </Badge>
                    )}
                  </p>
                  <p className="text-[12px] text-faint">{s.teacher} · {s.assistant}</p>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <Bar value={s.adoption} color="#37357A" />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(s.adoption)}</span>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <Bar value={s.independence} color="#5E7C6A" />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(s.independence)}</span>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <Bar value={s.followThrough} color="#C0913A" />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(s.followThrough)}</span>
                </div>
              </InfoDrawer>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-[12px] text-faint">
          The system never judges a teacher on its own. A lower number is a nudge to offer support —
          planning together and a paired session — not a mark against anyone.
        </p>
      </Section>

      {trainingSection && (
        <Section title="Support under way">
          <Card className="flex items-start gap-4 border-indigo/20 bg-indigo-soft/30 p-6">
            <HeartHandshake size={22} className="mt-0.5 shrink-0 text-indigo" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-lg text-ink">{trainingSection.section}</p>
                <Badge tone="indigo">
                  <Sparkles size={11} /> Training opportunity
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
                {trainingSection.support}
              </p>
              <p className="mt-3 text-[12px] text-faint">
                This is support, with a named mentor and a clear next session — the goal is a
                confident room, reached together.
              </p>
            </div>
          </Card>
        </Section>
      )}
    </AppShell>
  );
}
