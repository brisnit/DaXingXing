"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2, Check } from "lucide-react";

import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  name: z.string().min(2, "Tell us your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof schema>;

const perks = [
  "Free Concept plan — no card required",
  "AI product concept in minutes",
  "Guided path from idea to prototype",
];

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [pending, setPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    setPending(true);
    signIn(values.email);
    router.push("/onboarding");
  };

  const busy = pending || isSubmitting;

  return (
    <div className="animate-fade-up">
      <Badge variant="warning" className="mb-6">
        <span className="h-1.5 w-1.5 animate-pulse-status rounded-full bg-mustard" />
        Demo Access
      </Badge>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-2 text-muted-foreground">
        Start turning your idea into a real product today.
      </p>

      <ul className="mt-6 space-y-2">
        {perks.map((perk) => (
          <li
            key={perk}
            className="flex items-center gap-2.5 text-sm text-khaki/80"
          >
            <Check className="h-4 w-4 shrink-0 text-mustard" />
            {perk}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jordan Alvarez"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-300">{errors.name.message}</p>
          )}
        </div>

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
            <Label htmlFor="company">Company</Label>
            <span className="mono-label text-khaki/40">optional</span>
          </div>
          <Input
            id="company"
            autoComplete="organization"
            placeholder="Independent, or your brand"
            {...register("company")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-300">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Create account
              <ArrowRight />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-mustard underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-6 text-xs leading-relaxed text-khaki/40">
        Demo authentication — no real backend or password check. Your session
        is stored locally in this browser. Supabase-ready for production.
      </p>
    </div>
  );
}
