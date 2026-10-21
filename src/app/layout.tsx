import type { Metadata } from "next";
import { connection } from "next/server";
import { Geist, Geist_Mono } from "next/font/google";
import { brandConfig } from "@/config/brand";
import { Footer, SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "empowerBiz — Good business grows together",
    template: "%s · empowerBiz",
  },
  description: "Discover thoughtful finds from independent Kenyan shops, or bring your own business online.",
  applicationName: brandConfig.name,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <html lang="en-KE" data-scroll-behavior="smooth" className={geistSans.variable + " " + geistMono.variable + " h-full antialiased"}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="site-main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
