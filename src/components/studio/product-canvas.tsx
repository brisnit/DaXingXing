"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Interactive, parametric product canvas.
// Renders recognizable concept products as SVG that respond to material,
// color, finish, feature, and size decisions — and can be driven by the
// AI design conversation. Everything here is a labeled concept placeholder;
// the architecture stays ready for real 3D / CAD later.
// ---------------------------------------------------------------------------

export type Archetype = "speaker" | "lamp" | "tumbler";
export type Finish = "matte" | "satin" | "gloss" | "textured";

export interface Design {
  archetype: Archetype;
  shell: string; // hex
  accent: string; // hex (bumpers / straps / trim)
  material: string; // label
  texture: "plastic" | "metal" | "wood" | "fabric" | "silicone" | "leather";
  finish: Finish;
  weightFactor: number;
  costDelta: number;
  size: number; // 0.8 – 1.2
  features: Record<string, boolean>;
}

export interface MaterialPreset {
  name: string;
  color: string;
  texture: Design["texture"];
  weightFactor: number;
  costDelta: number;
}

export const MATERIAL_PRESETS: MaterialPreset[] = [
  { name: "Recycled ABS", color: "#33432F", texture: "plastic", weightFactor: 1.0, costDelta: 0 },
  { name: "Recycled Aluminum", color: "#B7BCC0", texture: "metal", weightFactor: 1.35, costDelta: 6 },
  { name: "Stainless Steel", color: "#9AA0A4", texture: "metal", weightFactor: 1.6, costDelta: 5 },
  { name: "Bamboo", color: "#C8A96A", texture: "wood", weightFactor: 1.1, costDelta: 3 },
  { name: "Walnut", color: "#5A4632", texture: "wood", weightFactor: 1.2, costDelta: 4 },
  { name: "Silicone Wrap", color: "#B9512E", texture: "silicone", weightFactor: 1.15, costDelta: 3 },
  { name: "Recycled Fabric", color: "#3A4636", texture: "fabric", weightFactor: 0.95, costDelta: 1 },
  { name: "Vegan Leather", color: "#6E5A43", texture: "leather", weightFactor: 1.0, costDelta: 2 },
];

export const QUICK_COLORS = [
  "#33432F", "#D8C79E", "#2B2E2A", "#C1A548", "#64714A",
  "#B7BCC0", "#5A4632", "#B9512E", "#1B4B54", "#EDE7D6",
];

export const FEATURE_CONFIG: Record<Archetype, { key: string; label: string; costDelta: number }[]> = {
  speaker: [
    { key: "strap", label: "Carry strap", costDelta: 1.5 },
    { key: "usbc", label: "USB-C port", costDelta: 1 },
    { key: "metalGrille", label: "Metal grille", costDelta: 2 },
  ],
  lamp: [
    { key: "wireless", label: "Qi charge pad", costDelta: 4 },
    { key: "usbc", label: "USB-C port", costDelta: 1 },
    { key: "foldFlat", label: "Fold-flat arm", costDelta: 2 },
  ],
  tumbler: [
    { key: "handle", label: "Handle", costDelta: 1.5 },
    { key: "strawLid", label: "Straw lid", costDelta: 1 },
    { key: "copperLine", label: "Copper lining", costDelta: 3 },
  ],
};

const VIEWS: Record<Archetype, { key: string; label: string }[]> = {
  speaker: [
    { key: "front", label: "Front" },
    { key: "exploded", label: "Exploded" },
    { key: "internal", label: "Internal" },
    { key: "material", label: "Material" },
    { key: "dimension", label: "Dimension" },
    { key: "packaging", label: "Packaging" },
  ],
  lamp: [
    { key: "front", label: "Front" },
    { key: "material", label: "Material" },
    { key: "dimension", label: "Dimension" },
    { key: "packaging", label: "Packaging" },
  ],
  tumbler: [
    { key: "front", label: "Front" },
    { key: "material", label: "Material" },
    { key: "dimension", label: "Dimension" },
    { key: "packaging", label: "Packaging" },
  ],
};

const BASE = {
  speaker: { name: "Trailhead Rugged Speaker", w: 210, h: 96, d: 78, weight: 620, cost: 24 },
  lamp: { name: "Beacon Modular Desk Lamp", w: 150, h: 420, d: 150, weight: 780, cost: 18 },
  tumbler: { name: "Summit Insulated Tumbler", w: 88, h: 210, d: 88, weight: 340, cost: 6 },
};

export const PRODUCT_NAMES: Record<Archetype, string> = {
  speaker: "Trailhead Rugged Speaker",
  lamp: "Beacon Modular Desk Lamp",
  tumbler: "Summit Insulated Tumbler",
};

export function defaultDesign(archetype: Archetype): Design {
  const m = MATERIAL_PRESETS[0];
  const feats: Record<string, boolean> = {};
  FEATURE_CONFIG[archetype].forEach((f, i) => (feats[f.key] = i === 0));
  return {
    archetype,
    shell: archetype === "tumbler" ? "#2B2E2A" : m.color,
    accent: "#26231E",
    material: m.name,
    texture: m.texture,
    finish: "matte",
    weightFactor: m.weightFactor,
    costDelta: m.costDelta,
    size: 1,
    features: feats,
  };
}

// ---- color helpers --------------------------------------------------------
const clamp = (n: number) => Math.max(0, Math.min(255, n));
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => clamp(Math.round(x)).toString(16).padStart(2, "0")).join("");
}
/** amt < 0 darkens, amt > 0 lightens (0..1) */
function shade(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
}

const STROKE = "#2c2b27";
const finishSheen: Record<Finish, number> = { matte: 0.05, satin: 0.16, gloss: 0.34, textured: 0.08 };

// ---- derived spec readouts ------------------------------------------------
export function readouts(d: Design) {
  const b = BASE[d.archetype];
  const w = Math.round(b.w * (0.8 + 0.2 * d.size));
  const h = Math.round(b.h * (0.8 + 0.2 * d.size));
  const depth = Math.round(b.d * (0.8 + 0.2 * d.size));
  let extra = 0;
  FEATURE_CONFIG[d.archetype].forEach((f) => (extra += d.features[f.key] ? f.costDelta : 0));
  const weight = Math.round(b.weight * (0.65 + 0.35 * d.size) * d.weightFactor + (d.features.metalGrille ? 60 : 0));
  const cost = b.cost + d.costDelta + extra;
  return {
    w, h, depth, weight,
    costLow: Math.max(2, Math.round(cost - 3)),
    costHigh: Math.round(cost + 4),
    water: d.archetype === "tumbler" ? "Leakproof" : d.features.usbc ? "IPX5 (sealed port)" : "IPX5 target",
  };
}

// ===========================================================================
// SVG builders per archetype (front view). Others wrap these.
// ===========================================================================

function Texture({ d, x, y, w, h, id }: { d: Design; x: number; y: number; w: number; h: number; id: string }) {
  const lines: React.ReactNode[] = [];
  const clip = `clip-${id}`;
  if (d.texture === "metal") {
    for (let i = 0; i < 40; i++) {
      const lx = x + (i / 40) * w;
      lines.push(<line key={i} x1={lx} y1={y} x2={lx} y2={y + h} stroke="#ffffff" strokeOpacity={i % 2 ? 0.05 : 0.09} strokeWidth={0.8} />);
    }
  } else if (d.texture === "wood") {
    for (let i = 0; i < 7; i++) {
      const ly = y + ((i + 0.5) / 7) * h;
      lines.push(<path key={i} d={`M${x} ${ly} q${w / 2} ${i % 2 ? -5 : 5} ${w} 0`} fill="none" stroke={shade(d.shell, -0.35)} strokeOpacity={0.35} strokeWidth={1.1} />);
    }
  } else if (d.texture === "fabric") {
    for (let i = 0; i < 24; i++) {
      const lx = x + (i / 24) * w;
      lines.push(<line key={`v${i}`} x1={lx} y1={y} x2={lx} y2={y + h} stroke={shade(d.shell, -0.3)} strokeOpacity={0.18} strokeWidth={0.7} />);
    }
    for (let i = 0; i < 12; i++) {
      const ly = y + (i / 12) * h;
      lines.push(<line key={`h${i}`} x1={x} y1={ly} x2={x + w} y2={ly} stroke={shade(d.shell, -0.3)} strokeOpacity={0.18} strokeWidth={0.7} />);
    }
  } else if (d.texture === "leather") {
    // deterministic pebbled grain (SSR-safe — no Math.random)
    for (let i = 0; i < 22; i++) {
      lines.push(<circle key={i} cx={x + ((i * 53) % w)} cy={y + ((i * 37) % h)} r={1.1} fill={shade(d.shell, -0.3)} fillOpacity={0.22} />);
    }
  }
  if (!lines.length) return null;
  return (
    <g clipPath={`url(#${clip})`}>
      <defs>
        <clipPath id={clip}>
          <rect x={x} y={y} width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      {lines}
    </g>
  );
}
function Sheen({ finish, x, y, w, h }: { finish: Finish; x: number; y: number; w: number; h: number }) {
  const o = finishSheen[finish];
  return (
    <ellipse cx={x + w * 0.32} cy={y + h * 0.28} rx={w * 0.42} ry={h * 0.3} fill="#ffffff" opacity={o} />
  );
}

function SpeakerFront({ d, cx = 200, cy = 150 }: { d: Design; cx?: number; cy?: number }) {
  const w = 200 * d.size, h = 116 * d.size;
  const x = cx - w / 2, y = cy - h / 2;
  const bump = w * 0.1;
  const gx = x + bump, gw = w - bump * 2;
  const rx = Math.min(30, h * 0.32);
  const gid = `sp-${Math.round(w)}-${d.shell.slice(1)}`;

  // grille dots
  const dots: React.ReactNode[] = [];
  const sp = 10 * d.size, r = 2.3 * d.size;
  for (let yy = y + 14; yy < y + h - 12; yy += sp) {
    for (let xx = gx + 12; xx < gx + gw - 10; xx += sp) {
      dots.push(<circle key={`${xx}-${yy}`} cx={xx} cy={yy} r={r} fill={d.features.metalGrille ? "#8b9096" : shade(d.shell, -0.45)} opacity={0.85} />);
    }
  }

  return (
    <g>
      <defs>
        <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(d.shell, 0.14)} />
          <stop offset="100%" stopColor={shade(d.shell, -0.16)} />
        </linearGradient>
      </defs>
      {/* soft shadow */}
      <ellipse cx={cx} cy={y + h + 12} rx={w * 0.44} ry={7} fill="#000" opacity={0.12} />
      {/* strap */}
      {d.features.strap && (
        <path
          d={`M${x + bump * 0.6} ${y + 6} C ${x - 8} ${y - 34}, ${x + w * 0.34} ${y - 40}, ${x + w * 0.34} ${y + 6}`}
          fill="none" stroke={d.accent} strokeWidth={7 * d.size} strokeLinecap="round"
        />
      )}
      {/* body */}
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#g-${gid})`} stroke={STROKE} strokeWidth={2} />
      <Texture d={d} x={x + 4} y={y + 4} w={w - 8} h={h - 8} id={gid} />
      {/* bumpers */}
      <rect x={x} y={y} width={bump} height={h} rx={rx} fill={shade(d.accent, 0.05)} stroke={STROKE} strokeWidth={1.5} />
      <rect x={x + w - bump} y={y} width={bump} height={h} rx={rx} fill={shade(d.accent, 0.05)} stroke={STROKE} strokeWidth={1.5} />
      {/* grille face */}
      <rect x={gx + 6} y={y + 8} width={gw - 12} height={h - 16} rx={12} fill={shade(d.shell, -0.28)} opacity={0.55} />
      {dots}
      {/* logo deboss */}
      <g transform={`translate(${cx},${y + h / 2})`} opacity={0.9}>
        <path d="M0 -9 L7 -6 L9 1 L4 8 L-4 8 L-9 1 L-7 -6 Z" fill="none" stroke={d.features.metalGrille ? "#cfd3d6" : shade(d.shell, 0.4)} strokeWidth={1.4} />
        <path d="M-4 -1 L-1.5 -1 M1.5 -1 L4 -1" stroke={d.features.metalGrille ? "#cfd3d6" : shade(d.shell, 0.4)} strokeWidth={1.6} strokeLinecap="round" />
      </g>
      {/* top control buttons */}
      {[-1.5, -0.5, 0.5, 1.5].map((i) => (
        <rect key={i} x={cx + i * 15 * d.size - 5} y={y - 3} width={10} height={5} rx={2.5} fill={shade(d.shell, -0.2)} stroke={STROKE} strokeWidth={1} />
      ))}
      <Sheen finish={d.finish} x={x} y={y} w={w} h={h} />
    </g>
  );
}

function LampFront({ d, cx = 200, cy = 155 }: { d: Design; cx?: number; cy?: number }) {
  const s = d.size;
  const baseW = 96 * s, baseH = 16 * s;
  const baseY = cy + 84 * s;
  const stemX = cx;
  const armY = cy - 96 * s;
  return (
    <g>
      <ellipse cx={cx} cy={baseY + baseH + 6} rx={baseW * 0.6} ry={6} fill="#000" opacity={0.12} />
      {/* base (weighted) */}
      <rect x={cx - baseW / 2} y={baseY} width={baseW} height={baseH} rx={7} fill={shade(d.shell, -0.1)} stroke={STROKE} strokeWidth={2} />
      {d.features.wireless && <ellipse cx={cx} cy={baseY - 3} rx={18 * s} ry={5 * s} fill={shade(d.accent, 0.1)} stroke={STROKE} strokeWidth={1.2} />}
      {d.features.usbc && <rect x={cx + baseW / 2 - 12} y={baseY + baseH / 2 - 2} width={7} height={4} rx={2} fill="#111" />}
      {/* stem */}
      <rect x={stemX - 5 * s} y={armY} width={10 * s} height={baseY - armY} rx={5} fill={d.shell} stroke={STROKE} strokeWidth={2} />
      {/* joint */}
      <circle cx={stemX} cy={armY} r={7 * s} fill={shade(d.accent, 0.1)} stroke={STROKE} strokeWidth={1.6} />
      {/* arm */}
      <rect x={stemX - 4 * s} y={armY - 4 * s} width={92 * s} height={9 * s} rx={4.5} fill={d.shell} stroke={STROKE} strokeWidth={2} transform={`rotate(${d.features.foldFlat ? -18 : -8} ${stemX} ${armY})`} />
      {/* LED head */}
      <g transform={`translate(${stemX + 88 * s}, ${armY - (d.features.foldFlat ? 26 : 16) * s})`}>
        <rect x={-26 * s} y={-8 * s} width={52 * s} height={16 * s} rx={7} fill={shade(d.shell, -0.05)} stroke={STROKE} strokeWidth={2} />
        <rect x={-22 * s} y={-4 * s} width={44 * s} height={8 * s} rx={4} fill="#F5E6A8" />
        <ellipse cx={0} cy={20 * s} rx={40 * s} ry={12 * s} fill="#F5E6A8" opacity={0.28} />
      </g>
      <Sheen finish={d.finish} x={cx - baseW / 2} y={baseY} w={baseW} h={baseH} />
    </g>
  );
}

function TumblerFront({ d, cx = 200, cy = 150 }: { d: Design; cx?: number; cy?: number }) {
  const s = d.size;
  const topW = 74 * s, botW = 56 * s, bh = 150 * s;
  const y = cy - bh / 2;
  const lidH = 22 * s;
  const path = `M${cx - topW / 2} ${y + lidH} L${cx + topW / 2} ${y + lidH} L${cx + botW / 2} ${y + bh} L${cx - botW / 2} ${y + bh} Z`;
  const gid = `tb-${d.shell.slice(1)}`;
  return (
    <g>
      <defs>
        <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade(d.shell, -0.16)} />
          <stop offset="45%" stopColor={shade(d.shell, 0.16)} />
          <stop offset="100%" stopColor={shade(d.shell, -0.2)} />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy={y + bh + 6} rx={botW * 0.7} ry={6} fill="#000" opacity={0.12} />
      {/* body */}
      <path d={path} fill={`url(#g-${gid})`} stroke={STROKE} strokeWidth={2} />
      <Texture d={d} x={cx - topW / 2} y={y + lidH} w={topW} h={bh - lidH} id={gid} />
      {d.features.copperLine && <path d={`M${cx - topW / 2 + 4} ${y + lidH + 6} L${cx + topW / 2 - 4} ${y + lidH + 6}`} stroke="#B87333" strokeWidth={3} />}
      {/* lid */}
      <rect x={cx - topW / 2 - 3} y={y} width={topW + 6} height={lidH} rx={7} fill={shade(d.accent, 0.12)} stroke={STROKE} strokeWidth={2} />
      {d.features.strawLid && <rect x={cx - 3} y={y - 18 * s} width={6} height={20 * s} rx={3} fill={shade(d.accent, 0.2)} stroke={STROKE} strokeWidth={1.2} />}
      {/* handle */}
      {d.features.handle && (
        <path d={`M${cx + topW / 2} ${y + lidH + 20} q${44 * s} ${8} ${0} ${60 * s}`} fill="none" stroke={shade(d.shell, -0.1)} strokeWidth={7 * s} strokeLinecap="round" />
      )}
      <Sheen finish={d.finish} x={cx - topW / 2} y={y + lidH} w={topW} h={bh - lidH} />
    </g>
  );
}

function Front({ d }: { d: Design }) {
  if (d.archetype === "lamp") return <LampFront d={d} />;
  if (d.archetype === "tumbler") return <TumblerFront d={d} />;
  return <SpeakerFront d={d} />;
}

// ---- specialized speaker views -------------------------------------------
function SpeakerExploded({ d }: { d: Design }) {
  const layers = [
    { label: "Grille / mesh", c: d.features.metalGrille ? "#9a9fa4" : shade(d.shell, -0.4), yy: 40 },
    { label: "Front shell", c: d.shell, yy: 92 },
    { label: "Driver + radiator", c: "#2f3430", yy: 150 },
    { label: "Battery + PCBA", c: "#3a4d3a", yy: 208 },
    { label: "Rear housing", c: shade(d.shell, -0.12), yy: 258 },
  ];
  return (
    <g>
      <line x1={200} y1={30} x2={200} y2={272} stroke={STROKE} strokeDasharray="4 5" strokeOpacity={0.4} />
      {layers.map((l) => (
        <g key={l.label}>
          <rect x={130} y={l.yy - 12} width={140} height={24} rx={12} fill={l.c} stroke={STROKE} strokeWidth={1.6} />
          <line x1={272} y1={l.yy} x2={300} y2={l.yy} stroke={STROKE} strokeOpacity={0.5} />
          <text x={304} y={l.yy + 3} fontSize={9} fontFamily="monospace" fill="#4a4a44">{l.label}</text>
        </g>
      ))}
    </g>
  );
}

function SpeakerInternal({ d }: { d: Design }) {
  return (
    <g>
      <rect x={110} y={104} width={180} height={92} rx={26} fill={shade(d.shell, 0.28)} stroke={STROKE} strokeWidth={2} />
      {/* driver */}
      {[26, 20, 12, 5].map((r, i) => (
        <circle key={r} cx={158} cy={150} r={r} fill="none" stroke="#3a3f3a" strokeWidth={i === 0 ? 2 : 1} opacity={0.8} />
      ))}
      <circle cx={158} cy={150} r={3} fill="#3a3f3a" />
      {/* passive radiator */}
      {[22, 15, 8].map((r) => (
        <circle key={`p${r}`} cx={244} cy={150} r={r} fill="none" stroke="#6a7a5a" strokeDasharray="3 3" strokeWidth={1.2} />
      ))}
      {/* battery */}
      <rect x={128} y={168} width={60} height={18} rx={4} fill="#4a5d3f" stroke={STROKE} strokeWidth={1.2} />
      <text x={132} y={181} fontSize={8} fontFamily="monospace" fill="#e7e0cd">3.6Ah</text>
      {/* PCBA */}
      <rect x={212} y={112} width={40} height={22} rx={3} fill="#243b28" stroke={STROKE} strokeWidth={1} />
      <text x={216} y={126} fontSize={8} fontFamily="monospace" fill="#9fd39f">PCBA</text>
      <text x={200} y={214} fontSize={9} fontFamily="monospace" fill="#4a4a44" textAnchor="middle">CUTAWAY · INTERNAL COMPONENTS</text>
    </g>
  );
}

// ---- generic overlays -----------------------------------------------------
function DimensionView({ d }: { d: Design }) {
  const r = readouts(d);
  return (
    <g>
      <g opacity={0.95}>
        <Front d={d} />
      </g>
      <g stroke="#8a6f2e" strokeWidth={1} fill="#8a6f2e" fontFamily="monospace" fontSize={9}>
        <line x1={70} y1={40} x2={70} y2={260} />
        <line x1={65} y1={40} x2={75} y2={40} />
        <line x1={65} y1={260} x2={75} y2={260} />
        <text x={34} y={153}>{r.h}mm</text>
        <line x1={90} y1={278} x2={310} y2={278} />
        <line x1={90} y1={273} x2={90} y2={283} />
        <line x1={310} y1={273} x2={310} y2={283} />
        <text x={175} y={293}>{r.w}mm</text>
        <text x={318} y={70} fillOpacity={0.85}>D {r.depth}mm</text>
        <text x={318} y={84} fillOpacity={0.85}>{r.weight}g</text>
      </g>
    </g>
  );
}

function MaterialView({ d }: { d: Design }) {
  const chips = [
    { label: d.material, c: d.shell, y: 70 },
    { label: `${d.finish} finish`, c: shade(d.shell, 0.14), y: 150 },
    { label: "Bumper / trim", c: d.accent, y: 230 },
  ];
  return (
    <g>
      <Front d={d} />
      {chips.map((ch) => (
        <g key={ch.label}>
          <line x1={200} y1={150} x2={330} y2={ch.y} stroke={STROKE} strokeOpacity={0.35} />
          <rect x={318} y={ch.y - 12} width={70} height={24} rx={6} fill="#fff" stroke={STROKE} strokeWidth={1} />
          <rect x={322} y={ch.y - 8} width={16} height={16} rx={3} fill={ch.c} stroke={STROKE} strokeWidth={0.8} />
          <text x={342} y={ch.y + 3} fontSize={7.5} fontFamily="monospace" fill="#3a3a34">{ch.label.slice(0, 12)}</text>
        </g>
      ))}
    </g>
  );
}

function PackagingView({ d }: { d: Design }) {
  return (
    <g>
      {/* iso box */}
      <polygon points="120,120 240,120 280,90 160,90" fill="#d8ccae" stroke={STROKE} strokeWidth={1.6} />
      <polygon points="240,120 280,90 280,220 240,250" fill="#c3b591" stroke={STROKE} strokeWidth={1.6} />
      <rect x={120} y={120} width={120} height={130} fill="#e6dcc0" stroke={STROKE} strokeWidth={1.6} />
      {/* printed silhouette */}
      <g transform="translate(-20,20) scale(0.6)">
        <Front d={d} />
      </g>
      <rect x={132} y={224} width={96} height={16} rx={3} fill="#fff" stroke={STROKE} strokeWidth={0.8} />
      <text x={138} y={236} fontSize={8} fontFamily="monospace" fill="#3a3a34">{BASE[d.archetype].name.toUpperCase().slice(0, 18)}</text>
      {/* recyclable stamp */}
      <g transform="translate(258,110)">
        <circle r={16} fill="none" stroke="#5b7a3f" strokeWidth={1.4} />
        <text y={3} textAnchor="middle" fontSize={6.5} fontFamily="monospace" fill="#5b7a3f">100%</text>
        <text y={11} textAnchor="middle" fontSize={5} fontFamily="monospace" fill="#5b7a3f">RECYCLE</text>
      </g>
    </g>
  );
}

// ===========================================================================
// Public canvas
// ===========================================================================
export function ProductCanvasSVG({ design, view, className }: { design: Design; view: string; className?: string }) {
  let content: React.ReactNode;
  if (view === "exploded" && design.archetype === "speaker") content = <SpeakerExploded d={design} />;
  else if (view === "internal" && design.archetype === "speaker") content = <SpeakerInternal d={design} />;
  else if (view === "dimension") content = <DimensionView d={design} />;
  else if (view === "material") content = <MaterialView d={design} />;
  else if (view === "packaging") content = <PackagingView d={design} />;
  else content = <Front d={design} />;

  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-card blueprint", className)}>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        {content}
      </svg>
      <div className="absolute left-3 top-3 mono-label text-khaki">{VIEWS[design.archetype].find((v) => v.key === view)?.label ?? "Front"} View</div>
      <div className="absolute bottom-3 right-3 rounded bg-foreground/70 px-2 py-1 mono-label text-[0.6rem] text-primary-foreground">
        DEMO · LIVE CONCEPT
      </div>
    </div>
  );
}

export function viewsFor(archetype: Archetype) {
  return VIEWS[archetype];
}
