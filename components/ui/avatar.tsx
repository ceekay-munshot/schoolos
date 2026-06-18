import { cn, initials, hashIndex } from "@/lib/utils";

const TINTS = [
  "bg-indigo-soft text-indigo",
  "bg-saffron-soft text-saffron-deep",
  "bg-mastered-soft text-mastered",
  "bg-practising-soft text-practising",
  "bg-gap-soft text-gap",
];

export function Avatar({
  name,
  size = 38,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const tint = TINTS[hashIndex(name, TINTS.length)];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium select-none ring-1 ring-black/[0.04]",
        tint,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
