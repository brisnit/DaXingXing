"use client";

import { useMemo, useState } from "react";
import {
  Rocket,
  Info,
  Plus,
  Trash2,
  Calendar,
  Users,
  Target,
  Mail,
  Check,
  Milestone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { ProductRender } from "@/components/product/product-render";
import { formatCurrency } from "@/lib/utils";

const DEMO_PRODUCTS = [
  { id: "trailhead-lantern", name: "Trailhead Solar Lantern", seed: "#344A32" },
  { id: "harbor-bottle", name: "Harbor Insulated Bottle", seed: "#8FB4C0" },
  { id: "field-satchel", name: "Field Canvas Satchel", seed: "#6E5A43" },
];

// A fixed demo funding percentage — this is a live preview, not a real campaign.
const DEMO_FUNDED_PCT = 43;
const DEMO_SUPPORTERS = 187;

export default function PreorderBuilderPage() {
  const [campaignName, setCampaignName] = useState("Trailhead Launch");
  const [productId, setProductId] = useState(DEMO_PRODUCTS[0].id);
  const [goal, setGoal] = useState(40000);
  const [preorderPrice, setPreorderPrice] = useState(59);
  const [earlyBirdPrice, setEarlyBirdPrice] = useState(45);
  const [shipDate, setShipDate] = useState("2026-11-01");
  const [tagline, setTagline] = useState(
    "A packable solar lantern built for long trails and longer nights."
  );
  const [milestones, setMilestones] = useState<string[]>([
    "Tooling complete",
    "Pre-production sample approved",
    "Mass production begins",
    "Fulfillment & shipping",
  ]);
  const [newMilestone, setNewMilestone] = useState("");
  const [configs, setConfigs] = useState<string[]>([
    "Forest Green",
    "Sand",
    "Charcoal",
  ]);
  const [newConfig, setNewConfig] = useState("");

  const product = useMemo(
    () => DEMO_PRODUCTS.find((p) => p.id === productId) ?? DEMO_PRODUCTS[0],
    [productId]
  );

  const raised = Math.round((goal * DEMO_FUNDED_PCT) / 100);

  const addMilestone = () => {
    const v = newMilestone.trim();
    if (!v) return;
    setMilestones((m) => [...m, v]);
    setNewMilestone("");
  };
  const addConfig = () => {
    const v = newConfig.trim();
    if (!v) return;
    setConfigs((c) => [...c, v]);
    setNewConfig("");
  };

  const shipLabel = useMemo(() => {
    if (!shipDate) return "TBD";
    const d = new Date(shipDate + "T00:00:00");
    if (Number.isNaN(d.getTime())) return "TBD";
    return d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [shipDate]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="container relative py-14 md:py-16">
          <TechLabel className="mb-5">预售 · Preorder Builder</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Build your preorder campaign
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Configure your campaign on the left and watch a crowdfunding-style
            preview build live on the right. Nothing is published — this is a
            preview only.
          </p>
        </div>
      </section>

      {/* ESTIMATE DISCLAIMER */}
      <div className="border-b border-mustard/25 bg-mustard/10">
        <div className="container flex items-start gap-3 py-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-mustard" />
          <p className="text-foreground/85">
            <span className="font-semibold">
              Launch and production dates are estimates.
            </span>{" "}
            Funding progress and supporter counts shown in the preview are demo
            values. This builder has no backend and does not collect payments.
          </p>
        </div>
      </div>

      {/* BODY */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          {/* FORM */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign basics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="campaignName">Campaign name</Label>
                  <Input
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="product">Product</Label>
                  <select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {DEMO_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Demo)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Funding &amp; pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="goal">Funding goal</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="goal"
                      type="number"
                      min={0}
                      step={1000}
                      value={goal}
                      onChange={(e) => setGoal(Number(e.target.value) || 0)}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="earlyBird">Early-bird price</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="earlyBird"
                        type="number"
                        min={0}
                        step={1}
                        value={earlyBirdPrice}
                        onChange={(e) =>
                          setEarlyBirdPrice(Number(e.target.value) || 0)
                        }
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="preorder">Preorder price</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="preorder"
                        type="number"
                        min={0}
                        step={1}
                        value={preorderPrice}
                        onChange={(e) =>
                          setPreorderPrice(Number(e.target.value) || 0)
                        }
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ship">Estimated ship date</Label>
                  <Input
                    id="ship"
                    type="date"
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Production milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {milestones.map((m, i) => (
                    <li
                      key={`${m}-${i}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm"
                    >
                      <span className="text-foreground/90">{m}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setMilestones((list) =>
                            list.filter((_, idx) => idx !== i)
                          )
                        }
                        className="text-muted-foreground transition-colors hover:text-red-400"
                        aria-label={`Remove ${m}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addMilestone()}
                    placeholder="Add a milestone…"
                  />
                  <Button type="button" variant="outline" onClick={addMilestone}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configurations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {configs.map((c, i) => (
                    <span
                      key={`${c}-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 py-1 pl-3 pr-1.5 text-xs"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() =>
                          setConfigs((list) =>
                            list.filter((_, idx) => idx !== i)
                          )
                        }
                        className="text-muted-foreground transition-colors hover:text-red-400"
                        aria-label={`Remove ${c}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newConfig}
                    onChange={(e) => setNewConfig(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addConfig()}
                    placeholder="Add a configuration / colorway…"
                  />
                  <Button type="button" variant="outline" onClick={addConfig}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* LIVE PREVIEW */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-3 flex items-center justify-between">
              <span className="mono-label text-xs text-mustard">
                Live campaign preview
              </span>
              <Badge variant="warning">DEMO · PREVIEW</Badge>
            </div>

            <Card className="overflow-hidden">
              <ProductRender
                seed={product.seed}
                label={product.name}
                className="rounded-none border-0 border-b border-border"
              />

              <CardContent className="space-y-6 p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {campaignName || "Untitled Campaign"}
                    </h2>
                    <Rocket className="size-5 text-mustard" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.name}
                  </p>
                  <p className="mt-3 text-pretty text-foreground/85">
                    {tagline}
                  </p>
                </div>

                {/* Funding progress */}
                <div className="rounded-lg border border-border bg-forest-deep/40 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold tabular-nums text-mustard">
                        {formatCurrency(raised)}
                      </div>
                      <div className="mono-label mt-1 text-[0.65rem] text-muted-foreground">
                        pledged of {formatCurrency(goal)} goal
                      </div>
                    </div>
                    <Badge variant="success">{DEMO_FUNDED_PCT}% funded</Badge>
                  </div>
                  <Progress value={DEMO_FUNDED_PCT} className="mt-4 h-2.5" />
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-bold tabular-nums">
                        <Users className="size-4 text-khaki" />
                        {DEMO_SUPPORTERS}
                      </div>
                      <div className="mono-label text-[0.6rem] text-muted-foreground">
                        supporters
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-lg font-bold tabular-nums">
                        <Target className="size-4 text-khaki" />
                        {DEMO_FUNDED_PCT}%
                      </div>
                      <div className="mono-label text-[0.6rem] text-muted-foreground">
                        funded
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-sm font-bold">
                        <Calendar className="size-4 text-khaki" />
                        {shipLabel}
                      </div>
                      <div className="mono-label text-[0.6rem] text-muted-foreground">
                        est. ship
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-center text-[0.65rem] text-muted-foreground">
                    Funding figures are demo values for preview.
                  </p>
                </div>

                {/* Price tiers */}
                <div>
                  <div className="mono-label mb-3 text-xs text-muted-foreground">
                    Pledge tiers
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-mustard/40 bg-mustard/5 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Early bird</span>
                        <Badge variant="warning">Limited</Badge>
                      </div>
                      <div className="mt-2 text-2xl font-bold tabular-nums text-mustard">
                        {formatCurrency(earlyBirdPrice)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        First supporters — best price
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-background/40 p-4">
                      <span className="text-sm font-semibold">Preorder</span>
                      <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                        {formatCurrency(preorderPrice)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Standard campaign price
                      </p>
                    </div>
                  </div>
                </div>

                {/* Configurations */}
                {configs.length > 0 && (
                  <div>
                    <div className="mono-label mb-2 text-xs text-muted-foreground">
                      Available configurations
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {configs.map((c, i) => (
                        <Badge key={`${c}-${i}`} variant="secondary">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Milestones timeline */}
                {milestones.length > 0 && (
                  <div>
                    <div className="mono-label mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Milestone className="size-3.5" /> Production timeline
                    </div>
                    <ol className="relative space-y-4 border-l border-border pl-6">
                      {milestones.map((m, i) => (
                        <li key={`${m}-${i}`} className="relative">
                          <span className="absolute -left-[1.6rem] top-0.5 flex size-4 items-center justify-center rounded-full border border-mustard bg-forest-deep">
                            <span className="size-1.5 rounded-full bg-mustard" />
                          </span>
                          <div className="text-sm font-medium text-foreground/90">
                            {m}
                          </div>
                          <div className="mono-label text-[0.6rem] text-muted-foreground">
                            Phase {String(i + 1).padStart(2, "0")} · estimated
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 text-[0.65rem] text-muted-foreground">
                      Timeline phases are estimates and subject to change.
                    </p>
                  </div>
                )}

                {/* Email capture */}
                <div className="rounded-lg border border-border bg-forest-deep/40 p-5">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-mustard" />
                    <span className="text-sm font-semibold">
                      Get notified at launch
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Join the list to be first in line for early-bird pricing.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      aria-label="Email address (preview only)"
                    />
                    <Button type="button" className="shrink-0">
                      Notify me
                    </Button>
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-[0.65rem] text-muted-foreground">
                    <Check className="size-3" />
                    Preview only — the form does not submit or store data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
