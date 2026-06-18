"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";

/** Wrap any trigger (which may contain block elements) to open a detail panel
 *  in the side drawer. Uses a div with button semantics so rich row layouts
 *  remain valid markup. */
export function InfoDrawer({
  children,
  panel,
  title,
  eyebrow,
  width,
  className,
}: {
  children: React.ReactNode;
  panel: React.ReactNode;
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  width?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={className}
      >
        {children}
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title={title} eyebrow={eyebrow} width={width}>
        {panel}
      </Sheet>
    </>
  );
}
