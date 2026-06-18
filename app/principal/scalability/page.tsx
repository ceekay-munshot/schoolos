import { LifeBuoy } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { schoolHealth } from "@/data/metrics";
import { MetricTile } from "@/components/patterns/atoms";
import { Card, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

/* Section-level operating data — the proof the model runs on the system, not heroics. */
const sections = [
  { name: "Class 5 · Kaveri", teacher: "L. Krishnan", followThrough: 0.92, calm: 0.81 },
  { name: "Class 5 · Ganga", teacher: "S. Rao", followThrough: 0.88, calm: 0.79 },
  { name: "Class 6 · Yamuna", teacher: "A. Bose", followThrough: 0.9, calm: 0.86 },
  { name: "Class 4 · Narmada", teacher: "P. Singh", followThrough: 0.81, calm: 0.72, support: true },
  { name: "Class 6 · Kaveri", teacher: "R. Iyer", followThrough: 0.87, calm: 0.83 },
];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-sand">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, backgroundColor: color }} />
    </div>
  );
}

export default function Scalability() {
  return (
    <AppShell persona="principal" eyebrow="The scalability claim, operationalised" title="Scalability">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Is the recommended one-move actually being run? Is the calm room actually calm? This is
        where the USP stops being a slogan — success tracking to the <em>system</em>, not to any
        one teacher&apos;s brilliance.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricTile label="Teacher-action follow-through" value={pct(schoolHealth.teacherActionFollowThrough)} accent="#37357A" foot="recommended moves actually run" />
        <MetricTile label="Independent-work ratio" value={pct(schoolHealth.independentWorkRatio)} accent="#5E7C6A" foot="the calm-room signal" />
        <MetricTile label="Tutor utilisation" value={pct(schoolHealth.tutorUtilisation)} foot="middle & high self-work" />
      </div>

      <Section title="By section" description="Where teachers are thriving — and where one needs support, not blame.">
        <Card>
          <div className="grid grid-cols-12 gap-4 border-b border-line px-5 py-3 text-[11px] font-medium uppercase tracking-wide text-faint">
            <span className="col-span-4">Section</span>
            <span className="col-span-4">One-move follow-through</span>
            <span className="col-span-4">Calm-room (independent work)</span>
          </div>
          <div className="divide-y divide-line">
            {sections.map((s) => (
              <div key={s.name} className="grid grid-cols-12 items-center gap-4 px-5 py-4">
                <div className="col-span-4">
                  <p className="inline-flex items-center gap-2 text-[14px] font-medium text-ink">
                    {s.name}
                    {s.support && <Badge tone="practising"><LifeBuoy size={11} /> support</Badge>}
                  </p>
                  <p className="text-[12px] text-faint">{s.teacher}</p>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <Bar value={s.followThrough} color={s.support ? "#C0913A" : "#37357A"} />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(s.followThrough)}</span>
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <Bar value={s.calm} color={s.support ? "#C0913A" : "#5E7C6A"} />
                  <span className="w-9 shrink-0 text-right text-[12px] tnum text-ink">{pct(s.calm)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-3 text-[12px] text-faint">
          The AI never auto-judges a teacher. A low number is a prompt for support — co-planning,
          not a performance flag.
        </p>
      </Section>
    </AppShell>
  );
}
