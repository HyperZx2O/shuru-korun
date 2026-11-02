import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import AskShuru from "@/components/ask/AskShuru";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import BackToTop from "@/components/ui/BackToTop";

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shuru Korun — শুরু করুন",
  description:
    "Start your business in Bangladesh, step by step. A free guide for first-time founders: documents, offices, fees, timelines, and sources.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${notoBengali.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&display=swap"
          rel="stylesheet"
        />
        <script src="/liquid-glass.js" defer />
      </head>
      <body className="paper min-h-dvh flex flex-col">
        <LocaleProvider>
          <div className="scroll-progress" aria-hidden="true" />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <AskShuru />
          <BackToTop />
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
