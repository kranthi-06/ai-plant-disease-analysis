import { Bot, Camera, ChartColumnBig, Languages, ShieldPlus, Waves } from "lucide-react";

import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const features = [
  {
    icon: Camera,
    title: "Mobile-first image intake",
    description: "Drag and drop, upload from gallery, or capture fresh leaf imagery with the device camera."
  },
  {
    icon: Bot,
    title: "Model-ready inference layer",
    description: "Local knowledge engine today, remote or fine-tuned vision model tomorrow without changing the UI contract."
  },
  {
    icon: ChartColumnBig,
    title: "Structured diagnosis reports",
    description: "Every scan returns disease, confidence, severity, symptom explanation, treatment options, and guided next steps."
  },
  {
    icon: Waves,
    title: "Explainable AI overlays",
    description: "Hotspot mapping surfaces the regions driving the diagnosis to build trust with field operators."
  },
  {
    icon: ShieldPlus,
    title: "Operationally safe defaults",
    description: "Graceful fallbacks, validation, error handling, and Vercel-ready serverless APIs keep the system dependable."
  },
  {
    icon: Languages,
    title: "Expansion-ready product surface",
    description: "The experience is ready for multilingual content, saved accounts, and voice-assisted readouts."
  }
];

export function FeatureGrid() {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow="Why it stands out"
        title="Built like an agritech product, not a classroom demo"
        description="The platform combines premium product design with a clean architecture that can scale from a demo-ready local engine to a production AI service."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.04}>
            <GlassCard className="h-full rounded-[28px] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

