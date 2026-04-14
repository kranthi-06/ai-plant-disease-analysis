import { Activity, GalleryVerticalEnd, ScanSearch } from "lucide-react";

import { GlassCard } from "@/components/shared/glass-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: GalleryVerticalEnd,
    title: "Capture a leaf image",
    text: "Upload a field image or capture one from the live camera feed using touch-friendly controls."
  },
  {
    icon: ScanSearch,
    title: "Run AI analysis",
    text: "The serverless inference route preprocesses the image, scores disease candidates, and assembles a structured response."
  },
  {
    icon: Activity,
    title: "Act with confidence",
    text: "The dashboard visualizes severity, treatment plans, hotspot overlays, and the next actions your team should take."
  }
];

export function WorkflowSection() {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow="Workflow"
        title="A frictionless scan-to-decision path"
        description="The product is optimized for real field usage, where speed, clarity, and confidence matter more than raw predictions alone."
        align="center"
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.08}>
            <GlassCard className="h-full rounded-[28px] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 0{index + 1}</p>
                  <h3 className="text-2xl font-semibold">{step.title}</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{step.text}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

