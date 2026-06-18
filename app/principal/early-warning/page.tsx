import { TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { earlyWarning } from "@/data/metrics";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

export default function EarlyWarning() {
  const rows = earlyWarning();

  return (
    <AppShell persona="principal" eyebrow="The retention & attrition predictor" title="Early-warning">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Which children are accumulating gap-debt that will surface as failures — and as attrition
        — months from now. This is what the report card can never give you: time to act.
      </p>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rows.map(({ student: s, risk, reason }) => (
          <StudentInspector key={s.id} studentId={s.id} className="block w-full text-left">
            <Card hover className="p-5">
              <div className="flex items-start gap-4">
                <Avatar name={s.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-medium text-ink">{s.name}</p>
                    <span className="text-[12px] text-faint">{s.grade}</span>
                    <Badge tone={risk === "elevated" ? "gap" : "practising"}>
                      <TriangleAlert size={11} /> {risk}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-muted">{reason}</p>
                  <div className="mt-3 flex gap-5">
                    <span className="text-[12px] text-faint">
                      Gap-debt <span className="font-medium tnum text-gap">{s.gapDebt}</span>
                    </span>
                    <span className="text-[12px] text-faint">
                      Retention <span className="font-medium tnum text-ink">{pct(s.retentionIntegrity)}</span>
                    </span>
                    <span className="text-[12px] text-faint">
                      Velocity <span className="font-medium tnum text-ink">{s.masteryVelocity.toFixed(1)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </StudentInspector>
        ))}
      </div>
    </AppShell>
  );
}
