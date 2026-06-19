"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import {
  teacherProfiles,
  teacherById,
  classesForTeacher,
  type TeacherClass,
  type Weekday,
} from "@/data/teacher-profiles";
import { TeacherToggle } from "@/components/teacher/TeacherToggle";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const WEEK: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_NAMES: Record<Weekday, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};
const TODAY: Weekday = "Thu";

interface WeekBlock {
  c: TeacherClass;
  day: Weekday;
  flag?: string;
}

/* Build a believable Mon–Fri week from a teacher's five classes. Concept classes
   recur across the week (as a real timetable does); PATH classes sit after lunch.
   Index into the class list keeps it deterministic and stable. */
function weekFor(teacherId: string): WeekBlock[] {
  const classes = classesForTeacher(teacherId);
  const concepts = classes.filter((c) => c.kind === "concept");
  const paths = classes.filter((c) => c.kind === "path");
  const blocks: WeekBlock[] = [];

  // Concept blocks: each of the three runs on most mornings, rotating slots.
  // Pattern picks which concepts appear each day so no day is empty or overfull.
  const conceptPlan: Record<Weekday, number[]> = {
    Mon: [0, 1],
    Tue: [0, 2],
    Wed: [0, 1],
    Thu: [0, 1, 2],
    Fri: [0, 2],
  };
  const slots = ["09:00", "10:15", "11:30"];
  WEEK.forEach((day) => {
    conceptPlan[day].forEach((ci, i) => {
      const c = concepts[ci];
      if (!c) return;
      const start = slots[i] ?? c.start;
      const flag =
        day === "Wed" && i === 0 ? "Two small-groups queued" : day === TODAY && i === 0 ? "Your one group today" : undefined;
      blocks.push({ c: { ...c, start, end: addHour(start) }, day, flag });
    });
  });

  // PATH blocks: alternate the two across the week, always after lunch.
  const pathDays: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  pathDays.forEach((day, i) => {
    const p = paths[i % paths.length];
    if (!p) return;
    blocks.push({ c: { ...p, start: "13:00", end: "14:00" }, day });
  });

  return blocks;
}

function addHour(start: string) {
  const h = Number(start.slice(0, 2));
  const m = start.slice(3);
  return `${String(h + 1).padStart(2, "0")}:${m}`;
}

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

export default function TeacherWeek() {
  const [teacherId, setTeacherId] = useState(teacherProfiles[0].id);
  const teacher = teacherById(teacherId)!;
  const blocks = weekFor(teacherId);

  return (
    <AppShell persona="teacher" eyebrow={`${teacher.honorific} ${teacher.name} · ${teacher.subject}`} title="My week">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-indigo" /> Concept block</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-saffron" /> PATH block</span>
        </div>
        <TeacherToggle value={teacherId} onChange={setTeacherId} />
      </div>
      <p className="mb-6 max-w-2xl text-[12px] leading-relaxed text-faint">
        Classes stay the same all term. Inside a block, the system makes small help groups; it never
        reshuffles the class every hour.
      </p>

      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WEEK.map((day) => {
            const isToday = day === TODAY;
            const dayBlocks = blocks
              .filter((b) => b.day === day)
              .sort((a, b) => toMin(a.c.start) - toMin(b.c.start));
            return (
              <div
                key={day}
                className={cn(
                  "rounded-2xl border p-3",
                  isToday ? "border-indigo/25 bg-indigo-soft/40" : "border-line bg-sand/40",
                )}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className={cn("text-[13px] font-semibold", isToday ? "text-indigo" : "text-ink")}>
                    {DAY_NAMES[day]}
                  </span>
                  {isToday && (
                    <span className="rounded-full bg-indigo px-2 py-0.5 text-[10px] font-medium text-white">Today</span>
                  )}
                </div>
                <div className="space-y-2.5">
                  {dayBlocks.map((b, idx) => {
                    const concept = b.c.kind === "concept";
                    return (
                      <Link
                        key={`${b.c.id}-${idx}`}
                        href={`/teacher/class/${b.c.id}`}
                        className={cn(
                          "block rounded-xl border bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift",
                          b.flag ? "border-indigo/30 ring-1 ring-indigo/20" : "border-line",
                        )}
                      >
                        <div className="mb-2 h-1 w-8 rounded-full" style={{ backgroundColor: concept ? "#37357A" : "#C8802E" }} />
                        <p className="text-[13px] font-medium leading-tight text-ink">{b.c.topic}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-faint">
                          <Clock size={10} /> {b.c.start} · {b.c.klass.replace("Class ", "Cl ")}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-faint">
                          <MapPin size={10} /> {b.c.room}
                        </p>
                        {!concept && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-faint">
                            <Users size={10} /> mixed-age group
                          </p>
                        )}
                        {b.flag && (
                          <Badge tone="indigo" className="mt-2 text-[10px]">{b.flag}</Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </AppShell>
  );
}
