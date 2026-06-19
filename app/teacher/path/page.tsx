"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, ArrowRight, Drama, MapPin, Clock } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { teacherProfiles, teacherById, pathClasses, type TeacherClass } from "@/data/teacher-profiles";
import { Segmented } from "@/components/ui/tabs";
import { Card, Badge } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";

const ARC = [
  { stage: "Sample", body: "Try it out. Notice what pulls you in." },
  { stage: "Specialise", body: "Pick a few. Build skill and a real body of work." },
  { stage: "Master", body: "A voice you can recognise. The bar keeps rising, with no ceiling." },
];

function PathCard({ c }: { c: TeacherClass }) {
  const teacher = teacherById(c.teacherId);
  const groups = c.groups?.length ?? 0;
  return (
    <Link href={`/teacher/class/${c.id}`}>
      <Card hover className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <Badge tone="saffron"><Drama size={12} /> {c.subject.replace("PATH · ", "")}</Badge>
          <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
            <Users size={13} /> {c.roster.length}
          </span>
        </div>
        <h2 className="mt-4 font-display text-xl leading-snug text-ink">{c.topic}</h2>
        <p className="mt-1 text-[13px] text-muted">{c.klass}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-faint">
          <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {c.start}–{c.end}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {c.room}</span>
        </div>

        <p className="mt-3 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">{c.competency}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          {teacher && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
              <Avatar name={teacher.name} size={20} /> {teacher.name.split(" ")[0]}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo">
            {groups ? `${groups} groups` : "Open"} <ArrowRight size={14} />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function PathBlocks() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? pathClasses : pathClasses.filter((c) => c.teacherId === filter);

  return (
    <AppShell persona="teacher" eyebrow="Builder · Explorer · Scholar · Artist · Communicator" title="PATH blocks">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-[14px] leading-relaxed text-muted">
          PATH works differently from a Concept block. Groups are mixed-age, and what you watch is the
          work itself and how its standard rises — never a worksheet. You rate the work; the system
          tracks how it grows.
        </p>
        <Segmented
          items={[
            { id: "all", label: "All teachers" },
            ...teacherProfiles.map((t) => ({ id: t.id, label: t.name.split(" ")[0] })),
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ARC.map((a, i) => (
          <Card key={a.stage} className="p-5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-saffron-soft text-[12px] font-semibold text-saffron-deep tnum">
                {i + 1}
              </span>
              <p className="font-display text-lg text-ink">{a.stage}</p>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{a.body}</p>
          </Card>
        ))}
      </div>

      <Section title="PATH classes" description="Tap any class for its session plan, mixed-age groups and recent work.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <PathCard key={c.id} c={c} />
          ))}
        </div>
      </Section>
    </AppShell>
  );
}
