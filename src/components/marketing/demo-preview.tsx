import {
  Ruler,
  Layers,
  Weight,
  Palette,
  Cpu,
  BatteryCharging,
  Droplets,
  SlidersHorizontal,
  Factory,
  DollarSign,
} from "lucide-react";
import { ProductRender } from "@/components/product/product-render";

const specs = [
  { icon: Ruler, label: "Dimensions", value: "210 × 96 × 78 mm" },
  { icon: Layers, label: "Suggested materials", value: "Recycled ABS shell · TPU bumper" },
  { icon: Weight, label: "Estimated weight", value: "620 g" },
  { icon: Palette, label: "Color options", value: "Forest · Sand · Charcoal" },
  { icon: Cpu, label: "Components", value: "5W driver · BT 5.3 · passive radiator" },
  { icon: BatteryCharging, label: "Battery", value: "3,600 mAh · ~14 hr runtime" },
  { icon: Droplets, label: "Water resistance", value: "IPX5 target (light rain)" },
  { icon: SlidersHorizontal, label: "Control layout", value: "Power · Vol ± · Pair · USB-C" },
  { icon: Factory, label: "Manufacturing", value: "Injection molding + assembly" },
  { icon: DollarSign, label: "Est. unit cost", value: "$24 – $34" },
];

export function DemoPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-forest-deep shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border bg-charcoal px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-earth" />
          <span className="size-2.5 rounded-full bg-olive" />
          <span className="size-2.5 rounded-full bg-mustard" />
        </div>
        <span className="mono-label ml-2 text-khaki/60">
          Product Creation Studio · Live Demo
        </span>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
        {/* Conversation */}
        <div className="space-y-4 border-b border-border p-5 md:border-b-0 md:border-r">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-secondary px-4 py-3 text-sm leading-relaxed">
            I want to create a rugged rechargeable Bluetooth speaker for outdoor
            use. It should fit in a backpack, survive light rain, have a carrying
            strap, and feel premium but affordable.
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Cpu className="size-4" />
            </div>
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-border bg-forest px-4 py-3 text-sm leading-relaxed text-foreground/90">
              Great starting point. I&apos;ve generated an initial direction: a
              backpack-sized speaker with a recycled-ABS shell, TPU corner
              bumpers, an IPX5 splash target, and a webbing carry strap. Below is
              the first-pass specification — everything here is an{" "}
              <span className="text-mustard">estimate</span> until we confirm
              volume and materials. Want tool-free assembly, or is a metal grille
              acceptable?
            </div>
          </div>
        </div>

        {/* Generated spec */}
        <div className="p-5">
          <ProductRender seed="#344A32" label="AI Concept" className="mb-4" />
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s.label} className="bg-forest p-3">
                <div className="flex items-center gap-1.5 text-khaki/70">
                  <s.icon className="size-3.5" />
                  <span className="mono-label text-[0.6rem]">{s.label}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
