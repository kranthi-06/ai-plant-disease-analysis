import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";

import "@/app/globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Verdant AI | Plant Disease Detection Platform",
  description:
    "Premium plant disease detection web application with explainable diagnosis dashboards, structured treatment guidance, and Vercel-ready architecture.",
  applicationName: "Verdant AI",
  keywords: [
    "plant disease detection",
    "agritech",
    "crop analysis",
    "leaf disease AI",
    "Next.js plant scanner"
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2b6b47"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="app-shell">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              classNames: {
                toast: "glass-panel !border-border/70 !bg-background/95",
                title: "!text-foreground",
                description: "!text-muted-foreground"
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
