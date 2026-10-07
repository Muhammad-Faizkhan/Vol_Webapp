import { SettingsView } from "./SettingsView";

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const { tab } = await searchParams;
  return <SettingsView tab={(Array.isArray(tab) ? tab[0] : tab) ?? "overview"} />;
}
