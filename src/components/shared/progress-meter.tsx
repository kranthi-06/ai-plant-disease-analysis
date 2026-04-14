import { cn, formatConfidence, toPercent } from "@/lib/utils";

export function ProgressMeter({
  value,
  label,
  className
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-muted-foreground">{label ?? "Confidence"}</span>
        <span>{formatConfidence(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-primary/10">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
          style={{ width: `${toPercent(value)}%` }}
        />
      </div>
    </div>
  );
}

