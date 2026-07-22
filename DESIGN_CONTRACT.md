# Da Xing Xing — Build Contract (for page authors)

You are building pages inside an existing Next.js 14 App Router + TypeScript + Tailwind project.
The shared foundation ALREADY EXISTS. **Do not modify shared files.** Only create the page/component files assigned to you. Import from the shared modules below.

## Path alias

`@/*` → `src/*`

## Brand & visual language

Premium military-industrial. Dark by default. Backgrounds: `bg-forest` (#17251D), `bg-forest-deep`, `bg-charcoal`. Text: `text-foreground` (bone). Accent: `mustard` (#C1A548) used SPARINGLY for primary actions/active states/status. Greens: `military`, `olive`, `khaki`, `sand`, `earth`.

Use: strong typography, spacious layout, subtle grid lines (`className="blueprint"` for blueprint grid bg), monospace technical labels (`className="mono-label"`), dimensional markers, material swatches, manufacturing-status indicators. Avoid generic-AI-startup or cheap-marketplace look. Always label estimates/sample/demo data clearly.

## Available shared components (import these — they exist)

```tsx
import { Button } from "@/components/ui/button";            // variants: default|secondary|outline|ghost|destructive|link ; sizes: default|sm|lg|icon
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";              // variants: default|secondary|outline|olive|success|warning|danger|muted
import { Input, Textarea, Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";        // <Progress value={62} />
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { ApeMark, Wordmark } from "@/components/brand/logo";
import { ProductRender } from "@/components/product/product-render"; // <ProductRender seed="#344A32" label="Front View" />
import { cn, formatCurrency, formatRange, slugify } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";               // { user, loading, signIn, signOut }
```

Icons: `lucide-react` (e.g. `import { ArrowRight } from "lucide-react"`).

## Available mock data (import — do not redefine)

```tsx
import { categories } from "@/lib/mock/categories";        // ProductCategory[] {name,slug,blurb,regulated,regulationNote}
import { materials, materialGroups } from "@/lib/mock/materials"; // Material[]
import { manufacturers } from "@/lib/mock/manufacturers";  // Manufacturer[] (all demo:true)
import { products, featuredProduct } from "@/lib/mock/products"; // ProductProject[]
import { servicePackages, subscriptionTiers, howItWorks } from "@/lib/mock/packages";
import { quotes } from "@/lib/mock/quotes";                 // Quote[]
import { getAiProvider } from "@/lib/ai/provider";          // mock design chat
```

Types are in `@/types`. Read those files if you need exact field names — DO run `Read` on the mock/type files before using fields.

## Rules

- `"use client"` only when using state/effects/hooks/onClick. Marketing content pages should be server components where possible.
- Pages under `src/app/(marketing)/*` automatically get the site header/footer from the marketing layout — do NOT add header/footer yourself.
- Pages under `src/app/dashboard/*` are wrapped by a dashboard layout that renders `<DashboardShell>` — do NOT add the shell yourself.
- Every page: export default function, add `export const metadata = { title: "..." }` for server components.
- Responsive: use container, grid, flex; mobile-first. Wide tables get `overflow-x-auto`.
- Keep it real and polished — no lorem ipsum. Use the mock data and the product spec content.
- Add clear disclaimers where the spec requires (estimates, compliance, demo profiles, no legal/engineering guarantees).
