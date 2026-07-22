import * as React from "react";
import { cn } from "@/lib/utils";

/** A small uppercase monospace eyebrow label used across the platform. */
export function TechLabel({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 text-mustard",
        className
      )}
    >
      {index && <span className="text-khaki/60">{index}</span>}
      <span className="h-px w-6 bg-mustard/50" />
      {children}
    </span>
  );
}

export function Section({
  children,
  className,
  containerClassName,
  ...props
}: React.HTMLAttributes<HTMLElement> & { containerClassName?: string }) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      <div className={cn("container", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <TechLabel className="mb-4">{eyebrow}</TechLabel>}
      <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
