"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  Layers,
  Weight,
  Palette,
  PackageCheck,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TechLabel } from "@/components/ui/section";
import { materials, materialGroups } from "@/lib/mock/materials";
import { cn } from "@/lib/utils";

/** Filled pips out of 5 for a rated attribute. */
function Pips({
  value,
  max = 5,
  tone = "mustard",
}: {
  value: number;
  max?: number;
  tone?: "mustard" | "olive" | "sand";
}) {
  const toneClass =
    tone === "olive"
      ? "bg-olive"
      : tone === "sand"
        ? "bg-sand"
        : "bg-mustard";
  return (
    <div className="flex items-center gap-1" aria-label={`${value} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full",
            i < value ? toneClass : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "mustard" | "olive" | "sand";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="mono-label text-[0.65rem] text-muted-foreground">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <Pips value={value} tone={tone} />
        <span className="w-8 text-right text-xs tabular-nums text-foreground/70">
          {value}/5
        </span>
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  // Only surface group chips that actually have materials, ordered by the
  // canonical materialGroups list.
  const availableGroups = useMemo(() => {
    const present = new Set(materials.map((m) => m.group));
    return materialGroups.filter((g) => present.has(g));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((m) => {
      if (activeGroup && m.group !== activeGroup) return false;
      if (!q) return true;
      const haystack = [
        m.name,
        m.group,
        m.description,
        ...m.commonUses,
        ...m.compatibility,
        ...m.pros,
        ...m.cons,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, activeGroup]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-16 md:py-20">
          <TechLabel className="mb-5">材料 · Material Library</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            A working library of production materials
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Browse the substrates behind real consumer products — from recycled
            aluminum to molded pulp — with cost, durability, sustainability, and
            tooling implications laid out side by side.
          </p>

          <div className="mt-8 flex items-start gap-3 rounded-lg border border-mustard/25 bg-mustard/5 p-4 text-sm text-foreground/80">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-mustard" />
            <p className="text-pretty">
              <span className="font-semibold text-foreground">
                How matching works.
              </span>{" "}
              The Da Xing Xing AI recommends materials automatically from your
              product description, budget, use case, quality target, and
              sustainability and volume goals — this library is the catalog it
              draws from.
            </p>
          </div>
        </div>
      </section>

      {/* CONTROLS + GRID */}
      <section className="container py-12 md:py-16">
        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials, uses, or processes…"
            className="pl-10"
            aria-label="Search materials"
          />
        </div>

        {/* Group filter chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveGroup(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeGroup === null
                ? "border-mustard bg-mustard/15 text-mustard"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All groups
          </button>
          {availableGroups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setActiveGroup((cur) => (cur === g ? null : g))}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeGroup === g
                  ? "border-mustard bg-mustard/15 text-mustard"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <p className="mt-6 mono-label text-xs text-muted-foreground">
          {filtered.length} material{filtered.length === 1 ? "" : "s"}
          {activeGroup ? ` · ${activeGroup}` : ""}
        </p>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
            No materials match “{query}”. Try a broader term or clear the group
            filter.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => (
              <Card
                key={m.id}
                className="flex flex-col overflow-hidden transition-colors hover:border-mustard/40"
              >
                {/* Swatch header */}
                <div
                  className="relative h-24 w-full border-b border-border"
                  style={{ backgroundColor: m.swatch }}
                >
                  <div className="absolute inset-0 blueprint opacity-20" />
                  <div className="absolute bottom-2 right-2 rounded bg-black/40 px-2 py-0.5 mono-label text-[0.6rem] text-sand">
                    {m.swatch.toUpperCase()}
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-tight">
                        {m.name}
                      </h3>
                      <Badge variant="olive" className="shrink-0">
                        {m.group}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {m.description}
                    </p>
                  </div>

                  {/* Common uses */}
                  <div>
                    <div className="mono-label mb-2 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                      <Layers className="size-3" /> Common uses
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.commonUses.map((u) => (
                        <Badge key={u} variant="secondary">
                          {u}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Meters */}
                  <div className="space-y-2 rounded-md border border-border bg-forest-deep/40 p-3">
                    <Meter label="Cost tier" value={m.costTier} tone="sand" />
                    <Meter label="Durability" value={m.durability} />
                    <Meter
                      label="Sustainability"
                      value={m.sustainability}
                      tone="olive"
                    />
                  </div>

                  {/* Facts */}
                  <dl className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Weight className="mt-0.5 size-3.5 shrink-0 text-khaki" />
                      <div>
                        <dt className="inline text-muted-foreground">
                          Weight:{" "}
                        </dt>
                        <dd className="inline text-foreground/90">
                          {m.weight}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Palette className="mt-0.5 size-3.5 shrink-0 text-khaki" />
                      <div>
                        <dt className="inline text-muted-foreground">
                          Color:{" "}
                        </dt>
                        <dd className="inline text-foreground/90">
                          {m.colorAvailability}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <PackageCheck className="mt-0.5 size-3.5 shrink-0 text-khaki" />
                      <div>
                        <dt className="inline text-muted-foreground">
                          MOQ:{" "}
                        </dt>
                        <dd className="inline text-foreground/90">
                          {m.moqImplication}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {/* Pros / Cons */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="mono-label mb-1.5 text-[0.6rem] text-emerald-300/80">
                        Pros
                      </div>
                      <ul className="space-y-1">
                        {m.pros.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-1.5 text-xs text-foreground/80"
                          >
                            <Check className="mt-0.5 size-3 shrink-0 text-emerald-400" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mono-label mb-1.5 text-[0.6rem] text-red-300/80">
                        Cons
                      </div>
                      <ul className="space-y-1">
                        {m.cons.map((c) => (
                          <li
                            key={c}
                            className="flex items-start gap-1.5 text-xs text-foreground/80"
                          >
                            <X className="mt-0.5 size-3 shrink-0 text-red-400" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mono-label mb-1.5 text-[0.6rem] text-muted-foreground">
                      Compatible processes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.compatibility.map((c) => (
                        <Badge key={c} variant="outline">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
