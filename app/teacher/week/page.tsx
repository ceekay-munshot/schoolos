import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { timetable, WEEK_DAYS, TODAY_DAY, HERO_BLOCK_ID } from "@/data/timetable";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const DAY_NAMES: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

export default function TeacherWeek() {
  return (
    <AppShell persona="teacher" eyebrow="Ms. Lakshmi Krishnan · Maths" title="Week">
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-indigo" /> Concept block</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-saffron" /> PATH block</span>
        <span className="text-faint">Groups stay stable through the term — the system forms small intervention groups within a block, never a new class every hour.</span>
      </div>

      <Section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {WEEK_DAYS.map((day) => {
            const isToday = day === TODAY_DAY;
            const blocks = timetable.filter((b) => b.day === day);
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
                  {blocks.map((b) => {
                    const concept = b.kind === "concept";
                    const href = concept ? `/teacher/block/${b.id}` : "/teacher/path";
                    const isHero = b.id === HERO_BLOCK_ID;
                    return (
                      <Link
                        key={b.id}
                        href={href}
                        className={cn(
                          "block rounded-xl border bg-surface p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift",
                          isHero ? "border-indigo/30 ring-1 ring-indigo/20" : "border-line",
                        )}
                      >
                        <div className="mb-2 h-1 w-8 rounded-full" style={{ backgroundColor: concept ? "#37357A" : "#C8802E" }} />
                        <p className="text-[13px] font-medium leading-tight text-ink">{b.label}</p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-faint">
                          <Clock size={10} /> {b.start} · {b.klass.replace("Class ", "Cl ")}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-faint">
                          <MapPin size={10} /> {b.room}
                        </p>
                        {b.kind === "path" && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-faint">
                            <Users size={10} /> mixed-age group
                          </p>
                        )}
                        {b.flag && (
                          <Badge tone={isHero ? "indigo" : "neutral"} className="mt-2 text-[10px]">{b.flag}</Badge>
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
