import Link from "next/link";
import { ApeMark, Wordmark } from "@/components/brand/logo";
import { ShieldCheck, Factory, Sparkles } from "lucide-react";

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Vetted manufacturing network",
    body: "Every profile is a labeled demo today — the real network is verified, rated, and audited.",
  },
  {
    icon: Factory,
    title: "Idea to production run",
    body: "Concept, specification, prototype, and global distribution in one continuous workflow.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-forest">
      {/* Top-left link home */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 transition-opacity hover:opacity-80 lg:left-8 lg:top-8"
        aria-label="Back to Da Xing Xing home"
      >
        <Wordmark />
      </Link>

      {/* Left — form column */}
      <div className="flex w-full flex-col justify-center px-6 py-24 sm:px-10 lg:w-[46%] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>

      {/* Right — branded panel (hidden on mobile) */}
      <div className="relative hidden overflow-hidden border-l border-border bg-forest-deep lg:flex lg:w-[54%]">
        <div className="blueprint absolute inset-0 opacity-70" aria-hidden />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(120% 80% at 80% 10%, rgba(193,165,72,0.14), transparent 55%), radial-gradient(90% 70% at 10% 100%, rgba(52,74,50,0.5), transparent 60%)",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-14 xl:p-20">
          <div className="flex items-center gap-3">
            <span className="mono-label text-khaki/60">Secure Access</span>
            <span className="h-px flex-1 bg-border" />
            <span className="mono-label text-khaki/40">DXX-01</span>
          </div>

          <div className="max-w-xl">
            <ApeMark className="h-14 w-14 text-mustard" />
            <h2 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight text-foreground xl:text-5xl">
              Describe it.
              <br />
              Design it.
              <br />
              <span className="text-mustard">Build it.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-khaki/80">
              Turn a rough physical-product idea into a production-ready
              design, prototype, and launch — guided end to end by AI and a
              vetted manufacturing network.
            </p>

            <div className="mt-12 space-y-6">
              {trustPoints.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-military/30 text-mustard">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-khaki/70">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-khaki/50">
            <Sparkles className="h-4 w-4 text-mustard/70" />
            <span className="mono-label">
              Idea → Product → Market
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
