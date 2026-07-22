"use client";

import * as React from "react";
import {
  BadgeCheck,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileClock,
  FileText,
  FileUp,
  Gauge,
  Globe2,
  Languages,
  Lock,
  MessageSquare,
  Package,
  Plus,
  Send,
  ShieldCheck,
  Star,
  Timer,
  Truck,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { cn, formatCurrency, formatRange } from "@/lib/utils";
import { manufacturers } from "@/lib/mock/manufacturers";
import { products } from "@/lib/mock/products";
import { quotes } from "@/lib/mock/quotes";
import type { Quote } from "@/types";

const factory =
  manufacturers.find((m) => m.id === "shenzhen-apex") ?? manufacturers[0];

const PRODUCTION_STATUSES = [
  "Tooling",
  "Sampling",
  "In Production",
  "Quality Control",
  "Packaging",
  "Shipping",
] as const;

// ── small inline building blocks ──────────────────────────────────────────
function StatTile({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-charcoal/60 p-4">
      <div className="flex items-center justify-between">
        <span className="mono-label text-khaki/60">{label}</span>
        <Icon className="size-4 text-mustard/70" />
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <TechLabel className="mb-2">{eyebrow}</TechLabel>
          <h2 className="text-2xl font-bold tracking-tight md:text-[1.7rem]">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-left mono-label font-medium text-khaki/60",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={cn("whitespace-nowrap px-3 py-2.5 align-middle", className)}>
      {children}
    </td>
  );
}

export default function ManufacturerPortalPage() {
  // ── opportunities: file-access requests ────────────────────────────────
  const [requested, setRequested] = React.useState<Set<string>>(new Set());
  const toggleRequest = (id: string) =>
    setRequested((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // ── quotes: seed with this factory's demo quotes + local submissions ───
  const seededQuotes = React.useMemo(
    () => quotes.filter((q) => q.manufacturer === factory.name),
    []
  );
  const [submitted, setSubmitted] = React.useState<
    Array<Quote & { status: string }>
  >(seededQuotes.map((q) => ({ ...q, status: "Submitted" })));

  const emptyForm = {
    product: products[0]?.name ?? "",
    prototypeCost: "",
    toolingCost: "",
    moldCost: "",
    unitCost: "",
    moq: "",
    samplingDays: "",
    productionDays: "",
    packagingCost: "",
    qcCost: "",
    shippingEstimate: "",
    paymentTerms: "30% deposit / 70% before shipment",
    assumptions: "",
    exclusions: "",
  };
  const [form, setForm] = React.useState(emptyForm);
  const setField = (k: keyof typeof emptyForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const draft: Quote & { status: string } = {
      id: `draft-${Date.now()}`,
      manufacturer: factory.name,
      country: factory.country,
      demo: true,
      prototypeCost: Number(form.prototypeCost) || 0,
      toolingCost: Number(form.toolingCost) || 0,
      moldCost: Number(form.moldCost) || 0,
      unitCost: Number(form.unitCost) || 0,
      moq: Number(form.moq) || 0,
      samplingDays: Number(form.samplingDays) || 0,
      productionDays: Number(form.productionDays) || 0,
      packagingCost: Number(form.packagingCost) || 0,
      qcCost: Number(form.qcCost) || 0,
      shippingEstimate: Number(form.shippingEstimate) || 0,
      dutiesEstimate: 0,
      paymentTerms: form.paymentTerms,
      expires: "2026-09-30",
      assumptions: form.assumptions
        ? form.assumptions.split("\n").filter(Boolean)
        : [],
      exclusions: form.exclusions
        ? form.exclusions.split("\n").filter(Boolean)
        : [],
      flags: [],
      status: "Draft",
    };
    setSubmitted((prev) => [draft, ...prev]);
    setForm(emptyForm);
  };

  // ── orders: active production book (demo) ──────────────────────────────
  const orderProducts = React.useMemo(
    () =>
      products.filter((p) =>
        [
          "Prototype",
          "Testing",
          "Production Ready",
          "In Production",
          "Quality Control",
          "Shipping",
        ].includes(p.stage)
      ),
    []
  );
  const [orderStatus, setOrderStatus] = React.useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        orderProducts.map((p) => [
          p.id,
          p.stage === "In Production" ? "In Production" : "Sampling",
        ])
      )
  );
  const [uploads, setUploads] = React.useState<string[]>([]);
  const logUpload = (order: string, kind: string) =>
    setUploads((prev) =>
      [`${kind} attached to ${order} · pending buyer review`, ...prev].slice(0, 6)
    );

  // ── clarification composer ─────────────────────────────────────────────
  const [thread, setThread] = React.useState<
    Array<{ project: string; body: string }>
  >([]);
  const [msgProject, setMsgProject] = React.useState(products[0]?.name ?? "");
  const [msgBody, setMsgBody] = React.useState("");
  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;
    setThread((prev) => [{ project: msgProject, body: msgBody.trim() }, ...prev]);
    setMsgBody("");
  };

  // ── staff permissions ──────────────────────────────────────────────────
  const [staff, setStaff] = React.useState([
    { name: "L. Chen", role: "Account Owner", quoting: true, production: true, admin: true },
    { name: "R. Ortega", role: "Sales Engineer", quoting: true, production: false, admin: false },
    { name: "P. Nguyen", role: "Production Lead", quoting: false, production: true, admin: false },
    { name: "S. Rao", role: "QC Manager", quoting: false, production: true, admin: false },
  ]);
  const togglePerm = (i: number, key: "quoting" | "production" | "admin") =>
    setStaff((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [key]: !m[key] } : m))
    );

  return (
    <div className="blueprint">
      {/* Overview / hero */}
      <section id="overview" className="scroll-mt-20 border-b border-border">
        <div className="container py-10 md:py-12">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="warning">
              <ShieldCheck className="size-3.5" /> Demo profile — sample data only
            </Badge>
            <Badge variant="secondary">Logged in as factory</Badge>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <TechLabel className="mb-3">Manufacturer Portal</TechLabel>
              <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight md:text-4xl">
                {factory.name}
                {factory.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    <BadgeCheck className="size-3.5" /> Verified
                  </span>
                )}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {factory.blurb}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="size-4 text-mustard/70" />
                  {factory.city}, {factory.country}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Boxes className="size-4 text-mustard/70" />
                  {factory.capacity}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="size-4 text-mustard/70" />
                  Exports: {factory.exportRegions.join(", ")}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <a href="#opportunities">
                  <ClipboardList className="size-4" /> Browse opportunities
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="#quotes">
                  <Plus className="size-4" /> Submit quote
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatTile label="Rating" value={factory.rating.toFixed(1)} sub="of 5.0" icon={Star} />
            <StatTile label="On-time" value={`${factory.onTime}%`} sub="delivery" icon={Timer} />
            <StatTile label="Comms" value={`${factory.communication}%`} sub="responsiveness" icon={MessageSquare} />
            <StatTile label="Projects" value={factory.completedProjects} sub="completed" icon={CheckCircle2} />
            <StatTile label="MOQ" value={factory.moq.toLocaleString()} sub="min. units" icon={Package} />
            <StatTile label="Lead time" value={`${factory.leadTimeDays}d`} sub="typical" icon={Gauge} />
          </div>
        </div>
      </section>

      <div className="container space-y-16 py-12 md:py-16">
        {/* Opportunities */}
        <SectionShell
          id="opportunities"
          eyebrow="Qualified matches"
          title="Product opportunities"
          description="Projects you've been matched to based on your capabilities. Design files, CAD, and full specifications are gated until the buyer approves your access and a platform agreement is in place."
          action={
            <Badge variant="olive">
              {products.length} matched · demo
            </Badge>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => {
              const isRequested = requested.has(p.id);
              return (
                <Card key={p.id} className="flex flex-col bg-charcoal/60">
                  <CardHeader className="gap-2 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{p.category}</Badge>
                      <Badge variant="outline">{p.stage}</Badge>
                    </div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {p.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3 pt-0">
                    <dl className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-md border border-border bg-forest-deep/50 p-2">
                        <dt className="mono-label text-[0.55rem] text-khaki/50">Target qty</dt>
                        <dd className="mt-0.5 text-sm font-semibold">
                          {p.quantity.toLocaleString()}
                        </dd>
                      </div>
                      <div className="rounded-md border border-border bg-forest-deep/50 p-2">
                        <dt className="mono-label text-[0.55rem] text-khaki/50">Target unit</dt>
                        <dd className="mt-0.5 text-sm font-semibold">
                          {formatRange(p.unitCostLow, p.unitCostHigh)}
                        </dd>
                      </div>
                      <div className="rounded-md border border-border bg-forest-deep/50 p-2">
                        <dt className="mono-label text-[0.55rem] text-khaki/50">Budget</dt>
                        <dd className="mt-0.5 text-sm font-semibold">
                          {formatCurrency(p.budget, { compact: true })}
                        </dd>
                      </div>
                    </dl>
                    <Button
                      size="sm"
                      variant={isRequested ? "secondary" : "outline"}
                      className="w-full"
                      onClick={() => toggleRequest(p.id)}
                    >
                      {isRequested ? (
                        <>
                          <FileClock className="size-4" /> Access requested
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" /> Request file access
                        </>
                      )}
                    </Button>
                    {isRequested && (
                      <p className="text-[0.7rem] leading-snug text-muted-foreground">
                        Files stay locked until the buyer approves and the
                        platform manufacturing agreement is signed.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionShell>

        {/* Quotes */}
        <SectionShell
          id="quotes"
          eyebrow="Bids & pricing"
          title="Your quotes"
          description="Quotes you've submitted to matched projects, plus a builder to submit a new one. Everything here is local demo state — no backend."
          action={<Badge variant="olive">{submitted.length} on file · demo</Badge>}
        >
          <Card className="overflow-hidden bg-charcoal/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-forest-deep/50">
                  <tr>
                    <Th>Quote / project</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Unit</Th>
                    <Th className="text-right">Tooling</Th>
                    <Th className="text-right">Mold</Th>
                    <Th className="text-right">MOQ</Th>
                    <Th>Sampling</Th>
                    <Th>Production</Th>
                    <Th>Terms</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submitted.map((q) => (
                    <tr key={q.id} className="hover:bg-secondary/20">
                      <Td>
                        <div className="font-medium text-foreground">{q.manufacturer}</div>
                        <div className="text-xs text-muted-foreground">
                          {q.id.startsWith("draft-") ? "New submission" : "Trailhead Rugged Speaker"}
                        </div>
                      </Td>
                      <Td>
                        <Badge variant={q.status === "Draft" ? "warning" : "success"}>
                          {q.status}
                        </Badge>
                      </Td>
                      <Td className="text-right font-semibold">
                        {formatCurrency(q.unitCost, { cents: true })}
                      </Td>
                      <Td className="text-right">{formatCurrency(q.toolingCost)}</Td>
                      <Td className="text-right">{formatCurrency(q.moldCost)}</Td>
                      <Td className="text-right">{q.moq.toLocaleString()}</Td>
                      <Td>{q.samplingDays}d</Td>
                      <Td>{q.productionDays}d</Td>
                      <Td className="text-muted-foreground">{q.paymentTerms}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Submit new quote */}
          <Card className="mt-6 bg-charcoal/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="size-4 text-mustard" /> Submit a new quote
              </CardTitle>
              <CardDescription>
                Prototype, tooling, mold, unit cost, MOQ, timelines, packaging,
                QC, shipping, terms, assumptions & exclusions. Demo — saved to
                this page only.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitQuote} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="q-product">Opportunity</Label>
                    <select
                      id="q-product"
                      value={form.product}
                      onChange={(e) => setField("product", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(
                    [
                      ["prototypeCost", "Prototype cost ($)"],
                      ["unitCost", "Unit cost ($)"],
                      ["toolingCost", "Tooling cost ($)"],
                      ["moldCost", "Mold cost ($)"],
                      ["moq", "MOQ (units)"],
                      ["packagingCost", "Packaging / unit ($)"],
                      ["samplingDays", "Sampling (days)"],
                      ["productionDays", "Production (days)"],
                      ["qcCost", "QC cost ($)"],
                      ["shippingEstimate", "Shipping estimate ($)"],
                    ] as Array<[keyof typeof emptyForm, string]>
                  ).map(([key, label]) => (
                    <div className="space-y-1.5" key={key}>
                      <Label htmlFor={`q-${key}`}>{label}</Label>
                      <Input
                        id={`q-${key}`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        value={form[key]}
                        onChange={(e) => setField(key, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="q-terms">Payment terms</Label>
                    <Input
                      id="q-terms"
                      value={form.paymentTerms}
                      onChange={(e) => setField("paymentTerms", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="q-assume">Assumptions (one per line)</Label>
                    <Textarea
                      id="q-assume"
                      placeholder="Recycled ABS shell with TPU bumper&#10;1,000-unit initial run"
                      value={form.assumptions}
                      onChange={(e) => setField("assumptions", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="q-exclude">Exclusions (one per line)</Label>
                    <Textarea
                      id="q-exclude"
                      placeholder="Certification testing&#10;Custom retail packaging"
                      value={form.exclusions}
                      onChange={(e) => setField("exclusions", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Buyer sees a normalized cost breakdown once submitted.
                  </p>
                  <Button type="submit">
                    <Send className="size-4" /> Submit quote
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </SectionShell>

        {/* Orders */}
        <SectionShell
          id="orders"
          eyebrow="Production"
          title="Active orders"
          description="Production orders in progress. Update status and attach prototype updates, quality reports, shipping documents, and invoices for buyer review."
          action={<Badge variant="olive">{orderProducts.length} active · demo</Badge>}
        >
          <div className="space-y-4">
            {orderProducts.map((p) => (
              <Card key={p.id} className="bg-charcoal/60">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">{p.name}</span>
                        <Badge variant="secondary">{p.category}</Badge>
                        <span className="mono-label text-khaki/50">
                          PO-{p.id.slice(0, 6).toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                        {p.latestUpdate}
                      </p>
                      <div className="mt-3 max-w-md">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Completion</span>
                          <span className="font-medium text-foreground">{p.completion}%</span>
                        </div>
                        <Progress value={p.completion} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`st-${p.id}`} className="mono-label text-khaki/60">
                          Status
                        </Label>
                        <select
                          id={`st-${p.id}`}
                          value={orderStatus[p.id]}
                          onChange={(e) =>
                            setOrderStatus((s) => ({ ...s, [p.id]: e.target.value }))
                          }
                          className="h-9 rounded-md border border-input bg-background/60 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {PRODUCTION_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={() => logUpload(p.name, "Prototype update")}>
                          <FileUp className="size-4" /> Prototype
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => logUpload(p.name, "Quality report")}>
                          <ShieldCheck className="size-4" /> QC report
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => logUpload(p.name, "Shipping document")}>
                          <Truck className="size-4" /> Shipping
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => logUpload(p.name, "Invoice")}>
                          <FileText className="size-4" /> Invoice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {uploads.length > 0 && (
              <Card className="border-dashed bg-forest-deep/40">
                <CardContent className="p-4">
                  <div className="mono-label mb-2 text-khaki/60">Recent uploads (demo)</div>
                  <ul className="space-y-1.5">
                    {uploads.map((u, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-400" /> {u}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </SectionShell>

        {/* Profile: capabilities, clarifications, staff */}
        <SectionShell
          id="profile"
          eyebrow="Factory profile"
          title="Capabilities & team"
          description="Your verified capability sheet is what the matching engine uses to surface opportunities. Ask buyers clarifying questions and manage who on your team can quote and run production."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Capabilities */}
            <Card className="bg-charcoal/60 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Verified capabilities</CardTitle>
                <CardDescription>Sourced from your onboarding audit — demo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CapRow title="Specialties" items={factory.specialties} />
                <CapRow title="Materials" items={factory.materials} />
                <CapRow title="Methods" items={factory.methods} />
                <CapRow title="Certifications" items={factory.certifications} variant="success" />
                <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
                  <MiniStat label="MOQ" value={factory.moq.toLocaleString()} />
                  <MiniStat label="Lead time" value={`${factory.leadTimeDays} days`} />
                  <MiniStat label="Prototyping" value={factory.prototypeCapable ? "Yes" : "No"} />
                  <MiniStat label="Price tier" value={"$".repeat(factory.priceTier)} />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Languages className="size-4 text-mustard/70" />
                    {factory.languages.join(", ")}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe2 className="size-4 text-mustard/70" />
                    {factory.exportRegions.join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Clarification composer */}
            <Card className="bg-charcoal/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="size-4 text-mustard" /> Ask a clarification
                </CardTitle>
                <CardDescription>Message the buyer's project team — demo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={sendMsg} className="space-y-3">
                  <select
                    value={msgProject}
                    onChange={(e) => setMsgProject(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background/60 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Textarea
                    placeholder="e.g. Can you confirm the target IP rating and whether the strap is in-scope for tooling?"
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="w-full">
                    <Send className="size-4" /> Send question
                  </Button>
                </form>
                {thread.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-border pt-3">
                    {thread.map((t, i) => (
                      <li key={i} className="rounded-md border border-border bg-forest-deep/50 p-2.5">
                        <div className="mono-label text-[0.55rem] text-khaki/50">{t.project}</div>
                        <p className="mt-0.5 text-sm text-foreground">{t.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Staff & permissions */}
          <Card className="mt-4 overflow-hidden bg-charcoal/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-mustard" /> Staff & permissions
              </CardTitle>
              <CardDescription>
                Control who can submit quotes, manage production, and administer the
                account. Demo — toggles are local only.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-y border-border bg-forest-deep/50">
                    <tr>
                      <Th>Member</Th>
                      <Th>Role</Th>
                      <Th className="text-center">Quoting</Th>
                      <Th className="text-center">Production</Th>
                      <Th className="text-center">Admin</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {staff.map((m, i) => (
                      <tr key={m.name} className="hover:bg-secondary/20">
                        <Td className="font-medium text-foreground">{m.name}</Td>
                        <Td className="text-muted-foreground">{m.role}</Td>
                        {(["quoting", "production", "admin"] as const).map((key) => (
                          <Td key={key} className="text-center">
                            <button
                              type="button"
                              onClick={() => togglePerm(i, key)}
                              className={cn(
                                "mono-label rounded-full px-2.5 py-1 text-[0.6rem] transition-colors",
                                m[key]
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {m[key] ? "On" : "Off"}
                            </button>
                          </Td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </SectionShell>
      </div>
    </div>
  );
}

function CapRow({
  title,
  items,
  variant = "secondary",
}: {
  title: string;
  items: string[];
  variant?: "secondary" | "success";
}) {
  return (
    <div>
      <div className="mono-label mb-1.5 text-khaki/60">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Badge key={it} variant={variant}>
            {it}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-forest-deep/50 p-3 text-center">
      <div className="mono-label text-[0.55rem] text-khaki/50">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
