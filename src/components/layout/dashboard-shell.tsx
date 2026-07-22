"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  MessageSquare,
  FileText,
  ClipboardList,
  Package,
  FolderOpen,
  Users,
  Bell,
  Settings,
  Sparkles,
  LogOut,
  Menu,
} from "lucide-react";
import { Wordmark, ApeMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Products", href: "/dashboard/products", icon: Boxes },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Files", href: "/dashboard/files", icon: FolderOpen },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Account", href: "/dashboard/account", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-forest-deep">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-forest transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Wordmark />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <Button asChild className="mb-3 w-full justify-start">
            <Link href="/studio">
              <Sparkles className="size-4" /> New Product
            </Link>
          </Button>
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-foreground/70 hover:bg-secondary/40 hover:text-foreground"
                )}
              >
                <l.icon className="size-4 shrink-0" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-mustard">
              <ApeMark className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name ?? "Demo Founder"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "demo@daxingxing.co"}
              </p>
            </div>
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="rounded p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-forest/80 px-4 backdrop-blur lg:px-8">
          <button
            className="rounded-md p-2 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <div className="hidden lg:block">
            <span className="mono-label text-khaki/60">Workspace · Demo</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/manufacturers">Find Manufacturers</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/studio">Open Studio</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
