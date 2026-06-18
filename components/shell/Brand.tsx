import Link from "next/link";
import { cn } from "@/lib/utils";

/** The Tomo mark — an indigo tile with a saffron "Mojo" spark — plus wordmark. */
export function Brand({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-indigo shadow-soft">
        <Spark />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-medium tracking-tight text-ink">
            Tomo
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
            School OS
          </span>
        </span>
      )}
    </Link>
  );
}

export function Spark({ size = 18, color = "var(--color-saffron)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2c.6 4.8 2.6 6.8 7.4 7.4-4.8.6-6.8 2.6-7.4 7.4-.6-4.8-2.6-6.8-7.4-7.4C9.4 8.8 11.4 6.8 12 2Z"
        fill={color}
      />
    </svg>
  );
}
