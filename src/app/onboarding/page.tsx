"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  MessagesSquare,
  Package,
  Users,
  Target,
  Ruler,
  Tag,
  Layers,
  Upload,
  FileText,
  CalendarClock,
  Sparkles,
  Globe,
  Wallet,
  Lightbulb,
  Rocket,
} from "lucide-react";

import { useAuth } from "@/lib/auth/context";
import { categories } from "@/lib/mock/categories";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Answer model                                                       */
/* ------------------------------------------------------------------ */

interface Answers {
  idea: string;
  category: string;
  audience: string;
  problem: string;
  size: string;
  price: number;
  quantity: string;
  hasAssets: string;
  startingPoint: string;
  timeline: string;
  support: string[];
  manufacturing: string;
  budget: string;
}

const initialAnswers: Answers = {
  idea: "",
  category: "",
  audience: "",
  problem: "",
  size: "",
  price: 49,
  quantity: "",
  hasAssets: "",
  startingPoint: "",
  timeline: "",
  support: [],
  manufacturing: "",
  budget: "",
};

const SIZES = [
  "Pocket",
  "Handheld",
  "Backpack",
  "Tabletop",
  "Furniture-scale",
  "Custom",
];
const QUANTITIES = [
  "1 prototype",
  "10",
  "25",
  "50",
  "100",
  "250",
  "500",
  "1000+",
];
const TIMELINES = ["ASAP", "3 months", "6 months", "12 months", "Flexible"];
const SUPPORT = [
  "Branding",
  "Packaging",
  "Ecommerce",
  "Marketing",
  "Photography",
  "Fulfillment",
];
const BUDGETS = [
  "Under $2k",
  "$2k – $10k",
  "$10k – $50k",
  "$50k – $150k",
  "$150k+",
  "Not sure yet",
];

interface StepDef {
  key: keyof Answers | "review";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  question: string;
  hint: string;
}

const STEPS: StepDef[] = [
  {
    key: "idea",
    label: "The Idea",
    icon: Package,
    question: "What would you like to create?",
    hint: "Plain language is perfect — no CAD or engineering background required.",
  },
  {
    key: "category",
    label: "Category",
    icon: Layers,
    question: "What kind of product is it?",
    hint: "Pick the closest category. We use it to match materials and manufacturers.",
  },
  {
    key: "audience",
    label: "Audience",
    icon: Users,
    question: "Who is the product for?",
    hint: "The person or team who will actually use it.",
  },
  {
    key: "problem",
    label: "Problem",
    icon: Target,
    question: "What problem does it solve?",
    hint: "The clearer the problem, the stronger the concept we can generate.",
  },
  {
    key: "size",
    label: "Size",
    icon: Ruler,
    question: "What size should it be?",
    hint: "A rough scale is enough — we refine exact dimensions later.",
  },
  {
    key: "price",
    label: "Retail Price",
    icon: Tag,
    question: "What should it sell for?",
    hint: "Your target retail price. This anchors material and cost decisions.",
  },
  {
    key: "quantity",
    label: "Quantity",
    icon: Layers,
    question: "What's your initial production quantity?",
    hint: "Start small to validate, or scale straight into a production run.",
  },
  {
    key: "hasAssets",
    label: "References",
    icon: Upload,
    question: "Do you have sketches, photos, CAD, or reference products?",
    hint: "Anything visual helps — but it's completely optional to start.",
  },
  {
    key: "startingPoint",
    label: "Starting Point",
    icon: FileText,
    question: "Are you starting with an idea or with specifications?",
    hint: "Either is fine. It just changes where the conversation begins.",
  },
  {
    key: "timeline",
    label: "Timeline",
    icon: CalendarClock,
    question: "What's your desired launch timeline?",
    hint: "An estimate — we'll build a realistic plan around it.",
  },
  {
    key: "support",
    label: "Support",
    icon: Sparkles,
    question: "Do you need branding, packaging, or launch support?",
    hint: "Select everything that applies, or skip if you're focused on the product.",
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    icon: Globe,
    question: "US manufacturing, overseas, or either?",
    hint: "This shapes which manufacturers we surface for you.",
  },
  {
    key: "budget",
    label: "Budget",
    icon: Wallet,
    question: "What's your approximate budget?",
    hint: "A rough range keeps recommendations grounded in reality.",
  },
  {
    key: "review",
    label: "Review",
    icon: Check,
    question: "Here's your brief",
    hint: "Review your answers, then step into the Studio to start designing.",
  },
];

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function OptionButton({
  selected,
  onClick,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm font-medium transition-all",
        selected
          ? "border-mustard bg-mustard/10 text-foreground shadow-[0_0_0_1px_rgba(193,165,72,0.4)]"
          : "border-border bg-charcoal/40 text-khaki hover:border-olive hover:bg-secondary/30 hover:text-foreground",
        className
      )}
    >
      {children}
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-mustard bg-mustard text-forest-deep"
            : "border-border text-transparent"
        )}
      >
        <Check className="h-3 w-3" />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>(initialAnswers);

  const total = STEPS.length;
  const current = STEPS[step];
  const isReview = current.key === "review";
  const progress = Math.round(((step + 1) / total) * 100);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, total - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleSupport = (item: string) =>
    setAnswers((a) => ({
      ...a,
      support: a.support.includes(item)
        ? a.support.filter((s) => s !== item)
        : [...a.support, item],
    }));

  const firstName = user?.name?.split(" ")[0];

  /* ---- per-step body -------------------------------------------- */
  function renderBody() {
    switch (current.key) {
      case "idea":
        return (
          <Textarea
            autoFocus
            rows={5}
            value={answers.idea}
            onChange={(e) => set("idea", e.target.value)}
            placeholder="e.g. A rugged, refillable field notebook with a built-in modular pen and weatherproof cover…"
            className="text-base"
          />
        );

      case "category":
        return (
          <div className="max-h-[46vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((cat) => {
                const active = answers.category === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => set("category", cat.slug)}
                    className={cn(
                      "flex flex-col gap-1 rounded-md border p-3 text-left transition-all",
                      active
                        ? "border-mustard bg-mustard/10 shadow-[0_0_0_1px_rgba(193,165,72,0.4)]"
                        : "border-border bg-charcoal/40 hover:border-olive hover:bg-secondary/30"
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {cat.name}
                      </span>
                      {active && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-mustard" />
                      )}
                    </span>
                    {cat.regulated && (
                      <Badge variant="warning" className="w-fit">
                        Regulated
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case "audience":
        return (
          <Input
            autoFocus
            value={answers.audience}
            onChange={(e) => set("audience", e.target.value)}
            placeholder="e.g. Backcountry hikers and field researchers"
            className="h-12 text-base"
          />
        );

      case "problem":
        return (
          <Textarea
            autoFocus
            rows={4}
            value={answers.problem}
            onChange={(e) => set("problem", e.target.value)}
            placeholder="e.g. Paper notebooks fall apart in wet, rough conditions and pens always go missing…"
            className="text-base"
          />
        );

      case "size":
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SIZES.map((s) => (
              <OptionButton
                key={s}
                selected={answers.size === s}
                onClick={() => set("size", s)}
              >
                {s}
              </OptionButton>
            ))}
          </div>
        );

      case "price":
        return (
          <div className="rounded-lg border border-border bg-charcoal/40 p-6">
            <div className="flex items-baseline justify-between">
              <span className="mono-label text-khaki/50">Target retail</span>
              <span className="text-3xl font-bold text-mustard tabular-nums">
                ${answers.price}
                {answers.price >= 500 && "+"}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={answers.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="mt-6 w-full accent-mustard"
              aria-label="Target retail price"
            />
            <div className="mt-2 flex justify-between text-xs text-khaki/40">
              <span>$5</span>
              <span>$500+</span>
            </div>
          </div>
        );

      case "quantity":
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUANTITIES.map((q) => (
              <OptionButton
                key={q}
                selected={answers.quantity === q}
                onClick={() => set("quantity", q)}
              >
                {q}
              </OptionButton>
            ))}
          </div>
        );

      case "hasAssets":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {["Yes, I have some", "Not yet"].map((opt) => (
                <OptionButton
                  key={opt}
                  selected={answers.hasAssets === opt}
                  onClick={() => set("hasAssets", opt)}
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
            {answers.hasAssets === "Yes, I have some" && (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-olive/60 bg-charcoal/30 px-6 py-10 text-center transition-colors hover:border-mustard hover:bg-secondary/20">
                <Upload className="h-6 w-6 text-mustard" />
                <span className="text-sm font-medium text-foreground">
                  Drop sketches, photos, or CAD files
                </span>
                <span className="mono-label text-khaki/40">
                  Upload enabled inside the Studio
                </span>
                <input type="file" multiple className="hidden" disabled />
              </label>
            )}
          </div>
        );

      case "startingPoint":
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              {
                v: "Just an idea",
                icon: Lightbulb,
                d: "Start from a blank canvas and shape it conversationally.",
              },
              {
                v: "I have specifications",
                icon: FileText,
                d: "Bring dimensions, materials, or requirements you already know.",
              },
            ].map(({ v, icon: Icon, d }) => {
              const active = answers.startingPoint === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("startingPoint", v)}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border p-5 text-left transition-all",
                    active
                      ? "border-mustard bg-mustard/10 shadow-[0_0_0_1px_rgba(193,165,72,0.4)]"
                      : "border-border bg-charcoal/40 hover:border-olive hover:bg-secondary/30"
                  )}
                >
                  <Icon className="h-5 w-5 text-mustard" />
                  <span className="font-semibold text-foreground">{v}</span>
                  <span className="text-sm text-khaki/70">{d}</span>
                </button>
              );
            })}
          </div>
        );

      case "timeline":
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TIMELINES.map((t) => (
              <OptionButton
                key={t}
                selected={answers.timeline === t}
                onClick={() => set("timeline", t)}
              >
                {t}
              </OptionButton>
            ))}
          </div>
        );

      case "support":
        return (
          <div className="flex flex-wrap gap-2">
            {SUPPORT.map((item) => {
              const active = answers.support.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSupport(item)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    active
                      ? "border-mustard bg-mustard/15 text-foreground"
                      : "border-border bg-charcoal/40 text-khaki hover:border-olive hover:text-foreground"
                  )}
                >
                  {active && <Check className="h-3.5 w-3.5 text-mustard" />}
                  {item}
                </button>
              );
            })}
          </div>
        );

      case "manufacturing":
        return (
          <div className="grid gap-2 sm:grid-cols-3">
            {["US manufacturing", "Overseas", "Either"].map((m) => (
              <OptionButton
                key={m}
                selected={answers.manufacturing === m}
                onClick={() => set("manufacturing", m)}
              >
                {m}
              </OptionButton>
            ))}
          </div>
        );

      case "budget":
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUDGETS.map((b) => (
              <OptionButton
                key={b}
                selected={answers.budget === b}
                onClick={() => set("budget", b)}
              >
                {b}
              </OptionButton>
            ))}
          </div>
        );

      case "review":
        return <ReviewSummary answers={answers} onEdit={setStep} />;

      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-forest">
      {/* Slim top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-forest/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6">
          <Link href="/" aria-label="Da Xing Xing home">
            <Wordmark />
          </Link>

          <div className="mx-auto hidden w-full max-w-xs flex-col gap-1.5 sm:flex">
            <div className="flex items-center justify-between">
              <span className="mono-label text-khaki/50">
                {isReview ? "Final review" : `Step ${step + 1} of ${total - 1}`}
              </span>
              <span className="mono-label text-mustard">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-mustard transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-khaki/60 transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit to dashboard</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-40" />

        <div
          key={step}
          className="relative w-full max-w-2xl animate-fade-up"
        >
          {step === 0 && firstName && (
            <p className="mb-4 text-center text-sm text-khaki/60">
              Welcome, {firstName}. Let's frame your product in a few quick
              questions.
            </p>
          )}

          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-military/30 text-mustard">
              <current.icon className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {current.question}
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {current.hint}
            </p>
          </div>

          <div className="mb-8">{renderBody()}</div>

          {/* Footer controls */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={back}
              disabled={step === 0}
              className={cn(step === 0 && "invisible")}
            >
              <ArrowLeft />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {!isReview && (
                <button
                  type="button"
                  onClick={next}
                  className="text-sm text-khaki/50 transition-colors hover:text-foreground"
                >
                  Skip
                </button>
              )}

              {isReview ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => router.push("/studio")}
                >
                  <Rocket />
                  Enter the Studio
                </Button>
              ) : (
                <Button type="button" size="lg" onClick={next}>
                  Next
                  <ArrowRight />
                </Button>
              )}
            </div>
          </div>

          {/* Conversational escape hatch */}
          {!isReview && (
            <div className="mt-10 flex justify-center">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-charcoal/40 px-4 py-2 text-sm text-khaki/70 transition-colors hover:border-olive hover:text-foreground"
              >
                <MessagesSquare className="h-4 w-4 text-mustard" />
                Rather just talk it through? Design conversationally in the
                Studio
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review summary                                                     */
/* ------------------------------------------------------------------ */

function ReviewSummary({
  answers,
  onEdit,
}: {
  answers: Answers;
  onEdit: (step: number) => void;
}) {
  const categoryName =
    categories.find((c) => c.slug === answers.category)?.name || null;

  const rows: { label: string; value: string | null; step: number }[] = [
    { label: "Idea", value: answers.idea || null, step: 0 },
    { label: "Category", value: categoryName, step: 1 },
    { label: "Audience", value: answers.audience || null, step: 2 },
    { label: "Problem", value: answers.problem || null, step: 3 },
    { label: "Size", value: answers.size || null, step: 4 },
    { label: "Target retail", value: `$${answers.price}`, step: 5 },
    { label: "Quantity", value: answers.quantity || null, step: 6 },
    { label: "References", value: answers.hasAssets || null, step: 7 },
    { label: "Starting point", value: answers.startingPoint || null, step: 8 },
    { label: "Timeline", value: answers.timeline || null, step: 9 },
    {
      label: "Support",
      value: answers.support.length ? answers.support.join(", ") : null,
      step: 10,
    },
    { label: "Manufacturing", value: answers.manufacturing || null, step: 11 },
    { label: "Budget", value: answers.budget || null, step: 12 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-charcoal/40">
      <dl className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="group flex items-start gap-4 px-5 py-3.5"
          >
            <dt className="mono-label w-32 shrink-0 pt-0.5 text-khaki/50">
              {row.label}
            </dt>
            <dd className="flex-1 text-sm text-foreground">
              {row.value ?? (
                <span className="italic text-khaki/30">Skipped</span>
              )}
            </dd>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="text-xs text-khaki/40 opacity-0 transition-opacity hover:text-mustard group-hover:opacity-100"
            >
              Edit
            </button>
          </div>
        ))}
      </dl>
      <p className="border-t border-border bg-forest-deep/50 px-5 py-3 text-xs leading-relaxed text-khaki/40">
        This brief seeds your first AI concept. Everything stays editable — you
        can refine every detail conversationally inside the Studio.
      </p>
    </div>
  );
}
