"use client";

import { useState } from "react";
import {
  GitCommitVertical,
  Check,
  Dot,
  History,
  GitCompareArrows,
  RotateCcw,
  CircleCheck,
} from "lucide-react";
import { mapVersions, type MapVersion, type VersionStatus } from "@/data/curriculum-extra";
import { Card, SectionLabel, Badge, Button } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  VersionStatus,
  { label: string; tone: "mastered" | "neutral" | "indigo" }
> = {
  published: { label: "Live now", tone: "mastered" },
  superseded: { label: "Superseded", tone: "neutral" },
  draft: { label: "Draft", tone: "indigo" },
};

function VersionNode({
  v,
  isLast,
  onCompare,
  onRestore,
}: {
  v: MapVersion;
  isLast: boolean;
  onCompare: (v: MapVersion) => void;
  onRestore: (v: MapVersion) => void;
}) {
  const live = v.status === "published";
  const meta = STATUS_META[v.status];
  return (
    <div className="relative flex gap-4">
      {/* rail */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "z-10 grid size-9 place-items-center rounded-full border bg-canvas",
            live ? "border-mastered text-mastered" : "border-line text-faint",
          )}
        >
          {live ? <CircleCheck size={18} /> : <GitCommitVertical size={18} />}
        </span>
        {!isLast && <span className="w-px flex-1 bg-line" />}
      </div>

      {/* card */}
      <Card className={cn("mb-5 flex-1", live && "border-mastered/30")}>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-lg tnum text-ink">{v.label}</span>
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
            <span className="text-[12px] text-faint">
              {new Date(v.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{v.summary}</p>

          <ul className="mt-3 space-y-1.5">
            {v.changes.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
                <Dot size={16} className="-ml-1 mt-px shrink-0 text-indigo" />
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
            <span className="text-[12px] text-faint">
              By <span className="font-medium text-ink">{v.author}</span> · {v.nodeCount} skills
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => onCompare(v)}>
                <GitCompareArrows size={14} /> Compare
              </Button>
              {!live && (
                <Button size="sm" variant="outline" onClick={() => onRestore(v)}>
                  <RotateCcw size={14} /> Restore
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function VersionTimeline() {
  const live = mapVersions.find((v) => v.status === "published");
  const [compare, setCompare] = useState<MapVersion | null>(null);
  const [restore, setRestore] = useState<MapVersion | null>(null);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <History size={15} className="text-indigo" />
          {mapVersions.length} versions on record
        </span>
        {live && (
          <span className="inline-flex items-center gap-1.5 text-faint">
            <span className="size-2 rounded-full bg-mastered" />
            {live.label} is live across every class
          </span>
        )}
      </div>

      <div>
        {mapVersions.map((v, i) => (
          <Reveal key={v.id} delay={Math.min(i, 5) * 0.05}>
            <VersionNode
              v={v}
              isLast={i === mapVersions.length - 1}
              onCompare={setCompare}
              onRestore={setRestore}
            />
          </Reveal>
        ))}
      </div>

      {/* compare drawer */}
      <Sheet
        open={compare !== null}
        onClose={() => setCompare(null)}
        eyebrow="Compare with the live map"
        title={compare ? `${compare.label} → ${live?.label ?? "live"}` : ""}
        width={520}
      >
        {compare && (
          <div className="space-y-6">
            <p className="text-[13px] leading-relaxed text-muted">
              What changed between {compare.label} and the version live today.
            </p>
            {compare.status === "published" ? (
              <Card className="bg-mastered-soft/30 p-4">
                <p className="flex items-center gap-2 text-[13px] text-ink">
                  <Check size={15} className="text-mastered" />
                  This is the live map — nothing to compare against.
                </p>
              </Card>
            ) : (
              <div>
                <SectionLabel className="mb-2">Changes since {compare.label}</SectionLabel>
                <div className="overflow-hidden rounded-xl border border-line">
                  {compare.changes.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 border-b border-line px-3.5 py-2.5 last:border-b-0"
                    >
                      <GitCommitVertical size={14} className="mt-0.5 shrink-0 text-indigo" />
                      <span className="text-[13px] leading-relaxed text-ink">{c}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between rounded-xl bg-canvas px-4 py-3">
                  <span className="text-[12.5px] text-muted">Skills on the map</span>
                  <span className="text-[13px] font-medium text-ink tnum">
                    {compare.nodeCount} <span className="text-faint">→ {live?.nodeCount ?? compare.nodeCount}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Sheet>

      {/* restore confirm drawer */}
      <Sheet
        open={restore !== null}
        onClose={() => setRestore(null)}
        eyebrow="Restore a version"
        title={restore ? `Restore ${restore.label}` : ""}
        width={460}
      >
        {restore && (
          <div className="space-y-5">
            <p className="text-[13.5px] leading-relaxed text-ink">
              Restoring {restore.label} makes it the working draft again. It does not go live to
              classes on its own — it opens for review first, so the change is still a person&apos;s
              decision.
            </p>
            <Card className="bg-canvas p-4">
              <SectionLabel className="mb-1.5">From {restore.label}</SectionLabel>
              <p className="text-[13px] leading-relaxed text-muted">{restore.summary}</p>
            </Card>
            <div className="flex items-center gap-2.5 border-t border-line pt-4">
              <Button onClick={() => setRestore(null)}>
                <RotateCcw size={14} /> Open as a draft
              </Button>
              <Button variant="ghost" onClick={() => setRestore(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
