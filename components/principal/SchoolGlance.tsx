"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  schoolGlance,
  pathBreakdown,
  upcomingEvents,
  type GlancePeriod,
  type SchoolEvent,
} from "@/data/principal-extra";
import { Segmented } from "@/components/ui/tabs";
import { MetricTile } from "@/components/patterns/atoms";
import { CountUp } from "@/components/motion";
import { Card, SectionLabel, Badge } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

const EVENT_TONE: Record<SchoolEvent["kind"], "saffron" | "indigo" | "mastered" | "neutral"> = {
  parents: "saffron",
  academic: "indigo",
  path: "mastered",
  ops: "neutral",
};

export function SchoolGlance() {
  const [period, setPeriod] = useState<GlancePeriod>("week");
  const g = schoolGlance.byPeriod[period];
  const maxPath = Math.max(...pathBreakdown.map((p) => p.students));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionLabel>School at a glance</SectionLabel>
        <Segmented
          items={[
            { id: "week", label: "This week" },
            { id: "month", label: "This month" },
            { id: "term", label: "This term" },
          ]}
          value={period}
          onChange={(v) => setPeriod(v as GlancePeriod)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <MetricTile label="Total students" value={<CountUp value={schoolGlance.totalStudents} />} accent="#37357A" foot="across the campus" />
        <MetricTile label="Average attendance" value={pct(g.attendance)} foot="present, this period" />
        <MetricTile label="Course completion" value={g.completion} accent="#5E7C6A" foot="curriculum vs schedule" />
        <MetricTile label="Learning retention" value={pct(g.retention)} foot="content still sticking" />
        <MetricTile label="AI worksheets used" value={pct(g.aiWorksheets)} foot="of classes, differentiated" />
        <MetricTile label="AI tutor used" value={pct(g.aiTutor)} foot="of middle & high students" />
        <MetricTile label="Parent rating" value={`${g.parentRating.toFixed(1)}/5`} accent="#C8802E" foot={`${pct(g.parentEngagement)} engaged`} />
        <MetricTile label="Teachers" value={<CountUp value={schoolGlance.numTeachers} />} foot={`${g.teacherHours.toFixed(1)} h/day in class`} />
        <MetricTile label="Teacher NPS" value={`+${g.teacherNPS}`} accent="#5E7C6A" foot="how teachers feel" />
        <MetricTile label="Needs your attention" value={g.cases} accent="#B25B43" foot="cases to look at" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionLabel className="mb-4">Where students are across the six PATHs</SectionLabel>
          <div className="space-y-2.5">
            {pathBreakdown.map((p) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[13px] text-ink">
                  <span className="mr-1.5 text-saffron-deep">{p.glyph}</span>
                  {p.path}
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-sand">
                  <div className="h-full rounded-full bg-indigo" style={{ width: `${(p.students / maxPath) * 100}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-[13px] tnum text-muted">{p.students}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionLabel className="mb-4">Upcoming events</SectionLabel>
          <ul className="space-y-3">
            {upcomingEvents.map((e) => (
              <li key={e.title} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sand text-muted">
                  <CalendarDays size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink">{e.title}</p>
                  <p className="text-[12px] text-faint">{e.date}</p>
                </div>
                <Badge tone={EVENT_TONE[e.kind]} className="shrink-0 capitalize">{e.kind}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
