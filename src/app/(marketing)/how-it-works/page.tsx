import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  PenTool,
  Ruler,
  Cpu,
  Layers,
  Factory,
  Calculator,
  MessagesSquare,
  FileText,
  Boxes,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { howItWorks } from "@/lib/mock/packages";
import type { ProjectStage } from "@/types";

export const metadata = {
  title: "How It Works — Da Xing Xing",
  description:
    "A guided, transparent path from a plain-language idea to a manufactured product in market.",
};

const stepDetail: Record<
  string,
  { detail: string; outputs: string[]; icon: React.ComponentType<{ className?: string }> }
> = {
  "01": {
    icon: MessagesSquare,
    detail:
      "Start with a sentence. Describe what the product does, who it is for, and roughly what it should feel like. No CAD, no engineering vocabulary, no specification templates. Da Xing Xing interprets intent and asks focused follow-up questions only where a decision genuinely changes the outcome.",
    outputs: ["Plain-language brief", "Clarifying questions", "Initial constraints captured"],
  },
  "02": {
    icon: Sparkles,
    detail:
      "The studio returns a first product direction: form, approximate dimensions, candidate materials, key components, weight target, and a preliminary cost range. Everything is presented as an estimate and clearly separated from confirmed facts, so you always know what is a recommendation versus a decision.",
    outputs: ["Concept direction", "Dimensioned first pass", "Preliminary cost range"],
  },
  "03": {
    icon: PenTool,
    detail:
      "Refine by conversation. Ask for a smaller footprint, a warmer material, a lower unit cost, or a tougher enclosure — every change immediately shows its impact on cost, durability, manufacturability, and timeline. Trade-offs are made visible instead of hidden.",
    outputs: ["Live design revisions", "Impact analysis per change", "Locked decisions"],
  },
  "04": {
    icon: FileText,
    detail:
      "A living product specification and bill of materials assembles itself as you decide. It carries dimensions, tolerances, materials, finishes, components, compliance flags, and cost assumptions — the exact document a manufacturer needs to quote accurately.",
    outputs: ["Product specification", "Bill of materials", "Exportable RFQ"],
  },
  "05": {
    icon: Factory,
    detail:
      "Match with qualified manufacturers based on category, materials, methods, certifications, and volume. Compare structured quotes side by side — tooling, unit cost, MOQ, lead time, and terms — then order a prototype to hold the product in your hands.",
    outputs: ["Manufacturer matches", "Comparable quotes", "Prototype order"],
  },
  "06": {
    icon: Rocket,
    detail:
      "Move from a validated prototype to a real launch. Build a brand and packaging, prepare product photography and a store, run a preorder campaign, then scale into a first production run and global distribution with quality control at every stage.",
    outputs: ["Brand & packaging", "Preorder campaign", "Production & distribution"],
  },
};

const aiTeam = [
  {
    icon: PenTool,
    role: "Industrial Designer",
    body: "Shapes form, ergonomics, and the physical feel of the product.",
  },
  {
    icon: Sparkles,
    role: "Product Strategist",
    body: "Aligns the design to the market, the buyer, and a defensible position.",
  },
  {
    icon: Cpu,
    role: "Engineer",
    body: "Pressure-tests structure, components, and how it is actually built.",
  },
  {
    icon: Layers,
    role: "Material Specialist",
    body: "Selects materials balancing durability, cost, weight, and sustainability.",
  },
  {
    icon: Factory,
    role: "Manufacturing Advisor",
    body: "Maps the design to real processes, tooling, and production realities.",
  },
  {
    icon: Calculator,
    role: "Cost Analyst",
    body: "Models unit economics, tooling amortization, and landed cost ranges.",
  },
  {
    icon: Ruler,
    role: "Compliance Reviewer",
    body: "Flags certification, safety, and testing requirements early.",
  },
  {
    icon: Boxes,
    role: "Sourcing Coordinator",
    body: "Matches your specification to qualified, capable manufacturers.",
  },
];

const stages: ProjectStage[] = [
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

export default function HowItWorksPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <TechLabel className="mb-6">大猩猩 · The Process</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            How an idea becomes a{" "}
            <span className="text-primary">manufactured product</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Da Xing Xing turns a plain-language idea into a fully specified
            product, connects you with manufacturers, produces prototypes, and
            scales into distribution — with every trade-off made visible along
            the way. Costs shown throughout are estimates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
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

      {/* TIMELINE / STEPPER */}
      <Section>
        <SectionHeading
          eyebrow="Six steps"
          title="From imagination to market"
          description="A numbered path that keeps complex manufacturing understandable — and always shows you what happens next."
        />
        <div className="mt-14 space-y-6">
          {howItWorks.map((step, i) => {
            const meta = stepDetail[step.n];
            const Icon = meta.icon;
            const isLast = i === howItWorks.length - 1;
            return (
              <div key={step.n} className="relative flex gap-6 md:gap-8">
                {/* Station rail */}
                <div className="relative flex flex-col items-center">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-border bg-forest-deep font-mono text-lg font-bold text-mustard shadow-sm">
                    {step.n}
                  </div>
                  {!isLast && (
                    <div className="mt-2 w-px flex-1 bg-gradient-to-b from-mustard/40 to-border" />
                  )}
                </div>

                <Card className="mb-2 flex-1 overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-md border border-border bg-forest text-mustard">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">
                        {step.title}
                      </h3>
                      <span className="mono-label ml-auto text-khaki/60">
                        Step {step.n} / 06
                      </span>
                    </div>
                    <p className="mt-4 text-base font-medium text-foreground/90">
                      {step.body}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {meta.detail}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {meta.outputs.map((o) => (
                        <Badge key={o} variant="secondary">
                          {o}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </Section>

      {/* AI TEAM */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="What the AI does"
            title="A coordinated team, not a single chatbot"
            description="Behind one conversation, Da Xing Xing orchestrates specialized reasoning roles. Each pushes on the product from a different angle, so decisions hold up in the real world — not just on screen."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiTeam.map((member) => (
              <Card key={member.role} className="group h-full">
                <CardContent className="p-6">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-forest text-mustard">
                    <member.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{member.role}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {member.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            These roles are AI-assisted recommendations, clearly separated from
            confirmed information. Final engineering, compliance, and legal
            decisions should be validated with qualified professionals.
          </p>
        </div>
      </section>

      {/* STAGE RAIL */}
      <Section>
        <SectionHeading
          eyebrow="Project stages"
          title="Every project moves through fifteen tracked stages"
          description="From the first idea to active distribution, each project advances through a transparent pipeline. You always know exactly where your product stands."
        />
        <div className="mt-12 flex flex-wrap gap-3">
          {stages.map((stage, i) => (
            <div
              key={stage}
              className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-forest-deep px-4 py-2.5 transition-colors hover:border-mustard/50"
            >
              <span className="mono-label text-khaki/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-foreground/85">
                {stage}
              </span>
              {i < stages.length - 1 && (
                <ArrowRight className="size-3 text-khaki/30" />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Ready to move from idea to product?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Start with a single description. We&apos;ll guide the rest of the
            path to a real product in the market.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
