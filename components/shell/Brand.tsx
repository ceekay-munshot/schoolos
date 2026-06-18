import Link from "next/link";
import { cn } from "@/lib/utils";
import { TomoWordmark } from "./TomoLogo";

/** The Tomo lockup — the wordmark in brand saffron, with a quiet "School OS" tag. */
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
    <Link
      href={href}
      aria-label="Tomo School OS"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <TomoWordmark
        className={cn(
          "text-saffron-deep transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]",
          compact ? "h-5" : "h-[26px]",
        )}
      />
      {!compact && (
        <span className="border-l border-line pl-2.5 text-[10px] font-medium uppercase tracking-[0.18em] text-faint">
          School OS
        </span>
      )}
    </Link>
  );
}

/** The Mojo spark — a small saffron accent used across the app. */
export function Spark({
  size = 18,
  color = "var(--color-saffron)",
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 2c.6 4.8 2.6 6.8 7.4 7.4-4.8.6-6.8 2.6-7.4 7.4-.6-4.8-2.6-6.8-7.4-7.4C9.4 8.8 11.4 6.8 12 2Z"
        fill={color}
      />
    </svg>
  );
}
