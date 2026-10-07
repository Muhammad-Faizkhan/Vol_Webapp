import { PolicyEditor } from "@/components/PolicyEditor";
import { policyPlaceholder } from "@/lib/mock-data";

export default function TermsPage() {
  return <PolicyEditor title="Terms & Conditions" initialText={policyPlaceholder} />;
}
