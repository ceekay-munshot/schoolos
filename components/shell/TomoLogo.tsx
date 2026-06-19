import { cn } from "@/lib/utils";

/**
 * The Tomo wordmark, rebuilt as a clean monoline so it scales crisply and can
 * be tinted to any colour (it inherits `currentColor`). Reads "tomo" with the
 * playful oversized final O.
 */
export function TomoWordmark({
  className,
  title = "Tomo",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 132 44"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("h-6 w-auto", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth={6.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* t */}
        <path d="M12 5 V27 C12 32 15 34 20 33" />
        <path d="M5 14.5 H20" />
        {/* o */}
        <circle cx="34" cy="25.5" r="8.4" />
        {/* m — the signature curly loops that flow toward the O */}
        <path d="M46 34 C58 6 34 6 56 34 C68 6 44 6 66 34 C78 6 54 6 76 34" />
      </g>
      {/* O — the oversized hero ring */}
      <circle
        cx="104"
        cy="22"
        r="16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={7.4}
      />
    </svg>
  );
}

/** App-icon lockup: the wordmark in white on a rounded brand-saffron tile. */
export function TomoMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-[28%] bg-saffron shadow-soft",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <TomoWordmark className="w-[64%] text-white" />
    </span>
  );
}
