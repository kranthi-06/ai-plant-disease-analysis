import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start"
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className={cn("max-w-3xl space-y-3", align === "center" && "mx-auto text-center")}>
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="text-base text-muted-foreground sm:text-lg">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

