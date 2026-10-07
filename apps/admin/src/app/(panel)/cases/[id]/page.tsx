import { notFound } from "next/navigation";
import { getCase } from "@/lib/mock-data";
import { CaseDetail } from "./CaseDetail";

export default async function CaseDetailPage({ params }: PageProps<"/cases/[id]">) {
  const { id } = await params;
  const escalation = getCase(id);
  if (!escalation) notFound();
  return <CaseDetail escalation={escalation} />;
}
