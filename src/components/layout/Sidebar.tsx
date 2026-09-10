"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/discover", label: "Feed", icon: "feed" },
  { href: "/workspaces", label: "Workspaces", icon: "workspaces" },
  { href: "/explore", label: "Explore", icon: "explore" },
  { href: "/classrooms", label: "Classrooms", icon: "classrooms" },
  { href: "/business/dashboard", label: "Products", icon: "products" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-[1080px] w-[400px] shrink-0 bg-auth-navy">
      <div className="absolute left-[50px] top-[50px] flex size-[120px] items-center justify-center rounded-full bg-white/15 text-2xl text-white">
        Logo
      </div>

      <nav className="absolute left-10 top-[218px] flex w-[320px] flex-col gap-1 px-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 ${
                active
                  ? "rounded-br-lg rounded-tr-lg bg-white/90 text-auth-navy"
                  : "rounded-lg text-white"
              }`}
            >
              <Image
                src={`/icons/nav/${item.icon}${active ? "-active" : ""}.svg`}
                alt=""
                width={40}
                height={40}
              />
              <span className="text-xl font-medium tracking-[0.28px]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/login"
        className="absolute left-10 top-[966px] flex w-[320px] items-center gap-3 rounded-br-lg rounded-tr-lg bg-[#edeff0] px-4 py-3"
      >
        <Image src="/icons/nav/logout.svg" alt="" width={24} height={24} />
        <span className="text-xl font-medium tracking-[0.28px] text-auth-navy">
          Logout
        </span>
      </Link>
    </div>
  );
}
