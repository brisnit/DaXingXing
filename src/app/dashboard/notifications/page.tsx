import {
  FileText,
  Wallet,
  FileCheck2,
  Truck,
  ShieldAlert,
  MessageSquare,
  TrendingUp,
  CheckCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TechLabel } from "@/components/ui/section";
import { cn } from "@/lib/utils";

export const metadata = { title: "Notifications · Da Xing Xing" };

type Notif = {
  icon: typeof FileText;
  cls: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const TODAY: Notif[] = [
  {
    icon: FileText,
    cls: "text-mustard",
    title: "New quote received",
    body: "Molde Norte (Demo) submitted a quote for the Trailhead Rugged Speaker.",
    time: "22m ago",
    unread: true,
  },
  {
    icon: Wallet,
    cls: "text-mustard",
    title: "Payment due",
    body: "Prototype deposit of $4,350 is required to release tooling with Apex Precision (Demo).",
    time: "1h ago",
    unread: true,
  },
  {
    icon: FileCheck2,
    cls: "text-emerald-300",
    title: "File awaiting approval",
    body: "bumper_rev_C.dwg was uploaded and needs your sign-off.",
    time: "3h ago",
    unread: true,
  },
  {
    icon: MessageSquare,
    cls: "text-khaki",
    title: "Manufacturer update",
    body: "Apex Precision shared tooling progress photos and a driver sample report.",
    time: "5h ago",
    unread: false,
  },
];

const THIS_WEEK: Notif[] = [
  {
    icon: Truck,
    cls: "text-emerald-300",
    title: "Prototype shipped",
    body: "Lone Star Prototyping (Demo) shipped your pilot prototype — overnight, tracking attached.",
    time: "Fri",
    unread: false,
  },
  {
    icon: ShieldAlert,
    cls: "text-red-300",
    title: "Compliance flag",
    body: "Grove Wooden Building Set flagged for CPSIA & ASTM F963 children's-product testing.",
    time: "Thu",
    unread: false,
  },
  {
    icon: TrendingUp,
    cls: "text-mustard",
    title: "Campaign milestone",
    body: "Preorder demo landing page passed 3,000 visits and 120 preorders.",
    time: "Wed",
    unread: false,
  },
];

function NotifRow({ n }: { n: Notif }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 transition-colors",
        n.unread
          ? "border-mustard/30 bg-mustard/5"
          : "border-border bg-forest-deep/30"
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary/60">
        <n.icon className={cn("size-4", n.cls)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm", n.unread ? "font-semibold" : "font-medium")}>
            {n.title}
          </p>
          {n.unread && <span className="size-2 rounded-full bg-mustard" />}
        </div>
        <p className="text-xs text-muted-foreground">{n.body}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
    </div>
  );
}

export default function NotificationsPage() {
  const unreadCount = [...TODAY, ...THIS_WEEK].filter((n) => n.unread).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <TechLabel className="mb-3">Notifications</TechLabel>
          <h1 className="text-3xl font-bold tracking-tight">Activity feed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount} unread · demo notifications
          </p>
        </div>
        <Button type="button" variant="outline" size="sm">
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold">Today</h2>
          <Badge variant="warning">{TODAY.filter((n) => n.unread).length} new</Badge>
        </div>
        <div className="space-y-2">
          {TODAY.map((n, i) => (
            <NotifRow key={i} n={n} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">This week</h2>
        <div className="space-y-2">
          {THIS_WEEK.map((n, i) => (
            <NotifRow key={i} n={n} />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        All notifications shown are demo/sample data for illustration.
      </p>
    </div>
  );
}
