import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "SSF TKMCE · Faith, Knowledge & Community",
    template: "%s · SSF TKMCE",
  },
  description:
    "SSF TKMCE at TKM College of Engineering, Kollam — a unified campus community bringing together English dialogue, Malayalam heritage, and classical Arabic learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
