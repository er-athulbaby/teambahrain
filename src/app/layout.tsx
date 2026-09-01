import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen flex flex-col bg-ground text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
