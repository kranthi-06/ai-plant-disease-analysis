import type { RiskLevel, SeverityLevel } from "@/types/diagnosis";

import { cn } from "@/lib/utils";

const riskStyles: Record<RiskLevel, string> = {
  Low: "border-primary/20 bg-primary/10 text-primary",
  Moderate: "border-secondary/25 bg-secondary/15 text-foreground",
  Elevated: "border-warning/20 bg-warning/15 text-warning",
  Critical: "border-danger/20 bg-danger/10 text-danger"
};

const severityStyles: Record<SeverityLevel, string> = {
  Low: "border-primary/20 bg-primary/10 text-primary",
  Medium: "border-secondary/25 bg-secondary/15 text-foreground",
  High: "border-danger/20 bg-danger/10 text-danger"
};

export function RiskPill({
  value,
  kind = "risk"
}: {
  value: RiskLevel | SeverityLevel;
  kind?: "risk" | "severity";
}) {
  const styles = kind === "risk" ? riskStyles[value as RiskLevel] : severityStyles[value as SeverityLevel];
  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-sm font-semibold", styles)}>{value}</span>;
}

