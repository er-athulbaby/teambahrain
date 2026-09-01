import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import { getTickerItems } from "@/lib/data/home";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Team Bahrain — Bahrain Olympic Committee",
  description:
    "The official home of Bahrain's Olympic movement — every athlete, every federation, every result on the road from Aichi–Nagoya to Los Angeles.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tickerItems = await getTickerItems();

  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen flex flex-col bg-ground text-ink">
        <Header />
        <Ticker items={tickerItems} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
