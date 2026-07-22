import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Manufacturer Portal",
  description:
    "Demo manufacturer portal — manage capabilities, opportunities, quotes, and production orders on Da Xing Xing.",
};

const NAV = [
  { label: "Overview", href: "#overview" },
  { label: "Opportunities", href: "#opportunities" },
  { label: "Quotes", href: "#quotes" },
  { label: "Orders", href: "#orders" },
  { label: "Profile", href: "#profile" },
];

export default function ManufacturerLayout({
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
            <span className="mono-label hidden text-khaki/70 sm:inline">
              Manufacturer Portal
            </span>
            <Badge variant="warning" className="hidden md:inline-flex">
              Demo
            </Badge>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back to site</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>Da Xing Xing · Manufacturer Portal</span>
          <span className="mono-label text-khaki/50">
            Demo environment — sample data only
          </span>
        </div>
      </footer>
    </div>
  );
}
