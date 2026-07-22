"use client";

import * as React from "react";
import {
  UserPlus,
  Crown,
  ShieldCheck,
  Pencil,
  Eye,
  Building2,
  Check,
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

type Role = "Owner" | "Admin" | "Editor" | "Viewer";

const ROLE_META: Record<
  Role,
  { icon: typeof Crown; variant: "warning" | "default" | "olive" | "muted" }
> = {
  Owner: { icon: Crown, variant: "warning" },
  Admin: { icon: ShieldCheck, variant: "default" },
  Editor: { icon: Pencil, variant: "olive" },
  Viewer: { icon: Eye, variant: "muted" },
};

const MEMBERS: { name: string; email: string; role: Role; status: string }[] = [
  { name: "Demo Founder", email: "demo@daxingxing.co", role: "Owner", status: "Active" },
  { name: "Priya Anand", email: "priya@studio.demo", role: "Admin", status: "Active" },
  { name: "Marcus Vale", email: "marcus@studio.demo", role: "Editor", status: "Active" },
  { name: "Jen Okafor", email: "jen@studio.demo", role: "Editor", status: "Invited" },
  { name: "Sam Reyes", email: "sam@partner.demo", role: "Viewer", status: "Active" },
];

const PERMISSIONS = [
  { role: "Owner" as Role, perms: "Full control · billing, delete workspace, manage all roles." },
  { role: "Admin" as Role, perms: "Manage members, files, manufacturers, and production. No billing deletion." },
  { role: "Editor" as Role, perms: "Edit specs, chat with AI, message manufacturers. No member or billing changes." },
  { role: "Viewer" as Role, perms: "Read-only access to shared products, quotes, and files." },
];

export default function TeamPage() {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("Editor");
  const [invited, setInvited] = React.useState<string[]>([]);

  function invite() {
    if (!email.trim()) return;
    setInvited((v) => [...v, `${email.trim()} · ${role}`]);
    setEmail("");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <TechLabel className="mb-3">Team</TechLabel>
        <h1 className="text-3xl font-bold tracking-tight">Team & permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who can access this workspace. Demo members and invites.
        </p>
      </div>

      {/* Workspace info */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-secondary text-mustard">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Demo Studio Workspace</p>
              <p className="text-xs text-muted-foreground">
                Company plan · {MEMBERS.length} members · 3 active products
              </p>
            </div>
          </div>
          <Badge variant="olive">Demo workspace</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Members table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Members</CardTitle>
            <CardDescription>Roles determine access across the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Member", "Role", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="mono-label px-4 py-3 text-khaki/70"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map((m) => {
                    const rm = ROLE_META[m.role];
                    return (
                      <tr
                        key={m.email}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-mustard">
                              {m.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{m.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {m.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={rm.variant}>
                            <rm.icon className="size-3" /> {m.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              m.status === "Active"
                                ? "text-xs text-emerald-300"
                                : "text-xs text-mustard"
                            }
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={m.role === "Owner"}
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invite form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserPlus className="size-4 text-mustard" /> Invite member
            </CardTitle>
            <CardDescription className="text-xs">
              Demo — invites are stored locally only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="flex h-10 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
            <Button type="button" onClick={invite} className="w-full">
              <UserPlus className="size-4" /> Send invite
            </Button>
            {invited.length > 0 && (
              <div className="space-y-1.5 rounded-md border border-border bg-forest-deep/40 p-3">
                <p className="mono-label text-khaki/70">Pending (demo)</p>
                {invited.map((v, i) => (
                  <p
                    key={i}
                    className="flex items-center gap-1.5 text-xs text-foreground/90"
                  >
                    <Check className="size-3.5 text-emerald-400" /> {v}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role permissions explainer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Role-based permissions</CardTitle>
          <CardDescription>What each role can do in the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PERMISSIONS.map((p) => {
            const rm = ROLE_META[p.role];
            return (
              <div
                key={p.role}
                className="flex items-start gap-3 rounded-md border border-border bg-forest-deep/40 p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-mustard">
                  <rm.icon className="size-4" />
                </div>
                <div>
                  <p className="font-medium">{p.role}</p>
                  <p className="text-xs text-muted-foreground">{p.perms}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Members, roles, and invites shown are demo/sample data for illustration.
      </p>
    </div>
  );
}
