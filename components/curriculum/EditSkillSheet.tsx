"use client";

import { useEffect, useState } from "react";
import { Plus, X, ShieldCheck, GitBranch, Sparkle } from "lucide-react";
import type { CompetencyNode, JudgmentType } from "@/data/types";
import {
  authoredNodeById,
  allAuthoredNodes,
  type AuthoredNode,
  type AuthoringStatus,
} from "@/data/curriculum-extra";
import { Sheet } from "@/components/ui/sheet";
import { Button, SectionLabel, Badge, Divider } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BLOOM_LEVELS, BLOOM_GLOSS } from "./bloom";

/** The editable slice of a node the sheet owns. */
export interface SkillEdits {
  statement: string;
  bloom: CompetencyNode["bloom"];
  judgmentType: JudgmentType;
  boardMap: string[];
  misconceptions: string[];
  prerequisites: string[];
  status: AuthoringStatus;
}

function fromNode(n: AuthoredNode): SkillEdits {
  return {
    statement: n.statement,
    bloom: n.bloom,
    judgmentType: n.judgmentType,
    boardMap: [...n.boardMap],
    misconceptions: [...n.misconceptions],
    prerequisites: [...n.prerequisites],
    status: n.status,
  };
}

const BLANK: SkillEdits = {
  statement: "",
  bloom: "Understand",
  judgmentType: "objective",
  boardMap: [],
  misconceptions: [],
  prerequisites: [],
  status: "draft",
};

/* A small label above each field group. */
function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <SectionLabel>{children}</SectionLabel>
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </div>
  );
}

/* An editable list of short text chips (board codes, misconceptions). */
function ChipList({
  items,
  onChange,
  placeholder,
  mono,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  mono?: boolean;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }
  return (
    <div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-xl border border-line bg-surface px-3 py-2"
          >
            <span className={cn("min-w-0 flex-1 text-[13px] leading-relaxed text-ink", mono && "font-mono text-[12px]")}>
              {it}
            </span>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="mt-0.5 shrink-0 text-faint transition-colors hover:text-gap"
              aria-label="Remove"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-line px-3 py-2 text-[12.5px] text-faint">
            None yet.
          </p>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-[13px] text-ink placeholder:text-faint focus:border-indigo/50 focus:outline-none",
            mono && "font-mono text-[12px]",
          )}
        />
        <Button size="sm" variant="subtle" onClick={add} type="button">
          <Plus size={14} /> Add
        </Button>
      </div>
    </div>
  );
}

export function EditSkillSheet({
  open,
  isNew,
  node,
  strands,
  grade,
  subjectName,
  onClose,
  onSave,
}: {
  open: boolean;
  isNew: boolean;
  node?: AuthoredNode;
  strands: string[];
  grade: string;
  subjectName: string;
  onClose: () => void;
  onSave: (id: string, edits: SkillEdits) => void;
}) {
  const [draft, setDraft] = useState<SkillEdits>(BLANK);
  const [newId, setNewId] = useState("");
  const [newStrand, setNewStrand] = useState(strands[0] ?? "");

  // Seed the form when the sheet opens onto a node (or as a blank new skill).
  // Keyed off the node id and `open` only — so editing a field never gets
  // clobbered by an unrelated re-render while the drawer is up.
  const nodeId = node?.id;
  useEffect(() => {
    if (!open) return;
    if (isNew) {
      setDraft(BLANK);
      setNewId("");
      setNewStrand(strands[0] ?? "");
    } else if (node) {
      setDraft(fromNode(node));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isNew, nodeId]);

  const dirty = node ? JSON.stringify(draft) !== JSON.stringify(fromNode(node)) : true;

  function update<K extends keyof SkillEdits>(key: K, value: SkillEdits[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save() {
    const id = isNew ? newId.trim() || `NEW.SKILL.${Date.now()}` : node!.id;
    onSave(id, { ...draft, status: isNew ? "draft" : draft.status });
  }

  // resolve prerequisite statements for a readable list
  const prereqNodes = draft.prerequisites.map((id) => ({ id, n: authoredNodeById(id) }));

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow={isNew ? `${grade} · ${subjectName} · new skill` : `${grade} · ${subjectName}`}
      title={isNew ? "Add a skill" : "Edit skill"}
      width={560}
    >
      <div className="space-y-7">
        {/* id (mono) */}
        <div>
          <FieldLabel hint="house format · SUBJECT.STRAND.SKILL.NN">Skill ID</FieldLabel>
          {isNew ? (
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value.toUpperCase())}
              placeholder="MATH.FRAC.SIMPLIFY.07"
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 font-mono text-[13px] uppercase text-ink placeholder:text-faint/70 focus:border-indigo/50 focus:outline-none"
            />
          ) : (
            <p className="font-mono text-[13px] text-muted">{node?.id}</p>
          )}
        </div>

        {/* strand (new only) */}
        {isNew && strands.length > 0 && (
          <div>
            <FieldLabel>Strand</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {strands.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStrand(s)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors",
                    newStrand === s
                      ? "border-indigo bg-indigo-soft text-indigo"
                      : "border-line bg-surface text-muted hover:bg-sand",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* statement */}
        <div>
          <FieldLabel hint="what a child should be able to do">Statement</FieldLabel>
          <textarea
            value={draft.statement}
            onChange={(e) => update("statement", e.target.value)}
            rows={2}
            placeholder="Write the skill in plain words…"
            className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-ink placeholder:text-faint focus:border-indigo/50 focus:outline-none"
          />
        </div>

        {/* bloom */}
        <div>
          <FieldLabel hint={BLOOM_GLOSS[draft.bloom]}>Thinking level</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {BLOOM_LEVELS.map((b) => (
              <button
                key={b}
                onClick={() => update("bloom", b)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12.5px] font-medium transition-colors",
                  draft.bloom === b
                    ? "border-indigo bg-indigo-soft text-indigo"
                    : "border-line bg-surface text-muted hover:bg-sand",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* judgment vs objective */}
        <div>
          <FieldLabel hint="who decides if it's met">How it's checked</FieldLabel>
          <Segmented
            items={[
              { id: "objective", label: "Machine-checkable" },
              { id: "judgment", label: "Teacher-judged" },
            ]}
            value={draft.judgmentType}
            onChange={(v) => update("judgmentType", v as JudgmentType)}
          />
          <p className="mt-2 text-[12px] leading-relaxed text-faint">
            {draft.judgmentType === "judgment"
              ? "A teacher decides whether this is met — the system never marks it on its own."
              : "The system can check this from a child's work, then a teacher confirms."}
          </p>
        </div>

        <Divider />

        {/* prerequisites */}
        <div>
          <FieldLabel hint="skills that must come first">Prerequisites</FieldLabel>
          <div className="space-y-1.5">
            {prereqNodes.map(({ id, n }) => (
              <div
                key={id}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <GitBranch size={13} className="shrink-0 text-indigo" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11.5px] text-faint">{id}</span>
                  {n && <span className="block text-[12.5px] leading-snug text-ink">{n.statement}</span>}
                </span>
                <button
                  onClick={() => update("prerequisites", draft.prerequisites.filter((p) => p !== id))}
                  className="shrink-0 text-faint transition-colors hover:text-gap"
                  aria-label="Remove prerequisite"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {prereqNodes.length === 0 && (
              <p className="rounded-xl border border-dashed border-line px-3 py-2 text-[12.5px] text-faint">
                This is a root skill — nothing comes before it.
              </p>
            )}
          </div>
          <AddPrerequisite
            existing={draft.prerequisites}
            selfId={node?.id}
            onAdd={(id) => update("prerequisites", [...draft.prerequisites, id])}
          />
        </div>

        {/* board mapping */}
        <div>
          <FieldLabel hint="CBSE chapter · NCF outcome">Board mapping</FieldLabel>
          <ChipList
            items={draft.boardMap}
            onChange={(v) => update("boardMap", v)}
            placeholder="CBSE Cl-5 Math 7.3"
            mono
          />
        </div>

        {/* misconceptions */}
        <div>
          <FieldLabel hint="the slips to watch for">Common misconceptions</FieldLabel>
          <ChipList
            items={draft.misconceptions}
            onChange={(v) => update("misconceptions", v)}
            placeholder="What a child often gets wrong here…"
          />
        </div>

        {!isNew && (
          <>
            <Divider />
            <div className="flex items-center justify-between">
              <FieldLabel>Status</FieldLabel>
              <Badge
                tone={
                  draft.status === "published"
                    ? "mastered"
                    : draft.status === "in-review"
                      ? "practising"
                      : "neutral"
                }
                className={draft.status === "draft" ? "capitalize" : undefined}
              >
                {draft.status === "in-review" ? "In review" : draft.status === "published" ? "Published" : "Draft"}
              </Badge>
            </div>
          </>
        )}

        {/* the governing rule + actions */}
        <div className="sticky bottom-0 -mx-6 border-t border-line bg-canvas px-6 pt-4">
          <p className="mb-3 flex items-start gap-2 text-[12px] leading-relaxed text-faint">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-indigo" />
            Changes are reviewed before they go live. Your edit becomes a proposal in the review
            queue, traced to you.
          </p>
          <div className="flex items-center gap-2.5">
            <Button onClick={save} disabled={!dirty || (isNew && !draft.statement.trim())}>
              <Sparkle size={14} /> {isNew ? "Propose new skill" : "Propose change"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

/* A tiny inline picker to add a prerequisite from the published map. */
function AddPrerequisite({
  existing,
  selfId,
  onAdd,
}: {
  existing: string[];
  selfId?: string;
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const matches = query.trim()
    ? allAuthoredNodes
        .filter(
          (n) =>
            n.id !== selfId &&
            !existing.includes(n.id) &&
            (n.id.toLowerCase().includes(query.toLowerCase()) ||
              n.statement.toLowerCase().includes(query.toLowerCase())),
        )
        .slice(0, 6)
    : [];

  return (
    <div className="relative mt-2">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpenList(true);
        }}
        onFocus={() => setOpenList(true)}
        placeholder="Link a skill that comes first…"
        className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-[13px] text-ink placeholder:text-faint focus:border-indigo/50 focus:outline-none"
      />
      {openList && matches.length > 0 && (
        <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-lift">
          {matches.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onAdd(m.id);
                setQuery("");
                setOpenList(false);
              }}
              className="flex w-full flex-col gap-0.5 border-b border-line px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-sand"
            >
              <span className="font-mono text-[11px] text-faint">{m.id}</span>
              <span className="text-[12.5px] leading-snug text-ink">{m.statement}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
