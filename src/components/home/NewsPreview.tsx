import SectionHead from "@/components/shared/SectionHead";
import NewsCard from "@/components/news/NewsCard";
import type { NewsItem } from "@/types";

export default function NewsPreview({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null;

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Latest from the team" href="/news" linkLabel="All news →" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((n) => (
            <NewsCard key={n.id} item={n} headingLevel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
