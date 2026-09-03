import Hero from "@/components/home/Hero";
import FiguresStrip from "@/components/home/FiguresStrip";
import NewsPreview from "@/components/home/NewsPreview";
import AthletesPreview from "@/components/home/AthletesPreview";
import MedalsBand from "@/components/home/MedalsBand";
import InstagramGrid from "@/components/home/InstagramGrid";
import RedClose from "@/components/home/RedClose";
import { getHomeFigures, getHomeNews, getFeaturedAthletes, getInstagramPosts } from "@/lib/data/home";
import { getMedalTotals } from "@/lib/data/medals";
import { getPageContent } from "@/lib/data/pageContent";

export default async function HomePage() {
  const [figures, news, athletes, instagram, medalTotals, content, site] = await Promise.all([
    getHomeFigures(),
    getHomeNews(),
    getFeaturedAthletes(),
    getInstagramPosts(),
    getMedalTotals(),
    getPageContent("home"),
    getPageContent("site"),
  ]);

  return (
    <main>
      <Hero content={content} targetDate={site.games_date} />
      <FiguresStrip figures={figures} />
      {content.show_news_section !== "false" && <NewsPreview news={news} />}
      {content.show_athletes_section !== "false" && <AthletesPreview athletes={athletes} />}
      {content.show_medals_section !== "false" && <MedalsBand totals={medalTotals} />}
      <InstagramGrid posts={instagram} />
      <RedClose content={content} />
    </main>
  );
}
