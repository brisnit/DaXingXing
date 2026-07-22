import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  FileBox,
  ListTree,
  FileDown,
  ScrollText,
  Images,
  PackageOpen,
  Rocket,
  Check,
  CircleDot,
  Circle,
  AlertTriangle,
  MessageSquare,
  History,
  HelpCircle,
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
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { ProductRender } from "@/components/product/product-render";
import { products } from "@/lib/mock/products";
import { formatCurrency, formatRange } from "@/lib/utils";
import type { ProjectStage } from "@/types";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  return { title: product ? `${product.name} · Da Xing Xing` : "Product" };
}

const STAGE_ORDER: ProjectStage[] = [
  "Idea",
  "Concept",
  "Specification",
  "Feasibility Review",
  "Manufacturer Matching",
  "Quoting",
  "Prototype",
  "Testing",
  "Revision",
  "Production Ready",
  "In Production",
  "Quality Control",
  "Shipping",
  "Launch",
  "Distribution",
];

// Lighten/darken a hex color slightly for gallery seed variation.
function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = Math.max(0, Math.min(255, ((n >> 16) & 0xff) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function clamp(n: number) {
  return Math.max(4, Math.min(98, Math.round(n)));
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();

  const currentStageIndex = STAGE_ORDER.indexOf(product.stage);

  const canvasViews = [
    "Front View",
    "Back View",
    "Side View",
    "Top View",
    "Exploded View",
    "Dimension View",
    "Material Callout",
    "Internal Layout",
  ];

  // Demo feasibility sub-scores derived from the overall feasibility.
  const f = product.feasibility;
  const subScores = [
    { label: "Technical feasibility", value: clamp(f + 4) },
    { label: "Manufacturing complexity", value: clamp(f - 8) },
    { label: "Material availability", value: clamp(f + 10) },
    { label: "Compliance complexity", value: clamp(f - 12) },
    { label: "Supply-chain risk", value: clamp(f - 5) },
    { label: "Prototype readiness", value: clamp(f + 6) },
    { label: "Market readiness", value: clamp(f - 3) },
    { label: "Sustainability", value: clamp(f + 2) },
    { label: "Margin viability", value: clamp(f + 1) },
  ];

  const recommendations = [
    "Lock the primary material selection to reduce quoting variance.",
    "Split compliance testing into an early pre-check to de-risk certification.",
    "Request a dual-source quote to reduce supply-chain concentration.",
  ];

  const dimensions = [
    { part: "Overall length", value: "210 mm", tol: "±1.5 mm" },
    { part: "Overall width", value: "96 mm", tol: "±1.0 mm" },
    { part: "Overall height", value: "78 mm", tol: "±1.0 mm" },
    { part: "Wall thickness", value: "2.4 mm", tol: "±0.2 mm" },
    { part: "Net weight (est.)", value: "540 g", tol: "±25 g" },
  ];

  const materials = [
    { name: "Recycled ABS", role: "Primary housing", note: "Impact resistant" },
    { name: "TPU", role: "Bumper / grip", note: "Overmolded edges" },
    { name: "Silicone", role: "Seals & gasket", note: "Light-rain resistance" },
    { name: "Aluminum 6061", role: "Accent / mount", note: "Anodized finish" },
  ];

  const components = [
    { name: "Main housing", qty: 1, source: "Injection molded" },
    { name: "Audio / functional module", qty: 1, source: "Sub-assembly" },
    { name: "Rechargeable battery pack", qty: 1, source: "Certified cell" },
    { name: "Fasteners & hardware", qty: 12, source: "Standard parts" },
    { name: "Carry strap", qty: 1, source: "Cut & sew" },
  ];

  const colorways = [
    { name: "Forest", hex: "#344A32" },
    { name: "Mustard", hex: "#C1A548" },
    { name: "Earth", hex: "#594735" },
    { name: "Bone", hex: "#E4D8BA" },
  ];

  const revisions = [
    {
      v: "v0.4",
      date: "2026-07-14",
      note: "Updated bumper geometry after drop-test feedback.",
      by: "AI + Founder",
    },
    {
      v: "v0.3",
      date: "2026-06-30",
      note: "Switched primary shell to recycled ABS for cost and sustainability.",
      by: "AI suggestion",
    },
    {
      v: "v0.2",
      date: "2026-06-18",
      note: "Added light-rain sealing requirement and gasket callout.",
      by: "Founder",
    },
    {
      v: "v0.1",
      date: "2026-06-05",
      note: "Initial specification generated from concept brief.",
      by: "AI",
    },
  ];

  const openQuestions = [
    "Final decision on strap attachment method (loop vs. clip).",
    "Confirm target IP rating language — currently 'light-rain resistant', not IP-rated.",
    "Retail packaging: fully recyclable mono-material vs. printed gift box.",
  ];

  const exports = [
    { label: "Product Brief", icon: FileText },
    { label: "RFQ Package", icon: FileBox },
    { label: "BOM Draft", icon: ListTree },
    { label: "Spec PDF", icon: FileDown },
    { label: "PRD", icon: ScrollText },
    { label: "Image Package", icon: Images },
    { label: "Packaging Brief", icon: PackageOpen },
    { label: "Launch Brief", icon: Rocket },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/products"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All products
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <TechLabel className="mb-2">{product.category}</TechLabel>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {product.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="warning">{product.stage}</Badge>
              <Badge variant="muted">
                Feasibility {product.feasibility}% · est.
              </Badge>
              <Badge variant="muted">
                Completion {product.completion}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance disclaimer banner */}
      <div className="flex items-start gap-3 rounded-md border border-mustard/30 bg-mustard/5 px-4 py-3 text-xs text-foreground/90">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-mustard" />
        <p>
          This is a <strong>living product specification</strong> built from
          sample data. All dimensions, materials, costs, and feasibility scores
          are AI-generated <strong>estimates</strong> for illustration. Safety
          and compliance items require review by a qualified professional and
          are not legal or engineering guarantees.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Product Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Canvas</CardTitle>
              <CardDescription>
                Generated concept views · AI placeholders, not final renders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {canvasViews.map((v, i) => (
                  <ProductRender
                    key={v}
                    seed={shade(product.render, (i - 3) * 10)}
                    label={v}
                    annotated={i % 3 === 0}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overview */}
          <Section
            title="Overview & intended customer"
            icon={<CircleDot className="size-4 text-mustard" />}
          >
            <p className="text-sm leading-relaxed text-foreground/90">
              {product.summary}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MiniBlock title="Intended customer">
                Outdoor-leaning consumers and gift buyers seeking a durable,
                well-designed product at a{" "}
                {formatCurrency(product.retailTarget)} retail price point.
              </MiniBlock>
              <MiniBlock title="Primary use cases">
                Everyday carry, travel, and outdoor use; positioned as a premium
                but accessible option in the {product.category} category.
              </MiniBlock>
            </div>
          </Section>

          {/* Functional requirements */}
          <Section
            title="Functional requirements"
            icon={<ListTree className="size-4 text-mustard" />}
          >
            <ul className="space-y-2 text-sm">
              {[
                "Performs its core function reliably across expected use conditions.",
                "Rechargeable / serviceable where applicable, with accessible parts.",
                "Light-rain resistant (not a rated IP claim in this demo spec).",
                "Meets target unit cost of " +
                  formatRange(product.unitCostLow, product.unitCostHigh) +
                  " at " +
                  product.quantity.toLocaleString() +
                  " units.",
                "Ships flat / compact where possible to reduce freight cost.",
              ].map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  <span className="text-foreground/90">{r}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Physical dimensions */}
          <Section
            title="Physical dimensions"
            icon={<FileBox className="size-4 text-mustard" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="mono-label px-3 py-2 text-khaki/70">
                      Parameter
                    </th>
                    <th className="mono-label px-3 py-2 text-khaki/70">
                      Value (est.)
                    </th>
                    <th className="mono-label px-3 py-2 text-khaki/70">
                      Tolerance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map((d) => (
                    <tr
                      key={d.part}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="px-3 py-2 text-foreground/90">{d.part}</td>
                      <td className="px-3 py-2 font-medium tabular-nums">
                        {d.value}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {d.tol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Materials + Components */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Section
              title="Materials"
              icon={<CircleDot className="size-4 text-mustard" />}
            >
              <ul className="space-y-3 text-sm">
                {materials.map((m) => (
                  <li key={m.name}>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.role} · {m.note}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>
            <Section
              title="Components (BOM preview)"
              icon={<ListTree className="size-4 text-mustard" />}
            >
              <ul className="space-y-3 text-sm">
                {components.map((c) => (
                  <li key={c.name} className="flex justify-between gap-3">
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.source}</p>
                    </div>
                    <span className="mono-label text-khaki/70">×{c.qty}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Color & finish */}
          <Section
            title="Color & finish"
            icon={<CircleDot className="size-4 text-mustard" />}
          >
            <div className="flex flex-wrap gap-4">
              {colorways.map((c) => (
                <div key={c.name} className="text-center">
                  <div
                    className="size-14 rounded-md border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="mt-1 text-xs font-medium">{c.name}</p>
                  <p className="font-mono text-[0.65rem] text-muted-foreground">
                    {c.hex}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Finish direction: matte powder-coat / soft-touch. Final colorway
              pending prototype approval.
            </p>
          </Section>

          {/* Performance & durability */}
          <Section
            title="Performance & durability"
            icon={<CircleDot className="size-4 text-mustard" />}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { k: "Drop resistance", v: "1.2 m onto hardwood (target)" },
                { k: "Water exposure", v: "Light rain / splash (not rated)" },
                { k: "Cycle life", v: "500+ use cycles (target)" },
              ].map((p) => (
                <MiniBlock key={p.k} title={p.k}>
                  {p.v}
                </MiniBlock>
              ))}
            </div>
          </Section>

          {/* Packaging */}
          <Section
            title="Packaging"
            icon={<PackageOpen className="size-4 text-mustard" />}
          >
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Retail-ready carton with recycled kraft insert (target).</li>
              <li>Master carton of 20 units for freight efficiency.</li>
              <li>
                Mono-material / recyclable direction preferred to reduce cost
                and improve sustainability score.
              </li>
            </ul>
          </Section>

          {/* Safety & compliance */}
          <Section
            title="Safety & compliance considerations"
            icon={<AlertTriangle className="size-4 text-mustard" />}
          >
            <ul className="space-y-2 text-sm text-foreground/90">
              <li>Battery / electronics: applicable UN 38.3 & FCC considerations.</li>
              <li>Materials: RoHS / REACH direction for exported goods.</li>
              <li>
                If reclassified as a children&apos;s product: CPSIA & ASTM F963
                testing would apply.
              </li>
            </ul>
            <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-red-200">
              Compliance items are indicative only and must be verified by a
              qualified compliance professional before production or sale.
            </div>
          </Section>

          {/* Target cost / quantity / delivery */}
          <Section
            title="Target cost, quantity & delivery"
            icon={<FileDown className="size-4 text-mustard" />}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Unit cost (est.)" value={formatRange(product.unitCostLow, product.unitCostHigh)} />
              <Stat label="Retail target" value={formatCurrency(product.retailTarget)} />
              <Stat label="Quantity" value={product.quantity.toLocaleString()} />
              <Stat label="Target launch" value={formatDate(product.targetLaunch)} />
            </div>
          </Section>

          {/* Feasibility panel */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Feasibility score</CardTitle>
                <CardDescription>
                  AI estimate across nine dimensions · demo scoring.
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold tabular-nums text-mustard">
                  {product.feasibility}
                </p>
                <p className="mono-label text-khaki/60">overall</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {subScores.map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-foreground/90">{s.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {s.value}
                      </span>
                    </div>
                    <Progress
                      value={s.value}
                      indicatorClassName={
                        s.value >= 70
                          ? "bg-emerald-400"
                          : s.value >= 50
                          ? "bg-mustard"
                          : "bg-red-400"
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-border bg-forest-deep/40 p-4">
                <p className="mono-label mb-2 text-khaki/70">
                  Improvement recommendations
                </p>
                <ul className="space-y-1.5 text-sm">
                  {recommendations.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-mustard" />
                      <span className="text-foreground/90">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Revision history + open questions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Section
              title="Revision history"
              icon={<History className="size-4 text-mustard" />}
            >
              <ol className="space-y-3">
                {revisions.map((r) => (
                  <li key={r.v} className="border-l border-border pl-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-mustard">
                        {r.v}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.date)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90">{r.note}</p>
                    <p className="text-xs text-muted-foreground">— {r.by}</p>
                  </li>
                ))}
              </ol>
            </Section>
            <Section
              title="Open questions"
              icon={<HelpCircle className="size-4 text-mustard" />}
            >
              <ul className="space-y-2 text-sm">
                {openQuestions.map((q) => (
                  <li key={q} className="flex items-start gap-2">
                    <HelpCircle className="mt-0.5 size-4 shrink-0 text-mustard" />
                    <span className="text-foreground/90">{q}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stage stepper */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-0.5">
                {STAGE_ORDER.map((s, i) => {
                  const done = i < currentStageIndex;
                  const current = i === currentStageIndex;
                  return (
                    <li key={s} className="flex items-center gap-2.5 py-1">
                      {done ? (
                        <Check className="size-4 shrink-0 text-emerald-400" />
                      ) : current ? (
                        <CircleDot className="size-4 shrink-0 text-mustard" />
                      ) : (
                        <Circle className="size-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={
                          current
                            ? "text-sm font-semibold text-mustard"
                            : done
                            ? "text-sm text-foreground/70"
                            : "text-sm text-muted-foreground/60"
                        }
                      >
                        {s}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          {/* Next action + budget */}
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="rounded-md border border-mustard/30 bg-mustard/5 px-3 py-2.5">
                <p className="mono-label text-mustard/80">Next action</p>
                <p className="mt-0.5 text-sm font-medium">
                  {product.nextAction}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Est. budget
                </span>
                <span className="font-semibold">
                  {formatCurrency(product.budget)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Manufacturer
                </span>
                <span className="text-sm font-medium">
                  {product.manufacturer ?? (
                    <span className="text-mustard">Matching…</span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/quotes">
                    <MessageSquare className="size-4" /> View quotes
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/orders">
                    <FileBox className="size-4" /> Prototype tracking
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/orders">
                    <PackageOpen className="size-4" /> Production
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exports */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export documents</CardTitle>
              <CardDescription className="text-xs">
                Demo · generation not wired in this preview.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {exports.map((e) => (
                <button
                  key={e.label}
                  type="button"
                  className="flex items-center gap-2 rounded-md border border-border bg-forest-deep/40 px-3 py-2 text-left text-xs font-medium transition-colors hover:border-mustard/40 hover:text-mustard"
                >
                  <e.icon className="size-3.5 shrink-0" />
                  {e.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* --- local presentational helpers (server-safe) --- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function MiniBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-forest-deep/40 p-3">
      <p className="mono-label mb-1 text-khaki/70">{title}</p>
      <p className="text-sm text-foreground/90">{children}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-forest-deep/40 p-3">
      <p className="mono-label text-khaki/70">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
