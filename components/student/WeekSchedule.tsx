import * as React from "react";
import { Clock, MapPin } from "lucide-react";
import type { DaySchedule, ScheduleBlock } from "@/data/student-profiles";
import { SectionLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* A calm week strip: five day columns, today gently lifted. Concept blocks read
   as solid surface cards; PATH blocks carry a saffron tint and a small glyph so
   the two kinds are distinct at a glance. Read-only. */

const TODAY: DaySchedule["day"] = "Thu";

const DAY_LABEL: Record<DaySchedule["day"], string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

function BlockChip({ block }: { block: ScheduleBlock }) {
  const isPath = block.kind === "path";
  return (
    <div
      className={cn(
        "rounded-xl border p-3 transition-colors",
        isPath
          ? "border-saffron/20 bg-saffron-soft/40"
          : "border-line bg-surface shadow-soft",
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] text-faint tnum">
        <Clock size={11} className="shrink-0" />
        {block.start}–{block.end}
      </div>
      <p
        className={cn(
          "mt-1 text-[13px] font-medium leading-snug",
          isPath ? "text-saffron-deep" : "text-ink",
        )}
      >
        {block.label}
      </p>
      <p className="mt-0.5 text-[12px] leading-snug text-muted">{block.topic}</p>
      <p className="mt-1.5 flex items-center gap-1 text-[11px] text-faint">
        <MapPin size={10} className="shrink-0" />
        {block.room}
      </p>
    </div>
  );
}

export function WeekSchedule({ week }: { week: DaySchedule[] }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>Your week</SectionLabel>
        <div className="flex items-center gap-4 text-[11px] text-faint">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[4px] border border-line bg-surface" />
            Lesson
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-[4px] border border-saffron/30 bg-saffron-soft" />
            PATH
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {week.map((d) => {
          const isToday = d.day === TODAY;
          return (
            <div
              key={d.day}
              className={cn(
                "rounded-2xl border p-3",
                isToday
                  ? "border-indigo/25 bg-indigo-soft/25 ring-1 ring-inset ring-indigo/10"
                  : "border-line bg-canvas",
              )}
            >
              <div className="mb-3 flex items-baseline justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-[13px] font-medium",
                      isToday ? "text-indigo" : "text-ink",
                    )}
                  >
                    {DAY_LABEL[d.day]}
                  </span>
                  <span className="text-[11px] text-faint tnum">{d.date}</span>
                </div>
                {isToday && (
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-indigo">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {d.blocks.map((b, i) => (
                  <BlockChip key={i} block={b} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
