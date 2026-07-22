"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Factory,
  LifeBuoy,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Section, SectionHeading, TechLabel } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const interests = [
  "Concept",
  "Prototype",
  "Go to Market",
  "Global Distribution",
  "Manufacturer",
] as const;

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  interest: z.enum(interests, {
    errorMap: () => ({ message: "Select an area of interest." }),
  }),
  message: z.string().min(10, "Tell us a little more (10+ characters)."),
});

type ContactValues = z.infer<typeof contactSchema>;

const contactChannels = [
  {
    icon: Mail,
    title: "Sales & new projects",
    email: "sales@daxingxing.demo",
    body: "Scoping a product, choosing a package, or planning a launch.",
  },
  {
    icon: Factory,
    title: "Manufacturer partnerships",
    email: "partners@daxingxing.demo",
    body: "Factories and suppliers who want to join the network.",
  },
  {
    icon: LifeBuoy,
    title: "Product support",
    email: "support@daxingxing.demo",
    body: "Questions about an active project or your account.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState<ContactValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  const onSubmit = async (values: ContactValues) => {
    // Demo only — no backend. Simulate a short round-trip.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(values);
    reset();
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 blueprint opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mustard/40 to-transparent" />
        <div className="container relative py-20 md:py-28">
          <TechLabel className="mb-6">大猩猩 · Contact</TechLabel>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Let&apos;s talk about{" "}
            <span className="text-primary">what you&apos;re building</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Whether you have a product idea, run a factory, or need a hand with
            an active project, reach out. This is a preview environment, so
            responses here are demonstration only.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* FORM */}
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              {submitted ? (
                <div className="flex flex-col items-start py-8 text-left">
                  <div className="flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold tracking-tight">
                    Message received, {submitted.name.split(" ")[0]}.
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Thanks for reaching out about{" "}
                    <span className="text-foreground">{submitted.interest}</span>
                    . In a live environment our team would follow up at{" "}
                    <span className="text-foreground">{submitted.email}</span>.
                    This is a demo, so no message was actually sent.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button onClick={() => setSubmitted(null)} variant="outline">
                      Send another message
                    </Button>
                    <Button asChild>
                      <a href="/onboarding">
                        Start a Project <ArrowRight className="size-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">
                      Send us a message
                    </h2>
                    <Badge variant="muted">Demo form</Badge>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Jordan Rivera"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-300">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-300">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company (optional)</Label>
                      <Input
                        id="company"
                        placeholder="Acme Goods"
                        {...register("company")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="interest">Area of interest</Label>
                      <select
                        id="interest"
                        defaultValue=""
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring"
                        )}
                        {...register("interest")}
                      >
                        <option value="" disabled>
                          Select an area…
                        </option>
                        {interests.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      {errors.interest && (
                        <p className="text-xs text-red-300">
                          {errors.interest.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us about your product, your factory, or how we can help…"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-300">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending…"
                    ) : (
                      <>
                        Send Message <Send className="size-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Demo only — no data is stored or sent to a server.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          {/* CHANNELS */}
          <div>
            <SectionHeading
              eyebrow="Reach the right team"
              title="Contact channels"
              description="Pick the inbox that fits. All addresses below are demonstration placeholders."
            />
            <div className="mt-8 space-y-4">
              {contactChannels.map((c) => (
                <Card key={c.title}>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-forest-deep text-mustard">
                      <c.icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{c.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {c.body}
                      </p>
                      <p className="mono-label mt-2 text-mustard">{c.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-border bg-forest-deep p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Prefer to just start building? Skip the form and open a project
                — you can describe your idea in plain language and see a concept
                in minutes.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <a href="/onboarding">
                  Start a Project <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
