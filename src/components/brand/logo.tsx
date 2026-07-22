import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Da Xing Xing — "great ape" mark.
 * A geometric, angular ape-head silhouette built for app icons,
 * headers, packaging stamps, and manufacturer certification badges.
 * Deliberately industrial and confident — not cartoonish.
 */
export function ApeMark({
  className,
  title = "Da Xing Xing",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-8 w-8", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer head — broad angular gorilla skull */}
      <path
        d="M32 3 L48 9 L56 22 L54 34 L58 40 L50 44 L44 56 L32 61 L20 56 L14 44 L6 40 L10 34 L8 22 L16 9 Z"
        className="fill-current"
        opacity="0.16"
      />
      <path
        d="M32 3 L48 9 L56 22 L54 34 L58 40 L50 44 L44 56 L32 61 L20 56 L14 44 L6 40 L10 34 L8 22 L16 9 Z"
        className="stroke-current"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Heavy brow ridge */}
      <path
        d="M17 25 L27 22 L32 25 L37 22 L47 25"
        className="stroke-current"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Eyes — intelligent, deep-set */}
      <path
        d="M23 30 L28 30"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M36 30 L41 30"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Muzzle / jaw structure */}
      <path
        d="M24 40 L32 37 L40 40 L38 48 L32 51 L26 48 Z"
        className="stroke-current"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Nostrils */}
      <path
        d="M30 43.5 L30 45.5 M34 43.5 L34 45.5"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  markClassName,
  showTagline = false,
}: {
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <ApeMark className={cn("h-8 w-8 text-mustard", markClassName)} />
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-[0.02em] text-foreground">
          Da Xing Xing
        </span>
        {showTagline && (
          <span className="mono-label mt-1 text-[0.6rem] text-khaki/70">
            Idea → Product → Market
          </span>
        )}
      </span>
    </span>
  );
}
