"use client";

import { animate, motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Fade + rise into view, once. */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children that are <Reveal>-like; wrap a list. */
export function Stagger({
  children,
  className,
  gap = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap } },
  };
  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Counts up to `value` when scrolled into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.1,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** The Tomo wordmark, drawing itself on (stroke by stroke). Inherits currentColor. */
export function AnimatedTomo({ className }: { className?: string }) {
  const stroke = {
    common: { stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const },
  };
  const draw = (order: number): Variants => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: EASE, delay: order * 0.16 },
        opacity: { duration: 0.2, delay: order * 0.16 },
      },
    },
  });
  return (
    <motion.svg
      viewBox="0 0 132 44"
      fill="none"
      role="img"
      aria-label="Tomo"
      initial="hidden"
      animate="show"
      className={cn("h-7 w-auto", className)}
    >
      <motion.path variants={draw(0)} d="M12 5 V27 C12 32 15 34 20 33" strokeWidth={6.4} {...stroke.common} />
      <motion.path variants={draw(0.5)} d="M5 14.5 H20" strokeWidth={6.4} {...stroke.common} />
      <motion.circle variants={draw(1)} cx="34" cy="25.5" r="8.4" strokeWidth={6.4} {...stroke.common} />
      <motion.path variants={draw(1.4)} d="M46 34 C58 6 34 6 56 34 C68 6 44 6 66 34 C78 6 54 6 76 34" strokeWidth={6.4} {...stroke.common} />
      <motion.circle variants={draw(2.1)} cx="104" cy="22" r="16.5" strokeWidth={7.4} {...stroke.common} />
    </motion.svg>
  );
}
