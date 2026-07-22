import { cn } from "@/lib/utils";

/**
 * Generated concept-render placeholder. The MVP uses structured SVG "renders"
 * with blueprint annotations in place of real product photography or 3D output.
 * The architecture is intentionally ready to swap in AI images / CAD later.
 */
export function ProductRender({
  seed = "#344A32",
  label = "Concept Render",
  className,
  annotated = true,
}: {
  seed?: string;
  label?: string;
  className?: string;
  annotated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-forest-deep blueprint",
        className
      )}
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`g-${label}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={seed} stopOpacity="0.95" />
            <stop offset="100%" stopColor={seed} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {/* Product body — an abstract dimensioned object */}
        <rect
          x="120"
          y="95"
          width="160"
          height="110"
          rx="18"
          fill={`url(#g-${label})`}
          stroke="#E4D8BA"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <ellipse cx="160" cy="150" rx="20" ry="20" fill="#0F1913" opacity="0.5" />
        <ellipse cx="240" cy="150" rx="20" ry="20" fill="#0F1913" opacity="0.5" />
        <rect x="185" y="112" width="30" height="6" rx="3" fill="#F3F0E7" opacity="0.5" />
        {annotated && (
          <g stroke="#C1A548" strokeWidth="1" fill="#C1A548" fontSize="9" fontFamily="monospace">
            {/* width dimension */}
            <line x1="120" y1="225" x2="280" y2="225" strokeOpacity="0.7" />
            <line x1="120" y1="220" x2="120" y2="230" strokeOpacity="0.7" />
            <line x1="280" y1="220" x2="280" y2="230" strokeOpacity="0.7" />
            <text x="185" y="240" fillOpacity="0.9">W 210mm</text>
            {/* height dimension */}
            <line x1="95" y1="95" x2="95" y2="205" strokeOpacity="0.7" />
            <line x1="90" y1="95" x2="100" y2="95" strokeOpacity="0.7" />
            <line x1="90" y1="205" x2="100" y2="205" strokeOpacity="0.7" />
            <text x="55" y="153" fillOpacity="0.9">H 96mm</text>
            {/* callout */}
            <circle cx="240" cy="150" r="2" />
            <line x1="240" y1="150" x2="330" y2="90" strokeOpacity="0.5" />
            <text x="300" y="82" fillOpacity="0.8">DRIVER</text>
          </g>
        )}
      </svg>
      <div className="absolute left-3 top-3 mono-label text-khaki/80">{label}</div>
      <div className="absolute bottom-3 right-3 rounded bg-black/40 px-2 py-1 mono-label text-[0.6rem] text-mustard">
        DEMO · AI PLACEHOLDER
      </div>
    </div>
  );
}
