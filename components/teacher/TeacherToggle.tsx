"use client";

import { Segmented } from "@/components/ui/tabs";
import { teacherProfiles } from "@/data/teacher-profiles";

/** The teacher switcher used across Today, Week and PATH.
 *  First-name labels keep it calm; state lives in the parent. */
export function TeacherToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Segmented
      items={teacherProfiles.map((t) => ({
        id: t.id,
        label: t.name.split(" ")[0],
      }))}
      value={value}
      onChange={onChange}
    />
  );
}
