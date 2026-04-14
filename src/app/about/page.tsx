import { CheckCircle2, Layers3, ShieldCheck, Workflow } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { SectionHeading } from "@/components/shared/section-heading";

const stack = [
  "Next.js App Router with serverless API routes",
  "Tailwind CSS with a custom glassmorphism design system",
  "Framer Motion interactions and skeleton loading states",
  "Pluggable AI runtime with local diagnosis engine and remote model hooks",
  "Local analysis history with easy database migration path"
];

const principles = [
  {
    icon: Layers3,
    title: "Layered architecture",
    text: "Presentation, orchestration, and disease knowledge are split into focused modules so the app stays maintainable as complexity grows."
  },
  {
    icon: Workflow,
    title: "Action-oriented outputs",
    text: "Diagnosis results are shaped into operational cards rather than raw predictions, making the product usable in real agricultural workflows."
  },
  {
    icon: ShieldCheck,
    title: "Production sensibilities",
    text: "Input validation, resilient fallbacks, scalable folder structure, and deployment documentation are included from the start."
  }
];

export default function AboutPage() {
  return (
    <PageShell className="space-y-12 py-10 sm:py-14">
      <SectionHeading
        eyebrow="Platform overview"
        title="Designed for serious AI product delivery"
        description="Verdant AI pairs a premium operator experience with a clean application architecture, allowing the product to launch quickly and still evolve into a more advanced disease intelligence platform."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="rounded-[32px] p-8">
          <h2 className="text-3xl font-semibold">Architecture summary</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            The frontend experience is built on Next.js App Router, while the backend uses a serverless analysis route that preprocesses imagery, evaluates disease candidates, and assembles the structured report contract consumed by the dashboard.
          </p>
          <div className="mt-6 grid gap-4">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-[24px] border border-border/70 bg-background/70 p-5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{principle.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[32px] p-8">
          <h2 className="text-3xl font-semibold">Core stack</h2>
          <div className="mt-6 grid gap-3">
            {stack.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 dark:bg-white/5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm leading-7 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}

