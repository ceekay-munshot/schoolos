import * as React from "react";
import { Clock } from "lucide-react";
import type { CurrentClass } from "@/data/student-profiles";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";

/* "What your teacher planned" — the current class's lesson plan, shown warmly
   and read-only, with the teacher's own prep note up top. The child sees the
   plan their teacher made; they do not edit it. */

export function LessonPlanCard({ current }: { current: CurrentClass }) {
  const total = current.plan.reduce((a, s) => a + s.minutes, 0);

  return (
    <Card className="overflow-hidden">
      {/* the teacher's note, in their voice */}
      <div className="flex items-start gap-3 border-b border-line bg-sand/50 p-5">
        <Avatar name={current.teacherName} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-ink">{current.teacherName}</p>
          <p className="text-[12px] text-faint">
            {current.subject} · {current.room} · {current.time}
          </p>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
            &ldquo;{current.prepNote}&rdquo;
          </p>
        </div>
      </div>

      {/* the read-only plan */}
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <SectionLabel>The plan for {current.topic}</SectionLabel>
          <Badge tone="neutral">
            <Clock size={11} /> {total} min
          </Badge>
        </div>

        <ol className="relative space-y-4 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-line">
          {current.plan.map((step, i) => (
            <li key={i} className="relative flex gap-3.5">
              <span className="z-10 grid size-7 shrink-0 place-items-center rounded-full border border-line bg-surface text-[12px] font-semibold text-indigo tnum shadow-soft">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[14px] font-medium text-ink">{step.title}</p>
                  <span className="shrink-0 text-[11px] text-faint tnum">{step.minutes} min</span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
