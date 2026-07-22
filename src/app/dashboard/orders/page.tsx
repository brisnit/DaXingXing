import {
  Check,
  CircleDot,
  Circle,
  AlertTriangle,
  OctagonAlert,
  Wallet,
  FileWarning,
  ClipboardCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TechLabel } from "@/components/ui/section";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Orders · Da Xing Xing" };

const PROTOTYPE_STEPS = [
  "Specifications Approved",
  "Manufacturer Selected",
  "Deposit Paid",
  "Prototype in Production",
  "Manufacturer Updates",
  "Prototype Shipped",
  "Prototype Received",
  "User Review",
  "Revision Requested",
  "Prototype Approved",
  "Ready for Production",
];
const PROTOTYPE_CURRENT = 3; // "Prototype in Production"

const PRODUCTION_STEPS = [
  "Purchase order",
  "Deposit",
  "Materials ordered",
  "Tooling created",
  "Pre-production sample",
  "Production started",
  "Production run",
  "Quality inspection",
  "Packaging",
  "Freight booking",
  "Shipment",
  "Customs",
  "Warehouse delivery",
  "Final payment",
];
const PRODUCTION_CURRENT = 6; // "Production run"
const PRODUCTION_PCT = 60;

const ALERTS = [
  {
    level: "payment" as const,
    title: "Payment due",
    body: "Prototype deposit of $4,350 (30%) is required to release tooling — Apex Precision (Demo).",
  },
  {
    level: "approval" as const,
    title: "Approval required",
    body: "Pre-shipment inspection checklist for Summit Tumbler awaiting your sign-off.",
  },
  {
    level: "delay" as const,
    title: "Possible delay",
    body: "Ocean freight window for the Trailhead run may slip ~5 days due to port congestion (demo).",
  },
  {
    level: "file" as const,
    title: "Missing file",
    body: "Updated Pantone callout not yet uploaded for the powder-coat finish.",
  },
  {
    level: "quality" as const,
    title: "Quality concern",
    body: "Two of ten samples showed minor seam flash — manufacturer investigating (demo).",
  },
];

const ALERT_META = {
  payment: { icon: Wallet, cls: "border-mustard/40 bg-mustard/10 text-mustard" },
  approval: { icon: ClipboardCheck, cls: "border-mustard/40 bg-mustard/10 text-mustard" },
  delay: { icon: AlertTriangle, cls: "border-mustard/40 bg-mustard/10 text-mustard" },
  file: { icon: FileWarning, cls: "border-border bg-secondary/40 text-foreground/80" },
  quality: { icon: OctagonAlert, cls: "border-destructive/40 bg-destructive/10 text-red-200" },
};

function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              {done ? (
                <Check className="size-5 shrink-0 rounded-full bg-emerald-500/20 p-0.5 text-emerald-400" />
              ) : active ? (
                <CircleDot className="size-5 shrink-0 text-mustard" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground/40" />
              )}
              {!last && (
                <span
                  className={`my-0.5 w-px flex-1 ${
                    done ? "bg-emerald-500/40" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className={last ? "pb-0" : "pb-5"}>
              <p
                className={
                  active
                    ? "text-sm font-semibold text-mustard"
                    : done
                    ? "text-sm text-foreground/80"
                    : "text-sm text-muted-foreground/60"
                }
              >
                {s}
              </p>
              {active && (
                <Badge variant="warning" className="mt-1">
                  In progress
                </Badge>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <TechLabel className="mb-3">Orders & Tracking</TechLabel>
        <h1 className="text-3xl font-bold tracking-tight">
          Prototype & production tracking
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live-style status for your active builds. All progress and alerts are
          demo data.
        </p>
      </div>

      {/* Alerts */}
      <Card className="border-mustard/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-mustard" /> Alerts &amp;
            required actions
          </CardTitle>
          <CardDescription>
            Delays, approvals, payments, missing files, and quality concerns.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {ALERTS.map((a) => {
            const m = ALERT_META[a.level];
            return (
              <div
                key={a.title}
                className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-xs ${m.cls}`}
              >
                <m.icon className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="opacity-90">{a.body}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Prototype workflow */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Prototype workflow</CardTitle>
                <CardDescription>
                  Trailhead Rugged Speaker · Apex Precision (Demo)
                </CardDescription>
              </div>
              <Badge variant="warning">In production</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Stepper steps={PROTOTYPE_STEPS} current={PROTOTYPE_CURRENT} />
            <div className="mt-4 flex gap-2">
              <Button type="button" size="sm">
                Approve current step
              </Button>
              <Button type="button" variant="outline" size="sm">
                Request update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Production order */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Production order</CardTitle>
                <CardDescription>
                  Summit Insulated Tumbler · Durable Goods Collective (Demo)
                </CardDescription>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">Production run</span>
                <span className="tabular-nums">{PRODUCTION_PCT}% of 2,500</span>
              </div>
              <Progress value={PRODUCTION_PCT} indicatorClassName="bg-emerald-400" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-border bg-forest-deep/40 p-2">
                <p className="mono-label text-khaki/70">Deposit</p>
                <p className="text-sm font-semibold">{formatCurrency(16500)}</p>
              </div>
              <div className="rounded-md border border-border bg-forest-deep/40 p-2">
                <p className="mono-label text-khaki/70">Balance</p>
                <p className="text-sm font-semibold">{formatCurrency(38500)}</p>
              </div>
              <div className="rounded-md border border-border bg-forest-deep/40 p-2">
                <p className="mono-label text-khaki/70">ETA</p>
                <p className="text-sm font-semibold">Aug 30</p>
              </div>
            </div>
            <Stepper steps={PRODUCTION_STEPS} current={PRODUCTION_CURRENT} />
            <div className="flex gap-2">
              <Button type="button" size="sm">
                Approve inspection
              </Button>
              <Button type="button" variant="outline" size="sm">
                View documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Order statuses, payments, ETAs, and alerts shown here are demo/sample
        data for illustration only.
      </p>
    </div>
  );
}
