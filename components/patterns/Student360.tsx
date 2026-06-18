import { GraduationCap, Quote, MessageSquare, Flag } from "lucide-react";
import { studentById } from "@/data/students";
import { masteryFor } from "@/data/mastery";
import { nodeById } from "@/data/competency";
import { pathDefs } from "@/data/paths";
import { tutorSessionsByStudent } from "@/data/tutorSessions";
import { coachNotesForStudent } from "@/data/coach";
import { CompetencyMap } from "@/components/viz/CompetencyMap";
import { MasteryChip, Delta } from "./atoms";
import { Avatar } from "@/components/ui/avatar";
import { Badge, SectionLabel } from "@/components/ui/primitives";
import { pct } from "@/lib/utils";

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-5">
      <SectionLabel className="mb-3">{label}</SectionLabel>
      {children}
    </section>
  );
}

export function Student360({ studentId }: { studentId: string }) {
  const s = studentById(studentId);
  if (!s) return null;
  const states = masteryFor(studentId);
  const misconceptions = states
    .filter((m) => m.status === "gap" || m.status === "practising" || m.status === "faded")
    .map((m) => ({ node: nodeById(m.nodeId)!, m }))
    .filter((x) => x.node?.misconceptions.length);
  const sessions = tutorSessionsByStudent(studentId);
  const notes = coachNotesForStudent(studentId);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-start gap-4">
        <Avatar name={s.name} size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl text-ink">{s.name}</h3>
          <p className="text-[13px] text-muted">
            {s.grade} · {s.house} House · joined {s.joinedYear}
          </p>
          {s.flag && (
            <Badge tone={s.flag.tone === "watch" ? "gap" : "mastered"} className="mt-2">
              <Flag size={11} /> {s.flag.reason}
            </Badge>
          )}
        </div>
      </div>
      <p className="text-[14px] leading-relaxed text-ink">{s.headline}</p>

      {/* leading metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <SectionLabel>Mastery velocity</SectionLabel>
          <p className="mt-1 font-display text-2xl text-ink tnum">{s.masteryVelocity.toFixed(1)}</p>
          <div className="mt-0.5"><Delta value={s.masteryVelocity} expected={s.expectedVelocity} /> <span className="text-[11px] text-faint">vs {s.expectedVelocity.toFixed(1)} expected</span></div>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <SectionLabel>Gap-debt</SectionLabel>
          <p className="mt-1 font-display text-2xl tnum" style={{ color: s.gapDebt >= 2 ? "#B25B43" : "#1C1B19" }}>{s.gapDebt}</p>
          <p className="mt-0.5 text-[11px] text-faint">unresolved prerequisite gaps</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <SectionLabel>Retention integrity</SectionLabel>
          <p className="mt-1 font-display text-2xl text-ink tnum">{pct(s.retentionIntegrity)}</p>
          <p className="mt-0.5 text-[11px] text-faint">mastered nodes still passing recall</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <SectionLabel>Independent work</SectionLabel>
          <p className="mt-1 font-display text-2xl text-ink tnum">{pct(s.independentWorkRatio)}</p>
          <p className="mt-0.5 text-[11px] text-faint">worked without intervention</p>
        </div>
      </div>

      {/* maths map */}
      <Block label="Position on the Fractions map">
        <CompetencyMap studentId={studentId} />
      </Block>

      {/* named misconceptions */}
      {misconceptions.length > 0 && (
        <Block label="Named misconceptions">
          <ul className="space-y-2.5">
            {misconceptions.map(({ node, m }) => (
              <li key={node.id} className="flex items-start gap-3 rounded-xl bg-canvas p-3">
                <MasteryChip status={m.status} />
                <div className="min-w-0">
                  <p className="text-[13px] text-ink">&ldquo;{node.misconceptions[0]}&rdquo;</p>
                  <p className="mt-0.5 font-mono text-[11px] text-faint">{node.id}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {/* paths */}
      <Block label="PATH progress & standard">
        <div className="space-y-3">
          {s.paths.map((e) => {
            const def = pathDefs[e.path];
            return (
              <div key={e.path}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="inline-flex items-center gap-2 font-medium text-ink">
                    <span className="text-saffron-deep">{def.glyph}</span> {def.name}
                    <span className="text-[11px] capitalize text-faint">· {e.stage}</span>
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
      </Block>

      {/* tutor usage */}
      {sessions.length > 0 && (
        <Block label="AI-tutor usage (middle school)">
          <div className="space-y-2.5">
            {sessions.map((t) => (
              <div key={t.id} className="rounded-xl border border-line bg-surface p-3">
                <div className="flex items-center justify-between">
                  <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                    <GraduationCap size={14} className="text-indigo" /> {t.topic}
                  </p>
                  <span className="text-[11px] text-faint tnum">{t.turns} turns · {t.minutes}m</span>
                </div>
                <p className="mt-1 text-[12px] text-muted">Stuck: {t.stuckPoint}. Unlocked by {t.unlockedBy}.</p>
                {t.flaggedForTeacher && (
                  <p className="mt-2 rounded-lg bg-practising-soft px-2.5 py-1.5 text-[12px] text-practising">
                    ⚑ {t.flaggedForTeacher}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* coach notes — the shared picture */}
      {notes.length > 0 && (
        <Block label="Coach's notes — the human truth">
          {notes.map((n) => (
            <div key={n.id} className="space-y-3 rounded-2xl bg-canvas p-4">
              <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink">
                <Quote size={14} className="mt-0.5 shrink-0 text-faint" /> {n.context}
              </p>
              <div className="rounded-xl border border-line bg-surface p-3">
                <SectionLabel>The plan</SectionLabel>
                <p className="mt-1 text-[13px] text-ink">{n.plan}</p>
              </div>
              <div className="grid gap-2 text-[12px] sm:grid-cols-2">
                <p className="rounded-lg bg-surface p-2.5 text-muted">
                  <MessageSquare size={12} className="mr-1 inline text-faint" /> Student: &ldquo;{n.studentVoice}&rdquo;
                </p>
                <p className="rounded-lg bg-surface p-2.5 text-muted">
                  <MessageSquare size={12} className="mr-1 inline text-faint" /> Parent: &ldquo;{n.parentVoice}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </Block>
      )}
    </div>
  );
}
