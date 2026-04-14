/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, Clock3, Leaf, ShieldAlert, Volume2, VolumeX } from "lucide-react";

import { GlassCard } from "@/components/shared/glass-card";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { RiskPill } from "@/components/shared/risk-pill";
import type { DiagnosisReport } from "@/types/diagnosis";
import { formatConfidence } from "@/lib/utils";

function StatCard({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: string;
  tone?: "default" | "highlight";
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${tone === "highlight" ? "border-primary/25 bg-primary/10" : "border-border/70 bg-background/65 dark:bg-white/5"}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <GlassCard className="rounded-[28px] p-6">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-border/70 bg-background/65 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-white/5">
            {item}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export function ReportDashboard({ report }: { report: DiagnosisReport }) {
  const [speaking, setSpeaking] = useState(false);

  function toggleSpeech() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `${report.diseaseName}. Confidence ${formatConfidence(report.confidence)}. ${report.summary}. Next steps: ${report.nextSteps.join(". ")}`
    );
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <GlassCard className="rounded-[32px] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Detected Disease</p>
              <h1 className="mt-4 text-4xl font-semibold">{report.diseaseName}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{report.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <RiskPill value={report.severity} kind="severity" />
              <RiskPill value={report.riskLevel} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Plant type" value={report.plantType} />
            <StatCard label="Confidence" value={formatConfidence(report.confidence)} tone="highlight" />
            <StatCard label="Model" value={report.model} />
            <StatCard label="Runtime" value={`${report.metrics.processingTimeMs} ms`} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background/70 dark:bg-white/5">
              <div className="relative">
                <img src={report.imagePreview} alt={report.diseaseName} className="aspect-[4/3] w-full object-cover" />
                {report.explainability.regions.map((region) => (
                  <div
                    key={region.id}
                    className="absolute rounded-[18px] border border-danger/60 bg-danger/15 shadow-[0_0_0_1px_rgba(225,82,64,0.18),0_0_28px_rgba(225,82,64,0.32)]"
                    style={{
                      left: `${region.x * 100}%`,
                      top: `${region.y * 100}%`,
                      width: `${region.width * 100}%`,
                      height: `${region.height * 100}%`,
                      opacity: 0.45 + region.intensity * 0.4
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <ProgressMeter value={report.confidence} />
              <ProgressMeter value={report.metrics.lesionCoverage} label="Lesion coverage" />
              <ProgressMeter value={report.metrics.healthyCoverage} label="Healthy tissue" />
              <ProgressMeter value={report.metrics.moistureStress} label="Moisture stress" />
              <div className="rounded-[24px] border border-border/70 bg-background/65 p-5 text-sm leading-7 text-muted-foreground dark:bg-white/5">
                {report.explainability.summary}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard className="rounded-[32px] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Clinical summary</p>
                <h2 className="mt-4 text-3xl font-semibold">Decision overview</h2>
              </div>
              <button
                type="button"
                onClick={toggleSpeech}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-background/65 px-4 text-sm font-semibold dark:bg-white/5"
              >
                {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {speaking ? "Stop voice" : "Speak report"}
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-border/70 bg-background/65 p-5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">Visual summary</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{report.visualSummary}</p>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-background/65 p-5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-warning" />
                  <p className="text-sm font-semibold">Recommended actions</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {report.recommendedActions.map((step) => (
                    <div key={step} className="rounded-2xl bg-background/85 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-background">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-background/65 p-5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold">Model insights</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {report.insights.map((item) => (
                    <div key={item} className="rounded-2xl bg-background/85 px-4 py-3 text-sm leading-7 text-muted-foreground dark:bg-background">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="rounded-[32px] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Report actions</p>
                <h2 className="mt-4 text-3xl font-semibold">Keep working</h2>
              </div>
              <Clock3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href="/scan" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
                Run another scan
              </Link>
              <Link href="/history" className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-background/65 px-5 text-sm font-semibold dark:bg-white/5">
                Open history
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListCard title="Symptoms" items={report.symptoms} />
        <ListCard title="Causes of Disease" items={report.causes} />
        <ListCard title="Preventive Measures" items={report.preventiveMeasures} />
        <ListCard title="Next Steps" items={report.nextSteps} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListCard title="Organic Treatment Plan" items={report.treatments.organic} />
        <ListCard title="Chemical Treatment Plan" items={report.treatments.chemical} />
      </div>

      <GlassCard className="rounded-[32px] p-6 sm:p-8">
        <h2 className="text-3xl font-semibold">Related references</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {report.referenceAssets.map((asset) => (
            <div key={asset.title} className="overflow-hidden rounded-[28px] border border-border/70 bg-background/65 dark:bg-white/5">
              <img src={asset.image} alt={asset.title} className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold">{asset.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{asset.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
