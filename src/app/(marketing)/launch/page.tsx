import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Tag,
  Camera,
  Globe,
  Megaphone,
  Presentation,
  Compass,
  Rocket,
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

export const metadata = { title: "Launch Studio · Da Xing Xing" };

const categories = [
  {
    key: "brand",
    icon: Tag,
    title: "Brand",
    blurb: "The identity your product ships under.",
    services: [
      "Product naming",
      "Logo design",
      "Brand identity system",
      "Brand guidelines",
      "Packaging design",
      "Messaging & positioning",
    ],
  },
  {
    key: "content",
    icon: Camera,
    title: "Content",
    blurb: "The visuals that make it feel real.",
    services: [
      "Product photography direction",
      "3D renderings",
      "Press kit",
    ],
  },
  {
    key: "web",
    icon: Globe,
    title: "Web",
    blurb: "Where customers meet the product.",
    services: [
      "Ecommerce website",
      "Landing page",
      "Preorder website",
    ],
  },
  {
    key: "campaigns",
    icon: Megaphone,
    title: "Campaigns",
    blurb: "The launch push across channels.",
    services: [
      "Crowdfunding / preorder campaign (Kickstarter, Indiegogo, GoFundMe-style)",
      "Email marketing",
      "Social launch kit",
      "Paid ad assets",
    ],
  },
  {
    key: "sales",
    icon: Presentation,
    title: "Sales",
    blurb: "Materials to get you into channels.",
    services: [
      "Retail deck",
      "Distributor deck",
      "Influencer outreach",
    ],
  },
  {
    key: "strategy",
    icon: Compass,
    title: "Strategy",
    blurb: "The plan behind the launch.",
    services: [
      "Launch strategy",
      "Market testing",
      "Customer research",
    ],
  },
];

export default function LaunchStudioPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-16 md:py-24">
          <TechLabel className="mb-5">发布 · Launch Studio</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Branding &amp; marketing,
            <br />
            <span className="text-primary">built from your product.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            The Launch Studio turns the product information already in your
            project — category, materials, specs, renders, and positioning —
            into a full set of brand and go-to-market assets. No blank page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start a project <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/preorder">
                <Rocket className="size-4" />
                Build a preorder page
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS NOTE */}
      <Section className="py-14 md:py-16">
        <div className="flex items-start gap-4 rounded-lg border border-mustard/25 bg-mustard/5 p-6">
          <Sparkles className="mt-1 size-5 shrink-0 text-mustard" />
          <div>
            <h2 className="text-lg font-semibold">
              Assets generated from what the platform already knows
            </h2>
            <p className="mt-2 max-w-3xl text-pretty text-muted-foreground">
              Because your specification, materials, use case, and audience live
              in the project, the Launch Studio can draft names, packaging
              directions, page copy, and campaign creative that stay on-brand
              and consistent across every deliverable. You review and refine —
              you are not starting from scratch each time.
            </p>
          </div>
        </div>
      </Section>

      {/* SERVICE CATEGORIES */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Services"
          title="Everything a launch needs, in one studio"
          description="Six categories, from identity to strategy. Mix and match what your launch requires."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.key}
                className="flex flex-col transition-colors hover:border-mustard/40"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-md border border-border bg-forest-deep/60 text-mustard">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.blurb}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <ul className="space-y-2">
                    {c.services.map((s) => (
                      <li
                        key={s}
                        className="flex items-start gap-2 text-sm text-foreground/85"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mustard" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* PREORDER CALLOUT */}
      <Section className="pt-0">
        <Card className="overflow-hidden border-mustard/30">
          <div className="grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <Badge variant="olive" className="mb-3">
                Featured
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">
                Launch with a preorder campaign
              </h2>
              <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
                Validate demand and fund your first production run before you
                commit. The Preorder Builder assembles a crowdfunding-style page
                with tiers, milestones, and email capture — pulling in your
                product render and story automatically.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/preorder">
                  Open Preorder Builder
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/onboarding">Start from a product</Link>
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
