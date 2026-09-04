import Hero from "@/components/home/Hero";
import FiguresStrip from "@/components/home/FiguresStrip";
import GamesPreview from "@/components/home/GamesPreview";
import CalendarPreview from "@/components/home/CalendarPreview";
import NewsPreview from "@/components/home/NewsPreview";
import AthletesPreview from "@/components/home/AthletesPreview";
import MedalsBand from "@/components/home/MedalsBand";
import InstagramGrid from "@/components/home/InstagramGrid";
import RedClose from "@/components/home/RedClose";
import { getHomeFigures, getHomeNews, getFeaturedAthletes, getInstagramPosts } from "@/lib/data/home";
import { getMedalTotals } from "@/lib/data/medals";
import { getPageContent } from "@/lib/data/pageContent";
import { getPublishedEditions } from "@/lib/data/games";

export default async function HomePage() {
  const [figures, news, athletes, instagram, medalTotals, editions, content, site] = await Promise.all([
    getHomeFigures(),
    getHomeNews(),
    getFeaturedAthletes(),
    getInstagramPosts(),
    getMedalTotals(),
    getPublishedEditions(),
    getPageContent("home"),
    getPageContent("site"),
  ]);

  return (
    <main>
      <Hero content={content} targetDate={site.games_date} />
      {content.show_figures_strip !== "false" && <FiguresStrip figures={figures} />}
      {content.show_games_section !== "false" && <GamesPreview editions={editions} />}
      {content.show_calendar_section !== "false" && <CalendarPreview editions={editions} />}
      {content.show_news_section !== "false" && <NewsPreview news={news} />}
      {content.show_athletes_section !== "false" && <AthletesPreview athletes={athletes} />}
      {content.show_medals_section !== "false" && <MedalsBand totals={medalTotals} />}
      <InstagramGrid posts={instagram} />
      <RedClose content={content} />
    </main>
  );
}
