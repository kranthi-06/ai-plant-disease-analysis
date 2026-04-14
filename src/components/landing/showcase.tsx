import { Cpu, Database, Globe, WandSparkles } from "lucide-react";

import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const pillars = [
  {
    icon: Globe,
    title: "Vercel-native deployment",
    text: "App Router pages, serverless APIs, and edge-friendly payloads keep the app fast across devices."
  },
  {
    icon: Cpu,
    title: "AI abstraction layer",
    text: "Swap the default knowledge engine for a remote vision model or a fine-tuned classifier when you are ready."
  },
  {
    icon: Database,
    title: "History and persistence",
    text: "Analysis records are stored locally today and can be upgraded to a database-backed workspace later."
  },
  {
    icon: WandSparkles,
    title: "Premium diagnosis UX",
    text: "Confidence bars, risk labels, skeleton states, and explainability views create a polished operator experience."
  }
];

export function ShowcaseSection() {
  return (
    <section className="space-y-10 pb-6">
      <SectionHeading
        eyebrow="Architecture"
        title="Cleanly layered for scale"
        description="The codebase separates experience, inference, and domain knowledge so we can evolve each layer independently without breaking the product."
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <GlassCard className="rounded-[32px] p-0">
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {["Frontend Experience", "API Orchestration", "AI Knowledge Layer"].map((item, index) => (
                <div key={item} className="rounded-[24px] bg-background/80 p-5 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Layer 0{index + 1}</p>
                  <p className="mt-3 text-xl font-semibold">{item}</p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {index === 0 &&
                      "Responsive Next.js interfaces, dark mode, motion design, upload studio, results dashboard, and local history."}
                    {index === 1 &&
                      "Validated serverless route, image preprocessing, diagnosis assembly, runtime selection, and resilient error handling."}
                    {index === 2 &&
                      "Disease catalog, feature scoring, explainability regions, treatment intelligence, and model integration hooks."}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        <div className="grid gap-5">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.05}>
              <GlassCard className="rounded-[28px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

