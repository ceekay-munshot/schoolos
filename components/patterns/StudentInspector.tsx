"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Student360 } from "./Student360";

/** Wrap any trigger to open a child's 360 in the depth drawer. */
export function StudentInspector({
  studentId,
  children,
  className,
}: {
  studentId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} eyebrow="Student 360" title="The whole child">
        <Student360 studentId={studentId} />
      </Sheet>
    </>
  );
}
