"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Zap, Factory, ShieldCheck } from "lucide-react";

import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

const DEMO_EMAIL = "founder@daxingxing.demo";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [pending, setPending] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    setPending("form");
    signIn(values.email);
    router.push("/dashboard");
  };

  const demoFounder = () => {
    setPending("demo");
    signIn(DEMO_EMAIL);
    router.push("/dashboard");
  };

  const asManufacturer = () => {
    signIn("ops@demo-factory.com", "manufacturer");
    router.push("/manufacturer");
  };

  const asAdmin = () => {
    signIn("admin@daxingxing.demo", "admin");
    router.push("/admin");
  };

  const busy = pending !== null || isSubmitting;

  return (
    <div className="animate-fade-up">
      <Badge variant="warning" className="mb-6">
        <span className="h-1.5 w-1.5 animate-pulse-status rounded-full bg-mustard" />
        Demo Access
      </Badge>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-2 text-muted-foreground">
        Sign in to your workspace to keep building.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-300">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="mono-label text-khaki/40">optional in demo</span>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-300">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {pending === "form" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="mono-label text-khaki/40">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={demoFounder}
        disabled={busy}
      >
        {pending === "demo" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Zap className="text-mustard" />
            Continue as demo founder
          </>
        )}
      </Button>

      <div className="mt-6 rounded-md border border-border bg-charcoal/40 p-4">
        <p className="mono-label mb-3 text-khaki/50">Sign in as another role</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={asManufacturer}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm text-khaki transition-colors hover:text-mustard disabled:opacity-50"
          >
            <Factory className="h-3.5 w-3.5" />
            Manufacturer
          </button>
          <span className="text-border">·</span>
          <button
            type="button"
            onClick={asAdmin}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm text-khaki transition-colors hover:text-mustard disabled:opacity-50"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        New to Da Xing Xing?{" "}
        <Link
          href="/register"
          className="font-semibold text-mustard underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-6 text-xs leading-relaxed text-khaki/40">
        Demo authentication — no real backend or password check. Your session
        is stored locally in this browser. Supabase-ready for production.
      </p>
    </div>
  );
}
