import Link from "next/link";
import {
  Boxes,
  FileText,
  Hammer,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Truck,
  AlertCircle,
  CircleDot,
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
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { ProductRender } from "@/components/product/product-render";
import { products } from "@/lib/mock/products";
import { quotes } from "@/lib/mock/quotes";
import { formatCurrency, formatRange } from "@/lib/utils";
import type { ProjectStage } from "@/types";

export const metadata = { title: "Dashboard · Da Xing Xing" };

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

export default function DashboardPage() {
  const activeProducts = products.length;
  const openQuotes = quotes.length;
  const prototypeInProgress = products.filter((p) =>
    ["Prototype", "Testing", "Revision"].includes(p.stage)
  ).length;
  // Demo: next deposit derived from lowest tooling+deposit obligation
  const upcomingPayment = Math.round(
    quotes[0].toolingCost * 0.3 + quotes[0].prototypeCost
  );

  const stats = [
    {
      label: "Active products",
      value: String(activeProducts),
      sub: "across all stages",
      icon: Boxes,
      href: "/dashboard/products",
    },
    {
      label: "Open quotes",
      value: String(openQuotes),
      sub: "awaiting your review",
      icon: FileText,
      href: "/dashboard/quotes",
    },
    {
      label: "Prototypes in progress",
      value: String(prototypeInProgress),
      sub: "in build or revision",
      icon: Hammer,
      href: "/dashboard/orders",
    },
    {
      label: "Upcoming payment",
      value: formatCurrency(upcomingPayment, { compact: true }),
      sub: "deposit · est. demo",
      icon: Wallet,
      href: "/dashboard/orders",
    },
  ];

  const decisions = products
    .filter((p) => p.nextAction)
    .map((p) => ({
      id: p.id,
      product: p.name,
      stage: p.stage,
      action: p.nextAction,
    }));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <TechLabel className="mb-3">Workspace Overview</TechLabel>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, Demo Founder
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is where your products stand today. All figures below are
            sample estimates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/products">All products</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/studio">
              New product <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="h-full transition-colors group-hover:border-mustard/50">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="mono-label text-khaki/70">{s.label}</p>
                  <p className="mt-3 text-3xl font-bold tabular-nums">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-md bg-secondary/60 text-mustard">
                  <s.icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending decisions + demo widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4 text-mustard" />
                Pending decisions
              </CardTitle>
              <CardDescription>
                Next required actions across your active products.
              </CardDescription>
            </div>
            <Badge variant="warning">{decisions.length} open</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {decisions.map((d) => (
              <Link
                key={d.id}
                href={`/dashboard/products/${d.id}`}
                className="flex items-center gap-3 rounded-md border border-border bg-forest-deep/40 px-4 py-3 transition-colors hover:border-mustard/40"
              >
                <CircleDot className="size-4 shrink-0 text-mustard" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.action}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {d.product} · {d.stage}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Campaign performance widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4 text-mustard" />
                Campaign performance
              </CardTitle>
              <CardDescription className="text-xs">
                Preorder funnel · demo numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { k: "Landing visits", v: "3,412" },
                { k: "Email signups", v: "487" },
                { k: "Preorders (demo)", v: "126" },
                { k: "Conversion", v: "3.7%" },
              ].map((r) => (
                <div
                  key={r.k}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{r.k}</span>
                  <span className="font-semibold tabular-nums">{r.v}</span>
                </div>
              ))}
              <Badge variant="muted" className="mt-1">
                Sample data
              </Badge>
            </CardContent>
          </Card>

          {/* Distribution status widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Truck className="size-4 text-mustard" />
                Distribution status
              </CardTitle>
              <CardDescription className="text-xs">
                Summit Tumbler run · demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Production</span>
                  <span className="tabular-nums">60%</span>
                </div>
                <Progress value={60} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Units committed</span>
                <span className="font-semibold tabular-nums">2,500</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">QC inspection</span>
                <Badge variant="warning">Scheduled</Badge>
              </div>
              <Badge variant="muted" className="mt-1">
                Sample data
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your products</h2>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center gap-1 text-sm text-mustard hover:underline"
          >
            View all <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
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
                  <div>
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="font-semibold leading-tight hover:text-mustard"
                    >
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.category}
                    </p>
                  </div>
                  <Badge variant={stageVariant(p.stage)}>{p.stage}</Badge>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="tabular-nums">{p.completion}%</span>
                  </div>
                  <Progress value={p.completion} />
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Target launch</dt>
                    <dd className="font-medium">{formatDate(p.targetLaunch)}</dd>
                  </div>
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
                  <div>
                    <dt className="text-muted-foreground">Unit cost (est.)</dt>
                    <dd className="font-medium">
                      {formatRange(p.unitCostLow, p.unitCostHigh)}
                    </dd>
                  </div>
                </dl>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="mono-label text-khaki/60">Latest · </span>
                  {p.latestUpdate}
                </p>

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
      </div>

      <p className="text-xs text-muted-foreground">
        All manufacturer profiles, quotes, costs, and campaign metrics shown are
        labeled demo/sample data for illustration only. Cost figures are
        estimates, not guaranteed pricing.
      </p>
    </div>
  );
}
