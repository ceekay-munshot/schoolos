import Link from "next/link";
import { ArrowLeft, Flag, Hand, PenLine } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { timetable, blockById } from "@/data/timetable";
import { lessonPlanForBlock } from "@/data/lessonplans";
import { heroGrouping } from "@/data/teacher-extra";
import { heroClassStudents, studentById } from "@/data/students";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/primitives";

export const dynamicParams = false;
export function generateStaticParams() {
  return timetable.map((b) => ({ id: b.id }));
}

export default async function LiveBlock({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = blockById(id);
  const plan = lessonPlanForBlock(id);
  if (!block) {
    return (
      <AppShell persona="teacher" title="Live">
        <Link href="/teacher" className="text-indigo">← Today</Link>
      </AppShell>
    );
  }

  // The current lesson section (the self-work window — where the one-move pull happens).
  const current = plan?.sections.find((s) => s.kind === "Self-work") ?? plan?.sections[0];
  const group = heroGrouping.teacherGroup.map((sid) => studentById(sid)!);

  return (
    <AppShell
      persona="teacher"
      eyebrow={
        <Link href={`/teacher/block/${id}`} className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> Block prep
        </Link>
      }
      title="Live"
      maxWidth="max-w-[820px]"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted">{block.klass} · {block.room}</p>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gap">
            <span className="size-2 rounded-full bg-gap live-dot" /> Live · {block.start}
          </span>
        </div>

        {/* the only thing that matters right now */}
        {current && (
          <Card className="overflow-hidden">
            <div className="bg-indigo-soft/50 p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo">Now · {current.kind}</p>
              <h2 className="mt-2 font-display text-[28px] leading-tight text-ink">{current.title}</h2>
              <p className="mt-2 text-[14px] text-muted">{current.detail}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-surface">
                  <div className="h-full w-[44%] rounded-full bg-indigo" />
                </div>
                <span className="shrink-0 text-[13px] font-medium tnum text-ink">14 min left</span>
              </div>
            </div>
          </Card>
        )}

        {/* the one small group to pull */}
        <Card className="p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">Your group now</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {group.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas py-1 pl-1 pr-3 text-[13px] text-ink">
                <Avatar name={s.name} size={24} /> {s.name.split(" ")[0]}
              </span>
            ))}
            <span className="text-[12px] text-faint">· equivalent fractions, at the wall</span>
          </div>
        </Card>

        {/* quick flag — capture a moment without breaking flow */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-faint">Quick flag</p>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-faint"><Hand size={12} /> tap a name to note a moment</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {heroClassStudents.slice(0, 12).map((s) => (
              <span key={s.id} className="cursor-default rounded-full bg-sand px-2.5 py-1 text-[12px] text-muted transition-colors hover:bg-line/70 hover:text-ink">
                {s.name.split(" ")[0]}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-line px-2.5 py-1 text-[12px] text-faint">+ more</span>
          </div>
          <div className="mt-3 flex gap-2 text-[12px] text-faint">
            <Flag size={13} /> Flags become evidence after the block — never a live alert.
          </div>
        </Card>

        {/* elementary: paper-first, no student tutor (rule #3) */}
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-sand/50 p-4 text-[13px] text-muted">
          <PenLine size={16} className="mt-0.5 shrink-0 text-faint" />
          This is an elementary block — paper-first, no student screens. The AI tutor only appears
          from middle school, so there are no tutor exceptions to watch here.
        </div>
      </div>
    </AppShell>
  );
}
