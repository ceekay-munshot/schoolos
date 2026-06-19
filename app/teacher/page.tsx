"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, ArrowRight, Users, Radio, ChevronRight } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import {
  teacherProfiles,
  teacherById,
  classesForTeacher,
  type TeacherClass,
} from "@/data/teacher-profiles";
import { TeacherToggle } from "@/components/teacher/TeacherToggle";
import { Avatar } from "@/components/ui/avatar";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* "Today" is Thursday. We anchor the day at 10:30 so one class is live and the
   next is coming up — every teacher has a 10:15 block, so it always reads true. */
const NOW = "10:30";
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

function pickNowNext(classes: TeacherClass[]) {
  const sorted = [...classes].sort((a, b) => toMin(a.start) - toMin(b.start));
  const now = toMin(NOW);
  const live = sorted.find((c) => toMin(c.start) <= now && now < toMin(c.end));
  const next = sorted.find((c) => toMin(c.start) > now);
  return { live, next };
}

function MoveLine({ c }: { c: TeacherClass }) {
  return (
    <div className="mt-3 rounded-xl border border-line bg-canvas p-3.5">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-indigo">
        <Users size={12} /> One move
      </p>
      <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-ink">{c.oneMove.headline}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{c.oneMove.why}</p>
      <p className="mt-2 flex flex-wrap items-center gap-1.5">
        {c.oneMove.names.map((n) => (
          <span key={n} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface py-0.5 pl-0.5 pr-2 text-[11.5px] text-ink">
            <Avatar name={n} size={18} /> {n}
          </span>
        ))}
      </p>
    </div>
  );
}

function ClassCard({ c }: { c: TeacherClass }) {
  const concept = c.kind === "concept";
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className="mb-2 block h-1 w-9 rounded-full"
            style={{ backgroundColor: concept ? "#37357A" : "#C8802E" }}
          />
          <p className="font-display text-lg leading-tight text-ink">{c.topic}</p>
          <p className="mt-0.5 text-[12.5px] text-muted">{c.klass}</p>
        </div>
        <Badge tone={concept ? "indigo" : "saffron"} className="shrink-0">{concept ? "Concept" : "PATH"}</Badge>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-faint">
        <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {c.start}–{c.end}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {c.room}</span>
      </div>

      <MoveLine c={c} />

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <Link
          href={`/teacher/class/${c.id}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-indigo hover:text-indigo-ink"
        >
          Open class <ArrowRight size={14} />
        </Link>
        {c.hero && (
          <Link
            href="/teacher/block/blk-thu-0900"
            className="text-[12px] text-muted hover:text-ink"
          >
            Open full block prep →
          </Link>
        )}
      </div>
    </Card>
  );
}

function AnchorTile({ label, c, live }: { label: string; c?: TeacherClass; live?: boolean }) {
  if (!c) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <SectionLabel>{label}</SectionLabel>
        <p className="mt-2 text-[14px] text-muted">Nothing more scheduled — the day is yours to prep.</p>
      </div>
    );
  }
  const concept = c.kind === "concept";
  return (
    <Link
      href={`/teacher/class/${c.id}`}
      className={cn(
        "group block rounded-2xl border p-5 transition-shadow hover:shadow-lift",
        live ? "border-indigo/25 bg-indigo-soft/40" : "border-line bg-surface",
      )}
    >
      <div className="flex items-center justify-between">
        <SectionLabel className={live ? "text-indigo" : undefined}>{label}</SectionLabel>
        {live ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-indigo">
            <Radio size={12} className="live-dot" /> In this hour
          </span>
        ) : (
          <Badge tone={concept ? "indigo" : "saffron"}>{concept ? "Concept" : "PATH"}</Badge>
        )}
      </div>
      <p className="mt-2 font-display text-[22px] leading-tight text-ink">{c.topic}</p>
      <p className="mt-1 text-[13px] text-muted">{c.klass}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-faint">
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {c.start}–{c.end}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {c.room}</span>
      </div>
      <p className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-indigo">
        {c.oneMove.headline}
        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}

export default function TeacherToday() {
  const [teacherId, setTeacherId] = useState(teacherProfiles[0].id);
  const teacher = teacherById(teacherId)!;
  const classes = [...classesForTeacher(teacherId)].sort((a, b) => toMin(a.start) - toMin(b.start));
  const { live, next } = pickNowNext(classes);

  return (
    <AppShell
      persona="teacher"
      eyebrow="Thursday, 18 June · My schedule"
      title={`${teacher.honorific} ${teacher.name}`}
    >
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[14px] leading-relaxed text-muted">
          {teacher.blurb} One clear move per class today — everyone else has a task ready. Depth is one tap away.
        </p>
        <TeacherToggle value={teacherId} onChange={setTeacherId} />
      </div>

      <Section className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AnchorTile label="Now" c={live} live />
          <AnchorTile label="Next" c={next} />
        </div>
      </Section>

      <Section title="Today's classes" description={`${classes.length} classes · ${classes.filter((c) => c.kind === "concept").length} Concept, ${classes.filter((c) => c.kind === "path").length} PATH`}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      </Section>

      <p className="flex items-center gap-2 text-[12px] text-faint">
        Works without internet · last saved a few minutes ago. Nothing today needs the network.
      </p>
    </AppShell>
  );
}
