import Link from "next/link";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { teacherClasses, classById, teacherById } from "@/data/teacher-profiles";
import { ClassDetail } from "@/components/teacher/ClassDetail";
import { Badge } from "@/components/ui/primitives";

export const dynamicParams = false;
export function generateStaticParams() {
  return teacherClasses.map((c) => ({ classId: c.id }));
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const c = classById(classId);

  if (!c) {
    return (
      <AppShell persona="teacher" title="Class not found">
        <Link href="/teacher" className="text-indigo">← Back to today</Link>
      </AppShell>
    );
  }

  const teacher = teacherById(c.teacherId);
  const concept = c.kind === "concept";

  return (
    <AppShell
      persona="teacher"
      eyebrow={
        <Link href="/teacher" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> {c.klass} · {c.room}
        </Link>
      }
      title={c.topic}
      actions={
        <div className="hidden items-center gap-2 sm:flex">
          <Badge tone={concept ? "indigo" : "saffron"}>{concept ? "Concept" : "PATH"}</Badge>
          <Badge tone="neutral" className="h-9 px-3">
            <Clock size={13} /> {c.start}–{c.end}
          </Badge>
        </div>
      }
    >
      <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted">
        <span>{c.subject}</span>
        <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-faint" /> {c.room}</span>
        {teacher && <span className="text-faint">{teacher.honorific} {teacher.name}</span>}
        <span className="text-faint">·</span>
        <span className="text-faint">{c.competency}</span>
      </div>

      <ClassDetail c={c} />
    </AppShell>
  );
}
