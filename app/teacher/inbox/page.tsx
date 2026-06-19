"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Sparkles, MessageSquare, LifeBuoy, Drama, ArrowRight, Check, Clock } from "lucide-react";
import { AppShell, Section } from "@/components/shell/AppShell";
import {
  inboxItems as seedItems,
  teacherProfiles,
  teacherById,
  classById,
  type InboxItem,
  type InboxColumn,
  type InboxKind,
} from "@/data/teacher-profiles";
import { Segmented } from "@/components/ui/tabs";
import { Sheet } from "@/components/ui/sheet";
import { Card, Badge, Button, SectionLabel } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const KIND_META: Record<InboxKind, { label: string; Icon: typeof FileText; tone: "indigo" | "saffron" | "practising" | "mastered" | "neutral" }> = {
  worksheet: { label: "Worksheet", Icon: FileText, tone: "indigo" },
  "low-confidence": { label: "Mark to check", Icon: Sparkles, tone: "practising" },
  parent: { label: "Parent message", Icon: MessageSquare, tone: "saffron" },
  coach: { label: "Coach hand-off", Icon: LifeBuoy, tone: "mastered" },
  "path-artifact": { label: "PATH work", Icon: Drama, tone: "saffron" },
};

const COLUMNS: { id: InboxColumn; label: string; foot: string }[] = [
  { id: "needs-you", label: "Needs you", foot: "your decision, then it moves on" },
  { id: "in-progress", label: "In progress", foot: "started, not yet finished" },
  { id: "cleared", label: "Cleared", foot: "done this week" },
];

const NEXT_COLUMN: Record<InboxColumn, InboxColumn | null> = {
  "needs-you": "in-progress",
  "in-progress": "cleared",
  cleared: null,
};

function ItemCard({ item, onOpen }: { item: InboxItem; onOpen: () => void }) {
  const meta = KIND_META[item.kind];
  const teacher = teacherById(item.teacherId);
  return (
    <button
      onClick={onOpen}
      className="block w-full rounded-xl border border-line bg-surface p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center justify-between gap-2">
        <Badge tone={meta.tone}><meta.Icon size={12} /> {meta.label}</Badge>
        <span className="text-[11px] text-faint">{item.when}</span>
      </div>
      <p className="mt-2.5 text-[13.5px] font-medium leading-snug text-ink">{item.title}</p>
      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">{item.detail}</p>
      {teacher && (
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-faint">
          <Avatar name={teacher.name} size={18} /> {teacher.name.split(" ")[0]}
        </p>
      )}
    </button>
  );
}

export default function ActionInbox() {
  const [items, setItems] = useState<InboxItem[]>(seedItems);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.teacherId === filter)),
    [items, filter],
  );

  const open = items.find((i) => i.id === openId) ?? null;
  const openMeta = open ? KIND_META[open.kind] : null;
  const openClass = open?.classId ? classById(open.classId) : undefined;
  const openTeacher = open ? teacherById(open.teacherId) : undefined;

  function advance(id: string) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = NEXT_COLUMN[i.column];
        return next ? { ...i, column: next } : i;
      }),
    );
    setOpenId(null);
  }

  const needsYou = visible.filter((i) => i.column === "needs-you").length;

  return (
    <AppShell persona="teacher" eyebrow="Across every class you teach" title="Action inbox">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[14px] leading-relaxed text-muted">
          Everything waiting for a teacher&apos;s eye, in one calm place — worksheets to okay, a mark
          to check, a parent to reply to. {needsYou > 0 ? `${needsYou} need you right now.` : "Nothing urgent right now."}
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

      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLUMNS.map((col) => {
            const list = visible.filter((i) => i.column === col.id);
            return (
              <div key={col.id} className="rounded-2xl border border-line bg-sand/40 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{col.label}</p>
                    <p className="text-[11px] text-faint">{col.foot}</p>
                  </div>
                  <span className="grid size-6 place-items-center rounded-full bg-surface text-[11px] font-medium text-muted tnum ring-1 ring-line">
                    {list.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {list.length ? (
                    list.map((i) => <ItemCard key={i.id} item={i} onOpen={() => setOpenId(i.id)} />)
                  ) : (
                    <p className="px-1 py-6 text-center text-[12px] text-faint">Nothing here.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Sheet
        open={open !== null}
        onClose={() => setOpenId(null)}
        eyebrow={openMeta?.label}
        title={open?.title}
      >
        {open && openMeta && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={openMeta.tone}><openMeta.Icon size={12} /> {openMeta.label}</Badge>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
                <Clock size={12} /> {open.when}
              </span>
              {openTeacher && (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
                  <Avatar name={openTeacher.name} size={18} /> {openTeacher.honorific} {openTeacher.name}
                </span>
              )}
            </div>

            <p className="text-[14px] leading-relaxed text-ink">{open.detail}</p>

            {openClass && (
              <Link
                href={`/teacher/class/${openClass.id}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:bg-sand"
              >
                <div className="min-w-0">
                  <SectionLabel>From this class</SectionLabel>
                  <p className="mt-0.5 text-[13.5px] font-medium text-ink">{openClass.topic}</p>
                  <p className="text-[12px] text-muted">{openClass.klass}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-faint" />
              </Link>
            )}

            <div className="rounded-xl border border-line bg-canvas p-4">
              <SectionLabel className="mb-2">What you can do</SectionLabel>
              {open.column === "cleared" ? (
                <p className="inline-flex items-center gap-1.5 text-[13px] text-mastered">
                  <Check size={14} /> Done — nothing more needed.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="primary" onClick={() => advance(open.id)}>
                    <Check size={14} /> {open.action}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setOpenId(null)}>
                    Not now
                  </Button>
                </div>
              )}
              {open.column !== "cleared" && (
                <p className="mt-2.5 text-[12px] leading-relaxed text-faint">
                  You are the decider of record. {open.column === "needs-you" ? "This moves to In progress." : "This moves to Cleared."}
                </p>
              )}
            </div>
          </div>
        )}
      </Sheet>
    </AppShell>
  );
}
