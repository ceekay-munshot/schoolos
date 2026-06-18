import { ScanLine, Check, CircleHelp, RefreshCw, WifiOff } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { reviewQueue } from "@/data/coach";
import { studentById } from "@/data/students";
import { nodeById } from "@/data/competency";
import { OverrideControl } from "@/components/patterns/OverrideControl";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, Button } from "@/components/ui/primitives";

export default function Capture() {
  const lowConfidence = reviewQueue.filter((r) => r.kind === "low-confidence");
  const scanned = 28;
  const clean = scanned - lowConfidence.length;

  return (
    <AppShell persona="teacher" eyebrow="Class 5 Kaveri · 09:00 block" title="Capture">
      <p className="mb-7 max-w-2xl text-[14px] leading-relaxed text-muted">
        Turn the class&apos;s worksheets into a quick update. Takes about a minute, not a chore. Just
        confirm what scanned cleanly, and take a look only where the system isn&apos;t sure.
      </p>

      {/* scan summary */}
      <Card className="mb-8 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex items-center gap-4 p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-indigo-soft text-indigo">
              <ScanLine size={24} />
            </span>
            <div>
              <p className="font-display text-3xl text-ink tnum">{scanned}</p>
              <p className="text-[12px] text-faint">worksheets scanned</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-mastered-soft text-mastered">
              <Check size={24} />
            </span>
            <div>
              <p className="font-display text-3xl text-ink tnum">{clean}</p>
              <p className="text-[12px] text-faint">scanned cleanly and marked</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-practising-soft text-practising">
              <CircleHelp size={24} />
            </span>
            <div>
              <p className="font-display text-3xl text-ink tnum">{lowConfidence.length}</p>
              <p className="text-[12px] text-faint">need a quick look from you</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-line bg-canvas px-6 py-3 text-[12px] text-muted">
          <WifiOff size={13} className="text-faint" /> Scanned offline. Marks and progress will save once you&apos;re back online. Nothing here waits on the cloud.
        </div>
      </Card>

      <Section
        title="Scans the system isn't sure about"
        description="The system won't guess on a messy scan. A misread mark and a real mix-up are very different, so it leaves these to you."
      >
        <div className="space-y-3">
          {lowConfidence.map((item) => {
            const s = item.studentId ? studentById(item.studentId) : undefined;
            const node = item.nodeId ? nodeById(item.nodeId) : undefined;
            return (
              <Card key={item.id} className="p-5">
                <div className="flex items-start gap-4">
                  {s && <Avatar name={s.name} size={40} />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[14px] font-medium text-ink">{item.summary}</p>
                      {s && <Badge tone="neutral">{s.name}</Badge>}
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.detail}</p>
                    {node && <p className="mt-1.5 font-mono text-[11px] text-faint">{node.id} · {node.statement}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw size={13} /> Re-scan
                      </Button>
                      <OverrideControl initial="pending" size="sm" decider="you" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </AppShell>
  );
}
