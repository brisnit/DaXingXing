import Link from "next/link";
import { ArrowRight, Boxes, ShieldAlert, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { categories } from "@/lib/mock/categories";

export const metadata = {
  title: "Product Categories — Da Xing Xing",
  description:
    "Build across dozens of product categories. Regulated categories flag the extra engineering, compliance, and testing that may be required.",
};

export default function CategoriesPage() {
  const regulatedCount = categories.filter((c) => c.regulated).length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <TechLabel className="mb-6">大猩猩 · Product Directory</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Build across{" "}
            <span className="text-primary">{categories.length} categories</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            From audio hardware to industrial goods, Da Xing Xing supports the
            full range of physical products. Categories marked{" "}
            <span className="text-mustard">regulated</span> require additional
            engineering, compliance, and testing before they can be sold.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start a Project <ArrowRight className="size-4" />
              </Link>
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{categories.length} categories</Badge>
              <Badge variant="warning">
                <ShieldAlert className="size-3" />
                {regulatedCount} regulated
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <Section>
        <SectionHeading
          eyebrow="All categories"
          title="Choose where your product lives"
          description="Each card links deep from the homepage. Regulated categories carry a compliance note so nothing surprises you late in production."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Card
              key={c.slug}
              id={c.slug}
              className="group scroll-mt-24 overflow-hidden transition-colors hover:border-mustard/40"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-forest-deep text-mustard">
                    <Boxes className="size-5" />
                  </div>
                  {c.regulated ? (
                    <Badge variant="warning">
                      <ShieldAlert className="size-3" />
                      Regulated
                    </Badge>
                  ) : (
                    <Badge variant="muted">Standard</Badge>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {c.blurb}
                </p>

                {c.regulated && c.regulationNote && (
                  <div className="mt-4 rounded-md border border-mustard/20 bg-mustard/5 p-3">
                    <p className="mono-label mb-1.5 text-mustard">
                      Compliance note
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/75">
                      {c.regulationNote}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-5">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/onboarding">
                      Build in {c.name} <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* REGULATED EXPLAINER */}
      <section className="border-y border-border bg-forest-deep">
        <div className="container grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <TechLabel className="mb-4">Regulated categories</TechLabel>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              We flag compliance early, not after tooling
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Products that touch power, wireless radios, children, food, skin,
              or health carry certification requirements that shape design,
              material selection, and cost. Da Xing Xing surfaces these the
              moment they apply so they become part of the plan.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Compliance notes are informational guidance, not legal or
              engineering certification. Confirm every requirement with
              qualified professionals before selling a product.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["FCC / CE / EMC", "Wireless & electronics emissions"],
              ["UL / electrical safety", "Powered products & lighting"],
              ["CPSIA / ASTM F963", "Toys & children's products"],
              ["FDA / LFGB", "Food-contact & personal care"],
              ["CPSC juvenile", "Baby & infant gear"],
              ["DOT / SAE", "Automotive accessories"],
            ].map(([title, sub]) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-forest p-4"
              >
                <div className="flex items-center gap-2 text-mustard">
                  <Layers className="size-4" />
                  <p className="mono-label">{title}</p>
                </div>
                <p className="mt-2 text-sm text-foreground/80">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 blueprint opacity-40" />
        <div className="container relative py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Don&apos;t see your exact product? Start anyway.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Custom components and bespoke sub-assemblies are welcome. Describe
            it and the studio will find the right path.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">
                Start Building <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
