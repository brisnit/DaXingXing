"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Boxes,
  Star,
  Gauge,
  MessageSquare,
  ArrowRight,
  Lock,
  FlaskConical,
  Layers,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { TechLabel } from "@/components/ui/section";
import { manufacturers } from "@/lib/mock/manufacturers";
import { cn } from "@/lib/utils";

const priceTierLabels: Record<number, string> = {
  1: "$ · Economy",
  2: "$$ · Mid",
  3: "$$$ · Premium",
};

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background/40 px-3 py-2 text-left text-sm transition-colors hover:border-mustard/40"
    >
      <span className="text-foreground/90">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-mustard" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-forest-deep transition-all",
            checked ? "left-[1.125rem]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export default function ManufacturersPage() {
  const countries = useMemo(
    () => Array.from(new Set(manufacturers.map((m) => m.country))).sort(),
    []
  );
  const regions = useMemo(
    () => Array.from(new Set(manufacturers.map((m) => m.region))).sort(),
    []
  );

  const [country, setCountry] = useState("all");
  const [region, setRegion] = useState("all");
  const [usOnly, setUsOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [prototypeOnly, setPrototypeOnly] = useState(false);
  const [smallBatchOnly, setSmallBatchOnly] = useState(false);
  const [priceTier, setPriceTier] = useState<"all" | 1 | 2 | 3>("all");
  const [maxMoq, setMaxMoq] = useState(1000);

  const results = useMemo(() => {
    return manufacturers.filter((m) => {
      if (country !== "all" && m.country !== country) return false;
      if (region !== "all" && m.region !== region) return false;
      if (usOnly && !m.usManufacturing) return false;
      if (verifiedOnly && !m.verified) return false;
      if (prototypeOnly && !m.prototypeCapable) return false;
      if (smallBatchOnly && !m.smallBatch) return false;
      if (priceTier !== "all" && m.priceTier !== priceTier) return false;
      if (m.moq > maxMoq) return false;
      return true;
    });
  }, [
    country,
    region,
    usOnly,
    verifiedOnly,
    prototypeOnly,
    smallBatchOnly,
    priceTier,
    maxMoq,
  ]);

  const resetFilters = () => {
    setCountry("all");
    setRegion("all");
    setUsOnly(false);
    setVerifiedOnly(false);
    setPrototypeOnly(false);
    setSmallBatchOnly(false);
    setPriceTier("all");
    setMaxMoq(1000);
  };

  const selectClass =
    "flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="container relative py-14 md:py-16">
          <TechLabel className="mb-5">制造商 · Manufacturer Marketplace</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Find a factory matched to your product
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Filter vetted-style manufacturing partners by geography,
            capabilities, minimums, and price — then open a full profile to
            request a quote.
          </p>
        </div>
      </section>

      {/* DEMO BANNER */}
      <div className="border-b border-mustard/25 bg-mustard/10">
        <div className="container flex items-start gap-3 py-4 text-sm">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-mustard" />
          <p className="text-pretty text-foreground/85">
            <span className="font-semibold text-foreground">
              All profiles below are labeled DEMO profiles.
            </span>{" "}
            They are illustrative and do <span className="font-semibold">not</span>{" "}
            represent real, verified, or endorsed companies. Names, ratings, and
            certifications are sample data for the MVP.
          </p>
        </div>
      </div>

      {/* BODY */}
      <section className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* FILTER SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardContent className="space-y-5 p-5">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-xs text-mustard">
                    Filters
                  </span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="size-3" /> Reset
                  </button>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={selectClass}
                  >
                    <option value="all">All countries</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="region">Region</Label>
                  <select
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className={selectClass}
                  >
                    <option value="all">All regions</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price">Price tier</Label>
                  <select
                    id="price"
                    value={priceTier}
                    onChange={(e) =>
                      setPriceTier(
                        e.target.value === "all"
                          ? "all"
                          : (Number(e.target.value) as 1 | 2 | 3)
                      )
                    }
                    className={selectClass}
                  >
                    <option value="all">Any price</option>
                    <option value={1}>{priceTierLabels[1]}</option>
                    <option value={2}>{priceTierLabels[2]}</option>
                    <option value={3}>{priceTierLabels[3]}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="moq">Max MOQ</Label>
                    <span className="mono-label text-xs text-mustard">
                      ≤ {maxMoq.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="moq"
                    type="range"
                    min={1}
                    max={1000}
                    step={1}
                    value={maxMoq}
                    onChange={(e) => setMaxMoq(Number(e.target.value))}
                    className="w-full accent-mustard"
                  />
                  <p className="text-[0.7rem] text-muted-foreground">
                    Show partners whose minimum order is at or below this unit
                    count.
                  </p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <Toggle
                    label="US manufacturing"
                    checked={usOnly}
                    onChange={setUsOnly}
                  />
                  <Toggle
                    label="Verified profiles"
                    checked={verifiedOnly}
                    onChange={setVerifiedOnly}
                  />
                  <Toggle
                    label="Prototype-capable"
                    checked={prototypeOnly}
                    onChange={setPrototypeOnly}
                  />
                  <Toggle
                    label="Small-batch friendly"
                    checked={smallBatchOnly}
                    onChange={setSmallBatchOnly}
                  />
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="mono-label text-xs text-muted-foreground">
                {results.length} manufacturer
                {results.length === 1 ? "" : "s"} shown
              </p>
            </div>

            {/* File-access note */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-border bg-forest-deep/40 p-4 text-sm">
              <Lock className="mt-0.5 size-4 shrink-0 text-mustard" />
              <p className="text-pretty text-foreground/80">
                Manufacturers never receive your proprietary files, CAD, or
                specifications until you explicitly approve access and the
                platform manufacturing agreement is signed.
              </p>
            </div>

            {results.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center text-muted-foreground">
                No manufacturers match these filters. Try widening your MOQ or
                clearing a toggle.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {results.map((m) => (
                  <Card
                    key={m.id}
                    className="group flex flex-col transition-colors hover:border-mustard/40"
                  >
                    <CardContent className="flex flex-1 flex-col gap-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold leading-tight">
                            {m.name}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {m.city}, {m.country}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <Badge variant="warning">DEMO</Badge>
                          {m.verified ? (
                            <Badge variant="success">
                              <ShieldCheck className="size-3" /> Verified
                            </Badge>
                          ) : (
                            <Badge variant="muted">Unverified</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {m.blurb}
                      </p>

                      {/* Capability tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {m.smallBatch && (
                          <Badge variant="olive">
                            <Layers className="size-3" /> Small batch
                          </Badge>
                        )}
                        {m.prototypeCapable && (
                          <Badge variant="olive">
                            <FlaskConical className="size-3" /> Prototype
                          </Badge>
                        )}
                        {m.usManufacturing && (
                          <Badge variant="secondary">US-made</Badge>
                        )}
                        <Badge variant="secondary">
                          {priceTierLabels[m.priceTier]}
                        </Badge>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="mono-label mb-1 text-[0.6rem] text-muted-foreground">
                            Specialties
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {m.specialties.map((s) => (
                              <Badge key={s} variant="outline">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="mono-label mb-1 text-[0.6rem] text-muted-foreground">
                            Methods
                          </div>
                          <p className="text-foreground/75">
                            {m.methods.join(" · ")}
                          </p>
                        </div>
                        <div>
                          <div className="mono-label mb-1 text-[0.6rem] text-muted-foreground">
                            Certifications
                          </div>
                          <p className="text-foreground/75">
                            {m.certifications.join(" · ")}
                          </p>
                        </div>
                      </div>

                      {/* Stat row */}
                      <div className="grid grid-cols-2 gap-2 rounded-md border border-border bg-forest-deep/40 p-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Boxes className="size-3.5 text-khaki" />
                          <span className="text-muted-foreground">MOQ</span>
                          <span className="ml-auto font-semibold text-foreground">
                            {m.moq.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-khaki" />
                          <span className="text-muted-foreground">Lead</span>
                          <span className="ml-auto font-semibold text-foreground">
                            {m.leadTimeDays}d
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="size-3.5 text-mustard" />
                          <span className="text-muted-foreground">Rating</span>
                          <span className="ml-auto font-semibold text-foreground">
                            {m.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Gauge className="size-3.5 text-khaki" />
                          <span className="text-muted-foreground">On-time</span>
                          <span className="ml-auto font-semibold text-foreground">
                            {m.onTime}%
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5">
                          <MessageSquare className="size-3.5 text-khaki" />
                          <span className="text-muted-foreground">
                            Communication
                          </span>
                          <span className="ml-auto font-semibold text-foreground">
                            {m.communication}%
                          </span>
                        </div>
                      </div>

                      <Button asChild variant="outline" className="mt-auto w-full">
                        <Link href={`/manufacturers/${m.id}`}>
                          View profile
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
