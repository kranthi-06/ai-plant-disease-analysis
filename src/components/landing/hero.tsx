import Link from "next/link";
import { ArrowRight, BadgeCheck, Droplets, ShieldCheck, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";

const metrics = [
  { label: "Structured diagnosis", value: "10+" },
  { label: "Explainability overlays", value: "Real-time" },
  { label: "Deployment target", value: "Vercel-ready" }
];

export function HeroSection() {
  return (
    <section className="section-grid items-center py-12 lg:py-16">
      <Reveal className="space-y-8 lg:col-span-7">
        <span className="eyebrow">Precision Crop Diagnostics</span>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            AI disease detection designed like a premium agricultural intelligence platform.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Capture or upload plant imagery, run explainable disease analysis, and receive a structured treatment
            report that farmers, field teams, and agronomists can act on immediately.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/scan"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-glow transition hover:translate-y-[-2px]"
          >
            Launch Scan Studio
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="inline-flex h-14 items-center justify-center rounded-full border border-border/70 bg-white/55 px-6 text-base font-semibold backdrop-blur dark:bg-white/5"
          >
            Explore architecture
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <GlassCard key={metric.label} className="rounded-[24px] p-5">
              <p className="text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{metric.label}</p>
            </GlassCard>
          ))}
        </div>
      </Reveal>

      <Reveal className="lg:col-span-5" delay={0.12}>
        <GlassCard className="relative overflow-hidden rounded-[32px] p-0">
          <div className="absolute inset-0 bg-orchard opacity-70" />
          <div className="relative space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between rounded-[24px] border border-white/35 bg-white/70 p-4 dark:bg-white/10">
              <div>
                <p className="text-sm text-muted-foreground">Latest scan</p>
                <p className="text-2xl font-semibold">Tomato late blight</p>
              </div>
              <div className="rounded-full bg-danger/10 px-3 py-1 text-sm font-semibold text-danger">High risk</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="rounded-[24px] bg-white/75 p-5 dark:bg-white/10">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-semibold">92%</p>
                  </div>
                </div>
                <div className="mt-4 h-3 rounded-full bg-primary/10">
                  <div className="h-3 rounded-full bg-primary" style={{ width: "92%" }} />
                </div>
              </GlassCard>

              <GlassCard className="rounded-[24px] bg-white/75 p-5 dark:bg-white/10">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-warning/10 p-3 text-warning">
                    <Droplets className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">Moisture stress</p>
                    <p className="text-2xl font-semibold">68%</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Field humidity and lesion spread suggest urgent canopy management.</p>
              </GlassCard>
            </div>

            <GlassCard className="rounded-[28px] bg-white/75 p-6 dark:bg-white/10">
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: BadgeCheck, text: "Visual symptom extraction" },
                  { icon: ShieldCheck, text: "Actionable treatment playbook" },
                  { icon: Sparkles, text: "Explainable hotspot overlays" }
                ].map((item) => (
                  <div
                    key={item.text}
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Detect", "Interpret", "Treat"].map((step, index) => (
                  <div key={step} className="rounded-2xl bg-background/90 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stage 0{index + 1}</p>
                    <p className="mt-2 text-lg font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

