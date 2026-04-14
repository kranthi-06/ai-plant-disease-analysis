import Link from "next/link";
import { Leaf, ScanSearch } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan" },
  { href: "/history", label: "History" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-background/80 backdrop-blur-xl">
      <PageShell className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Leaf className="h-6 w-6" />
            </span>
            <div>
              <div className="text-lg font-semibold">Verdant AI</div>
              <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Plant intelligence</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-white/55 p-1 shadow-sm backdrop-blur lg:flex dark:bg-white/5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/scan"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
            >
              <ScanSearch className="h-4 w-4" />
              Analyze Crop
            </Link>
          </div>
        </div>

        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border/70 bg-white/55 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur transition hover:text-foreground dark:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </PageShell>
    </header>
  );
}
