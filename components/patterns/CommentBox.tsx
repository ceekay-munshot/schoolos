"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Card, Button, SectionLabel } from "@/components/ui/primitives";

interface Note {
  text: string;
  when: string;
}

/** A simple comment box for the coach to jot their own inputs on a child. */
export function CommentBox({ name, seed = [] }: { name: string; seed?: Note[] }) {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState<Note[]>(seed);

  function add() {
    const t = text.trim();
    if (!t) return;
    setNotes((n) => [{ text: t, when: "just now" }, ...n]);
    setText("");
  }

  return (
    <Card className="p-5">
      <SectionLabel className="mb-3 inline-flex items-center gap-1.5">
        <MessageSquare size={13} className="text-indigo" /> Your notes on {name.split(" ")[0]}
      </SectionLabel>
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) add();
          }}
          rows={2}
          placeholder={`Add a private note — context, a parent's words, something to remember…`}
          className="min-h-[44px] flex-1 resize-none rounded-xl border border-line bg-canvas p-3 text-[13px] text-ink outline-none transition-colors focus:border-indigo/40"
        />
        <Button size="md" onClick={add} disabled={!text.trim()} aria-label="Add note">
          <Send size={15} />
        </Button>
      </div>
      {notes.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {notes.map((nt, i) => (
            <li key={i} className="rounded-xl bg-canvas p-3">
              <p className="text-[13px] leading-relaxed text-ink">{nt.text}</p>
              <p className="mt-1 text-[11px] text-faint">{nt.when} · only you can see this</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
