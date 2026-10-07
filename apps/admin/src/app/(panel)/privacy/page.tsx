import { PolicyEditor } from "@/components/PolicyEditor";
import { policyPlaceholder } from "@/lib/mock-data";

export default function PrivacyPage() {
  return <PolicyEditor title="Privacy Policy" initialText={policyPlaceholder} />;
}
