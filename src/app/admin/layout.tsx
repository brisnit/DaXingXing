import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Admin Console",
  description:
    "Demo internal admin console for Da Xing Xing — platform analytics, verification queue, catalog, billing, and audit log.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-forest-deep">
      <header className="sticky top-0 z-40 border-b border-border bg-forest-deep/95 backdrop-blur supports-[backdrop-filter]:bg-forest-deep/80">
        <div className="container flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Da Xing Xing home">
              <Wordmark markClassName="h-7 w-7" />
            </Link>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="mono-label hidden items-center gap-1.5 text-khaki/70 sm:inline-flex">
              <ShieldCheck className="size-3.5 text-mustard" />
              Admin Console
            </span>
            <Badge variant="warning" className="hidden md:inline-flex">
              Demo
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="mono-label hidden text-khaki/50 md:inline">
              Internal / Restricted
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>Da Xing Xing · Admin Console</span>
          <span className="mono-label text-khaki/50">
            Demo environment — all figures & records are sample data
          </span>
        </div>
      </footer>
    </div>
  );
}
