export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-auto bg-[#111]">
      {children}
    </div>
  );
}
