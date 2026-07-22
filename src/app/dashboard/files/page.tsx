import {
  Upload,
  Box,
  FileText,
  ImageIcon,
  Ruler,
  ClipboardCheck,
  Lock,
  Users,
  ShieldCheck,
  Droplet,
  Download,
  History,
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
import { TechLabel } from "@/components/ui/section";

export const metadata = { title: "Files · Da Xing Xing" };

type Access = "Private" | "Team" | "Manufacturer-approved";

type FileRow = {
  name: string;
  type: "CAD" | "Spec PDF" | "Render" | "Drawing" | "Quality report";
  version: string;
  size: string;
  owner: string;
  access: Access;
  watermarked: boolean;
};

const FILE_META = {
  CAD: { icon: Box, cls: "text-mustard" },
  "Spec PDF": { icon: FileText, cls: "text-khaki" },
  Render: { icon: ImageIcon, cls: "text-emerald-300" },
  Drawing: { icon: Ruler, cls: "text-mustard" },
  "Quality report": { icon: ClipboardCheck, cls: "text-emerald-300" },
};

const ACCESS_META: Record<
  Access,
  { icon: typeof Lock; variant: "muted" | "olive" | "warning" }
> = {
  Private: { icon: Lock, variant: "muted" },
  Team: { icon: Users, variant: "olive" },
  "Manufacturer-approved": { icon: ShieldCheck, variant: "warning" },
};

const FILES: FileRow[] = [
  { name: "trailhead_housing_v4.step", type: "CAD", version: "v4", size: "8.2 MB", owner: "Demo Founder", access: "Manufacturer-approved", watermarked: false },
  { name: "trailhead_spec.pdf", type: "Spec PDF", version: "v0.4", size: "1.1 MB", owner: "Demo Founder", access: "Team", watermarked: true },
  { name: "front_render_hero.png", type: "Render", version: "v3", size: "3.4 MB", owner: "AI Studio", access: "Private", watermarked: true },
  { name: "bumper_rev_C.dwg", type: "Drawing", version: "rev C", size: "640 KB", owner: "Apex Precision (Demo)", access: "Manufacturer-approved", watermarked: false },
  { name: "driver_sample_report.pdf", type: "Quality report", version: "v1", size: "820 KB", owner: "Apex Precision (Demo)", access: "Team", watermarked: false },
  { name: "exploded_view.png", type: "Render", version: "v2", size: "2.7 MB", owner: "AI Studio", access: "Private", watermarked: true },
  { name: "packaging_dieline.pdf", type: "Spec PDF", version: "v0.2", size: "980 KB", owner: "Demo Founder", access: "Team", watermarked: true },
  { name: "qc_notes_pilot.pdf", type: "Quality report", version: "v1", size: "1.3 MB", owner: "Lone Star (Demo)", access: "Manufacturer-approved", watermarked: false },
];

const AUDIT = [
  { who: "Apex Precision (Demo)", what: "Uploaded bumper_rev_C.dwg", when: "Mon 14:05" },
  { who: "Demo Founder", what: "Set front_render_hero.png to Private + watermark", when: "Mon 10:22" },
  { who: "AI Studio", what: "Generated exploded_view.png v2", when: "Sun 18:40" },
  { who: "Demo Founder", what: "Granted manufacturer access to CAD package", when: "Fri 09:15" },
  { who: "Lone Star (Demo)", what: "Downloaded trailhead_spec.pdf (watermarked)", when: "Thu 16:02" },
];

export default function FilesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <TechLabel className="mb-3">Files</TechLabel>
          <h1 className="text-3xl font-bold tracking-tight">Project files</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Private by default. Role-based access, NDA gating, watermarking, and
            download controls. All files are demo data.
          </p>
        </div>
        <Button type="button">
          <Upload className="size-4" /> Upload file
        </Button>
      </div>

      {/* Access policy banner */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { icon: Lock, t: "Private by default", d: "New files are visible only to you until you share them." },
          { icon: ShieldCheck, t: "NDA-gated sharing", d: "Manufacturer access requires an accepted NDA in this workspace." },
          { icon: Droplet, t: "Watermark + download control", d: "Sensitive files are watermarked and can be view-only." },
        ].map((p) => (
          <div
            key={p.t}
            className="flex items-start gap-2 rounded-md border border-border bg-forest-deep/40 px-3 py-2.5"
          >
            <p.icon className="mt-0.5 size-4 shrink-0 text-mustard" />
            <div>
              <p className="text-xs font-semibold">{p.t}</p>
              <p className="text-xs text-muted-foreground">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* File table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All files</CardTitle>
            <CardDescription>{FILES.length} items · demo</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Name", "Version", "Size", "Owner", "Access", "Marks", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="mono-label whitespace-nowrap px-4 py-3 text-khaki/70"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {FILES.map((f) => {
                    const fm = FILE_META[f.type];
                    const am = ACCESS_META[f.access];
                    return (
                      <tr
                        key={f.name}
                        className="border-b border-border/60 last:border-0 hover:bg-secondary/20"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <fm.icon className={`size-4 shrink-0 ${fm.cls}`} />
                            <div>
                              <p className="font-medium">{f.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {f.type}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {f.version}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                          {f.size}
                        </td>
                        <td className="px-4 py-3 text-xs">{f.owner}</td>
                        <td className="px-4 py-3">
                          <Badge variant={am.variant}>
                            <am.icon className="size-3" /> {f.access}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {f.watermarked ? (
                            <span
                              className="inline-flex items-center gap-1 text-xs text-mustard"
                              title="Watermarked"
                            >
                              <Droplet className="size-3.5" /> WM
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label="Download"
                          >
                            <Download className="size-4" />
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

        {/* Audit trail */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <History className="size-4 text-mustard" /> Audit trail
            </CardTitle>
            <CardDescription className="text-xs">
              Revision & access history · demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {AUDIT.map((a, i) => (
                <li key={i} className="border-l border-border pl-3">
                  <p className="text-sm text-foreground/90">{a.what}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.who} · {a.when}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-4 rounded-md border border-border bg-forest-deep/40 p-3 text-xs text-muted-foreground">
              Downloads of watermarked or view-only files are logged. Access can
              be revoked at any time from file settings.
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        Files, owners, and access records are demo/sample data for illustration.
      </p>
    </div>
  );
}
