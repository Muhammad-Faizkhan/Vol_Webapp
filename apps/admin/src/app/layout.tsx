import type { Metadata } from "next";
import { Inter, Geist, Urbanist } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["500"],
});

// Figma uses Urbanist only for the Sign Out dialog buttons.
const urbanist = Urbanist({
  variable: "--font-urbanist-family",
  subsets: ["latin"],
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "VÔL Admin",
  description: "VÔL Network admin panel",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable} ${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full bg-dak-bg text-dak-heading">{children}</body>
    </html>
  );
}
