import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  ShieldCheck,
  Gauge,
  Layers,
  Eye,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { ApeMark } from "@/components/brand/logo";

export const metadata = {
  title: "About — Da Xing Xing",
  description:
    "Da Xing Xing means “great ape.” Our mission: give anyone with a strong product idea a clear, guided path from imagination to a real product in the market.",
};

const values = [
  {
    icon: Eye,
    title: "Radical Clarity",
    body: "Manufacturing is opaque by tradition. We make every trade-off — cost, durability, timeline, compliance — visible as you decide, and we always separate confirmed facts from AI recommendations.",
  },
  {
    icon: Gauge,
    title: "Momentum Over Friction",
    body: "Most ideas die in the gap between imagination and execution. We remove the gatekeepers, the jargon, and the dead ends so good products keep moving forward.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Hold Up",
    body: "A rendering is not a product. Every decision is pressure-tested against real materials, real processes, and real regulations before it reaches a factory floor.",
  },
  {
    icon: Globe2,
    title: "Globally Connected",
    body: "US and overseas manufacturers, materials, and logistics in one system — so where you build is a strategic choice, not a limitation.",
  },
];

const team = [
  ["Industrial Designer", "Form, ergonomics, and physical feel"],
  ["Product Strategist", "Market fit and positioning"],
  ["Engineer", "Structure, components, buildability"],
  ["Material Specialist", "Durability, cost, weight, sustainability"],
  ["Manufacturing Advisor", "Processes, tooling, production reality"],
  ["Cost Analyst", "Unit economics and landed cost"],
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <TechLabel className="mb-6">大猩猩 · Great Ape</TechLabel>
            <h1 className="max-w-2xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Power, intelligence, and a path to{" "}
              <span className="text-primary">make things real</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Da Xing Xing
              </span>{" "}
              means <span className="text-mustard">“great ape.”</span> It stands
              for what it takes to build physical products — raw capability,
              deliberate intelligence, and the strength to carry an idea all the
              way to market.
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

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-military/30 to-transparent blur-2xl" />
            <div className="relative flex items-center justify-center rounded-2xl border border-border bg-forest-deep p-12">
              <div className="grain absolute inset-0 rounded-2xl" />
              <ApeMark className="size-40 text-mustard md:size-56" />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <TechLabel className="mb-4 justify-center">Our mission</TechLabel>
          <p className="text-balance text-2xl font-semibold leading-snug tracking-tight md:text-4xl">
            Anyone with a strong product idea should have a clear, guided path
            from imagination to a{" "}
            <span className="text-primary">real product in the market.</span>
          </p>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            For decades, turning an idea into a manufactured product meant
            navigating engineering firms, sourcing agents, factories, tooling,
            compliance, logistics, and capital — a maze most people never get
            through. Da Xing Xing collapses that maze into one intelligent,
            industrial platform.
          </p>
        </div>
      </Section>

      {/* VALUES */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="What we believe"
            title="The principles behind the platform"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} className="h-full">
                <CardContent className="p-6 md:p-8">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-forest text-mustard">
                    <v.icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI AS A TEAM */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <TechLabel className="mb-4">AI as a coordinated team</TechLabel>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Not one chatbot — an orchestrated studio
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We separate reasoning from execution. Intelligent AI handles the
              thinking — design, strategy, engineering judgment, cost modeling —
              while deterministic systems handle the doing: specifications,
              sourcing, quoting, and production tracking. That separation is
              what makes the platform reliable at every step.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              AI outputs are recommendations, clearly labeled and separated from
              confirmed information. Final engineering, compliance, and legal
              decisions should always be validated with qualified professionals.
            </p>
            <Button asChild className="mt-8" variant="outline">
              <Link href="/how-it-works">
                See the full process <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {team.map(([role, focus]) => (
              <div
                key={role}
                className="rounded-lg border border-border bg-forest-deep p-4"
              >
                <div className="flex items-center gap-2 text-mustard">
                  <Layers className="size-4" />
                  <p className="mono-label">{role}</p>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{focus}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* IDENTITY */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container py-20 md:py-28">
          <SectionHeading
            eyebrow="Identity"
            title="An earth-toned, industrial system"
            description="The look is deliberate: military-industrial, dark, and precise. Earth tones and blueprint grids signal that this is a place where real things get engineered and built."
          />
          <div className="mt-12 flex flex-wrap gap-4">
            {[
              ["Forest", "#17251D"],
              ["Military", "#344A32"],
              ["Olive", "#4B5A2E"],
              ["Khaki", "#B7A97C"],
              ["Sand", "#CFC4A3"],
              ["Earth", "#6B5A43"],
              ["Mustard", "#C1A548"],
            ].map(([name, hex]) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div
                  className="size-16 rounded-lg border border-border shadow-inner"
                  style={{ backgroundColor: hex }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground/85">
                    {name}
                  </p>
                  <p className="mono-label text-khaki/50">{hex}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-4 rounded-lg border border-border bg-forest p-6">
            <ApeMark className="size-12 shrink-0 text-mustard" />
            <div>
              <p className="font-semibold">The Ape Mark</p>
              <p className="text-sm text-muted-foreground">
                A geometric, angular great-ape skull — confident and industrial,
                built to stamp on app icons, packaging, and manufacturer
                certification badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <Handshake className="mx-auto mb-6 size-10 text-mustard" />
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Bring the idea. We&apos;ll help you build the ape.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            From a single description to a product on a shelf — start the path
            today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
