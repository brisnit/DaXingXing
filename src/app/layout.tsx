import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";

export const metadata: Metadata = {
  title: {
    default: "Da Xing Xing — Describe it. Design it. Build it.",
    template: "%s · Da Xing Xing",
  },
  description:
    "Da Xing Xing is an AI-powered product creation and manufacturing platform. Turn a rough physical-product idea into a production-ready design, prototype, launch, and global distribution.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
