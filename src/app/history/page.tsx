/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { History, Trash2 } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { RiskPill } from "@/components/shared/risk-pill";
import { readHistory, removeReport } from "@/lib/history/storage";
import type { DiagnosisReport } from "@/types/diagnosis";

export default function HistoryPage() {
  const [history, setHistory] = useState<DiagnosisReport[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  return (
    <PageShell className="space-y-8 py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Local analysis history</p>
          <h1 className="mt-4 text-4xl font-semibold">Review recent diagnosis reports.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            History is stored locally in the browser today and can later be upgraded to authenticated cloud persistence.
          </p>
        </div>
        <Link href="/scan" className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          New scan
        </Link>
      </div>

      {history.length === 0 ? (
        <GlassCard className="rounded-[32px] p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold">No scans saved yet</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Run your first analysis to start building a local disease log with thumbnails, confidence, and treatment guidance.
              </p>
            </div>
          </div>
        </GlassCard>
      ) : (
        <div className="grid gap-6">
          {history.map((report) => (
            <GlassCard key={report.id} className="rounded-[32px] p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div className="overflow-hidden rounded-[24px] border border-border/70 bg-background/70 dark:bg-white/5">
                  <img src={report.imagePreview} alt={report.diseaseName} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {formatDistanceToNow(new Date(report.analyzedAt), { addSuffix: true })}
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold">{report.diseaseName}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{report.plantType}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <RiskPill value={report.severity} kind="severity" />
                      <RiskPill value={report.riskLevel} />
                    </div>
                  </div>

                  <ProgressMeter value={report.confidence} />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-border/70 bg-background/65 p-4 dark:bg-white/5">
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="mt-2 font-semibold">{report.source}</p>
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-background/65 p-4 dark:bg-white/5">
                      <p className="text-sm text-muted-foreground">Lesion coverage</p>
                      <p className="mt-2 font-semibold">{Math.round(report.metrics.lesionCoverage * 100)}%</p>
                    </div>
                    <div className="rounded-[24px] border border-border/70 bg-background/65 p-4 dark:bg-white/5">
                      <p className="text-sm text-muted-foreground">Processing time</p>
                      <p className="mt-2 font-semibold">{report.metrics.processingTimeMs} ms</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/results/${report.id}`} className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                      Open report
                    </Link>
                    <button
                      type="button"
                      onClick={() => setHistory(removeReport(report.id))}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-background/65 px-5 text-sm font-semibold dark:bg-white/5"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
