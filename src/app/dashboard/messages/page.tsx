"use client";

import * as React from "react";
import {
  Send,
  Paperclip,
  ImageIcon,
  FileText,
  Ruler,
  ClipboardCheck,
  Truck,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TechLabel } from "@/components/ui/section";
import { cn } from "@/lib/utils";

type Attachment = {
  kind: "image" | "doc" | "drawing" | "sample" | "shipping";
  name: string;
};

type Message = {
  id: string;
  from: "me" | "them";
  author: string;
  time: string;
  body: string;
  attachments?: Attachment[];
};

type Thread = {
  id: string;
  name: string;
  role: string;
  product: string;
  unread: number;
  preview: string;
  messages: Message[];
};

const THREADS: Thread[] = [
  {
    id: "apex",
    name: "Apex Precision (Demo)",
    role: "Manufacturer · Shenzhen",
    product: "Trailhead Rugged Speaker",
    unread: 2,
    preview: "Updated tooling drawing attached for your review.",
    messages: [
      {
        id: "m1",
        from: "them",
        author: "Apex Precision",
        time: "Mon 09:12",
        body: "Thanks for approving the material spec. We've started first-article tooling and will share DFM notes shortly.",
      },
      {
        id: "m2",
        from: "me",
        author: "You",
        time: "Mon 09:40",
        body: "Great. Can you confirm the TPU shore hardness on the bumper and share the updated drawing?",
      },
      {
        id: "m3",
        from: "them",
        author: "Apex Precision",
        time: "Mon 14:05",
        body: "Confirmed shore 60A on the bumper. Updated drawing and a driver sample report are attached.",
        attachments: [
          { kind: "drawing", name: "bumper_rev_C.dwg" },
          { kind: "sample", name: "driver_sample_report.pdf" },
        ],
      },
      {
        id: "m4",
        from: "them",
        author: "Apex Precision",
        time: "Mon 14:06",
        body: "Also sharing progress photos of the tooling in the CNC bay.",
        attachments: [{ kind: "image", name: "tooling_progress.jpg" }],
      },
    ],
  },
  {
    id: "lonestar",
    name: "Lone Star Prototyping (Demo)",
    role: "Manufacturer · Austin, TX",
    product: "Trailhead Rugged Speaker",
    unread: 0,
    preview: "Prototype shipped — tracking attached.",
    messages: [
      {
        id: "m1",
        from: "them",
        author: "Lone Star",
        time: "Fri 11:20",
        body: "Your pilot prototype passed our bench QC. Quality notes and photos attached.",
        attachments: [
          { kind: "sample", name: "qc_notes_pilot.pdf" },
          { kind: "image", name: "proto_front.jpg" },
        ],
      },
      {
        id: "m2",
        from: "me",
        author: "You",
        time: "Fri 12:02",
        body: "Looks excellent. Please ship to the studio address on file.",
      },
      {
        id: "m3",
        from: "them",
        author: "Lone Star",
        time: "Fri 16:30",
        body: "Shipped via overnight. Shipping info attached below.",
        attachments: [{ kind: "shipping", name: "shipment_1042.pdf" }],
      },
    ],
  },
  {
    id: "molde",
    name: "Molde Norte (Demo)",
    role: "Manufacturer · Monterrey",
    product: "Trailhead Rugged Speaker",
    unread: 1,
    preview: "Nearshore quote assumptions clarified.",
    messages: [
      {
        id: "m1",
        from: "them",
        author: "Molde Norte",
        time: "Tue 08:15",
        body: "Following up on our quote — happy to clarify the 500-unit run assumptions and scaling path.",
      },
      {
        id: "m2",
        from: "me",
        author: "You",
        time: "Tue 09:00",
        body: "Thanks. What's the lead time delta if we move to 1,000 units?",
      },
    ],
  },
];

const ATTACH_META: Record<
  Attachment["kind"],
  { icon: typeof ImageIcon; label: string; cls: string }
> = {
  image: { icon: ImageIcon, label: "Image", cls: "text-emerald-300" },
  doc: { icon: FileText, label: "Document", cls: "text-khaki" },
  drawing: { icon: Ruler, label: "Drawing", cls: "text-mustard" },
  sample: { icon: ClipboardCheck, label: "Sample report", cls: "text-emerald-300" },
  shipping: { icon: Truck, label: "Shipping", cls: "text-khaki" },
};

function AttachmentChip({ a }: { a: Attachment }) {
  const m = ATTACH_META[a.kind];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-forest-deep/60 px-2 py-1 text-xs">
      <m.icon className={cn("size-3.5", m.cls)} />
      <span className="font-medium">{a.name}</span>
      <span className="text-[0.65rem] text-muted-foreground">{m.label}</span>
    </span>
  );
}

export default function MessagesPage() {
  const [activeId, setActiveId] = React.useState(THREADS[0].id);
  const [drafts, setDrafts] = React.useState<Record<string, Message[]>>({});
  const [input, setInput] = React.useState("");

  const active = THREADS.find((t) => t.id === activeId)!;
  const messages = [...active.messages, ...(drafts[activeId] ?? [])];

  function send() {
    if (!input.trim()) return;
    const msg: Message = {
      id: `local-${Date.now()}`,
      from: "me",
      author: "You",
      time: "Just now",
      body: input.trim(),
    };
    setDrafts((d) => ({ ...d, [activeId]: [...(d[activeId] ?? []), msg] }));
    setInput("");
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <TechLabel className="mb-3">Messages</TechLabel>
        <h1 className="text-3xl font-bold tracking-tight">Manufacturer inbox</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exchange messages, images, drawings, sample reports, quality notes, and
          shipping info. All threads are demo conversations.
        </p>
      </div>

      <Card className="grid grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <div className="border-b border-border md:border-b-0 md:border-r">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search conversations" className="pl-8" />
            </div>
          </div>
          <ul className="max-h-[240px] overflow-y-auto md:max-h-[560px]">
            {THREADS.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors",
                    activeId === t.id
                      ? "bg-secondary/60"
                      : "hover:bg-secondary/30"
                  )}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-mustard">
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      {t.unread > 0 && (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mustard text-[0.65rem] font-bold text-forest-deep">
                          {t.unread}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.preview}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Thread view */}
        <div className="flex min-h-[420px] flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <p className="font-semibold">{active.name}</p>
              <p className="text-xs text-muted-foreground">
                {active.role} · {active.product}
              </p>
            </div>
            <Badge variant="muted">Demo thread</Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-1",
                  m.from === "me" ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg border px-3.5 py-2.5 text-sm",
                    m.from === "me"
                      ? "border-mustard/30 bg-mustard/10"
                      : "border-border bg-forest-deep/50"
                  )}
                >
                  <p className="mb-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    {m.author} · {m.time}
                  </p>
                  <p className="text-foreground/90">{m.body}</p>
                  {m.attachments && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.attachments.map((a) => (
                        <AttachmentChip key={a.name} a={a} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" aria-label="Attach">
                <Paperclip className="size-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
                placeholder="Write a message… (demo — stays local)"
              />
              <Button type="button" onClick={send} size="icon" aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
