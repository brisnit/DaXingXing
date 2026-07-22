import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = [
  { label: "Idea", tint: "text-khaki" },
  { label: "AI Concept", tint: "text-sand" },
  { label: "Digital Model", tint: "text-mustard" },
  { label: "Prototype", tint: "text-mustard-bright" },
  { label: "Production", tint: "text-olive" },
  { label: "Market", tint: "text-primary" },
];

export function ProcessFlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-3",
        className
      )}
    >
      {stages.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-border bg-forest/60 px-3 py-1.5">
            <span className={cn("size-1.5 rounded-full bg-current", s.tint)} />
            <span className={cn("text-xs font-medium", s.tint)}>{s.label}</span>
          </div>
          {i < stages.length - 1 && (
            <ArrowRight className="size-3.5 text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );
}
