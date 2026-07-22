import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Scale,
  ShieldCheck,
  Wrench,
  Layers,
  FileText,
  DollarSign,
  Boxes,
  Ruler,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";

export const metadata = {
  title: "Resources — Da Xing Xing",
  description:
    "Guides on manufacturing, materials, tooling, MOQs, RFQs, and compliance — plus IP and legal resource pointers. Educational only, not professional advice.",
};

const guides = [
  {
    icon: Ruler,
    title: "From Idea to Prototype",
    blurb:
      "The full arc: turning a plain-language concept into a specification a factory can actually build and sample.",
    read: "8 min read",
    level: "Foundational",
  },
  {
    icon: DollarSign,
    title: "Understanding Tooling Costs",
    blurb:
      "Why molds and fixtures dominate early budgets, how tooling amortizes over volume, and when it pays off.",
    read: "6 min read",
    level: "Intermediate",
  },
  {
    icon: Layers,
    title: "Choosing Materials",
    blurb:
      "Balancing durability, weight, cost, sustainability, and finish — and how material choice ripples into MOQ.",
    read: "7 min read",
    level: "Foundational",
  },
  {
    icon: Boxes,
    title: "MOQs Explained",
    blurb:
      "What drives minimum order quantities, why processes set the floor, and how to find small-batch options.",
    read: "5 min read",
    level: "Foundational",
  },
  {
    icon: FileText,
    title: "Preparing an RFQ",
    blurb:
      "What a manufacturer needs to quote accurately — and how a complete spec gets you comparable numbers.",
    read: "6 min read",
    level: "Intermediate",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Basics",
    blurb:
      "The certification landscape — FCC, CE, UL, CPSIA, FDA — and how to plan for it before tooling is cut.",
    read: "9 min read",
    level: "Essential",
  },
];

const ipResources = [
  {
    title: "Patents",
    blurb:
      "Utility vs. design patents, provisional filings, and why the timing of public disclosure matters for a physical product.",
  },
  {
    title: "Trademarks",
    blurb:
      "Protecting a brand name and logo, clearance searches, and classes relevant to consumer products.",
  },
  {
    title: "Trade Secrets & NDAs",
    blurb:
      "Keeping designs confidential when sharing with manufacturers, and what a manufacturing NDA typically covers.",
  },
];

const compliancePointers = [
  ["Electrical safety", "UL, ETL, CE marking for powered products"],
  ["Wireless & EMC", "FCC / CE / regional RF certification"],
  ["Children's products", "CPSIA, ASTM F963, small-parts testing"],
  ["Food & skin contact", "FDA / LFGB material compliance"],
  ["Environmental", "RoHS, REACH, Prop 65 considerations"],
  ["Packaging & labeling", "Country-of-origin and required markings"],
];

const levelVariant: Record<string, "warning" | "olive" | "muted"> = {
  Essential: "warning",
  Intermediate: "olive",
  Foundational: "muted",
};

export default function ResourcesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <TechLabel className="mb-6">大猩猩 · Resource Library</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Learn how physical products{" "}
            <span className="text-primary">actually get made</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Practical guides on design, materials, tooling, sourcing, and
            compliance — written for founders who are building something real,
            not for engineers who already know. Educational content only.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <Section>
        <SectionHeading
          eyebrow="Guides"
          title="Start with the fundamentals"
          description="Six core reads that cover the decisions every physical-product founder faces."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Card
              key={g.title}
              className="group h-full transition-colors hover:border-mustard/40"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-forest-deep text-mustard">
                    <g.icon className="size-5" />
                  </div>
                  <Badge variant={levelVariant[g.level]}>{g.level}</Badge>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {g.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {g.blurb}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="mono-label inline-flex items-center gap-1.5 text-khaki/60">
                    <Clock className="size-3.5" />
                    {g.read}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-mustard opacity-0 transition-opacity group-hover:opacity-100">
                    Read <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Guides are illustrative previews in this demo environment. Read times
          are approximate.
        </p>
      </Section>

      {/* IP / LEGAL */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="IP & legal"
            title="Protecting your idea"
            description="An orientation to the intellectual-property questions that come up when you take a product to market."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {ipResources.map((r) => (
              <Card key={r.title} className="h-full">
                <CardContent className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-forest text-mustard">
                    <Scale className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {r.blurb}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legal disclaimer */}
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-mustard/25 bg-mustard/5 p-5">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-mustard" />
            <p className="text-sm leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">
                Not legal advice.
              </span>{" "}
              These resources are general educational information and carry no
              legal guarantees. Intellectual-property law is jurisdiction- and
              fact-specific — always consult a qualified attorney or registered
              patent/trademark professional before making filing or protection
              decisions.
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE & SAFETY */}
      <Section>
        <SectionHeading
          eyebrow="Compliance & safety"
          title="Know your certification path early"
          description="Regulated products carry testing and certification requirements that shape design and cost. Use these pointers to plan ahead."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {compliancePointers.map(([title, sub]) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-forest-deep p-5"
            >
              <div className="flex items-center gap-2 text-mustard">
                <Wrench className="size-4" />
                <p className="mono-label">{title}</p>
              </div>
              <p className="mt-2 text-sm text-foreground/80">{sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-border bg-card p-5">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-khaki/70" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Compliance pointers are informational and do not constitute
            engineering or regulatory certification. Requirements vary by market
            and product; validate every certification with an accredited test
            lab or compliance professional before selling.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Learn as you build
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            The studio explains every trade-off in context — so the guides here
            become decisions you actually make on your product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
