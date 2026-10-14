"use client";

import { useParams } from "next/navigation";
import { ProfileOverview } from "@/components/profile/ProfileOverview";

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <ProfileOverview userId={id} />;
}
