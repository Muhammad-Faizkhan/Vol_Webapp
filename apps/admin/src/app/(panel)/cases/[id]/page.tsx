import { CaseDetail } from "./CaseDetail";

export default async function CaseDetailPage({ params }: PageProps<"/cases/[id]">) {
  const { id } = await params;
  return <CaseDetail id={id} />;
}
