import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { servicePackages, subscriptionTiers } from "@/lib/mock/packages";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pricing — Da Xing Xing",
  description:
    "Service packages and subscription tiers. Physical-product pricing varies and is shown as estimates until confirmed by a manufacturer.",
};

const faqs = [
  {
    q: "Why do prices say “starting at” or “request estimate”?",
    a: "Physical products have real material, tooling, and volume costs that vary with your exact design and quantities. Package prices reflect the studio work; the manufactured product is quoted separately once your specification exists. Every figure shown before a manufacturer quote is an estimate.",
  },
  {
    q: "What is the difference between an estimate and confirmed pricing?",
    a: "Estimates are AI-generated ranges based on similar products and material data — useful for planning. Confirmed pricing comes from a real manufacturer quote against your finished specification, including tooling, unit cost, MOQ, and terms. We keep the two clearly separated so you never mistake one for the other.",
  },
  {
    q: "How do prototypes work?",
    a: "The Prototype package covers refined design, engineering review, manufacturing specifications, prototype sourcing, one production cycle, shipping, and revision recommendations. Prototype cost is quoted by the matched manufacturer and depends on materials, complexity, and finish.",
  },
  {
    q: "What about MOQs (minimum order quantities)?",
    a: "MOQs are set by manufacturers and depend on process and materials — injection molding tooling implies higher minimums than small-batch assembly. When you compare quotes, each MOQ is shown up front, and small-batch-capable manufacturers are flagged for lower first runs.",
  },
  {
    q: "Can I manufacture in the US instead of overseas?",
    a: "Yes. The manufacturer network includes both US-based and global partners (all demo profiles in this preview). US manufacturing often means shorter lead times and simpler logistics at a higher unit cost; overseas often lowers unit cost at higher MOQs and longer freight. The studio helps you weigh the trade-off.",
  },
  {
    q: "Can pricing and packages change?",
    a: "Yes. Package contents and prices are configurable — admins can edit packages, tiers, and prices, and physical-product quotes update as your design and quantities change. Treat everything here as an illustrative starting point.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <TechLabel className="mb-6">大猩猩 · Pricing</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Pay for how far you want to{" "}
            <span className="text-primary">take it</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Choose a service package for a specific outcome, or subscribe for
            ongoing access to the studio. Physical-product costs vary, so
            packages are shown as “starting at” or by request estimate.
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

      {/* SERVICE PACKAGES */}
      <Section>
        <SectionHeading
          eyebrow="Service packages"
          title="Outcome-based packages"
          description="Each package delivers a concrete milestone — from a validated concept to full global distribution."
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
                <p className="pt-3 text-2xl font-bold text-primary">
                  {pkg.priceLabel}
                </p>
                <p className="mono-label text-khaki/60">{pkg.forWho}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2 text-sm">
                  {pkg.includes.map((inc) => (
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
                  <Link href="/onboarding">Select {pkg.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* SUBSCRIPTION TIERS */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="Subscriptions"
            title="Ongoing access to the studio"
            description="Subscribe for continuous access to AI design, manufacturer matching, and production tools. Cancel or change tier at any time."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {subscriptionTiers.map((tier) => (
              <Card
                key={tier.id}
                className={cn(
                  "flex flex-col",
                  tier.featured && "border-primary/50 ring-1 ring-primary/30"
                )}
              >
                <CardHeader>
                  {tier.featured && (
                    <Badge className="mb-2 w-fit">Recommended</Badge>
                  )}
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-3xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    {tier.cadence && (
                      <span className="text-sm text-muted-foreground">
                        {tier.cadence}
                      </span>
                    )}
                  </div>
                  <CardDescription>{tier.forWho}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-2 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-olive" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={tier.featured ? "default" : "outline"}
                    className="mt-6 w-full"
                  >
                    <Link href="/onboarding">
                      {tier.price === "Custom"
                        ? "Contact Sales"
                        : `Choose ${tier.name}`}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing disclaimer */}
          <div className="mt-10 flex items-start gap-3 rounded-lg border border-mustard/20 bg-mustard/5 p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-mustard" />
            <p className="text-sm leading-relaxed text-foreground/80">
              Pricing for physical products varies with design, materials,
              finishes, and volume — the figures above cover studio work, not
              manufacturing, which is quoted separately once your specification
              exists. Packages, tiers, and prices are configurable and can be
              edited by administrators. All figures shown are illustrative
              estimates for this preview.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section>
        <SectionHeading
          eyebrow="Questions"
          title="Pricing, prototypes, and production"
          description="The practical questions that come up when you move a physical product from idea to shelf."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground">{faq.q}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Start free. Upgrade when you&apos;re ready to build.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Explore a concept at no cost, then move into prototyping and
            production on your own timeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Talk to Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
