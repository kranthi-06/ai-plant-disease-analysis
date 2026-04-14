import { PageShell } from "@/components/layout/page-shell";
import { ResultClient } from "@/components/results/result-client";

export default async function ResultsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageShell className="py-10 sm:py-14">
      <ResultClient reportId={id} />
    </PageShell>
  );
}
