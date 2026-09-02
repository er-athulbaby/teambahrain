import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/analytics/Analytics";
import RouteLoader from "@/components/layout/RouteLoader";
import { getTickerItems } from "@/lib/data/home";
import { getPageContent } from "@/lib/data/pageContent";
import { getPublishedEditions } from "@/lib/data/games";

// All content on these pages is admin-editable and expected to show up
// immediately, not after the next deploy — so this subtree can't be
// statically prerendered at build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tickerItems, site, editions] = await Promise.all([
    getTickerItems(),
    getPageContent("site"),
    getPublishedEditions(),
  ]);

  return (
    <>
      <Analytics />
      <RouteLoader enabled={site.loader_enabled === "true"} />
      <Header tagline={site.tagline} gamesEditions={editions.map((e) => ({ slug: e.slug, name: e.name }))} />
      <Ticker items={tickerItems} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
