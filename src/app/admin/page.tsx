"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Boxes,
  Building2,
  CircleDollarSign,
  ClipboardList,
  Cog,
  FileText,
  FlaskConical,
  Gauge,
  Layers,
  LayoutGrid,
  LifeBuoy,
  Megaphone,
  Package,
  Percent,
  ReceiptText,
  Scale,
  ScrollText,
  ShieldAlert,
  Tags,
  Users,
  Wrench,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { cn, formatCurrency } from "@/lib/utils";
import { manufacturers } from "@/lib/mock/manufacturers";
import { products } from "@/lib/mock/products";
import { categories } from "@/lib/mock/categories";
import { materials } from "@/lib/mock/materials";
import { quotes } from "@/lib/mock/quotes";
import { servicePackages, subscriptionTiers } from "@/lib/mock/packages";

// ── nav model ──────────────────────────────────────────────────────────────
type SectionKey =
  | "overview"
  | "users"
  | "companies"
  | "manufacturers"
  | "projects"
  | "categories"
  | "materials"
  | "methods"
  | "quotes"
  | "orders"
  | "payments"
  | "disputes"
  | "support"
  | "compliance"
  | "packages"
  | "tiers"
  | "fees"
  | "promotions"
  | "content"
  | "audit";

const NAV: Array<{
  group: string;
  items: Array<{ key: SectionKey; label: string; icon: React.ComponentType<{ className?: string }> }>;
}> = [
  {
    group: "Analytics",
    items: [{ key: "overview", label: "Overview", icon: LayoutGrid }],
  },
  {
    group: "Management",
    items: [
      { key: "users", label: "Users", icon: Users },
      { key: "companies", label: "Companies", icon: Building2 },
      { key: "manufacturers", label: "Manufacturers", icon: BadgeCheck },
      { key: "projects", label: "Product Projects", icon: Package },
      { key: "categories", label: "Categories", icon: Tags },
      { key: "materials", label: "Materials", icon: Layers },
      { key: "methods", label: "Methods", icon: Wrench },
      { key: "quotes", label: "Quotes", icon: ClipboardList },
      { key: "orders", label: "Orders", icon: Boxes },
      { key: "payments", label: "Payments", icon: CircleDollarSign },
      { key: "disputes", label: "Disputes", icon: Scale },
      { key: "support", label: "Support", icon: LifeBuoy },
      { key: "compliance", label: "Compliance", icon: ShieldAlert },
    ],
  },
  {
    group: "Configuration",
    items: [
      { key: "packages", label: "Service Packages", icon: Cog },
      { key: "tiers", label: "Subscriptions", icon: ReceiptText },
      { key: "fees", label: "Fees & Transactions", icon: Percent },
      { key: "promotions", label: "Promotions", icon: Megaphone },
    ],
  },
  {
    group: "Platform",
    items: [
      { key: "content", label: "Content / Resources", icon: FileText },
      { key: "audit", label: "Audit Log", icon: ScrollText },
    ],
  },
];

// ── demo data ───────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { name: "Maya Rueben", email: "maya@northloop.co", role: "Company Owner", company: "North Loop", plan: "Company", status: "Active", projects: 4 },
  { name: "Devin Park", email: "devin@parklab.io", role: "Inventor", company: "—", plan: "Builder", status: "Active", projects: 2 },
  { name: "Aisha Bello", email: "aisha@meridiangoods.com", role: "Company Admin", company: "Meridian Goods", plan: "Enterprise", status: "Active", projects: 11 },
  { name: "Tomas Vela", email: "tomas@velacreative.com", role: "Inventor", company: "—", plan: "Explorer", status: "Trial", projects: 1 },
  { name: "Priya Anand", email: "priya@anandbrands.com", role: "Company Owner", company: "Anand Brands", plan: "Company", status: "Active", projects: 6 },
  { name: "Marcus Hill", email: "marcus@hillrange.co", role: "Inventor", company: "—", plan: "Builder", status: "Suspended", projects: 3 },
];

const DEMO_COMPANIES = [
  { name: "North Loop", plan: "Company", seats: 8, projects: 4, spend: 62000, status: "Active" },
  { name: "Meridian Goods", plan: "Enterprise", seats: 42, projects: 11, spend: 318000, status: "Active" },
  { name: "Anand Brands", plan: "Company", seats: 6, projects: 6, spend: 74500, status: "Active" },
  { name: "Vela Creative", plan: "Builder", seats: 2, projects: 1, spend: 1900, status: "Trial" },
];

const DEMO_ORDERS = [
  { id: "ORD-4821", project: "Summit Insulated Tumbler", buyer: "Meridian Goods", factory: "Durable Goods Collective (Demo)", value: 55000, stage: "In Production", status: "On track" },
  { id: "ORD-4796", project: "Trailhead Rugged Speaker", buyer: "North Loop", factory: "Apex Precision (Demo)", value: 48000, stage: "Prototype", status: "On track" },
  { id: "ORD-4770", project: "Roam Foldable Pet Carrier", buyer: "Anand Brands", factory: "Delta Softgoods (Demo)", value: 38000, stage: "Quoting", status: "At risk" },
];

const DEMO_PAYMENTS = [
  { id: "PMT-9912", party: "North Loop", type: "Milestone — deposit", amount: 14400, fee: 720, method: "ACH", status: "Cleared" },
  { id: "PMT-9908", party: "Meridian Goods", type: "Production balance", amount: 38500, fee: 1925, method: "Wire", status: "Cleared" },
  { id: "PMT-9901", party: "Vela Creative", type: "Prototype package", amount: 1900, fee: 95, method: "Card", status: "Pending" },
  { id: "PMT-9887", party: "Anand Brands", type: "Payout — factory", amount: 22800, fee: 0, method: "Payout", status: "Scheduled" },
];

const DEMO_DISPUTES = [
  { id: "DSP-217", parties: "North Loop ↔ Apex Precision (Demo)", topic: "Prototype color mismatch", opened: "2026-07-09", severity: "Medium", status: "Under review" },
  { id: "DSP-214", parties: "Anand Brands ↔ Delta Softgoods (Demo)", topic: "Lead-time slippage", opened: "2026-07-02", severity: "Low", status: "Awaiting response" },
  { id: "DSP-209", parties: "Meridian Goods ↔ Durable Goods (Demo)", topic: "QC AQL threshold", opened: "2026-06-28", severity: "High", status: "Escalated" },
];

const DEMO_SUPPORT = [
  { id: "SUP-3320", subject: "Cannot export specification PDF", requester: "devin@parklab.io", priority: "High", status: "Open", age: "3h" },
  { id: "SUP-3316", subject: "Manufacturer verification stuck", requester: "ops@durablegoods.demo", priority: "Medium", status: "In progress", age: "1d" },
  { id: "SUP-3309", subject: "Billing — upgrade to Company", requester: "priya@anandbrands.com", priority: "Low", status: "Resolved", age: "2d" },
  { id: "SUP-3301", subject: "Reset 2FA for team member", requester: "maya@northloop.co", priority: "Medium", status: "Open", age: "5h" },
];

const DEMO_COMPLIANCE = [
  { project: "Grove Wooden Building Set", flag: "CPSIA / ASTM F963", note: "Children's product testing required", level: "danger" as const },
  { project: "Trailhead Rugged Speaker", flag: "FCC / CE", note: "Wireless radio certification pending", level: "warning" as const },
  { project: "Summit Insulated Tumbler", flag: "FDA food-contact", note: "Material declaration on file", level: "info" as const },
  { project: "Aperture Portable Creator Light", flag: "Battery UN38.3", note: "Li-ion transport docs required", level: "warning" as const },
];

const DEMO_PROMOS = [
  { code: "LAUNCH25", desc: "25% off first Prototype package", uses: 84, cap: 200, active: true },
  { code: "MAKERFEST", desc: "Waived platform fee — event", uses: 31, cap: 100, active: true },
  { code: "WELCOME0", desc: "First month free — Builder", uses: 512, cap: 0, active: false },
];

const DEMO_AUDIT = [
  { actor: "admin:jordan", action: "Approved manufacturer", target: "Wisła Fabrication (Demo)", ts: "2026-07-21 09:14" },
  { actor: "admin:jordan", action: "Updated transaction fee", target: "Global · 5% → 4.5%", ts: "2026-07-21 08:52" },
  { actor: "admin:sam", action: "Refunded payment", target: "PMT-9861 · $1,900", ts: "2026-07-20 17:03" },
  { actor: "system", action: "Flagged compliance", target: "Grove Wooden Building Set", ts: "2026-07-20 14:20" },
  { actor: "admin:sam", action: "Suspended user", target: "marcus@hillrange.co", ts: "2026-07-20 11:47" },
  { actor: "admin:jordan", action: "Edited Service Package", target: "Prototype · $1,900", ts: "2026-07-19 16:31" },
];

const DEMO_ACTIVITY = [
  { icon: BadgeCheck, text: "Wisła Fabrication (Demo) approved from verification queue", ts: "12m ago" },
  { icon: Package, text: "New project created — 'Aperture Portable Creator Light'", ts: "48m ago" },
  { icon: CircleDollarSign, text: "Payment cleared — $38,500 (Meridian Goods)", ts: "2h ago" },
  { icon: ClipboardList, text: "Quote submitted by Apex Precision (Demo) on Trailhead Speaker", ts: "3h ago" },
  { icon: ShieldAlert, text: "Compliance flag raised — CPSIA on Grove Building Set", ts: "5h ago" },
  { icon: LifeBuoy, text: "Support ticket SUP-3320 opened — export PDF failing", ts: "6h ago" },
];

const METHODS = Array.from(new Set(manufacturers.flatMap((m) => m.methods))).sort();

// ── shared cells ─────────────────────────────────────────────────────────────
function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-3 py-2.5 text-left mono-label font-medium text-khaki/60", className)}>
      {children}
    </th>
  );
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-3 py-2.5 align-middle", className)}>{children}</td>;
}
function DataTable({ head, children, note }: { head: React.ReactNode; children: React.ReactNode; note?: string }) {
  return (
    <Card className="overflow-hidden bg-charcoal/60">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-forest-deep/50">
            <tr>{head}</tr>
          </thead>
          <tbody className="divide-y divide-border">{children}</tbody>
        </table>
      </div>
      {note && <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">{note}</div>}
    </Card>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-secondary/20">{children}</tr>;
}

function statusBadge(status: string): BadgeProps["variant"] {
  const s = status.toLowerCase();
  if (["active", "cleared", "resolved", "on track"].includes(s)) return "success";
  if (["pending", "trial", "in progress", "scheduled", "under review", "at risk", "awaiting response"].includes(s)) return "warning";
  if (["suspended", "escalated", "rejected", "open"].includes(s)) return "danger";
  return "secondary";
}

function SectionTitle({ title, description, count }: { title: string; description: string; count?: string }) {
  return (
    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {count && <Badge variant="olive">{count}</Badge>}
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function AdminConsolePage() {
  const [active, setActive] = React.useState<SectionKey>("overview");

  // verification queue local state
  const [verif, setVerif] = React.useState<Record<string, "Verified" | "Pending" | "Rejected">>(() =>
    Object.fromEntries(manufacturers.map((m) => [m.id, m.verified ? "Verified" : "Pending"])) as Record<
      string,
      "Verified" | "Pending" | "Rejected"
    >
  );

  // editable service packages
  const [pkgs, setPkgs] = React.useState(
    servicePackages.map((p) => ({ id: p.id, name: p.name, price: p.priceLabel, includes: p.includes }))
  );
  const setPkg = (id: string, key: "name" | "price", val: string) =>
    setPkgs((prev) => prev.map((p) => (p.id === id ? { ...p, [key]: val } : p)));

  // editable fees
  const [fees, setFees] = React.useState({
    transaction: "4.5",
    payout: "1.0",
    listing: "0",
    protoMarkup: "12",
  });

  return (
    <div className="container flex flex-col gap-6 py-6 lg:flex-row lg:gap-8 lg:py-8">
      {/* sidebar nav */}
      <aside className="lg:w-56 lg:shrink-0">
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-20 lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
          {NAV.map((grp) => (
            <div key={grp.group} className="lg:space-y-1">
              <div className="mono-label mb-1 hidden text-khaki/50 lg:block">{grp.group}</div>
              <div className="flex gap-1 lg:flex-col">
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActive(item.key)}
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/15 text-mustard"
                          : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* content */}
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <Badge variant="warning">Demo console — all records & figures are sample data</Badge>
        </div>

        {active === "overview" && <Overview />}

        {active === "users" && (
          <>
            <SectionTitle title="Users" description="All platform accounts across inventors, companies, and staff." count={`${DEMO_USERS.length} shown · demo`} />
            <DataTable
              head={<><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th>Company</Th><Th>Plan</Th><Th className="text-center">Projects</Th><Th>Status</Th></>}
              note="Sample rows for illustration."
            >
              {DEMO_USERS.map((u) => (
                <Row key={u.email}>
                  <Td className="font-medium text-foreground">{u.name}</Td>
                  <Td className="text-muted-foreground">{u.email}</Td>
                  <Td>{u.role}</Td>
                  <Td className="text-muted-foreground">{u.company}</Td>
                  <Td><Badge variant="secondary">{u.plan}</Badge></Td>
                  <Td className="text-center">{u.projects}</Td>
                  <Td><Badge variant={statusBadge(u.status)}>{u.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "companies" && (
          <>
            <SectionTitle title="Companies" description="Organizations with team workspaces and shared billing." count={`${DEMO_COMPANIES.length} shown · demo`} />
            <DataTable head={<><Th>Company</Th><Th>Plan</Th><Th className="text-center">Seats</Th><Th className="text-center">Projects</Th><Th className="text-right">Lifetime spend</Th><Th>Status</Th></>}>
              {DEMO_COMPANIES.map((c) => (
                <Row key={c.name}>
                  <Td className="font-medium text-foreground">{c.name}</Td>
                  <Td><Badge variant="secondary">{c.plan}</Badge></Td>
                  <Td className="text-center">{c.seats}</Td>
                  <Td className="text-center">{c.projects}</Td>
                  <Td className="text-right">{formatCurrency(c.spend)}</Td>
                  <Td><Badge variant={statusBadge(c.status)}>{c.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "manufacturers" && (
          <ManufacturerSection verif={verif} setVerif={setVerif} />
        )}

        {active === "projects" && (
          <>
            <SectionTitle title="Product Projects" description="Every active product moving through the pipeline." count={`${products.length} shown · demo`} />
            <DataTable head={<><Th>Project</Th><Th>Category</Th><Th>Stage</Th><Th className="text-center">Completion</Th><Th className="text-right">Budget</Th><Th>Manufacturer</Th></>}>
              {products.map((p) => (
                <Row key={p.id}>
                  <Td className="font-medium text-foreground">{p.name}</Td>
                  <Td><Badge variant="secondary">{p.category}</Badge></Td>
                  <Td>{p.stage}</Td>
                  <Td className="text-center">{p.completion}%</Td>
                  <Td className="text-right">{formatCurrency(p.budget)}</Td>
                  <Td className="text-muted-foreground">{p.manufacturer ?? "—"}</Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "categories" && (
          <>
            <SectionTitle title="Categories" description="The product taxonomy powering matching and compliance rules." count={`${categories.length} total · live data`} />
            <DataTable head={<><Th>Category</Th><Th>Slug</Th><Th className="text-center">Regulated</Th><Th>Regulation note</Th></>}>
              {categories.map((c) => (
                <Row key={c.slug}>
                  <Td className="font-medium text-foreground">{c.name}</Td>
                  <Td className="mono-label text-khaki/60">{c.slug}</Td>
                  <Td className="text-center">
                    {c.regulated ? <Badge variant="warning">Regulated</Badge> : <Badge variant="muted">Standard</Badge>}
                  </Td>
                  <Td className="max-w-md whitespace-normal text-xs text-muted-foreground">{c.regulationNote ?? "—"}</Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "materials" && (
          <>
            <SectionTitle title="Materials" description="The material library referenced by specs, quotes, and BOMs." count={`${materials.length} shown · live data`} />
            <DataTable head={<><Th></Th><Th>Material</Th><Th>Group</Th><Th className="text-center">Cost</Th><Th className="text-center">Durability</Th><Th className="text-center">Sustain.</Th><Th>Weight</Th></>}>
              {materials.map((m) => (
                <Row key={m.id}>
                  <Td>
                    <span className="inline-block size-4 rounded-sm border border-border" style={{ backgroundColor: m.swatch }} />
                  </Td>
                  <Td className="font-medium text-foreground">{m.name}</Td>
                  <Td className="text-muted-foreground">{m.group}</Td>
                  <Td className="text-center">{"$".repeat(m.costTier)}</Td>
                  <Td className="text-center">{m.durability}/5</Td>
                  <Td className="text-center">{m.sustainability}/5</Td>
                  <Td className="text-muted-foreground">{m.weight}</Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "methods" && (
          <>
            <SectionTitle title="Manufacturing Methods" description="Processes registered across the manufacturer network." count={`${METHODS.length} distinct · derived`} />
            <DataTable head={<><Th>Method</Th><Th className="text-center">Factories offering</Th><Th>Availability</Th></>}>
              {METHODS.map((method) => {
                const count = manufacturers.filter((m) => m.methods.includes(method)).length;
                return (
                  <Row key={method}>
                    <Td className="font-medium text-foreground">{method}</Td>
                    <Td className="text-center">{count}</Td>
                    <Td>
                      <Badge variant={count >= 3 ? "success" : count === 2 ? "warning" : "muted"}>
                        {count >= 3 ? "Broad" : count === 2 ? "Limited" : "Niche"}
                      </Badge>
                    </Td>
                  </Row>
                );
              })}
            </DataTable>
          </>
        )}

        {active === "quotes" && (
          <>
            <SectionTitle title="Quotes" description="Manufacturer bids submitted against product projects." count={`${quotes.length} shown · demo`} />
            <DataTable head={<><Th>Quote</Th><Th>Manufacturer</Th><Th>Country</Th><Th className="text-right">Unit</Th><Th className="text-right">Tooling</Th><Th className="text-right">MOQ</Th><Th>Expires</Th><Th className="text-center">Flags</Th></>}>
              {quotes.map((q) => (
                <Row key={q.id}>
                  <Td className="mono-label text-khaki/60">{q.id}</Td>
                  <Td className="font-medium text-foreground">{q.manufacturer}</Td>
                  <Td className="text-muted-foreground">{q.country}</Td>
                  <Td className="text-right">{formatCurrency(q.unitCost, { cents: true })}</Td>
                  <Td className="text-right">{formatCurrency(q.toolingCost)}</Td>
                  <Td className="text-right">{q.moq.toLocaleString()}</Td>
                  <Td className="text-muted-foreground">{q.expires}</Td>
                  <Td className="text-center">{q.flags.length}</Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "orders" && (
          <>
            <SectionTitle title="Orders" description="Production orders and their fulfillment state." count={`${DEMO_ORDERS.length} shown · demo`} />
            <DataTable head={<><Th>Order</Th><Th>Project</Th><Th>Buyer</Th><Th>Factory</Th><Th className="text-right">Value</Th><Th>Stage</Th><Th>Status</Th></>}>
              {DEMO_ORDERS.map((o) => (
                <Row key={o.id}>
                  <Td className="mono-label text-khaki/60">{o.id}</Td>
                  <Td className="font-medium text-foreground">{o.project}</Td>
                  <Td className="text-muted-foreground">{o.buyer}</Td>
                  <Td className="text-muted-foreground">{o.factory}</Td>
                  <Td className="text-right">{formatCurrency(o.value)}</Td>
                  <Td>{o.stage}</Td>
                  <Td><Badge variant={statusBadge(o.status)}>{o.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "payments" && (
          <>
            <SectionTitle title="Payments" description="Escrow milestones, platform fees, and factory payouts." count={`${DEMO_PAYMENTS.length} shown · demo`} />
            <DataTable head={<><Th>Payment</Th><Th>Party</Th><Th>Type</Th><Th className="text-right">Amount</Th><Th className="text-right">Platform fee</Th><Th>Method</Th><Th>Status</Th></>}>
              {DEMO_PAYMENTS.map((p) => (
                <Row key={p.id}>
                  <Td className="mono-label text-khaki/60">{p.id}</Td>
                  <Td className="font-medium text-foreground">{p.party}</Td>
                  <Td className="text-muted-foreground">{p.type}</Td>
                  <Td className="text-right">{formatCurrency(p.amount)}</Td>
                  <Td className="text-right text-mustard">{formatCurrency(p.fee)}</Td>
                  <Td>{p.method}</Td>
                  <Td><Badge variant={statusBadge(p.status)}>{p.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "disputes" && (
          <>
            <SectionTitle title="Disputes" description="Open cases between buyers and manufacturers." count={`${DEMO_DISPUTES.length} open · demo`} />
            <DataTable head={<><Th>Case</Th><Th>Parties</Th><Th>Topic</Th><Th>Opened</Th><Th>Severity</Th><Th>Status</Th></>}>
              {DEMO_DISPUTES.map((d) => (
                <Row key={d.id}>
                  <Td className="mono-label text-khaki/60">{d.id}</Td>
                  <Td className="font-medium text-foreground">{d.parties}</Td>
                  <Td className="text-muted-foreground">{d.topic}</Td>
                  <Td className="text-muted-foreground">{d.opened}</Td>
                  <Td>
                    <Badge variant={d.severity === "High" ? "danger" : d.severity === "Medium" ? "warning" : "muted"}>{d.severity}</Badge>
                  </Td>
                  <Td><Badge variant={statusBadge(d.status)}>{d.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "support" && (
          <>
            <SectionTitle title="Support Tickets" description="Inbound help requests across the platform." count={`${DEMO_SUPPORT.length} shown · demo`} />
            <DataTable head={<><Th>Ticket</Th><Th>Subject</Th><Th>Requester</Th><Th>Priority</Th><Th>Age</Th><Th>Status</Th></>}>
              {DEMO_SUPPORT.map((t) => (
                <Row key={t.id}>
                  <Td className="mono-label text-khaki/60">{t.id}</Td>
                  <Td className="font-medium text-foreground">{t.subject}</Td>
                  <Td className="text-muted-foreground">{t.requester}</Td>
                  <Td>
                    <Badge variant={t.priority === "High" ? "danger" : t.priority === "Medium" ? "warning" : "muted"}>{t.priority}</Badge>
                  </Td>
                  <Td className="text-muted-foreground">{t.age}</Td>
                  <Td><Badge variant={statusBadge(t.status)}>{t.status}</Badge></Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "compliance" && (
          <>
            <SectionTitle title="Compliance Flags" description="Regulatory checks raised on regulated product categories." count={`${DEMO_COMPLIANCE.length} active · demo`} />
            <DataTable head={<><Th>Project</Th><Th>Flag</Th><Th>Note</Th><Th className="text-center">Level</Th></>} note="Informational only — not legal or engineering certification.">
              {DEMO_COMPLIANCE.map((c) => (
                <Row key={c.project + c.flag}>
                  <Td className="font-medium text-foreground">{c.project}</Td>
                  <Td className="mono-label text-khaki/60">{c.flag}</Td>
                  <Td className="max-w-md whitespace-normal text-xs text-muted-foreground">{c.note}</Td>
                  <Td className="text-center">
                    <Badge variant={c.level === "danger" ? "danger" : c.level === "warning" ? "warning" : "secondary"}>
                      {c.level === "danger" ? "Blocking" : c.level === "warning" ? "Review" : "Info"}
                    </Badge>
                  </Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}

        {active === "packages" && (
          <PackagesSection pkgs={pkgs} setPkg={setPkg} />
        )}

        {active === "tiers" && (
          <>
            <SectionTitle title="Subscription Tiers" description="Recurring plans and their entitlements. Prices are admin-editable." count={`${subscriptionTiers.length} tiers · demo`} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {subscriptionTiers.map((t) => (
                <Card key={t.id} className={cn("bg-charcoal/60", t.featured && "border-mustard/40")}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      {t.featured && <Badge variant="warning">Popular</Badge>}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{t.price}</span>
                      <span className="text-xs text-muted-foreground">{t.cadence}</span>
                    </div>
                    <CardDescription>{t.forWho}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {t.features.slice(0, 5).map((f) => (
                        <li key={f} className="flex gap-1.5">
                          <BadgeCheck className="size-3.5 shrink-0 text-mustard/70" /> {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {active === "fees" && (
          <FeesSection fees={fees} setFees={setFees} />
        )}

        {active === "promotions" && (
          <>
            <SectionTitle title="Promotions" description="Discount codes and fee waivers. Toggle active state." count={`${DEMO_PROMOS.length} codes · demo`} />
            <DataTable head={<><Th>Code</Th><Th>Description</Th><Th className="text-center">Uses</Th><Th className="text-center">Cap</Th><Th className="text-center">Active</Th></>}>
              {DEMO_PROMOS.map((p) => (
                <PromoRow key={p.code} promo={p} />
              ))}
            </DataTable>
          </>
        )}

        {active === "content" && (
          <>
            <SectionTitle title="Content & Resources" description="Educational library, help center, and marketing pages." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { icon: FileText, title: "Educational Guides", desc: "24 published · 3 drafts", cta: "Manage guides" },
                { icon: LifeBuoy, title: "Help Center", desc: "58 articles across 9 collections", cta: "Manage articles" },
                { icon: Layers, title: "Material Spotlights", desc: "12 material deep-dives", cta: "Manage spotlights" },
                { icon: Megaphone, title: "Announcements", desc: "2 scheduled · 1 live", cta: "Manage banners" },
                { icon: Package, title: "Case Studies", desc: "7 published launches", cta: "Manage studies" },
                { icon: Cog, title: "Landing Pages", desc: "Marketing & category pages", cta: "Open CMS" },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <Card key={c.title} className="bg-charcoal/60">
                    <CardHeader className="pb-3">
                      <Icon className="size-5 text-mustard" />
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <CardDescription>{c.desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">{c.cta}</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Placeholder module — content management is stubbed in this demo.</p>
          </>
        )}

        {active === "audit" && (
          <>
            <SectionTitle title="Audit Log" description="Chronological record of important administrative actions." count={`${DEMO_AUDIT.length} recent · demo`} />
            <DataTable head={<><Th>Timestamp</Th><Th>Actor</Th><Th>Action</Th><Th>Target</Th></>} note="Immutable in production. Sample entries shown here.">
              {DEMO_AUDIT.map((a, i) => (
                <Row key={i}>
                  <Td className="mono-label text-khaki/60">{a.ts}</Td>
                  <Td className="mono-label text-khaki/80">{a.actor}</Td>
                  <Td className="font-medium text-foreground">{a.action}</Td>
                  <Td className="text-muted-foreground">{a.target}</Td>
                </Row>
              ))}
            </DataTable>
          </>
        )}
      </div>
    </div>
  );
}

// ── Overview section ─────────────────────────────────────────────────────────
function Overview() {
  const tiles = [
    { label: "Users", value: "3,412", sub: "+128 this week", icon: Users },
    { label: "Companies", value: "486", sub: "+9 this week", icon: Building2 },
    { label: "Manufacturers", value: manufacturers.length.toString(), sub: `${manufacturers.filter((m) => m.verified).length} verified`, icon: BadgeCheck },
    { label: "Active projects", value: "1,204", sub: "across pipeline", icon: Package },
    { label: "Open quotes", value: "372", sub: "awaiting review", icon: ClipboardList },
    { label: "Orders", value: "218", sub: "in production", icon: Boxes },
    { label: "GMV (YTD)", value: "$18.6M", sub: "gross merch. value", icon: CircleDollarSign },
    { label: "Platform fees", value: "$842K", sub: "YTD · ~4.5%", icon: Percent },
  ];
  return (
    <>
      <SectionTitle title="Platform Overview" description="Live-looking snapshot of platform health. All figures are demo values." count="Demo analytics" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="rounded-lg border border-border bg-charcoal/60 p-4">
              <div className="flex items-center justify-between">
                <span className="mono-label text-khaki/60">{t.label}</span>
                <Icon className="size-4 text-mustard/70" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight">{t.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{t.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="bg-charcoal/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-4 text-mustard" /> Activity feed
            </CardTitle>
            <CardDescription>Recent platform events — demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {DEMO_ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-md border border-border bg-forest-deep/60 p-1.5">
                      <Icon className="size-4 text-mustard/80" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground">{a.text}</p>
                      <span className="mono-label text-[0.6rem] text-khaki/50">{a.ts}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-charcoal/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="size-4 text-mustard" /> Operations
            </CardTitle>
            <CardDescription>Queues needing attention — demo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: BadgeCheck, label: "Verification queue", value: manufacturers.filter((m) => !m.verified).length, tone: "warning" as const },
              { icon: Scale, label: "Open disputes", value: DEMO_DISPUTES.length, tone: "danger" as const },
              { icon: LifeBuoy, label: "Support tickets", value: DEMO_SUPPORT.filter((t) => t.status !== "Resolved").length, tone: "warning" as const },
              { icon: ShieldAlert, label: "Compliance flags", value: DEMO_COMPLIANCE.length, tone: "danger" as const },
              { icon: FlaskConical, label: "Prototypes in review", value: 14, tone: "secondary" as const },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.label} className="flex items-center justify-between rounded-md border border-border bg-forest-deep/50 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="size-4 text-mustard/70" /> {q.label}
                  </span>
                  <Badge variant={q.tone}>{q.value}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ── Manufacturers + verification queue ───────────────────────────────────────
function ManufacturerSection({
  verif,
  setVerif,
}: {
  verif: Record<string, "Verified" | "Pending" | "Rejected">;
  setVerif: React.Dispatch<React.SetStateAction<Record<string, "Verified" | "Pending" | "Rejected">>>;
}) {
  const counts = {
    Verified: Object.values(verif).filter((v) => v === "Verified").length,
    Pending: Object.values(verif).filter((v) => v === "Pending").length,
    Rejected: Object.values(verif).filter((v) => v === "Rejected").length,
  };
  return (
    <>
      <SectionTitle title="Manufacturers" description="The verified factory network. Review the verification queue and approve or reject applicants." count={`${manufacturers.length} total · demo`} />
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-charcoal/60 p-3 text-center">
          <div className="text-xl font-bold text-emerald-300">{counts.Verified}</div>
          <div className="mono-label text-[0.6rem] text-khaki/50">Verified</div>
        </div>
        <div className="rounded-lg border border-border bg-charcoal/60 p-3 text-center">
          <div className="text-xl font-bold text-mustard">{counts.Pending}</div>
          <div className="mono-label text-[0.6rem] text-khaki/50">Pending</div>
        </div>
        <div className="rounded-lg border border-border bg-charcoal/60 p-3 text-center">
          <div className="text-xl font-bold text-red-300">{counts.Rejected}</div>
          <div className="mono-label text-[0.6rem] text-khaki/50">Rejected</div>
        </div>
      </div>
      <DataTable
        head={<><Th>Manufacturer</Th><Th>Location</Th><Th>Specialties</Th><Th className="text-center">MOQ</Th><Th className="text-center">Rating</Th><Th>Status</Th><Th className="text-right">Verification</Th></>}
        note="Approve / reject updates local demo state only."
      >
        {manufacturers.map((m) => {
          const status = verif[m.id];
          return (
            <Row key={m.id}>
              <Td className="font-medium text-foreground">{m.name}</Td>
              <Td className="text-muted-foreground">{m.city}, {m.country}</Td>
              <Td className="max-w-[16rem] truncate text-muted-foreground">{m.specialties.join(", ")}</Td>
              <Td className="text-center">{m.moq.toLocaleString()}</Td>
              <Td className="text-center">{m.rating.toFixed(1)}</Td>
              <Td>
                <Badge variant={status === "Verified" ? "success" : status === "Pending" ? "warning" : "danger"}>{status}</Badge>
              </Td>
              <Td>
                <div className="flex justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant={status === "Verified" ? "secondary" : "outline"}
                    onClick={() => setVerif((s) => ({ ...s, [m.id]: "Verified" }))}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "Rejected" ? "destructive" : "outline"}
                    onClick={() => setVerif((s) => ({ ...s, [m.id]: "Rejected" }))}
                  >
                    Reject
                  </Button>
                </div>
              </Td>
            </Row>
          );
        })}
      </DataTable>
    </>
  );
}

// ── Service packages editor ──────────────────────────────────────────────────
function PackagesSection({
  pkgs,
  setPkg,
}: {
  pkgs: Array<{ id: string; name: string; price: string; includes: string[] }>;
  setPkg: (id: string, key: "name" | "price", val: string) => void;
}) {
  return (
    <>
      <SectionTitle title="Service Packages" description="The productized offerings sold to buyers." count={`${pkgs.length} packages · demo`} />
      <Card className="mb-4 border-dashed bg-forest-deep/40">
        <CardContent className="flex items-start gap-2 p-3 text-xs text-muted-foreground">
          <AlertTriangle className="size-4 shrink-0 text-mustard" />
          Package names, prices, included features, and transaction percentages are admin-editable. Changes here are local demo state.
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {pkgs.map((p) => (
          <Card key={p.id} className="bg-charcoal/60">
            <CardHeader className="pb-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`pk-name-${p.id}`}>Name</Label>
                  <Input id={`pk-name-${p.id}`} value={p.name} onChange={(e) => setPkg(p.id, "name", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`pk-price-${p.id}`}>Price label</Label>
                  <Input id={`pk-price-${p.id}`} value={p.price} onChange={(e) => setPkg(p.id, "price", e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mono-label mb-2 text-khaki/60">Included features</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {p.includes.map((f) => (
                  <li key={f} className="flex items-center justify-between gap-2 rounded-md border border-border bg-forest-deep/40 px-2.5 py-1.5">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="size-3.5 text-mustard/70" /> {f}
                    </span>
                    <span className="mono-label text-[0.55rem] text-khaki/40">editable</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-3 w-full">Add feature</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

// ── Fees editor ──────────────────────────────────────────────────────────────
function FeesSection({
  fees,
  setFees,
}: {
  fees: { transaction: string; payout: string; listing: string; protoMarkup: string };
  setFees: React.Dispatch<React.SetStateAction<{ transaction: string; payout: string; listing: string; protoMarkup: string }>>;
}) {
  const rows: Array<{ key: keyof typeof fees; label: string; help: string; unit: string }> = [
    { key: "transaction", label: "Transaction fee", help: "Charged on order GMV", unit: "%" },
    { key: "payout", label: "Payout fee", help: "Charged on factory payouts", unit: "%" },
    { key: "listing", label: "Listing fee", help: "Per active opportunity", unit: "%" },
    { key: "protoMarkup", label: "Prototype markup", help: "Applied to prototype sourcing", unit: "%" },
  ];
  return (
    <>
      <SectionTitle title="Fees & Transactions" description="Platform economics. Percentages and fixed fees are admin-editable." count="Demo config" />
      <Card className="max-w-2xl bg-charcoal/60">
        <CardHeader>
          <CardTitle className="text-base">Platform fees</CardTitle>
          <CardDescription>These values drive the fee columns shown in Payments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div>
                <Label>{r.label}</Label>
                <p className="text-xs text-muted-foreground">{r.help}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={fees[r.key]}
                  onChange={(e) => setFees((f) => ({ ...f, [r.key]: e.target.value }))}
                  className="w-24 text-right"
                />
                <span className="mono-label text-khaki/60">{r.unit}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-muted-foreground">Effective blended take rate ≈ {fees.transaction}%.</p>
            <Button size="sm">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ── Promo row ────────────────────────────────────────────────────────────────
function PromoRow({ promo }: { promo: { code: string; desc: string; uses: number; cap: number; active: boolean } }) {
  const [active, setActive] = React.useState(promo.active);
  return (
    <Row>
      <Td className="mono-label font-medium text-mustard">{promo.code}</Td>
      <Td className="text-muted-foreground">{promo.desc}</Td>
      <Td className="text-center">{promo.uses}</Td>
      <Td className="text-center">{promo.cap === 0 ? "∞" : promo.cap}</Td>
      <Td className="text-center">
        <button
          type="button"
          onClick={() => setActive((a) => !a)}
          className={cn(
            "mono-label rounded-full px-2.5 py-1 text-[0.6rem] transition-colors",
            active ? "bg-emerald-500/15 text-emerald-300" : "bg-muted text-muted-foreground"
          )}
        >
          {active ? "Active" : "Paused"}
        </button>
      </Td>
    </Row>
  );
}
