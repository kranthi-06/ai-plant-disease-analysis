"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ReportDashboard } from "@/components/results/report-dashboard";
import { GlassCard } from "@/components/shared/glass-card";
import { SkeletonDashboard } from "@/components/shared/skeleton-dashboard";
import { getReportById } from "@/lib/history/storage";
import type { DiagnosisReport } from "@/types/diagnosis";

export function ResultClient({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<DiagnosisReport | null | undefined>(undefined);

  useEffect(() => {
    setReport(getReportById(reportId));
  }, [reportId]);

  if (report === undefined) {
    return <SkeletonDashboard />;
  }

  if (!report) {
    return (
      <GlassCard className="rounded-[32px] p-8">
        <p className="eyebrow">Result unavailable</p>
        <h1 className="mt-4 text-4xl font-semibold">We could not find that diagnosis report.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          This usually happens when browser history was cleared or the analysis was generated on another device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/scan" className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
            Run a new scan
          </Link>
          <Link href="/history" className="inline-flex h-12 items-center rounded-full border border-border/70 bg-background/65 px-5 text-sm font-semibold dark:bg-white/5">
            Open history
          </Link>
        </div>
      </GlassCard>
    );
  }

  return <ReportDashboard report={report} />;
}
