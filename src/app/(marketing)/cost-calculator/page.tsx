"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  TrendingUp,
  Package,
  Percent,
  Info,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TechLabel } from "@/components/ui/section";
import { formatCurrency } from "@/lib/utils";

type FieldKey =
  | "quantity"
  | "prototypeCost"
  | "toolingCost"
  | "unitCost"
  | "packagingCost"
  | "freight"
  | "dutiesPct"
  | "warehousing"
  | "fulfillmentPerUnit"
  | "marketing"
  | "platformFeePct"
  | "targetRetail";

const defaults: Record<FieldKey, number> = {
  quantity: 1000,
  prototypeCost: 3500,
  toolingCost: 12000,
  unitCost: 8.5,
  packagingCost: 1.25,
  freight: 4200,
  dutiesPct: 6,
  warehousing: 1800,
  fulfillmentPerUnit: 3.2,
  marketing: 15000,
  platformFeePct: 8,
  targetRetail: 49,
};

const QUANTITY_PRESETS = [100, 250, 500, 1000, 2500, 5000];

function Field({
  label,
  id,
  value,
  onChange,
  step = 1,
  prefix,
  suffix,
  min = 0,
  hint,
}: {
  label: string;
  id: FieldKey;
  value: number;
  onChange: (k: FieldKey, v: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
  min?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) =>
            onChange(id, e.target.value === "" ? 0 : Number(e.target.value))
          }
          className={prefix ? "pl-7" : suffix ? "pr-9" : undefined}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[0.7rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ResultRow({
  label,
  value,
  emphasis,
  hint,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <div>
        <div
          className={
            emphasis
              ? "text-sm font-semibold text-foreground"
              : "text-sm text-muted-foreground"
          }
        >
          {label}
        </div>
        {hint && (
          <div className="text-[0.7rem] text-muted-foreground/70">{hint}</div>
        )}
      </div>
      <div
        className={
          emphasis
            ? "text-lg font-bold tabular-nums text-mustard"
            : "text-base font-semibold tabular-nums text-foreground"
        }
      >
        {value}
      </div>
    </div>
  );
}

export default function CostCalculatorPage() {
  const [f, setF] = useState<Record<FieldKey, number>>(defaults);

  const update = (k: FieldKey, v: number) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const r = useMemo(() => {
    const qty = Math.max(1, f.quantity);

    // Per-unit variable costs.
    const dutiesPerUnit = f.unitCost * (f.dutiesPct / 100);
    const freightPerUnit = f.freight / qty;
    const warehousingPerUnit = f.warehousing / qty;
    const amortizedTooling = (f.toolingCost + f.prototypeCost) / qty;

    // Landed cost per unit = goods + packaging + duties + freight (fixed
    // logistics spread over the run) + warehousing + fulfillment.
    const landedPerUnit =
      f.unitCost +
      f.packagingCost +
      dutiesPerUnit +
      freightPerUnit +
      warehousingPerUnit +
      f.fulfillmentPerUnit;

    // Fully-loaded per-unit cost also carries amortized tooling + prototype.
    const fullyLoadedPerUnit = landedPerUnit + amortizedTooling;

    const totalLandedRun =
      landedPerUnit * qty +
      f.toolingCost +
      f.prototypeCost +
      f.marketing;

    const suggestedWholesale = landedPerUnit * 2;
    const suggestedRetail = suggestedWholesale * 2;

    // Margin at the user's target retail (platform fee taken off the top).
    const platformFeePerUnit = f.targetRetail * (f.platformFeePct / 100);
    const netRevenuePerUnit = f.targetRetail - platformFeePerUnit;
    const grossProfitPerUnit = netRevenuePerUnit - fullyLoadedPerUnit;
    const grossMarginPct =
      f.targetRetail > 0 ? (grossProfitPerUnit / f.targetRetail) * 100 : 0;

    // Break-even quantity: fixed costs / per-unit contribution margin.
    const contributionPerUnit = netRevenuePerUnit - landedPerUnit;
    const fixedCosts = f.toolingCost + f.prototypeCost + f.marketing;
    const breakEvenQty =
      contributionPerUnit > 0
        ? Math.ceil(fixedCosts / contributionPerUnit)
        : null;

    return {
      landedPerUnit,
      fullyLoadedPerUnit,
      amortizedTooling,
      totalLandedRun,
      suggestedWholesale,
      suggestedRetail,
      grossProfitPerUnit,
      grossMarginPct,
      breakEvenQty,
      platformFeePerUnit,
      netRevenuePerUnit,
      contributionPerUnit,
    };
  }, [f]);

  const marginTone =
    r.grossMarginPct >= 50
      ? "success"
      : r.grossMarginPct >= 25
        ? "warning"
        : "danger";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="container relative py-14 md:py-16">
          <TechLabel className="mb-5">成本 · Cost &amp; Margin</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Cost &amp; margin calculator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Model landed cost, wholesale and retail pricing, gross margin, and
            break-even across different production quantities.
          </p>
        </div>
      </section>

      {/* ESTIMATE DISCLAIMER */}
      <div className="border-b border-mustard/25 bg-mustard/10">
        <div className="container flex items-start gap-3 py-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-mustard" />
          <p className="text-foreground/85">
            <span className="font-semibold">All figures are estimates.</span>{" "}
            Actual quotes, duties, freight, and fees vary by product,
            manufacturer, and destination. Use this as a planning tool, not a
            final quote.
          </p>
        </div>
      </div>

      {/* BODY */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* INPUTS */}
          <div className="space-y-8">
            {/* Quantity presets */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Layers className="size-4 text-mustard" />
                <span className="mono-label text-xs text-mustard">
                  Production quantity
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUANTITY_PRESETS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => update("quantity", q)}
                    className={
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                      (f.quantity === q
                        ? "border-mustard bg-mustard/15 text-mustard"
                        : "border-border text-muted-foreground hover:text-foreground")
                    }
                  >
                    {q.toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Change the run size to see tooling amortize across more units.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Development &amp; tooling</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Production quantity"
                  id="quantity"
                  value={f.quantity}
                  onChange={update}
                  step={50}
                  suffix="units"
                  min={1}
                />
                <Field
                  label="Prototype cost"
                  id="prototypeCost"
                  value={f.prototypeCost}
                  onChange={update}
                  step={100}
                  prefix="$"
                  hint="One-time, amortized across the run"
                />
                <Field
                  label="Tooling / mold cost"
                  id="toolingCost"
                  value={f.toolingCost}
                  onChange={update}
                  step={500}
                  prefix="$"
                  hint="One-time, amortized across the run"
                />
                <Field
                  label="Marketing / launch"
                  id="marketing"
                  value={f.marketing}
                  onChange={update}
                  step={500}
                  prefix="$"
                  hint="Treated as a fixed launch cost"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Per-unit variable costs</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Unit (manufacturing) cost"
                  id="unitCost"
                  value={f.unitCost}
                  onChange={update}
                  step={0.25}
                  prefix="$"
                />
                <Field
                  label="Packaging / unit"
                  id="packagingCost"
                  value={f.packagingCost}
                  onChange={update}
                  step={0.05}
                  prefix="$"
                />
                <Field
                  label="Fulfillment / unit"
                  id="fulfillmentPerUnit"
                  value={f.fulfillmentPerUnit}
                  onChange={update}
                  step={0.1}
                  prefix="$"
                />
                <Field
                  label="Import duties"
                  id="dutiesPct"
                  value={f.dutiesPct}
                  onChange={update}
                  step={0.5}
                  suffix="%"
                  hint="Applied to unit manufacturing cost"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Logistics, fees &amp; target price
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Freight (whole run)"
                  id="freight"
                  value={f.freight}
                  onChange={update}
                  step={100}
                  prefix="$"
                  hint="Spread across all units"
                />
                <Field
                  label="Warehousing (whole run)"
                  id="warehousing"
                  value={f.warehousing}
                  onChange={update}
                  step={100}
                  prefix="$"
                  hint="Spread across all units"
                />
                <Field
                  label="Platform / channel fee"
                  id="platformFeePct"
                  value={f.platformFeePct}
                  onChange={update}
                  step={0.5}
                  suffix="%"
                  hint="Taken off the retail price"
                />
                <Field
                  label="Target retail price"
                  id="targetRetail"
                  value={f.targetRetail}
                  onChange={update}
                  step={1}
                  prefix="$"
                />
              </CardContent>
            </Card>
          </div>

          {/* RESULTS */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden border-mustard/30">
              <div className="border-b border-border bg-gradient-to-br from-military/20 to-transparent px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="size-4 text-mustard" />
                    <span className="mono-label text-xs text-mustard">
                      Estimated results
                    </span>
                  </div>
                  <Badge variant="warning">ESTIMATE</Badge>
                </div>
                <div className="mt-4">
                  <div className="mono-label text-[0.65rem] text-muted-foreground">
                    Gross margin at {formatCurrency(f.targetRetail)} retail
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tabular-nums text-foreground">
                      {r.grossMarginPct.toFixed(1)}%
                    </span>
                    <Badge variant={marginTone}>
                      {formatCurrency(r.grossProfitPerUnit, { cents: true })} /
                      unit
                    </Badge>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="mono-label mb-1 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                    <Package className="size-3.5" /> Cost per unit
                  </div>
                  <ResultRow
                    label="Landed cost / unit"
                    value={formatCurrency(r.landedPerUnit, { cents: true })}
                    hint="Goods, packaging, duties, freight, warehousing, fulfillment"
                  />
                  <ResultRow
                    label="Amortized tooling / unit"
                    value={formatCurrency(r.amortizedTooling, { cents: true })}
                    hint={`Tooling + prototype ÷ ${f.quantity.toLocaleString()} units`}
                  />
                  <ResultRow
                    label="Fully-loaded / unit"
                    value={formatCurrency(r.fullyLoadedPerUnit, {
                      cents: true,
                    })}
                    emphasis
                  />
                </div>

                <div className="mb-4">
                  <div className="mono-label mb-1 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                    <TrendingUp className="size-3.5" /> Suggested pricing
                  </div>
                  <ResultRow
                    label="Suggested wholesale"
                    value={formatCurrency(r.suggestedWholesale, {
                      cents: true,
                    })}
                    hint="≈ 2× landed cost"
                  />
                  <ResultRow
                    label="Suggested retail"
                    value={formatCurrency(r.suggestedRetail, { cents: true })}
                    hint="≈ 2× wholesale"
                  />
                </div>

                <div>
                  <div className="mono-label mb-1 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                    <Percent className="size-3.5" /> Run economics
                  </div>
                  <ResultRow
                    label="Total run cost"
                    value={formatCurrency(r.totalLandedRun)}
                    hint="Landed goods + tooling + prototype + marketing"
                  />
                  <ResultRow
                    label="Platform fee / unit"
                    value={formatCurrency(r.platformFeePerUnit, {
                      cents: true,
                    })}
                  />
                  <ResultRow
                    label="Break-even quantity"
                    value={
                      r.breakEvenQty === null
                        ? "—"
                        : `${r.breakEvenQty.toLocaleString()} units`
                    }
                    hint={
                      r.breakEvenQty === null
                        ? "Contribution margin is not positive at this price"
                        : "Units to recover fixed costs"
                    }
                    emphasis
                  />
                </div>

                <p className="mt-5 text-[0.7rem] leading-relaxed text-muted-foreground">
                  Estimates only. The 2× wholesale / 2× retail rule is a common
                  starting point — your real margins depend on channel,
                  positioning, and negotiated manufacturer quotes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
