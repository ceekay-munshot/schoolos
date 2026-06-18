import Link from "next/link";
import { ArrowLeft, Clock, FileText, Repeat, Rocket, TrendingUp, LifeBuoy } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { blockById } from "@/data/timetable";
import { lessonPlanForBlock, worksheetById } from "@/data/lessonplans";
import { heroClassStudents, studentById } from "@/data/students";
import { nodeById } from "@/data/competency";
import { OneMoveCard } from "@/components/patterns/OneMoveCard";
import { OverrideControl } from "@/components/patterns/OverrideControl";
import { StudentInspector } from "@/components/patterns/StudentInspector";
import { Avatar } from "@/components/ui/avatar";
import { Badge, Card, SectionLabel } from "@/components/ui/primitives";

const SECTION_TONE: Record<string, string> = {
  Instruction: "#37357A",
  "1:1 Talk-buddy": "#5E7C6A",
  "Self-work": "#C0913A",
  Activity: "#C8802E",
};
const DIFF_TONE = { support: "practising", core: "indigo", stretch: "mastered" } as const;

export default async function BlockPrep({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const block = blockById(id);
  const plan = lessonPlanForBlock(id);

  if (!block) {
    return (
      <AppShell persona="teacher" title="Block not found">
        <Link href="/teacher" className="text-indigo">← Back to the week</Link>
      </AppShell>
    );
  }

  const totalMin = plan?.sections.reduce((a, s) => a + s.minutes, 0) ?? 0;
  const racing = heroClassStudents.filter((s) => s.masteryVelocity >= 2.4);
  const support = (plan?.oneMove.studentIds ?? []).map((sid) => studentById(sid)!);

  return (
    <AppShell
      persona="teacher"
      eyebrow={
        <Link href="/teacher" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> {block.klass} · {block.room}
        </Link>
      }
      title="Block prep · Maths · Fractions"
      actions={
        <Badge tone="neutral" className="hidden h-9 px-3 sm:inline-flex">
          <Clock size={13} /> {block.start}–{block.end} · {totalMin} min planned
        </Badge>
      }
    >
      {!plan ? (
        <Card className="p-10 text-center">
          <p className="font-display text-xl text-ink">The plan generates the evening before.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Tomo drafts this block&apos;s lesson plan and differentiated worksheets overnight from
            yesterday&apos;s captured work. Today&apos;s Class 5 Kaveri block is ready to preview.
          </p>
          <Link href="/teacher/block/blk-thu-0900" className="mt-5 inline-flex text-sm font-medium text-indigo">
            Open today&apos;s ready block →
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          <OneMoveCard oneMove={plan.oneMove} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* lesson plan */}
            <div className="lg:col-span-3">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl text-ink">AI-proposed lesson plan</h2>
                <span className="text-[12px] text-faint">{plan.generatedBy}</span>
              </div>
              <Card>
                <div className="divide-y divide-line">
                  {plan.sections.map((sec) => (
                    <div key={sec.kind} className="flex gap-4 p-5">
                      <div className="flex w-14 shrink-0 flex-col items-center">
                        <span
                          className="grid size-9 place-items-center rounded-xl text-[13px] font-semibold text-white tnum"
                          style={{ backgroundColor: SECTION_TONE[sec.kind] }}
                        >
                          {sec.minutes}
                        </span>
                        <span className="mt-1 text-[10px] text-faint">min</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-faint">{sec.kind}</p>
                        <p className="mt-0.5 text-[15px] font-medium text-ink">{sec.title}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted">{sec.detail}</p>
                        <p className="mt-2 rounded-lg bg-indigo-soft/60 px-2.5 py-1.5 text-[12px] text-indigo">
                          {sec.aiNote}
                        </p>
                        <div className="mt-3">
                          <OverrideControl initial={sec.decision === "pending" ? "pending" : "accepted"} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line bg-canvas px-5 py-3 text-[12px] text-faint">
                  Every section carries accept / edit / reject. You are the decider of record —
                  the AI does the diagnostic legwork, never the teaching.
                </div>
              </Card>
            </div>

            {/* pre-block insight + worksheets */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <div className="p-5">
                  <SectionLabel>Pre-block insight</SectionLabel>
                  <div className="mt-3 space-y-4">
                    <div>
                      <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-gap">
                        <LifeBuoy size={14} /> Needs you today
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {support.map((s) => (
                          <StudentInspector
                            key={s.id}
                            studentId={s.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 text-[12px] text-ink transition-colors hover:bg-sand"
                          >
                            <Avatar name={s.name} size={22} /> {s.name.split(" ")[0]}
                          </StudentInspector>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-mastered">
                        <Rocket size={14} /> Racing — needs nothing
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {racing.map((s) => (
                          <StudentInspector
                            key={s.id}
                            studentId={s.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 text-[12px] text-ink transition-colors hover:bg-sand"
                          >
                            <Avatar name={s.name} size={22} /> {s.name.split(" ")[0]}
                          </StudentInspector>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div>
                <h2 className="mb-3 font-display text-xl text-ink">Differentiated worksheets</h2>
                <div className="space-y-3">
                  {plan.worksheetIds.map((wid) => {
                    const w = worksheetById(wid)!;
                    return (
                      <Card key={w.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink">
                              <FileText size={14} className="text-faint" /> {w.title}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-faint">
                              {w.targetNodeIds.map((n) => nodeById(n)?.id).join(" · ")}
                            </p>
                          </div>
                          <Badge tone={DIFF_TONE[w.difficulty]} className="shrink-0 capitalize">
                            {w.difficulty}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted">
                          <span>{w.forStudentIds.length} students</span>
                          {w.includesSpacedReview && (
                            <span className="inline-flex items-center gap-1"><Repeat size={11} /> spaced review</span>
                          )}
                          {w.includesStretch && (
                            <span className="inline-flex items-center gap-1"><TrendingUp size={11} /> stretch item</span>
                          )}
                        </div>
                        <div className="mt-3 border-t border-line pt-3">
                          {w.reviewStatus === "needs-review" ? (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[12px] text-practising">Awaiting your review</span>
                              <OverrideControl initial="pending" size="sm" />
                            </div>
                          ) : (
                            <OverrideControl initial="accepted" size="sm" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
