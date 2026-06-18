import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  ListChecks,
  GraduationCap,
  Drama,
  Heart,
  Quote,
  UserCheck,
  Target,
  MessageSquare,
} from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import { students, studentById } from "@/data/students";
import { insightsForStudent } from "@/data/insights";
import { checkInFor, coachNotesForStudent } from "@/data/coach";
import { masteryFor } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { pathDefs, artifactsByStudent } from "@/data/paths";
import {
  coachEvidenceFor,
  contextAnnotationsFor,
  humanPictureFor,
  planFor,
  OWNER_LABEL,
  type Owner,
} from "@/data/coach-extra";
import { Student360 } from "@/components/patterns/Student360";
import { StatusDot, Delta } from "@/components/patterns/atoms";
import { ConfidenceBadge, Freshness, AIStatus } from "@/components/patterns/Signals";
import { EvidenceDrawer } from "@/components/patterns/EvidenceDrawer";
import { Avatar } from "@/components/ui/avatar";
import { Card, Button, SectionLabel, Badge, Divider } from "@/components/ui/primitives";
import { statusLabel } from "@/lib/status";
import { relativeDays, pct } from "@/lib/utils";
import { CoachInsight } from "./CoachInsight";

export const dynamicParams = false;
export function generateStaticParams() {
  return students.map((s) => ({ id: s.id }));
}

const OWNER_TONE: Record<Owner, "indigo" | "saffron" | "mastered"> = {
  school: "indigo",
  student: "saffron",
  parent: "mastered",
};

/* A small heading used at the top of each of the three pictures. */
function PictureHead({
  icon: Icon,
  title,
  trailing,
}: {
  icon: typeof GraduationCap;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-lg bg-sand text-muted">
        <Icon size={16} />
      </span>
      <h3 className="flex-1 font-display text-[17px] text-ink">{title}</h3>
      {trailing}
    </div>
  );
}

function MetricRow({
  label,
  value,
  foot,
}: {
  label: string;
  value: React.ReactNode;
  foot?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-line py-2 first:border-t-0">
      <span className="text-[12.5px] text-muted">{label}</span>
      <span className="text-right">
        <span className="font-display text-[15px] text-ink tnum">{value}</span>
        {foot && <span className="ml-1.5 text-[11px] text-faint">{foot}</span>}
      </span>
    </div>
  );
}

export default async function CoachStudent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = studentById(id);
  if (!s) {
    return (
      <AppShell persona="coach" title="Not found">
        <Link href="/coach" className="text-indigo">← Back to caseload</Link>
      </AppShell>
    );
  }

  const insights = insightsForStudent(id);
  const checkIn = checkInFor(id);
  const note = coachNotesForStudent(id)[0];
  const states = masteryFor(id);
  const arts = artifactsByStudent(id);
  const evidence = coachEvidenceFor(id);
  const annotations = contextAnnotationsFor(id);
  const human = humanPictureFor(id);
  const plan = planFor(id);

  // academic picture: the frontier (gap / practising / faded) and a teacher observation
  const frontier =
    states.find((m) => m.status === "gap") ??
    states.find((m) => m.status === "practising") ??
    states.find((m) => m.status === "faded");
  const frontierNode = frontier ? nodeById(frontier.nodeId) : undefined;
  const retained = states.filter((m) => m.status === "retained" || m.status === "mastered").length;

  return (
    <AppShell
      persona="coach"
      eyebrow={
        <Link href="/coach" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={13} /> Caseload
        </Link>
      }
      title={s.name}
      actions={
        checkIn && (
          <Link href="/coach/checkins" className="hidden sm:block">
            <Button size="sm" variant="outline">
              <CalendarClock size={14} /> Check-in {relativeDays(checkIn.next)}
            </Button>
          </Link>
        )
      }
    >
      {/* identity strip */}
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <Avatar name={s.name} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-muted">
            {s.grade} · {s.house} House · {s.guardian.relation} {s.guardian.name} ({s.guardian.occupation})
          </p>
          <p className="mt-0.5 max-w-2xl text-[14px] leading-relaxed text-ink">{s.headline}</p>
        </div>
        <ConfidenceBadge level={s.gapDebt >= 2 ? "medium" : "high"} />
      </div>

      {/* ============ the three pictures, side by side ============ */}
      <Section
        title="The whole child"
        description="Three pictures, put together for you — school work, PATH, and the human side the data can't see."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* ---- Academic picture ---- */}
          <Card className="flex flex-col p-5">
            <PictureHead
              icon={GraduationCap}
              title="School work"
              trailing={<Freshness state="recent" />}
            />
            <div className="mb-4">
              <MetricRow
                label="Learning pace"
                value={s.masteryVelocity.toFixed(1)}
                foot={<Delta value={s.masteryVelocity} expected={s.expectedVelocity} />}
              />
              <MetricRow label="Missing basics" value={s.gapDebt} foot="gaps" />
              <MetricRow label="Sticking" value={pct(s.retentionIntegrity)} foot="still remembered" />
              <MetricRow label="Pace on the map" value={`${retained}/${states.length}`} foot="topics solid" />
            </div>
            {frontierNode && frontier && (
              <div className="rounded-xl bg-canvas p-3">
                <SectionLabel className="mb-1.5">Working on now</SectionLabel>
                <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  <StatusDot status={frontier.status} /> {statusLabel(frontier.status)} ·{" "}
                  {frontierNode.statement}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{frontier.lastEvidence}</p>
              </div>
            )}
            <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-muted">
              <Quote size={13} className="mt-0.5 shrink-0 text-faint" />
              What the teacher sees: Ms. Krishnan reads {s.name.split(" ")[0]} as{" "}
              {s.gapDebt >= 2
                ? "able to grasp the ideas — what's holding things up is one missing basic, not how far they can go."
                : s.masteryVelocity > s.expectedVelocity
                  ? "ahead of pace and ready for harder work, not more of the same."
                  : "steady and right on pace across the subject."}
            </p>
          </Card>

          {/* ---- PATH picture ---- */}
          <Card className="flex flex-col p-5">
            <PictureHead icon={Drama} title="PATH" trailing={<Freshness state="today" />} />
            <div className="space-y-3.5">
              {s.paths.map((e) => {
                const def = pathDefs[e.path];
                return (
                  <div key={e.path}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="inline-flex items-center gap-2 font-medium text-ink">
                        <span className="text-saffron-deep">{def.glyph}</span> {def.name}
                        <span className="text-[11px] capitalize text-faint">· {e.focus}</span>
                      </span>
                      <span className="tnum text-faint">{e.standard}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-sand">
                      <div className="h-full rounded-full bg-saffron" style={{ width: `${e.standard}%` }} />
                    </div>
                    <p className="mt-1 text-[12px] text-muted">{e.headline}</p>
                  </div>
                );
              })}
            </div>
            {arts.length > 0 && (
              <div className="mt-4 rounded-xl bg-canvas p-3">
                <SectionLabel className="mb-1.5">Latest work · how good</SectionLabel>
                <p className="text-[13px] font-medium text-ink">{arts[0].title}</p>
                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: i < arts[0].standardRating ? "#c8802e" : "#e4e0d7" }}
                    />
                  ))}
                  <span className="ml-1 text-[11px] text-faint">
                    {arts[0].standardRating}/5 · {arts[0].group}
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{arts[0].note}</p>
              </div>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              What they're drawn to:{" "}
              {arts.length
                ? `taking part steadily, and the work is getting better in ${pathDefs[s.paths[0].path].name}.`
                : "still trying different paths; no clear favourite yet."}
            </p>
          </Card>

          {/* ---- Human picture ---- */}
          <Card className="flex flex-col bg-indigo-soft/30 p-5">
            <PictureHead icon={Heart} title="Human" />
            {human ? (
              <div className="space-y-3.5 text-[13px] leading-relaxed">
                <div>
                  <SectionLabel className="mb-1">What they want</SectionLabel>
                  <p className="text-ink">{human.studentGoal}</p>
                </div>
                <Divider />
                <div>
                  <SectionLabel className="mb-1">What the parent worries about</SectionLabel>
                  <p className="text-muted">{human.parentConcern}</p>
                </div>
                <div>
                  <SectionLabel className="mb-1">How they're feeling</SectionLabel>
                  <p className="text-muted">{human.confidence}</p>
                </div>
                <div>
                  <SectionLabel className="mb-1">What's happening at home</SectionLabel>
                  <p className="text-muted">{human.homeContext}</p>
                </div>
                <Divider />
                <div>
                  <SectionLabel className="mb-1">Last plan</SectionLabel>
                  <p className="text-muted">{human.priorPlan}</p>
                </div>
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-muted">
                A settled, healthy picture. Nothing at home needs naming over the next two weeks —
                the next check-in is about keeping things going.
              </p>
            )}
          </Card>
        </div>

        {/* evidence behind the synthesis */}
        {evidence.length > 0 && (
          <Card className="mt-4 p-5">
            <EvidenceDrawer items={evidence} label="What this picture is based on" />
          </Card>
        )}
      </Section>

      {/* ============ logged context annotation (Brief §6.6) ============ */}
      {annotations.length > 0 && (
        <Section
          title="What you've added"
          description="Your read on a signal, saved so the system stops getting it wrong."
        >
          <div className="space-y-3">
            {annotations.map((a) => (
              <Card key={a.id} className="border-mastered/20 bg-mastered-soft/30 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-mastered-soft text-mastered">
                    <UserCheck size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-faint">
                      What the system saw: <span className="text-muted">{a.signal}</span>
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink">{a.context}</p>
                    <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-ink">
                      {a.directive}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <AIStatus status="coach-contextualized" />
                      <span className="text-[11px] text-faint">logged {relativeDays(a.date)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* ============ digest + plan + deep layer ============ */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* fortnightly insight digest */}
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">What we noticed, every two weeks</h2>
            <Freshness state="today" label="These two weeks" />
          </div>
          <p className="mb-4 text-[12.5px] leading-relaxed text-faint">
            Drafted and sorted by the system. You never get the system's words as the final truth —
            confirm them, put them in your own words, or set them aside. You also decide, item by
            item, whether each one is okay to share with the family.
          </p>
          <div className="space-y-3">
            {insights.length ? (
              insights.map((i) => (
                <CoachInsight
                  key={i.id}
                  insight={i}
                  defaultParentSafe={
                    // a low-confidence / mechanical flag isn't parent-ready by default
                    !i.evidence.toLowerCase().includes("routed to review") &&
                    i.status !== "raw"
                  }
                />
              ))
            ) : (
              <Card className="p-5 text-[13px] text-muted">
                Nothing came up these two weeks — a quiet, healthy picture.
              </Card>
            )}
          </div>

          {/* deep academic layer */}
          <div className="mt-8">
            <h2 className="mb-3 font-display text-xl text-ink">The full school-work picture</h2>
            <Card className="p-6">
              <Student360 studentId={id} />
            </Card>
          </div>
        </div>

        {/* right rail: next check-in + the live plan */}
        <div className="space-y-6 lg:col-span-2">
          {checkIn && (
            <Card className="overflow-hidden">
              <div className="bg-indigo-soft/50 p-5">
                <SectionLabel>Next check-in</SectionLabel>
                <p className="mt-1.5 font-display text-lg text-ink">
                  {relativeDays(checkIn.next)} · with student and parents
                </p>
                <p className="mt-2 flex items-start gap-2 text-[13px] text-muted">
                  <ListChecks size={15} className="mt-0.5 shrink-0 text-indigo" />
                  {checkIn.prompt}
                </p>
                <Link href="/coach/checkins">
                  <Button size="sm" className="mt-4">
                    <CalendarClock size={14} /> Open the check-in steps
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {plan && (
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <SectionLabel>Plan right now</SectionLabel>
                <Badge tone={plan.status === "on-track" ? "mastered" : "saffron"}>
                  {plan.status === "on-track" ? "Going well" : plan.status === "new" ? "Just set" : "Time to review"}
                </Badge>
              </div>
              <p className="mt-2 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink">
                <Target size={15} className="mt-0.5 shrink-0 text-indigo" />
                {plan.focus}
              </p>
              <div className="mt-4 space-y-2.5">
                {plan.commitments.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-canvas p-3">
                    <Badge tone={OWNER_TONE[c.owner]} className="shrink-0">
                      {OWNER_LABEL[c.owner]}
                    </Badge>
                    <p className="text-[12.5px] leading-relaxed text-ink">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="h-1.5 rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-mastered"
                    style={{ width: `${Math.round(plan.progress * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{plan.note}</p>
              </div>
              <Link href="/coach/plans" className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-indigo hover:text-indigo-ink">
                See all plans
              </Link>
            </Card>
          )}

          {note && (
            <Card className="p-5">
              <SectionLabel className="mb-2">From the last talk</SectionLabel>
              <p className="rounded-xl bg-canvas p-3 text-[12.5px] leading-relaxed text-ink">
                <MessageSquare size={12} className="mr-1 inline text-faint" /> Parent: &ldquo;{note.parentVoice}&rdquo;
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
