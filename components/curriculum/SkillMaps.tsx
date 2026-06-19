"use client";

import { useMemo, useState } from "react";
import { Plus, ArrowRight, GitBranch, Layers, ShieldCheck, Check } from "lucide-react";
import {
  gradeCurricula,
  authoredNodeById,
  statusCounts,
  type AuthoredNode,
  type AuthoringStatus,
  type GradeSubject,
} from "@/data/curriculum-extra";
import { Segmented } from "@/components/ui/tabs";
import { Card, SectionLabel, Badge, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";
import { EditSkillSheet, type SkillEdits } from "./EditSkillSheet";

const STATUS_LABEL: Record<AuthoringStatus, string> = {
  published: "Published",
  draft: "Draft",
  "in-review": "In review",
};

/* A node can be edited in place; we keep an overlay of local edits keyed by id
   so the map feels live without a backend. */
function applyEdits(node: AuthoredNode, edit?: SkillEdits): AuthoredNode {
  if (!edit) return node;
  return {
    ...node,
    statement: edit.statement,
    bloom: edit.bloom,
    judgmentType: edit.judgmentType,
    boardMap: edit.boardMap,
    misconceptions: edit.misconceptions,
    prerequisites: edit.prerequisites,
    status: edit.status,
  };
}

function StatusBadge({ status }: { status: AuthoringStatus }) {
  if (status === "published") return <Badge tone="mastered">{STATUS_LABEL[status]}</Badge>;
  if (status === "in-review") return <Badge tone="practising">{STATUS_LABEL[status]}</Badge>;
  return <Badge tone="neutral">{STATUS_LABEL[status]}</Badge>;
}

function NodeRow({
  node,
  onOpen,
  justSaved,
}: {
  node: AuthoredNode;
  onOpen: () => void;
  justSaved: boolean;
}) {
  return (
    <button
      onClick={onOpen}
      className="group flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-sand"
    >
      <span className="mt-0.5 hidden w-44 shrink-0 font-mono text-[11px] leading-relaxed text-faint sm:block">
        {node.id}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[14px] font-medium leading-snug text-ink">{node.statement}</span>
          {justSaved && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-mastered">
              <Check size={12} /> saved
            </span>
          )}
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-faint">
          <span className="inline-flex items-center gap-1">
            <Layers size={11} /> {node.bloom}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1",
              node.judgmentType === "judgment" ? "text-saffron-deep" : "text-muted",
            )}
          >
            {node.judgmentType === "judgment" ? "Teacher-judged" : "Machine-checkable"}
          </span>
          {node.prerequisites.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <GitBranch size={11} /> {node.prerequisites.length}{" "}
              {node.prerequisites.length === 1 ? "prerequisite" : "prerequisites"}
            </span>
          )}
          <span className="hidden font-mono text-[11px] text-faint md:inline">
            {node.boardMap.join(" · ")}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-3 self-center">
        <StatusBadge status={node.status} />
        <ArrowRight size={15} className="text-faint transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

export function SkillMaps() {
  const [gradeNum, setGradeNum] = useState(5);
  const grade = useMemo(() => gradeCurricula.find((g) => g.gradeNum === gradeNum)!, [gradeNum]);

  const [subjectId, setSubjectId] = useState(grade.subjects[0]?.subjectId ?? "maths");
  const subject: GradeSubject | undefined =
    grade.subjects.find((s) => s.subjectId === subjectId) ?? grade.subjects[0];

  // local overlay of edits + the open node
  const [edits, setEdits] = useState<Record<string, SkillEdits>>({});
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // keep subject valid when grade changes
  function selectGrade(n: number) {
    setGradeNum(n);
    const g = gradeCurricula.find((x) => x.gradeNum === n)!;
    if (!g.subjects.some((s) => s.subjectId === subjectId)) {
      setSubjectId(g.subjects[0]?.subjectId ?? "maths");
    }
  }

  const resolve = (n: AuthoredNode) => applyEdits(n, edits[n.id]);

  const allNodes = subject ? subject.strands.flatMap((s) => s.nodes).map(resolve) : [];
  const counts = statusCounts(allNodes);

  // stable list of strand names for the sheet (so its form doesn't reset on
  // unrelated re-renders)
  const strandNames = useMemo(
    () => subject?.strands.map((s) => s.name) ?? [],
    [subject],
  );

  const openNode = openId && openId !== "__new__" ? authoredNodeById(openId) : undefined;
  const openResolved = openNode ? resolve(openNode) : undefined;

  function handleSave(id: string, next: SkillEdits) {
    setEdits((e) => ({ ...e, [id]: next }));
    setOpenId(null);
    setSavedFlash(id);
    window.setTimeout(() => setSavedFlash((cur) => (cur === id ? null : cur)), 2600);
  }

  return (
    <div>
      {/* ---- grade + subject selectors ---- */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4">
          <div>
            <SectionLabel className="mb-2">Grade</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {gradeCurricula.map((g) => {
                const active = g.gradeNum === gradeNum;
                return (
                  <button
                    key={g.gradeNum}
                    onClick={() => selectGrade(g.gradeNum)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "border-indigo bg-indigo text-white shadow-soft"
                        : "border-line bg-surface text-muted hover:bg-sand hover:text-ink",
                    )}
                  >
                    {g.grade.replace("Class ", "")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
            <div>
              <SectionLabel className="mb-2">Subject</SectionLabel>
              <Segmented
                items={grade.subjects.map((s) => ({ id: s.subjectId, label: s.subjectName }))}
                value={subject?.subjectId ?? ""}
                onChange={setSubjectId}
              />
            </div>
            <div className="flex items-center gap-2 text-[12px] text-faint">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-mastered" /> {counts.published} published
              </span>
              {counts["in-review"] > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-practising" /> {counts["in-review"]} in review
                </span>
              )}
              {counts.draft > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-line" /> {counts.draft} draft
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ---- the map: strands → nodes ---- */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-xl text-ink">
            {grade.grade} · {subject?.subjectName}
          </h2>
          <span className="text-[13px] text-faint">{grade.stage} stage</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => setOpenId("__new__")}>
          <Plus size={14} /> Add a skill
        </Button>
      </div>

      <div className="space-y-6">
        {subject?.strands.map((strand, si) => (
          <Reveal key={strand.name} delay={si * 0.04}>
            <div>
              <div className="mb-2 flex items-center gap-2 px-1">
                <SectionLabel>{strand.name}</SectionLabel>
                <span className="h-px flex-1 bg-line" />
                <span className="text-[11px] text-faint tnum">
                  {strand.nodes.length} {strand.nodes.length === 1 ? "skill" : "skills"}
                </span>
              </div>
              <Card>
                <div className="divide-y divide-line">
                  {strand.nodes.map((n) => {
                    const node = resolve(n);
                    return (
                      <NodeRow
                        key={node.id}
                        node={node}
                        justSaved={savedFlash === node.id}
                        onOpen={() => setOpenId(node.id)}
                      />
                    );
                  })}
                </div>
              </Card>
            </div>
          </Reveal>
        ))}
      </div>

      {/* gentle reminder of the governing rule */}
      <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-faint">
        <ShieldCheck size={13} className="text-indigo" />
        Change the map once here, and every class, worksheet and report follows.
      </p>

      {/* ---- edit / add sheet ---- */}
      <EditSkillSheet
        open={openId !== null}
        isNew={openId === "__new__"}
        node={openResolved}
        strands={strandNames}
        grade={grade.grade}
        subjectName={subject?.subjectName ?? ""}
        onClose={() => setOpenId(null)}
        onSave={handleSave}
      />
    </div>
  );
}
