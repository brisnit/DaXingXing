import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Wallet,
  Boxes,
  Wrench,
  FlaskConical,
  Factory,
  ShieldCheck,
  PackageCheck,
  Ship,
  Landmark,
  Warehouse,
  BadgeDollarSign,
  Globe2,
  Store,
  RefreshCw,
  Users,
  Layers,
  MapPin,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";

export const metadata = { title: "Global Distribution · Da Xing Xing" };

const pipeline = [
  { label: "Purchase order", icon: FileText },
  { label: "Deposit", icon: Wallet },
  { label: "Materials", icon: Boxes },
  { label: "Tooling", icon: Wrench },
  { label: "Pre-production sample", icon: FlaskConical },
  { label: "Production", icon: Factory },
  { label: "Quality control", icon: ShieldCheck },
  { label: "Packaging", icon: PackageCheck },
  { label: "Freight booking", icon: Ship },
  { label: "Shipment", icon: Ship },
  { label: "Customs", icon: Landmark },
  { label: "Warehouse", icon: Warehouse },
  { label: "Final payment", icon: BadgeDollarSign },
];

const services = [
  {
    icon: Factory,
    title: "Production management",
    body: "Track every order from PO and deposit through sampling, production percentage, QC, and packaging in one status view.",
  },
  {
    icon: ShieldCheck,
    title: "Quality-control planning",
    body: "Define inspection checkpoints, AQL levels, and pre-shipment sign-off so issues surface before goods leave the factory.",
  },
  {
    icon: Ship,
    title: "Freight & logistics",
    body: "Coordinate sea, air, and courier freight, Incoterms, and booking windows to balance cost against launch timing.",
  },
  {
    icon: Warehouse,
    title: "Warehousing",
    body: "Receive, store, and stage inventory close to your customers with capacity that flexes to your run size.",
  },
  {
    icon: Globe2,
    title: "Global distribution",
    body: "Move product into multiple regions with customs, duties, and last-mile handled as part of the pipeline.",
  },
  {
    icon: Store,
    title: "Retail readiness",
    body: "Barcoding, carton specs, compliance labeling, and packaging that meets retailer and marketplace requirements.",
  },
  {
    icon: FileText,
    title: "Distributor materials",
    body: "Line sheets, spec sheets, and distributor decks so partners can carry and resell your product.",
  },
  {
    icon: RefreshCw,
    title: "Ongoing supply chain",
    body: "Manage reorders, forecasting, and supplier relationships as demand grows past the first run.",
  },
];

const batchSizes = [1, 10, 25, 50, 100, 250];

const financingOptions = [
  "Prototype financing",
  "Tooling financing",
  "Purchase-order financing",
  "Production financing",
  "Revenue-based financing",
  "Preorder-backed financing",
  "Milestone-based financing",
];

export default function DistributionPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-16 md:py-24">
          <TechLabel className="mb-5">分销 · Global Distribution</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            From factory floor to
            <br />
            <span className="text-primary">customer doorstep.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Production management, quality control, freight, warehousing, and
            global distribution — tracked as one continuous pipeline so you
            always know where your product is.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start a project <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PIPELINE */}
      <Section>
        <SectionHeading
          eyebrow="Production pipeline"
          title="Every stage, tracked end to end"
          description="Each order moves through a defined sequence of milestones. You see the current stage, what is next, and what is blocking."
        />
        <div className="mt-10 overflow-x-auto pb-2">
          <ol className="flex min-w-max items-stretch gap-3">
            {pipeline.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex items-center gap-3">
                  <div className="flex w-32 flex-col items-center gap-2 rounded-lg border border-border bg-forest-deep/40 p-4 text-center">
                    <div className="flex size-9 items-center justify-center rounded-md border border-border bg-background/60 text-mustard">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-medium leading-tight text-foreground/90">
                      {step.label}
                    </span>
                    <span className="mono-label text-[0.55rem] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {i < pipeline.length - 1 && (
                    <ArrowRight className="size-4 shrink-0 text-khaki/50" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* SERVICES GRID */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Capabilities"
          title="Distribution support at every level"
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="transition-colors hover:border-mustard/40">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-md border border-border bg-forest-deep/60 text-mustard">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* AFFORDABLE MANUFACTURING */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Affordable manufacturing"
          title="Ways to produce without overcommitting"
          description="Lower the barrier to your first run with shared costs, small batches, and flexible sourcing."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-md border border-border bg-forest-deep/60 text-mustard">
                <Layers className="size-5" />
              </div>
              <CardTitle>Small-batch runs</CardTitle>
              <CardDescription>
                Start small and scale as demand proves out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {batchSizes.map((b) => (
                  <Badge key={b} variant="olive">
                    {b} {b === 1 ? "unit" : "units"}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Run a pilot of a handful of units, then step up to 10, 25, 50,
                100, or 250 as you validate the product and lock the design.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-md border border-border bg-forest-deep/60 text-mustard">
                <Users className="size-5" />
              </div>
              <CardTitle>Shared tooling &amp; group production</CardTitle>
              <CardDescription>
                Split fixed costs across makers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Wrench className="mt-0.5 size-4 shrink-0 text-mustard" />
                  <span>
                    <span className="font-medium text-foreground">
                      Shared tooling
                    </span>{" "}
                    — amortize expensive molds across multiple products or
                    creators using a common platform.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Boxes className="mt-0.5 size-4 shrink-0 text-mustard" />
                  <span>
                    <span className="font-medium text-foreground">
                      Group production
                    </span>{" "}
                    — combine orders to reach factory minimums and unlock better
                    per-unit pricing together.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* US vs overseas */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-forest-deep/60 text-mustard">
                <MapPin className="size-5" />
              </div>
              <div>
                <CardTitle>Local (US) manufacturing mode</CardTitle>
                <CardDescription>
                  Choose domestic production and weigh the tradeoffs.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-forest-deep/40 p-5">
                <div className="mono-label mb-3 text-xs text-emerald-300">
                  US manufacturing
                </div>
                <ul className="space-y-2 text-sm text-foreground/85">
                  <li>Faster lead times and easier site visits</li>
                  <li>Lower shipping risk and no import duties</li>
                  <li>“Made in USA” positioning and IP proximity</li>
                  <li>Smaller minimums with some partners</li>
                  <li className="text-muted-foreground">
                    Tradeoff: typically higher per-unit cost
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-forest-deep/40 p-5">
                <div className="mono-label mb-3 text-xs text-khaki">
                  Overseas manufacturing
                </div>
                <ul className="space-y-2 text-sm text-foreground/85">
                  <li>Lower per-unit cost at volume</li>
                  <li>Deep tooling and component ecosystems</li>
                  <li>Broad process availability</li>
                  <li className="text-muted-foreground">
                    Tradeoff: longer lead times and freight
                  </li>
                  <li className="text-muted-foreground">
                    Tradeoff: duties, customs, and time-zone coordination
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* FINANCING PLACEHOLDER */}
      <Section className="pt-0">
        <Card className="border-mustard/25 bg-mustard/5">
          <CardContent className="p-8">
            <div className="flex items-start gap-3">
              <Info className="mt-1 size-5 shrink-0 text-mustard" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold tracking-tight">
                    Manufacturing financing
                  </h2>
                  <Badge variant="warning">Future placeholder</Badge>
                </div>
                <p className="mt-2 max-w-3xl text-pretty text-muted-foreground">
                  Financing options are planned concepts, not live products.
                  They are shown here to illustrate the roadmap and are{" "}
                  <span className="font-semibold text-foreground">
                    not offered, approved, or guaranteed
                  </span>
                  . Nothing here is a commitment to lend.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {financingOptions.map((o) => (
                    <Badge key={o} variant="muted">
                      {o}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="rounded-lg border border-border bg-gradient-to-br from-military/20 to-transparent p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to plan your production run?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Start a project and we will map the pipeline from PO to final
            delivery.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start a project <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
