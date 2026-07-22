"use client";

import * as React from "react";
import {
  User,
  CreditCard,
  SlidersHorizontal,
  Check,
  Info,
  Star,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { TechLabel } from "@/components/ui/section";
import { subscriptionTiers } from "@/lib/mock/packages";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "billing", label: "Subscription & billing", icon: CreditCard },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CURRENT_TIER = "company";

export default function AccountPage() {
  const [tab, setTab] = React.useState<TabId>("profile");
  const [prefs, setPrefs] = React.useState({
    email: true,
    productUpdates: true,
    manufacturerMessages: true,
    weeklyDigest: false,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <TechLabel className="mb-3">Account</TechLabel>
        <h1 className="text-3xl font-bold tracking-tight">Account & billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, subscription, and preferences. Demo account.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-mustard text-mustard"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Demo — changes are not persisted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" defaultValue="Demo Founder" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="demo@daxingxing.co" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Demo Studio" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Founder" />
                </div>
              </div>
              <Button type="button">Save changes</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-mustard">
                DF
              </div>
              <div>
                <p className="font-semibold">Demo Founder</p>
                <p className="text-xs text-muted-foreground">
                  demo@daxingxing.co
                </p>
              </div>
              <Badge variant="warning">Company plan</Badge>
              <Button type="button" variant="outline" size="sm">
                Change avatar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing */}
      {tab === "billing" && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-md border border-mustard/30 bg-mustard/5 px-4 py-3 text-xs text-foreground/90">
            <Info className="mt-0.5 size-4 shrink-0 text-mustard" />
            <p>
              Stripe billing is <strong>architected but not live</strong> in this
              demo. Plan selection, payment methods, and invoices below are
              sample placeholders.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Current subscription</CardTitle>
              <CardDescription>
                You are on the Company plan (demo).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                {subscriptionTiers.map((t) => {
                  const current = t.id === CURRENT_TIER;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "flex flex-col rounded-lg border p-4",
                        current
                          ? "border-mustard bg-mustard/5"
                          : "border-border bg-forest-deep/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{t.name}</p>
                        {t.featured && (
                          <Star className="size-3.5 text-mustard" />
                        )}
                      </div>
                      <p className="mt-1 text-2xl font-bold">
                        {t.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          {t.cadence}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t.forWho}
                      </p>
                      <ul className="mt-3 flex-1 space-y-1">
                        {t.features.slice(0, 4).map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-1.5 text-xs text-foreground/85"
                          >
                            <Check className="mt-0.5 size-3 shrink-0 text-emerald-400" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3">
                        {current ? (
                          <Badge variant="warning" className="w-full justify-center">
                            Current plan
                          </Badge>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {t.price === "Custom" ? "Contact sales" : "Select"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Manage subscription — plan changes route through Stripe once the
                integration is enabled. Not active in this demo.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment method</CardTitle>
                <CardDescription>Placeholder · Stripe not live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 rounded-md border border-border bg-forest-deep/40 px-4 py-3">
                  <CreditCard className="size-5 text-mustard" />
                  <div>
                    <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-xs text-muted-foreground">
                      Demo card · exp 12/29
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Update payment method
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Billing history</CardTitle>
                <CardDescription>Sample invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { d: "Jul 1, 2026", a: "$199.00", s: "Paid" },
                  { d: "Jun 1, 2026", a: "$199.00", s: "Paid" },
                  { d: "May 1, 2026", a: "$199.00", s: "Paid" },
                ].map((r) => (
                  <div
                    key={r.d}
                    className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2 text-sm"
                  >
                    <span>{r.d}</span>
                    <span className="tabular-nums">{r.a}</span>
                    <Badge variant="success">{r.s}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Preferences */}
      {tab === "preferences" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account preferences</CardTitle>
            <CardDescription>Notification and workspace settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { key: "email", label: "Email notifications", d: "Receive account and security emails." },
              { key: "productUpdates", label: "Product updates", d: "Alerts when a product's stage or status changes." },
              { key: "manufacturerMessages", label: "Manufacturer messages", d: "Notify me when a manufacturer replies." },
              { key: "weeklyDigest", label: "Weekly digest", d: "A Monday summary of activity across products." },
            ].map((p) => {
              const active = prefs[p.key as keyof typeof prefs];
              return (
                <div
                  key={p.key}
                  className="flex items-center justify-between border-b border-border/50 py-3 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.d}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs((s) => ({
                        ...s,
                        [p.key]: !s[p.key as keyof typeof prefs],
                      }))
                    }
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      active ? "bg-mustard" : "bg-muted"
                    )}
                    aria-pressed={active}
                    aria-label={p.label}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-forest-deep transition-transform",
                        active ? "translate-x-[22px]" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Account, billing, and subscription details shown are demo/sample data.
        No real charges are processed.
      </p>
    </div>
  );
}
