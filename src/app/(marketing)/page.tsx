import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Boxes,
  Globe2,
  Factory,
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
import { ProcessFlow } from "@/components/marketing/process-flow";
import { DemoPreview } from "@/components/marketing/demo-preview";
import { servicePackages, howItWorks } from "@/lib/mock/packages";
import { categories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div>
            <TechLabel className="mb-6">大猩猩 · Great Ape</TechLabel>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Describe it.
              <br />
              Design it.
              <br />
              <span className="text-primary">Build it.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Da Xing Xing helps you transform a product idea into a fully
              specified physical product, connect with manufacturers, produce
              prototypes, launch your brand, and scale distribution.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">
                  Start Building <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">Explore the Process</Link>
              </Button>
            </div>
            <div className="mt-10">
              <ProcessFlow className="justify-start" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-military/30 to-transparent blur-2xl" />
            <div className="relative">
              <DemoPreview />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-b border-border bg-forest-deep">
        <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { icon: Sparkles, label: "AI product studio", sub: "Concept to spec" },
            { icon: Factory, label: "Manufacturer network", sub: "US & global · demo" },
            { icon: ShieldCheck, label: "Private by default", sub: "NDA & access control" },
            { icon: Globe2, label: "Idea → Distribution", sub: "One platform" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-forest text-mustard">
                <f.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Six steps from imagination to market"
          description="A guided path that keeps complex manufacturing understandable — and always shows you what happens next."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {howItWorks.map((step) => (
            <Card key={step.n} className="group relative overflow-hidden">
              <div className="absolute right-4 top-4 font-mono text-4xl font-bold text-secondary/60">
                {step.n}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {step.body}
                </CardDescription>
              </CardHeader>
              <div className="h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </Card>
          ))}
        </div>
      </Section>

      {/* PRODUCT DEMO */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <TechLabel className="mb-4">Product creation demo</TechLabel>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Watch an idea become a dimensioned product
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Type a plain-language description and the studio returns an
                initial direction with dimensions, materials, weight, color
                options, components, battery, water-resistance target, controls,
                manufacturing methods, and estimated prototype and unit-cost
                ranges.
              </p>
              <ul className="mt-6 space-y-2.5">
                {[
                  "Every change shows cost, durability, and timeline impact",
                  "Confirmed information stays separate from AI recommendations",
                  "Safety and compliance concerns are flagged automatically",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/85">{t}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8">
                <Link href="/studio">
                  Open the Studio <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <DemoPreview />
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <Section>
        <SectionHeading
          eyebrow="Service packages"
          title="Choose how far you want to go"
          description="Physical-product costs vary, so packages are presented as “starting at” or by request estimate."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {servicePackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={cn(
                "flex flex-col",
                pkg.featured && "border-primary/50 ring-1 ring-primary/30"
              )}
            >
              <CardHeader>
                {pkg.featured && (
                  <Badge className="mb-2 w-fit">Most popular</Badge>
                )}
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.tagline}</CardDescription>
                <p className="pt-2 text-lg font-semibold text-primary">
                  {pkg.priceLabel}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2 text-sm">
                  {pkg.includes.slice(0, 6).map((inc) => (
                    <li key={inc} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-olive" />
                      <span className="text-foreground/80">{inc}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={pkg.featured ? "default" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link href="/pricing">Select {pkg.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <section className="border-t border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="Product categories"
            title="Build across dozens of product types"
            description="From audio to industrial products. Regulated categories flag the extra engineering, compliance, and testing that may be required."
          />
          <div className="mt-10 flex flex-wrap gap-2.5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories#${c.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-forest px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Boxes className="size-3.5 text-khaki/60 group-hover:text-primary" />
                {c.name}
                {c.regulated && (
                  <span className="size-1.5 rounded-full bg-mustard" />
                )}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/categories">
                View all categories <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Anyone with a strong product idea deserves a clear path to market
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Start with a description. We&apos;ll handle the path from imagination
            to a real product in the market.
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
