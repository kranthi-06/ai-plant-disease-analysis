import { GlassCard } from "@/components/shared/glass-card";

export function SkeletonDashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <GlassCard className="rounded-[32px] p-6">
        <div className="skeleton-shimmer h-64 rounded-[24px]" />
      </GlassCard>
      <div className="grid gap-6">
        <GlassCard className="rounded-[32px] p-6">
          <div className="skeleton-shimmer h-8 w-1/2 rounded-full" />
          <div className="mt-4 space-y-3">
            <div className="skeleton-shimmer h-4 rounded-full" />
            <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
          </div>
        </GlassCard>
        <GlassCard className="rounded-[32px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="skeleton-shimmer h-28 rounded-[24px]" />
            <div className="skeleton-shimmer h-28 rounded-[24px]" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
