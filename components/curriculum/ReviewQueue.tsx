"use client";

import { useState } from "react";
import {
  Check,
  Pencil,
  X,
  ArrowRight,
  UserRound,
  Inbox,
  CornerDownRight,
} from "lucide-react";
import {
  changeRequests as seed,
  CHANGE_KIND_LABEL,
  authoredNodeById,
  type ChangeRequest,
  type ChangeDecision,
  type ChangeKind,
} from "@/data/curriculum-extra";
import { Sheet } from "@/components/ui/sheet";
import { Card, SectionLabel, Badge, Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/motion";
import { relativeDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

const KIND_TONE: Record<ChangeKind, "indigo" | "saffron" | "mastered" | "gap" | "neutral"> = {
  add: "mastered",
  edit: "indigo",
  remap: "saffron",
  reorder: "neutral",
  retire: "gap",
};

const DECISION_META: Record<
  Exclude<ChangeDecision, "suggested">,
  { label: string; tone: "mastered" | "indigo" | "gap"; icon: typeof Check }
> = {
  accepted: { label: "Accepted", tone: "mastered", icon: Check },
  edited: { label: "Accepted with edits", tone: "indigo", icon: Pencil },
  rejected: { label: "Turned down", tone: "gap", icon: X },
};

/* before → after preview, shown when a request changes wording or codes */
function BeforeAfter({ cr }: { cr: ChangeRequest }) {
  if (!cr.before && !cr.after) return null;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line">
      {cr.before && (
        <div className="flex gap-2.5 bg-canvas px-3.5 py-2.5">
          <span className="mt-0.5 shrink-0 text-[10px] font-medium uppercase tracking-wide text-faint">
            Now
          </span>
          <span className="text-[13px] leading-relaxed text-muted line-through decoration-gap/40">
            {cr.before}
          </span>
        </div>
      )}
      {cr.after && (
        <div className="flex gap-2.5 border-t border-line bg-mastered-soft/30 px-3.5 py-2.5">
          <span className="mt-0.5 shrink-0 text-[10px] font-medium uppercase tracking-wide text-mastered">
            After
          </span>
          <span className="text-[13px] leading-relaxed text-ink">{cr.after}</span>
        </div>
      )}
    </div>
  );
}

function RequestCard({
  cr,
  onDecide,
  onEdit,
}: {
  cr: ChangeRequest;
  onDecide: (id: string, decision: "accepted" | "rejected") => void;
  onEdit: (cr: ChangeRequest) => void;
}) {
  const node = authoredNodeById(cr.nodeId);
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={KIND_TONE[cr.kind]}>{CHANGE_KIND_LABEL[cr.kind]}</Badge>
            <span className="text-[12px] text-faint">{cr.grade}</span>
          </div>
          <span className="shrink-0 font-mono text-[11px] text-faint">{cr.nodeId}</span>
        </div>

        <h3 className="mt-2.5 font-display text-[17px] leading-snug text-ink">{cr.title}</h3>

        {node && cr.kind !== "add" && (
          <p className="mt-1 text-[12.5px] text-faint">
            On <span className="text-muted">“{node.statement}”</span>
          </p>
        )}

        <p className="mt-3 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink">
          <CornerDownRight size={14} className="mt-1 shrink-0 text-indigo" />
          {cr.rationale}
        </p>

        <BeforeAfter cr={cr} />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5">
          <span className="inline-flex items-center gap-2 text-[12px] text-faint">
            <UserRound size={13} className="text-mastered" />
            <span className="font-medium text-ink">{cr.proposer}</span>
            <span>· {cr.proposerRole}</span>
            <span>· proposed {relativeDays(cr.date, "2026-06-19")}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => onDecide(cr.id, "rejected")}>
              <X size={14} /> Turn down
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(cr)}>
              <Pencil size={14} /> Edit
            </Button>
            <Button size="sm" onClick={() => onDecide(cr.id, "accepted")}>
              <Check size={14} /> Accept
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DecidedRow({ cr }: { cr: ChangeRequest }) {
  if (cr.decision === "suggested") return null;
  const m = DECISION_META[cr.decision];
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-lg",
          m.tone === "mastered" && "bg-mastered-soft text-mastered",
          m.tone === "indigo" && "bg-indigo-soft text-indigo",
          m.tone === "gap" && "bg-gap-soft text-gap",
        )}
      >
        <m.icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-ink">{cr.title}</span>
        <span className="block text-[11.5px] text-faint">
          {CHANGE_KIND_LABEL[cr.kind]} · {cr.grade} · decided by Dr. Vikram Iyer
        </span>
      </span>
      <Badge tone={m.tone}>{m.label}</Badge>
    </div>
  );
}

export function ReviewQueue() {
  const [requests, setRequests] = useState<ChangeRequest[]>(seed);
  const [editing, setEditing] = useState<ChangeRequest | null>(null);
  const [draftAfter, setDraftAfter] = useState("");

  const pending = requests.filter((r) => r.decision === "suggested");
  const decided = requests.filter((r) => r.decision !== "suggested");

  function decide(id: string, decision: "accepted" | "rejected") {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, decision } : r)));
  }

  function openEdit(cr: ChangeRequest) {
    setEditing(cr);
    setDraftAfter(cr.after ?? "");
  }

  function saveEdit() {
    if (!editing) return;
    setRequests((rs) =>
      rs.map((r) => (r.id === editing.id ? { ...r, decision: "edited", after: draftAfter } : r)),
    );
    setEditing(null);
  }

  return (
    <div>
      {/* count strip */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
        <span className="inline-flex items-center gap-2 font-medium text-ink">
          <Inbox size={15} className="text-indigo" />
          {pending.length} {pending.length === 1 ? "change" : "changes"} waiting
        </span>
        {decided.length > 0 && (
          <span className="text-faint">
            {decided.length} decided this session
          </span>
        )}
      </div>

      {/* pending queue */}
      {pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map((cr, i) => (
            <Reveal key={cr.id} delay={Math.min(i, 5) * 0.04}>
              <RequestCard cr={cr} onDecide={decide} onEdit={openEdit} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <span className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-mastered-soft text-mastered">
            <Check size={20} />
          </span>
          <p className="font-display text-lg text-ink">The queue is clear</p>
          <p className="mt-1 text-[13px] text-muted">
            Every proposed change has a decision. New ones from teachers will land here.
          </p>
        </Card>
      )}

      {/* decided log */}
      {decided.length > 0 && (
        <div className="mt-10">
          <div className="mb-3 flex items-center gap-2 px-1">
            <SectionLabel>Decided</SectionLabel>
            <span className="h-px flex-1 bg-line" />
          </div>
          <Card>
            <div className="divide-y divide-line">
              {decided.map((cr) => (
                <DecidedRow key={cr.id} cr={cr} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* edit-before-accept drawer */}
      <Sheet
        open={editing !== null}
        onClose={() => setEditing(null)}
        eyebrow={editing ? `${editing.grade} · ${CHANGE_KIND_LABEL[editing.kind]}` : ""}
        title="Edit before you accept"
        width={520}
      >
        {editing && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-[17px] leading-snug text-ink">{editing.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{editing.rationale}</p>
            </div>

            {editing.before && (
              <div>
                <SectionLabel className="mb-2">What it says now</SectionLabel>
                <p className="rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-muted">
                  {editing.before}
                </p>
              </div>
            )}

            <div>
              <SectionLabel className="mb-2">Your version</SectionLabel>
              <textarea
                value={draftAfter}
                onChange={(e) => setDraftAfter(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-ink focus:border-indigo/50 focus:outline-none"
              />
              <p className="mt-2 text-[12px] leading-relaxed text-faint">
                Accepting with edits keeps the proposer&apos;s intent but lands your exact wording on
                the map. It will be traced to you.
              </p>
            </div>

            <div className="flex items-center gap-2.5 border-t border-line pt-4">
              <Button onClick={saveEdit}>
                <Pencil size={14} /> Accept with edits
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      <p className="mt-8 flex items-center justify-center gap-2 text-[12px] text-faint">
        <ArrowRight size={13} className="text-indigo" />
        People decide, the system helps — every change to the map is accepted, edited or turned down
        by a person, and we note who.
      </p>
    </div>
  );
}
