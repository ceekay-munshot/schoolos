"use client";

import * as React from "react";
import { Upload, ScanLine, Check, FileText } from "lucide-react";
import { Card, SectionLabel, Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* A calm upload / scan affordance. UI only — no real file ever leaves the
   device. Choosing a way to add work shows a gentle, believable confirmation
   state held in local state, then lets the child start over. */

type Phase = "idle" | "added";

export function HomeworkUpload({ subject }: { subject: string }) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [via, setVia] = React.useState<"scan" | "upload">("scan");

  function add(how: "scan" | "upload") {
    setVia(how);
    setPhase("added");
  }

  if (phase === "added") {
    return (
      <Card className="p-6">
        <SectionLabel className="mb-4">Hand in your work</SectionLabel>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-mastered/20 bg-mastered-soft/40 px-6 py-10 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-surface text-mastered shadow-soft">
            <Check size={22} strokeWidth={2.5} />
          </span>
          <p className="mt-4 text-[15px] font-medium text-ink">Got it — your work is in</p>
          <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">
            {via === "scan"
              ? `Your ${subject.toLowerCase()} page is on its way to your teacher.`
              : `Your ${subject.toLowerCase()} file is on its way to your teacher.`}{" "}
            You will see a note here once they have looked at it.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] text-muted shadow-soft">
            <FileText size={13} className="text-indigo" />
            {subject} · added just now
          </div>
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="mt-5 text-[12.5px] font-medium text-indigo transition-colors hover:text-indigo-ink"
          >
            Add another page
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <SectionLabel className="mb-4">Hand in your work</SectionLabel>

      <button
        type="button"
        onClick={() => add("upload")}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-sand/40 px-6 py-10 text-center transition-colors",
          "hover:border-indigo/40 hover:bg-indigo-soft/20",
        )}
      >
        <span className="grid size-12 place-items-center rounded-full bg-surface text-indigo shadow-soft">
          <Upload size={20} />
        </span>
        <p className="mt-4 text-[14px] font-medium text-ink">
          Drop a photo of your {subject.toLowerCase()} work here
        </p>
        <p className="mt-1 text-[12.5px] text-faint">or choose a file from this device</p>
      </button>

      <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-faint">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => add("scan")}
      >
        <ScanLine size={17} className="text-indigo" />
        Scan with the class device
      </Button>
      <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-faint">
        The class tablet reads your page neatly, even when the internet is slow.
      </p>
    </Card>
  );
}
