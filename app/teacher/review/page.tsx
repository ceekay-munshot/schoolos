import { ScanLine, Scale, FileCheck2, RefreshCw } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { reviewQueue } from "@/data/coach";
import { studentById } from "@/data/students";
import { nodeById } from "@/data/competency";
import { OverrideControl } from "@/components/patterns/OverrideControl";
import { AIStatus } from "@/components/patterns/Signals";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, Button } from "@/components/ui/primitives";

const GROUPS = [
  { kind: "low-confidence" as const, title: "Low-confidence captures", icon: ScanLine, blurb: "The system won't guess on a messy scan — a misread slip vs a real misconception would poison the diagnosis." },
  { kind: "judgment" as const, title: "Judgment calls — yours to decide", icon: Scale, blurb: "The tutor flags the mechanical layer and never scores thinking. Meaning, argument and voice are your call." },
  { kind: "content" as const, title: "Content to approve", icon: FileCheck2, blurb: "Assembled from approved generators — a quick check before it reaches a child." },
];

export default function ReviewQueue() {
  return (
    <AppShell persona="teacher" eyebrow="Human in the loop" title="Review queue">
      <p className="mb-8 max-w-2xl text-[14px] leading-relaxed text-muted">
        Evidence first, AI suggestion second, your decision always. A short, finite list — not a
        scrolling feed of alerts.
      </p>

      <div className="space-y-9">
        {GROUPS.map((g) => {
          const items = reviewQueue.filter((r) => r.kind === g.kind);
          if (!items.length) return null;
          const Icon = g.icon;
          return (
            <Section key={g.kind} title={<span className="inline-flex items-center gap-2"><Icon size={18} className="text-indigo" /> {g.title}</span>} description={g.blurb}>
              <div className="space-y-3">
                {items.map((item) => {
                  const s = item.studentId ? studentById(item.studentId) : undefined;
                  const node = item.nodeId ? nodeById(item.nodeId) : undefined;
                  return (
                    <Card key={item.id} className="p-5">
                      <div className="flex items-start gap-4">
                        {s ? <Avatar name={s.name} size={40} /> : (
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sand text-faint"><FileCheck2 size={18} /></span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[14px] font-medium text-ink">{item.summary}</p>
                            {s && <Badge tone="neutral">{s.name}</Badge>}
                            <AIStatus status="human-review" className="ml-auto" />
                          </div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.detail}</p>
                          {node && <p className="mt-1.5 font-mono text-[11px] text-faint">{node.id} · {node.statement}</p>}
                          <div className="mt-3 flex items-center gap-2">
                            {g.kind === "low-confidence" && (
                              <Button size="sm" variant="outline"><RefreshCw size={13} /> Re-scan</Button>
                            )}
                            <OverrideControl initial="pending" size="sm" decider="you" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Section>
          );
        })}
      </div>
    </AppShell>
  );
}
