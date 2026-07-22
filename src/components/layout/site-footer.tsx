import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Create", href: "/studio" },
      { label: "Product Categories", href: "/categories" },
      { label: "Material Library", href: "/materials" },
      { label: "Manufacturers", href: "/manufacturers" },
      { label: "Cost Calculator", href: "/cost-calculator" },
    ],
  },
  {
    title: "Grow",
    links: [
      { label: "Launch Studio", href: "/launch" },
      { label: "Distribution", href: "/distribution" },
      { label: "Pricing", href: "/pricing" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Resources", href: "/resources" },
      { label: "Contact", href: "/contact" },
      { label: "Manufacturer Portal", href: "/manufacturer" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-forest-deep">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Wordmark showTagline />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            From imagination to a real product in the market. AI-powered product
            creation, manufacturing, launch, and global distribution.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mono-label mb-4 text-khaki/70">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/70 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Da Xing Xing (大猩猩). All rights reserved.</p>
          <p className="max-w-xl text-pretty">
            Estimates, sample data, and demo manufacturer profiles are for
            illustration only. Compliance, cost, and timelines must be verified
            by qualified professionals.
          </p>
        </div>
      </div>
    </footer>
  );
}
