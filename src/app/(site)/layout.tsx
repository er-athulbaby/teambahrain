import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/analytics/Analytics";
import { getTickerItems } from "@/lib/data/home";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tickerItems = await getTickerItems();

  return (
    <>
      <Analytics />
      <Header />
      <Ticker items={tickerItems} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
