# Da Xing Xing 大猩猩

**AI-powered product creation & manufacturing platform.** Turn a rough physical-product idea into a production-ready design, working prototype, market launch, and global distribution — from one platform.

> **Describe it. Design it. Build it.**

The build runs **fully on mock data with zero configuration** — `npm install && npm run dev`. Supabase, Stripe, and a real AI provider are wired behind swappable seams you enable when ready.

---

## 1. Architecture

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · custom ShadCN-style UI · Supabase (DB/auth/storage/realtime) · Stripe (billing) · AI provider abstraction (Anthropic / OpenAI / mock) · React Hook Form · Zod.

```
src/
  app/
    (marketing)/            # public site — shares SiteHeader + SiteFooter
      page.tsx              # homepage
      how-it-works, categories, materials, manufacturers, manufacturers/[id],
      pricing, launch, distribution, resources, about, contact,
      cost-calculator, preorder
    (auth)/                 # login, register (split-screen shell)
    onboarding/             # guided 13-step product-idea wizard
    studio/                 # Product Creation Studio (4-panel workspace)
    dashboard/              # authenticated app (sidebar shell)
      page, products, products/[id], quotes, messages, orders, files,
      team, notifications, account
    manufacturer/           # manufacturer portal
    admin/                  # admin console
    layout.tsx, globals.css, icon.svg
  components/
    ui/                     # button, card, badge, input, progress, section
    brand/logo.tsx          # ApeMark + Wordmark
    layout/                 # site-header, site-footer, dashboard-shell
    marketing/              # process-flow, demo-preview
    product/product-render  # generated blueprint concept render
  lib/
    utils.ts                # cn, formatCurrency, formatRange, slugify
    mock/                   # categories, materials, manufacturers, products, packages, quotes
    ai/provider.ts          # AiProvider interface + mock + system brief
    supabase/client.ts      # browser client (null until configured)
    stripe/config.ts        # plan → Stripe Price ID mapping
    auth/context.tsx        # demo auth (localStorage), Supabase-ready
  types/index.ts            # domain types mirroring the schema
supabase/schema.sql         # full Postgres schema + RLS
```

**Design principle (WAT-aligned):** probabilistic AI handles reasoning (design conversation, recommendations, feasibility) while deterministic code/data handles execution and record-keeping (the living specification, quotes, orders). Providers (AI, payments, storage, manufacturers) are isolated behind interfaces so they can be replaced later.

### Design system
Military earth-tone spectrum — Deep Forest `#17251D`, Military Green `#344A32`, Olive `#64714A`, Mustard `#C1A548`, Khaki `#C8B98C`, Earth Brown `#594735`, Sand `#E4D8BA`, Charcoal `#1D211E`, Bone `#F3F0E7`. Dark, industrial, blueprint-grid backgrounds, monospace technical labels, dimensional markers. Mustard is used sparingly for primary actions and status. The ape-head mark lives in `src/components/brand/logo.tsx` and `src/app/icon.svg`.

---

## 2. Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

No environment variables are required to run the demo. Copy `.env.example` → `.env.local` only when enabling real services.

---

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/schema.sql` (tables, enums, triggers, RLS, and an auth-user → `profiles` trigger). Or use the CLI:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
3. Copy the project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server only
   ```
4. `src/lib/supabase/client.ts` auto-detects config; until it's set, the app uses the demo auth context and mock data.
5. Projects, files, and quotes are **private by default** via RLS. Extend the representative policies in the schema for team access and manufacturer file gating.

---

## 4. Stripe setup

1. Create products/prices in the [Stripe dashboard](https://dashboard.stripe.com) for the Builder and Company subscriptions and the Prototype package.
2. Put the keys and Price IDs in `.env.local`:
   ```
   STRIPE_SECRET_KEY=...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
   STRIPE_WEBHOOK_SECRET=...
   STRIPE_PRICE_BUILDER=price_...
   STRIPE_PRICE_COMPANY=price_...
   STRIPE_PRICE_PROTOTYPE=price_...
   ```
3. `src/lib/stripe/config.ts` maps plans → Price IDs. Prices/features are **admin-editable** in the product design (see Admin console) and are not hard-coded into business logic.
4. Add a webhook endpoint (checkout, subscription lifecycle, payment intents) when wiring live checkout.

---

## 5. AI provider setup

`src/lib/ai/provider.ts` defines the `AiProvider` interface and ships a deterministic **mock** used by the Studio out of the box. To use a real model:

```
AI_PROVIDER=anthropic        # or openai
ANTHROPIC_API_KEY=...         # or OPENAI_API_KEY
```

Implement `designChat()` for the chosen provider using `AI_SYSTEM_BRIEF` (the "coordinated team" system prompt that enforces: ask focused questions, separate confirmed info from recommendations, flag safety/compliance, require approval before major changes, no unsupported engineering guarantees). Wire it into `getAiProvider()`.

---

## 6. Completed features (MVP)

- Brand identity: geometric ape-head mark, wordmark, favicon, full military earth-tone design system.
- **Homepage** — hero, process flow (Idea → Market), how-it-works, live studio demo preview, service packages, category directory, CTAs.
- Marketing site — How It Works, Product Categories (32, with regulated-category notices), Material Library (searchable/filterable), Manufacturer Marketplace (filterable) + Manufacturer Profile, Pricing (packages + subscription tiers + FAQ), Launch Studio, Distribution, Resources, About, Contact.
- **Cost & Margin Calculator** — interactive, models quantities, landed cost, margins, break-even.
- **Preorder Campaign Builder** — live crowdfunding-style preview.
- **Auth** — login/register with demo auth context (localStorage), Supabase-ready.
- **Guided onboarding** — 13-step product-idea wizard with skip/continue-conversationally.
- **Product Creation Studio** — 4 panels: Product Canvas (9 concept views), Design Conversation (mock AI with approve-before-apply proposed changes + impact analysis), Configuration Panel (accordion sections), living Specification Panel with export buttons.
- **Dashboard** — overview, My Products, Product Detail (living spec + feasibility score), Quotes comparison + AI flags, Messages, Orders (prototype + production trackers), Files (access/watermark/audit), Team, Notifications, Account/Billing.
- **Manufacturer portal** — profile, opportunities, quote submission, orders, staff.
- **Admin console** — users/companies/manufacturers/verification, catalog, quotes/orders/payments/disputes, package & fee configuration, compliance flags, audit log.
- Full **Supabase schema** with 45+ entities, relationships, indexes, timestamps, and RLS.

## 7. Mocked / simulated features

Clearly labeled **DEMO / ESTIMATE / SAMPLE** in-product:
- Manufacturer profiles (all `demo: true` — not real or verified companies).
- Product renders (generated blueprint SVGs, not photography/CAD/3D).
- AI design conversation (deterministic mock — no live model call yet).
- Quotes, prototype/production orders, campaign metrics, dashboard numbers.
- Auth (localStorage session, no real Supabase login yet).
- Stripe checkout (architecture + config mapping only; no live payments).
- Document exports (buttons present; PDF/BOM/RFQ generation not yet implemented).

## 8. Recommended next development phases

1. **Real auth & data** — swap demo auth for Supabase Auth; move mock data to tables; enforce RLS end-to-end.
2. **Live AI** — implement the Anthropic/OpenAI adapters; persist conversation + revision history to `product_versions`.
3. **Stripe checkout & webhooks** — subscriptions, package purchases, deposits, milestone/production payments.
4. **Document generation** — server-side PDF for spec, RFQ, BOM, briefs.
5. **File pipeline** — Supabase Storage, watermarking, NDA-gated manufacturer access, audit trail.
6. **Quote/RFQ realtime** — manufacturer submissions, comparison, and messaging over Supabase Realtime.
7. **3D/CAD** — replace concept renders with a model viewer and CAD import.
8. **Compliance engine** — rules that flag certification needs by category (electronics, batteries, children's products, food-contact, medical) with professional-review disclaimers.
9. **Affordable manufacturing** — shared tooling, group production runs, small-batch matching, financing partners.

---

### Disclaimers
Estimates, sample data, and demo manufacturer profiles are illustrative only. Cost, timelines, feasibility, safety, and compliance must be verified by qualified professionals and accredited testing laboratories. Nothing here constitutes legal or engineering advice.
