import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Boxes,
  Star,
  Gauge,
  MessageSquare,
  CheckCircle2,
  Languages,
  Globe2,
  Factory,
  FlaskConical,
  Layers,
  FileText,
  Lock,
  ArrowRight,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { manufacturers } from "@/lib/mock/manufacturers";

const priceTierLabels: Record<number, string> = {
  1: "$ · Economy",
  2: "$$ · Mid-range",
  3: "$$$ · Premium",
};

export function generateStaticParams() {
  return manufacturers.map((m) => ({ id: m.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const m = manufacturers.find((x) => x.id === params.id);
  return { title: m ? `${m.name} · Manufacturer (Demo)` : "Manufacturer" };
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-forest-deep/40 p-4">
      <div className="mono-label mb-2 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums text-foreground">
        {value}
        {suffix && (
          <span className="ml-0.5 text-base font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ManufacturerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const m = manufacturers.find((x) => x.id === params.id);
  if (!m) notFound();

  // Blueprint-tile seeds for the demo "factory photos" gallery.
  const gallery = [
    { label: "Production Floor", seed: "#344A32" },
    { label: "Tooling Bay", seed: "#64714A" },
    { label: "QC Station", seed: "#594735" },
    { label: "Assembly Line", seed: "#1D211E" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-50" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-12 md:py-16">
          <Link
            href="/manufacturers"
            className="mono-label text-xs text-muted-foreground transition-colors hover:text-mustard"
          >
            ← Back to marketplace
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">DEMO PROFILE</Badge>
                {m.verified ? (
                  <Badge variant="success">
                    <ShieldCheck className="size-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="muted">Unverified</Badge>
                )}
                {m.usManufacturing && (
                  <Badge variant="secondary">US Manufacturing</Badge>
                )}
                <Badge variant="olive">{priceTierLabels[m.priceTier]}</Badge>
              </div>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                {m.name}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                {m.city}, {m.country} · {m.region}
              </p>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/85">
                {m.blurb}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-mustard/25 bg-mustard/5 px-4 py-3">
              <Star className="size-5 text-mustard" />
              <div>
                <div className="text-2xl font-bold leading-none text-foreground">
                  {m.rating.toFixed(1)}
                </div>
                <div className="mono-label text-[0.6rem] text-muted-foreground">
                  {m.completedProjects} projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO NOTICE */}
      <div className="border-b border-mustard/25 bg-mustard/10">
        <div className="container flex items-start gap-3 py-3 text-sm">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-mustard" />
          <p className="text-foreground/85">
            This is a{" "}
            <span className="font-semibold">labeled demo profile</span> for
            illustration only — not a real, verified, or endorsed company. All
            figures are sample data.
          </p>
        </div>
      </div>

      {/* BODY */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* MAIN */}
          <div className="space-y-12">
            {/* Factory photos */}
            <div>
              <h2 className="mono-label mb-4 text-xs text-mustard">
                Facility · Demo imagery
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {gallery.map((g) => (
                  <div
                    key={g.label}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border blueprint"
                    style={{ backgroundColor: `${g.seed}55` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Factory className="size-8 text-sand/30" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 mono-label text-[0.6rem] text-sand/80">
                      {g.label}
                    </div>
                    <div className="absolute right-2 top-2 rounded bg-black/40 px-1.5 py-0.5 mono-label text-[0.55rem] text-mustard">
                      DEMO
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Placeholder blueprint tiles stand in for real factory
                photography in the MVP.
              </p>
            </div>

            {/* Stat tiles */}
            <div>
              <h2 className="mono-label mb-4 text-xs text-mustard">
                Performance
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat icon={Star} label="Rating" value={m.rating.toFixed(1)} />
                <Stat
                  icon={Gauge}
                  label="On-time"
                  value={m.onTime}
                  suffix="%"
                />
                <Stat
                  icon={MessageSquare}
                  label="Communication"
                  value={m.communication}
                  suffix="%"
                />
                <Stat
                  icon={CheckCircle2}
                  label="Completed"
                  value={m.completedProjects}
                />
              </div>
            </div>

            {/* Key facts */}
            <div>
              <h2 className="mono-label mb-4 text-xs text-mustard">
                Production profile
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat
                  icon={Boxes}
                  label="MOQ"
                  value={m.moq.toLocaleString()}
                  suffix="units"
                />
                <Stat
                  icon={Clock}
                  label="Lead time"
                  value={m.leadTimeDays}
                  suffix="days"
                />
                <Stat
                  icon={FlaskConical}
                  label="Prototype"
                  value={m.prototypeCapable ? "Yes" : "No"}
                />
                <Stat
                  icon={Layers}
                  label="Small batch"
                  value={m.smallBatch ? "Yes" : "No"}
                />
              </div>
              <div className="mt-4 rounded-lg border border-border bg-forest-deep/40 p-4">
                <div className="mono-label mb-1.5 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                  <Factory className="size-3.5" /> Capacity
                </div>
                <p className="text-foreground/90">{m.capacity}</p>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="mono-label mb-3 text-xs text-mustard">
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {m.specialties.map((s) => (
                  <Badge key={s} variant="olive">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Methods + Materials */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="mono-label mb-3 text-xs text-mustard">
                  Manufacturing methods
                </h2>
                <ul className="space-y-2">
                  {m.methods.map((mtd) => (
                    <li
                      key={mtd}
                      className="flex items-center gap-2 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="size-4 text-olive" />
                      {mtd}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mono-label mb-3 text-xs text-mustard">
                  Materials supported
                </h2>
                <div className="flex flex-wrap gap-2">
                  {m.materials.map((mat) => (
                    <Badge key={mat} variant="secondary">
                      {mat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="mono-label mb-3 text-xs text-mustard">
                Certifications
              </h2>
              <div className="flex flex-wrap gap-2">
                {m.certifications.map((c) => (
                  <Badge key={c} variant="outline">
                    <Award className="size-3" /> {c}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Languages + export */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="mono-label mb-3 flex items-center gap-1.5 text-xs text-mustard">
                  <Languages className="size-3.5" /> Languages
                </h2>
                <p className="text-sm text-foreground/90">
                  {m.languages.join(" · ")}
                </p>
              </div>
              <div>
                <h2 className="mono-label mb-3 flex items-center gap-1.5 text-xs text-mustard">
                  <Globe2 className="size-3.5" /> Export regions
                </h2>
                <div className="flex flex-wrap gap-2">
                  {m.exportRegions.map((r) => (
                    <Badge key={r} variant="secondary">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR CTA */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Work with this partner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/dashboard/quotes">
                    Request a Quote
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/quotes">
                    <Lock className="size-4" />
                    Request File Access
                  </Link>
                </Button>

                <div className="flex items-start gap-2 rounded-md border border-border bg-forest-deep/40 p-3 text-xs text-muted-foreground">
                  <FileText className="mt-0.5 size-3.5 shrink-0 text-mustard" />
                  <p className="text-pretty">
                    File access is gated. Proprietary designs, CAD, and specs
                    are shared only after you approve access and an NDA /
                    platform manufacturing agreement is signed.
                  </p>
                </div>

                <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-mustard" />
                    <p>
                      Demo profile — not a real or verified company. Quotes and
                      timelines generated here are estimates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
