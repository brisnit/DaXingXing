"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Check,
  X,
  Ruler,
  Layers,
  Palette,
  Cpu,
  BatteryCharging,
  Package,
  ShieldAlert,
  DollarSign,
  Boxes,
  FileText,
  MessageSquare,
  SlidersHorizontal,
  ChevronDown,
  Download,
  AlertTriangle,
  Leaf,
} from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAiProvider, type DesignReply } from "@/lib/ai/provider";
import { cn, formatCurrency } from "@/lib/utils";
import {
  ProductCanvasSVG,
  viewsFor,
  readouts,
  defaultDesign,
  MATERIAL_PRESETS,
  QUICK_COLORS,
  FEATURE_CONFIG,
  PRODUCT_NAMES,
  type Design,
  type Archetype,
  type Finish,
} from "@/components/studio/product-canvas";

type Msg = {
  role: "user" | "assistant";
  content: string;
  reply?: DesignReply;
};

const ARCHETYPES: { key: Archetype; label: string }[] = [
  { key: "speaker", label: "Rugged Speaker" },
  { key: "lamp", label: "Desk Lamp" },
  { key: "tumbler", label: "Tumbler" },
];
const FINISHES: Finish[] = ["matte", "satin", "gloss", "textured"];

/** Map an approved AI change onto the visual design so the canvas reacts. */
function applyChangeToDesign(prev: Design, text: string): Design {
  const t = text.toLowerCase();
  let next = { ...prev, features: { ...prev.features } };
  if (t.includes("aluminum") || t.includes("aluminium")) {
    const m = MATERIAL_PRESETS.find((x) => x.name.includes("Aluminum"))!;
    next = { ...next, shell: m.color, material: m.name, texture: m.texture, weightFactor: m.weightFactor, costDelta: m.costDelta };
  }
  if (t.includes("usb-c") || t.includes("usb c") || t.includes("port")) {
    if ("usbc" in next.features) next.features.usbc = true;
  }
  if (t.includes("children") || t.includes("kid")) {
    next.size = 0.85;
    next.shell = "#C1A548";
  }
  if (t.includes("$79") || t.includes("recycled abs") || t.includes("lower-cost") || t.includes("cheaper")) {
    const m = MATERIAL_PRESETS[0];
    next = { ...next, shell: m.color, material: m.name, texture: m.texture, weightFactor: m.weightFactor, costDelta: m.costDelta };
  }
  return next;
}

const CONFIG_SECTIONS: {
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { label: string; value: string; note?: string }[];
}[] = [
  {
    group: "Dimensions & Weight",
    icon: Ruler,
    items: [
      { label: "Dimensions", value: "210 × 96 × 78 mm", note: "Backpack-friendly" },
      { label: "Weight", value: "620 g (est.)" },
    ],
  },
  {
    group: "Materials & Finishes",
    icon: Layers,
    items: [
      { label: "Outer shell", value: "Recycled ABS", note: "AI recommended" },
      { label: "Bumper", value: "TPU elastomer" },
      { label: "Surface finish", value: "Matte soft-touch" },
    ],
  },
  {
    group: "Colors & Branding",
    icon: Palette,
    items: [
      { label: "Colors", value: "Forest · Sand · Charcoal" },
      { label: "Branding placement", value: "Debossed logo, front grille" },
    ],
  },
  {
    group: "Components & Controls",
    icon: Cpu,
    items: [
      { label: "Audio", value: "5W driver + passive radiator" },
      { label: "Connectivity", value: "Bluetooth 5.3" },
      { label: "Controls", value: "Power · Vol ± · Pair" },
      { label: "Ports", value: "USB-C (IP-rated cover)" },
    ],
  },
  {
    group: "Power & Battery",
    icon: BatteryCharging,
    items: [
      { label: "Battery", value: "3,600 mAh Li-ion", note: "Compliance flag: battery testing" },
      { label: "Runtime", value: "~14 hr (est.)" },
    ],
  },
  {
    group: "Packaging & Sustainability",
    icon: Package,
    items: [
      { label: "Packaging", value: "Molded pulp + recycled kraft" },
      { label: "Sustainability", value: "Recycled content, plastic-free box" },
    ],
  },
  {
    group: "Cost & Quantity Targets",
    icon: DollarSign,
    items: [
      { label: "Target retail price", value: "$129" },
      { label: "Target unit cost", value: "$24 – $34", note: "Estimate" },
      { label: "Initial quantity", value: "1,000 units" },
    ],
  },
];

const SPEC_SECTIONS = [
  {
    title: "Product overview",
    body: "A rugged, rechargeable Bluetooth speaker for outdoor use — backpack-sized, light-rain resistant, with a webbing carry strap. Premium feel at an accessible price.",
  },
  { title: "Intended customer", body: "Outdoor enthusiasts, travelers, and everyday users who want durable, portable sound." },
  { title: "Use cases", body: "Trail and campsite audio, backyard and beach use, travel, everyday portable listening." },
  {
    title: "Functional requirements",
    body: "≥12 hr runtime, Bluetooth 5.3 pairing, IPX5 splash resistance, one-handed controls, USB-C charging.",
  },
  { title: "Physical dimensions", body: "210 × 96 × 78 mm; target weight 620 g." },
  { title: "Materials", body: "Recycled ABS shell, TPU corner bumpers, powder-coated metal grille (optional)." },
  { title: "Performance & durability", body: "1.2 m drop target, IPX5 splash, −5 °C to 45 °C operating range." },
  { title: "Packaging requirements", body: "Fully recyclable molded-pulp tray in recycled kraft box; retail-ready." },
  {
    title: "Safety & compliance considerations",
    body: "Li-ion battery testing (UN38.3), wireless emissions (FCC/CE), general product safety. Final compliance must be confirmed by qualified professionals and accredited testing labs.",
    flag: true,
  },
  { title: "Target cost & quantity", body: "Unit cost target $24–$34 (est.); initial run 1,000 units; retail $129." },
  {
    title: "Open questions",
    body: "Tool-free assembly vs metal grille? Confirm final IP rating. Confirm US vs overseas manufacturing preference.",
    open: true,
  },
];

export default function StudioPage() {
  const ai = React.useMemo(() => getAiProvider(), []);
  const [design, setDesign] = React.useState<Design>(() => defaultDesign("speaker"));
  const [view, setView] = React.useState("front");
  const [rightTab, setRightTab] = React.useState<"config" | "spec">("config");
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [openGroup, setOpenGroup] = React.useState<string | null>(
    CONFIG_SECTIONS[0].group
  );
  const [appliedChanges, setAppliedChanges] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Welcome to the Studio. Describe your product, or ask me to change materials, add a port, adjust the price, or create a variant. I act as your industrial designer, engineer, material specialist, cost analyst, and manufacturing advisor — and I'll always show the impact of a change before applying it.",
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setThinking(true);
    const reply = await ai.designChat({ prompt: trimmed });
    setMessages((m) => [
      ...m,
      { role: "assistant", content: reply.message, reply },
    ]);
    setThinking(false);
  };

  const approve = (reply: DesignReply) => {
    setAppliedChanges((c) => [
      ...c,
      ...reply.proposedChanges.map((p) => `${p.field} → ${p.to}`),
    ]);
    // Drive the visual canvas from the approved change.
    setDesign((prev) => {
      let d = prev;
      reply.proposedChanges.forEach((p) => {
        d = applyChangeToDesign(d, `${p.field} ${p.to}`);
      });
      return d;
    });
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        content:
          "Applied to your living specification and reflected on the Product Canvas. Logged in the revision history — anything else you'd like to adjust?",
      },
    ]);
  };

  const chooseArchetype = (a: Archetype) => {
    setDesign(defaultDesign(a));
    setView("front");
  };
  const patch = (p: Partial<Design>) => setDesign((d) => ({ ...d, ...p }));
  const toggleFeature = (key: string) =>
    setDesign((d) => ({ ...d, features: { ...d.features, [key]: !d.features[key] } }));

  const r = readouts(design);

  return (
    <div className="flex h-screen flex-col bg-forest-deep">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-forest px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
          </Link>
          <Wordmark markClassName="h-6 w-6" />
          <span className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">{PRODUCT_NAMES[design.archetype]}</p>
            <span className="mono-label text-[0.6rem] text-khaki/60">
              Studio · Concept · {design.material}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="hidden md:inline-flex">
            <Sparkles className="size-3" /> Estimates until confirmed
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="size-4" /> Export
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/quotes">Request Quote</Link>
          </Button>
        </div>
      </header>

      {/* 4-panel workspace */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12">
        {/* 1. Product Canvas */}
        <section className="flex min-h-0 flex-col border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r">
          <PanelHeader icon={Boxes} title="Product Canvas" hint="Manipulate · live concept" />
          <div className="flex-1 overflow-y-auto p-4">
            {/* Preset products */}
            <div className="mb-3 flex gap-1.5">
              {ARCHETYPES.map((a) => (
                <button
                  key={a.key}
                  onClick={() => chooseArchetype(a.key)}
                  className={cn(
                    "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                    design.archetype === a.key
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-foreground/70 hover:bg-secondary/40"
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <ProductCanvasSVG design={design} view={view} />

            {/* View selector */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {viewsFor(design.archetype).map((v) => (
                <button
                  key={v.key}
                  onClick={() => setView(v.key)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                    view === v.key
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-foreground/70 hover:bg-secondary/40"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Live spec readout */}
            <div className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {[
                { k: "Size", v: `${r.w}×${r.h}×${r.depth}mm` },
                { k: "Weight", v: `${r.weight} g` },
                { k: "Water", v: r.water },
                { k: "Finish", v: design.finish },
                { k: "Material", v: design.material },
                { k: "Est. unit", v: `${formatCurrency(r.costLow)}–${formatCurrency(r.costHigh)}` },
              ].map((s) => (
                <div key={s.k} className="bg-card p-2">
                  <p className="mono-label text-[0.55rem] text-khaki">{s.k}</p>
                  <p className="mt-0.5 truncate text-xs font-medium capitalize text-foreground">{s.v}</p>
                </div>
              ))}
            </div>

            {/* Shell color */}
            <ControlBlock icon={Palette} label="Shell color">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => patch({ shell: c })}
                    aria-label={`Shell ${c}`}
                    className={cn(
                      "size-7 rounded-md border-2 transition-transform hover:scale-110",
                      design.shell.toLowerCase() === c.toLowerCase() ? "border-primary" : "border-border"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </ControlBlock>

            {/* Material */}
            <ControlBlock icon={Layers} label="Material">
              <div className="grid grid-cols-2 gap-1.5">
                {MATERIAL_PRESETS.map((m) => (
                  <button
                    key={m.name}
                    onClick={() =>
                      patch({ shell: m.color, material: m.name, texture: m.texture, weightFactor: m.weightFactor, costDelta: m.costDelta })
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                      design.material === m.name ? "border-primary/60 bg-primary/10" : "border-border hover:bg-secondary/40"
                    )}
                  >
                    <span className="size-3.5 shrink-0 rounded-sm border border-border" style={{ backgroundColor: m.color }} />
                    <span className="truncate">{m.name}</span>
                  </button>
                ))}
              </div>
            </ControlBlock>

            {/* Finish */}
            <ControlBlock icon={Sparkles} label="Finish">
              <div className="flex gap-1.5">
                {FINISHES.map((f) => (
                  <button
                    key={f}
                    onClick={() => patch({ finish: f })}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1 text-xs capitalize transition-colors",
                      design.finish === f ? "border-primary/60 bg-primary/10 text-primary" : "border-border text-foreground/70 hover:bg-secondary/40"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </ControlBlock>

            {/* Features */}
            <ControlBlock icon={SlidersHorizontal} label="Features">
              <div className="flex flex-wrap gap-1.5">
                {FEATURE_CONFIG[design.archetype].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                      design.features[f.key]
                        ? "border-primary/60 bg-primary/10 text-primary"
                        : "border-border text-foreground/60 hover:bg-secondary/40"
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", design.features[f.key] ? "bg-primary" : "bg-muted-foreground/40")} />
                    {f.label}
                  </button>
                ))}
              </div>
            </ControlBlock>

            {/* Size */}
            <ControlBlock icon={Ruler} label={`Overall size · ${Math.round(design.size * 100)}%`}>
              <input
                type="range"
                min={0.8}
                max={1.2}
                step={0.02}
                value={design.size}
                onChange={(e) => patch({ size: parseFloat(e.target.value) })}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </ControlBlock>

            <p className="mt-4 text-xs text-muted-foreground">
              Live concept placeholder — decisions here update the views and
              estimates instantly, and approved AI changes reflect here too.
              Architecture is ready for real 3D / CAD later.
            </p>
          </div>
        </section>

        {/* 2. Conversational Design Panel */}
        <section className="flex min-h-0 flex-col border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r">
          <PanelHeader icon={MessageSquare} title="Design Conversation" hint="Approve before applying" />
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i}>
                {m.role === "user" ? (
                  <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-secondary px-3.5 py-2.5 text-sm">
                    {m.content}
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Sparkles className="size-3.5" />
                    </div>
                    <div className="max-w-[88%] space-y-2.5">
                      <div className="rounded-2xl rounded-tl-sm border border-border bg-forest px-3.5 py-2.5 text-sm leading-relaxed text-foreground/90">
                        {m.content}
                      </div>
                      {m.reply && m.reply.proposedChanges.length > 0 && (
                        <ProposedChange
                          reply={m.reply}
                          onApprove={() => approve(m.reply!)}
                        />
                      )}
                      {m.reply && m.reply.openQuestions.length > 0 && (
                        <div className="rounded-lg border border-border bg-charcoal/60 p-3">
                          <p className="mono-label mb-1.5 text-khaki/60">Open questions</p>
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {m.reply.openQuestions.map((q) => (
                              <li key={q} className="flex gap-1.5">
                                <span className="text-mustard">·</span> {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 animate-pulse-status text-primary" />
                Analyzing tradeoffs…
              </div>
            )}
          </div>
          <div className="border-t border-border p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {[
                "Change the shell to recycled aluminum",
                "Add a USB-C port",
                "Reduce retail price to $79",
                "Create a children's version",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70 hover:border-primary/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe a change…"
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={thinking || !input.trim()}>
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </section>

        {/* 3 & 4. Configuration + Specification */}
        <section className="flex min-h-0 flex-col lg:col-span-4">
          <div className="flex shrink-0 border-b border-border">
            <TabBtn active={rightTab === "config"} onClick={() => setRightTab("config")} icon={SlidersHorizontal}>
              Configuration
            </TabBtn>
            <TabBtn active={rightTab === "spec"} onClick={() => setRightTab("spec")} icon={FileText}>
              Specification
            </TabBtn>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {rightTab === "config" ? (
              <div className="space-y-2">
                {appliedChanges.length > 0 && (
                  <div className="mb-3 rounded-lg border border-primary/40 bg-primary/10 p-3">
                    <p className="mono-label mb-1.5 text-primary">Applied changes</p>
                    <ul className="space-y-1 text-xs text-foreground/85">
                      {appliedChanges.map((c, i) => (
                        <li key={i} className="flex gap-1.5">
                          <Check className="size-3.5 shrink-0 text-primary" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {CONFIG_SECTIONS.map((section) => {
                  const open = openGroup === section.group;
                  return (
                    <div key={section.group} className="overflow-hidden rounded-lg border border-border">
                      <button
                        onClick={() => setOpenGroup(open ? null : section.group)}
                        className="flex w-full items-center justify-between bg-forest px-3.5 py-3 text-left"
                      >
                        <span className="flex items-center gap-2.5 text-sm font-medium">
                          <section.icon className="size-4 text-mustard" />
                          {section.group}
                        </span>
                        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                      </button>
                      {open && (
                        <div className="divide-y divide-border border-t border-border">
                          {section.items.map((it) => (
                            <div key={it.label} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
                              <div>
                                <p className="text-xs text-muted-foreground">{it.label}</p>
                                <p className="text-sm text-foreground/90">{it.value}</p>
                              </div>
                              {it.note && (
                                <Badge variant={it.note.toLowerCase().includes("flag") ? "warning" : "olive"} className="shrink-0 text-[0.6rem]">
                                  {it.note}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <p className="pt-2 text-xs text-muted-foreground">
                  Each section offers AI recommendations, common options, estimated
                  costs, and manufacturing implications. All figures are estimates
                  until confirmed by a manufacturer.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-forest p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Leaf className="size-4 text-olive" />
                    <span className="font-medium">Living specification</span>
                    <Badge variant="muted" className="ml-auto text-[0.6rem]">Auto-updating</Badge>
                  </div>
                </div>
                {SPEC_SECTIONS.map((s) => (
                  <div
                    key={s.title}
                    className={cn(
                      "rounded-lg border p-3",
                      s.flag ? "border-mustard/40 bg-mustard/5" : s.open ? "border-border bg-charcoal/50" : "border-border bg-forest"
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      {s.flag && <ShieldAlert className="size-3.5 text-mustard" />}
                      {s.open && <AlertTriangle className="size-3.5 text-khaki" />}
                      <p className="mono-label text-khaki/70">{s.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85">{s.body}</p>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {["Product Brief", "RFQ Package", "BOM Draft", "Spec PDF", "PRD", "Image Package", "Packaging Brief", "Launch Brief"].map((x) => (
                    <Button key={x} variant="outline" size="sm" className="justify-start text-xs">
                      <Download className="size-3.5" /> {x}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function ControlBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-1.5 text-khaki">
        <Icon className="size-3.5" />
        <span className="mono-label text-[0.6rem]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function PanelHeader({
  icon: Icon,
  title,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-mustard" />
        {title}
      </span>
      <span className="mono-label text-[0.6rem] text-khaki/50">{hint}</span>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors",
        active ? "border-b-2 border-primary bg-primary/5 text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}

function ProposedChange({
  reply,
  onApprove,
}: {
  reply: DesignReply;
  onApprove: () => void;
}) {
  const [resolved, setResolved] = React.useState<"none" | "approved" | "dismissed">("none");
  const impactEntries = Object.entries(reply.impact).filter(([, v]) => v);

  return (
    <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="warning" className="text-[0.6rem]">Proposed change · needs approval</Badge>
      </div>
      <ul className="mb-2.5 space-y-1">
        {reply.proposedChanges.map((p) => (
          <li key={p.field} className="text-sm">
            <span className="text-muted-foreground">{p.field}: </span>
            {p.from && <span className="text-muted-foreground line-through">{p.from} → </span>}
            <span className="font-medium text-foreground">{p.to}</span>
          </li>
        ))}
      </ul>
      {impactEntries.length > 0 && (
        <div className="mb-3 space-y-1 rounded-md bg-charcoal/60 p-2.5">
          <p className="mono-label text-khaki/60">Impact</p>
          {impactEntries.map(([k, v]) => (
            <p key={k} className="text-xs text-foreground/80">
              <span className="capitalize text-mustard">{k}:</span> {v}
            </p>
          ))}
        </div>
      )}
      {resolved === "none" ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setResolved("approved");
              onApprove();
            }}
          >
            <Check className="size-3.5" /> Approve & apply
          </Button>
          <Button size="sm" variant="outline" onClick={() => setResolved("dismissed")}>
            <X className="size-3.5" /> Not now
          </Button>
        </div>
      ) : (
        <p className={cn("text-xs font-medium", resolved === "approved" ? "text-primary" : "text-muted-foreground")}>
          {resolved === "approved" ? "✓ Applied to specification" : "Dismissed — nothing changed"}
        </p>
      )}
    </div>
  );
}
