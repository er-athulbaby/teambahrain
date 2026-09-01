import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import { getTickerItems } from "@/lib/data/home";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tickerItems = await getTickerItems();

  return (
    <>
      <Header />
      <Ticker items={tickerItems} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
