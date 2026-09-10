import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-white">
      <Sidebar />
      <AppHeader />
      <main className="ml-[400px] mt-[100px] min-h-[calc(100vh-100px)] bg-auth-navy/10 px-[50px] py-10">
        {children}
      </main>
    </div>
  );
}
