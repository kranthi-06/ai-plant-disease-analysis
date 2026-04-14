import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/20 py-10">
      <PageShell className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">Verdant AI</p>
          <p className="text-sm text-muted-foreground">
            Production-ready plant disease intelligence built for modern agricultural workflows.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="transition hover:text-foreground">
            System design
          </Link>
          <Link href="/history" className="transition hover:text-foreground">
            Analysis history
          </Link>
          <Link href="/scan" className="transition hover:text-foreground">
            Run a scan
          </Link>
        </div>
      </PageShell>
    </footer>
  );
}

