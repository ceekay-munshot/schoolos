import { ScanLine, GraduationCap, TriangleAlert } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { schoolHealth } from "@/data/metrics";
import { MasteryRing } from "@/components/viz/charts";
import { Card, SectionLabel } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

const captureBySection = [
  { name: "Class 5 · Kaveri", value: 0.96 },
  { name: "Class 5 · Ganga", value: 0.94 },
  { name: "Class 4 · Narmada", value: 0.89 },
  { name: "Class 6 · Yamuna", value: 0.97 },
  { name: "Class 6 · Kaveri", value: 0.93 },
];

export default function Compliance() {
  return (
    <AppShell persona="principal" eyebrow="The engine's eyesight" title="Capture & usage compliance">
      <Card className="mb-8 flex items-start gap-3 border-practising/25 bg-practising-soft/40 p-4">
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-practising" />
        <p className="text-[13px] leading-relaxed text-ink">
          If capture lapses, the whole engine goes blind — every diagnosis downstream is built on
          captured work. This is an ops-critical health metric, not a vanity one.
        </p>
      </Card>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex items-center gap-6 p-6">
          <MasteryRing value={schoolHealth.captureCompliance} color="#5E7C6A" size={104} caption="capture" />
          <div>
            <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
              <ScanLine size={18} className="text-mastered" /> Worksheets scanned
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {pct(schoolHealth.captureCompliance)} of elementary worksheets captured cleanly and
              on time this week.
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-6 p-6">
          <MasteryRing value={schoolHealth.tutorUtilisation} color="#37357A" size={104} caption="tutor" />
          <div>
            <p className="inline-flex items-center gap-2 font-display text-lg text-ink">
              <GraduationCap size={18} className="text-indigo" /> AI-tutor utilisation
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {pct(schoolHealth.tutorUtilisation)} of middle & high students used the tutor in
              self-work this week.
            </p>
          </div>
        </Card>
      </div>

      <Section title="Capture by section">
        <Card className="p-6">
          <SectionLabel className="mb-5">Worksheets scanned this week</SectionLabel>
          <div className="space-y-3.5">
            {captureBySection.map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-[13px] text-muted">{s.name}</span>
                <div className="h-2.5 flex-1 rounded-full bg-sand">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.value * 100}%`, backgroundColor: s.value < 0.9 ? "#C0913A" : "#5E7C6A" }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-[13px] font-medium tnum text-ink">{pct(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
