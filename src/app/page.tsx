import { PageShell } from "@/components/layout/page-shell";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { HeroSection } from "@/components/landing/hero";
import { ShowcaseSection } from "@/components/landing/showcase";
import { WorkflowSection } from "@/components/landing/workflow";

export default function HomePage() {
  return (
    <PageShell className="space-y-24 pb-20 pt-8 sm:pt-10">
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <ShowcaseSection />
    </PageShell>
  );
}

