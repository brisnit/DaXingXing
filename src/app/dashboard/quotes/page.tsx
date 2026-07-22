import {
  Info,
  AlertTriangle,
  OctagonAlert,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TechLabel } from "@/components/ui/section";
import { quotes } from "@/lib/mock/quotes";
import { featuredProduct } from "@/lib/mock/products";
import { formatCurrency } from "@/lib/utils";
import type { Quote } from "@/types";

export const metadata = { title: "Quotes · Da Xing Xing" };

function money(n: number, cents = false) {
  return formatCurrency(n, { cents });
}

function flagStyle(level: "warning" | "danger" | "info") {
  if (level === "danger")
    return {
      cls: "border-destructive/40 bg-destructive/10 text-red-200",
      icon: OctagonAlert,
    };
  if (level === "warning")
    return {
      cls: "border-mustard/40 bg-mustard/10 text-mustard",
      icon: AlertTriangle,
    };
  return { cls: "border-border bg-secondary/40 text-foreground/80", icon: Info };
}

const ROWS: { key: keyof Quote; label: string; fmt: (q: Quote) => string }[] = [
  { key: "prototypeCost", label: "Prototype cost", fmt: (q) => money(q.prototypeCost) },
  { key: "toolingCost", label: "Tooling", fmt: (q) => (q.toolingCost ? money(q.toolingCost) : "—") },
  { key: "moldCost", label: "Mold", fmt: (q) => (q.moldCost ? money(q.moldCost) : "—") },
  { key: "unitCost", label: "Unit cost", fmt: (q) => money(q.unitCost) },
  { key: "moq", label: "MOQ", fmt: (q) => q.moq.toLocaleString() },
  { key: "samplingDays", label: "Sampling (days)", fmt: (q) => `${q.samplingDays}` },
  { key: "productionDays", label: "Production (days)", fmt: (q) => `${q.productionDays}` },
  { key: "packagingCost", label: "Packaging / unit", fmt: (q) => money(q.packagingCost, true) },
  { key: "qcCost", label: "QC", fmt: (q) => money(q.qcCost) },
  { key: "shippingEstimate", label: "Shipping (est.)", fmt: (q) => money(q.shippingEstimate) },
  { key: "dutiesEstimate", label: "Duties (est.)", fmt: (q) => (q.dutiesEstimate ? money(q.dutiesEstimate) : "—") },
  { key: "paymentTerms", label: "Payment terms", fmt: (q) => q.paymentTerms },
  { key: "expires", label: "Expires", fmt: (q) => new Date(q.expires).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
];

export default function QuotesPage() {
  // Landed cost estimate at MOQ for a rough comparison.
  const landed = (q: Quote) =>
    q.toolingCost +
    q.moldCost +
    q.prototypeCost +
    q.qcCost +
    q.shippingEstimate +
    q.dutiesEstimate +
    q.unitCost * q.moq +
    q.packagingCost * q.moq;

  const cheapestUnit = Math.min(...quotes.map((q) => q.unitCost));
  const fastest = Math.min(...quotes.map((q) => q.samplingDays + q.productionDays));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <TechLabel className="mb-3">Quote Comparison</TechLabel>
        <h1 className="text-3xl font-bold tracking-tight">
          Quotes · {featuredProduct.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {quotes.length} demo quotes side by side. All figures are sample
          estimates, not binding offers.
        </p>
      </div>

      {/* Comparison table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="mono-label sticky left-0 bg-card px-4 py-3 text-left text-khaki/70">
                  Line item
                </th>
                {quotes.map((q) => (
                  <th key={q.id} className="px-4 py-3 text-left align-bottom">
                    <p className="font-semibold">{q.manufacturer}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {q.country}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {q.unitCost === cheapestUnit && (
                        <Badge variant="success">Lowest unit</Badge>
                      )}
                      {q.samplingDays + q.productionDays === fastest && (
                        <Badge variant="default">Fastest</Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.key as string}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="mono-label sticky left-0 bg-card px-4 py-2.5 text-khaki/70">
                    {row.label}
                  </td>
                  {quotes.map((q) => (
                    <td
                      key={q.id}
                      className="whitespace-nowrap px-4 py-2.5 font-medium tabular-nums"
                    >
                      {row.fmt(q)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Estimated landed total */}
              <tr className="border-t border-border bg-forest-deep/40">
                <td className="mono-label sticky left-0 bg-forest-deep/40 px-4 py-3 text-mustard">
                  Est. landed @ MOQ
                </td>
                {quotes.map((q) => (
                  <td
                    key={q.id}
                    className="px-4 py-3 font-semibold tabular-nums text-mustard"
                  >
                    {money(landed(q))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Flags per quote */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {quotes.map((q) => (
          <Card key={q.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{q.manufacturer}</CardTitle>
              <CardDescription>
                {q.country} · unit {money(q.unitCost)} · MOQ{" "}
                {q.moq.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="space-y-2">
                {q.flags.map((fl, i) => {
                  const s = flagStyle(fl.level);
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${s.cls}`}
                    >
                      <s.icon className="mt-0.5 size-3.5 shrink-0" />
                      <span>{fl.note}</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="mono-label mb-1 text-khaki/70">Assumptions</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {q.assumptions.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-label mb-1 text-khaki/70">Exclusions</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {q.exclusions.map((a) => (
                    <li key={a}>· {a}</li>
                  ))}
                </ul>
              </div>
              <Button type="button" size="sm" className="mt-auto w-full">
                <Check className="size-4" /> Accept &amp; start prototype
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI analysis panel */}
      <Card className="border-mustard/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-mustard" /> AI quote analysis
          </CardTitle>
          <CardDescription>
            Automated read of the differences and risks · demo analysis, verify
            before deciding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border border-border bg-forest-deep/40 p-4">
              <p className="mono-label mb-2 text-khaki/70">Cost structure</p>
              <p className="text-foreground/90">
                Apex Precision and Molde Norte both carry meaningful tooling and
                mold investment, which lowers their per-unit cost at volume. Lone
                Star Prototyping has <strong>no tooling or mold cost</strong> but
                a much higher unit cost ({money(58)}), so it only wins for small
                runs and prototypes.
              </p>
            </div>
            <div className="rounded-md border border-border bg-forest-deep/40 p-4">
              <p className="mono-label mb-2 text-khaki/70">Lead time</p>
              <p className="text-foreground/90">
                Lone Star is fastest end-to-end (31 days) with a very low MOQ,
                ideal for the first prototype. Molde Norte offers a balanced
                nearshore lead time; Apex is slowest door-to-door once ~30 days
                of ocean freight is added.
              </p>
            </div>
          </div>
          <div>
            <p className="mono-label mb-2 text-khaki/70">Concerns flagged</p>
            <ul className="space-y-2">
              {[
                { icon: AlertTriangle, t: "High MOQ", d: "Apex requires 1,000 units minimum — significant upfront inventory commitment." },
                { icon: AlertTriangle, t: "Unit cost at scale", d: "Lone Star's $58/unit is uneconomical beyond pilot volumes without hard tooling." },
                { icon: Info, t: "Missing certification", d: "All three quotes exclude certification testing — budget for it separately." },
                { icon: Info, t: "Shipping uncertainty", d: "Ocean freight estimates can swing with fuel and port conditions; treat as indicative." },
                { icon: Info, t: "Material clarity", d: "Confirm recycled-ABS grade and TPU shore hardness are identical across quotes before comparing price." },
                { icon: OctagonAlert, t: "Compliance risk", d: "If the product is reclassified (e.g. children's use), added testing changes the cost basis materially." },
              ].map((c) => (
                <li
                  key={c.t}
                  className="flex items-start gap-2 rounded-md border border-border px-3 py-2"
                >
                  <c.icon className="mt-0.5 size-4 shrink-0 text-mustard" />
                  <span>
                    <strong>{c.t}.</strong>{" "}
                    <span className="text-muted-foreground">{c.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-mustard/30 bg-mustard/5 p-4">
            <p className="flex items-center gap-2 font-medium text-mustard">
              <ArrowRight className="size-4" /> Recommended path
            </p>
            <p className="mt-1 text-foreground/90">
              Prototype with <strong>Lone Star</strong> for speed and low MOQ,
              then move volume production to <strong>Molde Norte</strong> or{" "}
              <strong>Apex</strong> once the design is validated — balancing
              tooling investment against lead time and landed cost.
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        All quotes, manufacturers, and cost figures on this page are labeled
        demo/sample data and are estimates only — not binding offers or
        guaranteed pricing.
      </p>
    </div>
  );
}
