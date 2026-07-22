"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, ArrowRight, LayoutGrid, Rows3 } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { ProductRender } from "@/components/product/product-render";
import { products } from "@/lib/mock/products";
import { cn, formatCurrency, formatRange } from "@/lib/utils";
import type { ProjectStage } from "@/types";

function stageVariant(
  stage: ProjectStage
): "default" | "warning" | "success" | "olive" | "muted" | "secondary" {
  if (["In Production", "Quality Control", "Shipping"].includes(stage))
    return "success";
  if (["Prototype", "Testing", "Revision"].includes(stage)) return "warning";
  if (["Launch", "Distribution", "Production Ready"].includes(stage))
    return "default";
  if (["Idea", "Concept"].includes(stage)) return "muted";
  return "olive";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProductsPage() {
  const stages = React.useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.stage));
    return ["All", ...Array.from(set)];
  }, []);

  const [activeStage, setActiveStage] = React.useState("All");
  const [view, setView] = React.useState<"grid" | "table">("grid");

  const filtered =
    activeStage === "All"
      ? products
      : products.filter((p) => p.stage === activeStage);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <TechLabel className="mb-3">My Products</TechLabel>
          <h1 className="text-3xl font-bold tracking-tight">Product portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} products in your workspace. All figures are sample
            estimates.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio">
            <Plus className="size-4" /> New Product
          </Link>
        </Button>
      </div>

      {/* Filter tabs + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStage(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                activeStage === s
                  ? "border-mustard bg-mustard/15 text-mustard"
                  : "border-border text-muted-foreground hover:border-mustard/40 hover:text-foreground"
              )}
            >
              {s}
              {s !== "All" && (
                <span className="ml-1.5 text-[0.65rem] opacity-70">
                  {products.filter((p) => p.stage === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs",
              view === "grid"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="size-3.5" /> Grid
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "flex items-center gap-1.5 border-l border-border px-3 py-1.5 text-xs",
              view === "table"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Rows3 className="size-3.5" /> Table
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No products in this stage yet.
          </CardContent>
        </Card>
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col overflow-hidden transition-colors hover:border-mustard/40"
            >
              <ProductRender
                seed={p.render}
                label={p.category}
                className="rounded-none border-0 border-b border-border"
              />
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/dashboard/products/${p.id}`}
                    className="font-semibold leading-tight hover:text-mustard"
                  >
                    {p.name}
                  </Link>
                  <Badge variant={stageVariant(p.stage)}>{p.stage}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="mb-1 flex justify-between text-[0.7rem]">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="tabular-nums">{p.completion}%</span>
                    </div>
                    <Progress value={p.completion} />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[0.7rem]">
                      <span className="text-muted-foreground">Feasibility</span>
                      <span className="tabular-nums">{p.feasibility}%</span>
                    </div>
                    <Progress
                      value={p.feasibility}
                      indicatorClassName="bg-emerald-400"
                    />
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Est. budget</dt>
                    <dd className="font-medium">{formatCurrency(p.budget)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Manufacturer</dt>
                    <dd className="font-medium">
                      {p.manufacturer ?? (
                        <span className="text-mustard">Matching…</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto rounded-md border border-mustard/30 bg-mustard/5 px-3 py-2">
                  <p className="mono-label text-mustard/80">Next action</p>
                  <p className="mt-0.5 text-xs font-medium">{p.nextAction}</p>
                </div>

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/dashboard/products/${p.id}`}>
                    Open product <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && filtered.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {[
                    "Product",
                    "Stage",
                    "Completion",
                    "Feasibility",
                    "Est. budget",
                    "Unit cost (est.)",
                    "Manufacturer",
                    "Next action",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="mono-label whitespace-nowrap px-4 py-3 text-khaki/70"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/products/${p.id}`}
                        className="font-medium hover:text-mustard"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {p.category} · launch {formatDate(p.targetLaunch)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={stageVariant(p.stage)}>{p.stage}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={p.completion} className="w-16" />
                        <span className="text-xs tabular-nums">
                          {p.completion}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={p.feasibility}
                          className="w-16"
                          indicatorClassName="bg-emerald-400"
                        />
                        <span className="text-xs tabular-nums">
                          {p.feasibility}%
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatCurrency(p.budget)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatRange(p.unitCostLow, p.unitCostHigh)}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {p.manufacturer ?? (
                        <span className="text-mustard">Matching…</span>
                      )}
                    </td>
                    <td className="max-w-[200px] px-4 py-3 text-xs text-muted-foreground">
                      {p.nextAction}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/products/${p.id}`}>
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Feasibility scores and unit-cost ranges are AI-generated estimates for
        demo purposes and do not constitute guaranteed pricing or an engineering
        assessment.
      </p>
    </div>
  );
}
