import { PageShell } from "@/components/layout/page-shell";
import { ScanStudio } from "@/components/scan/scan-studio";

export default function ScanPage() {
  return (
    <PageShell className="py-10 sm:py-14">
      <ScanStudio />
    </PageShell>
  );
}

