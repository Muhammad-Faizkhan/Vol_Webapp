import { notFound } from "next/navigation";
import { getUser } from "@/lib/mock-data";
import { UserDetail, type UserTab } from "./UserDetail";

const tabs: UserTab[] = ["profile", "workspaces", "classrooms"];

export default async function UserDetailPage({ params, searchParams }: PageProps<"/users/[id]">) {
  const { id } = await params;
  const { tab } = await searchParams;
  const user = getUser(id);
  if (!user) notFound();

  const activeTab = tabs.find((t) => t === tab) ?? "profile";
  return <UserDetail user={user} tab={activeTab} />;
}
