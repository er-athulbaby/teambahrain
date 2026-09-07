import type { Metadata } from "next";
import Link from "next/link";
import ImageTile from "@/components/shared/ImageTile";
import NewsCard from "@/components/news/NewsCard";
import { getLeadNews, getNewsList } from "@/lib/data/news";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "News — Team Bahrain",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function NewsPage() {
  const [lead, news, content] = await Promise.all([getLeadNews(), getNewsList(), getPageContent("news")]);

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            {content.eyebrow}
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            {content.headline}
          </h1>
        </div>
      </section>

      {lead && (
        <section className="border-b-2 border-ink">
          <Link
            href={`/news/${lead.slug}`}
            className="block max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] text-ink hover:bg-surface"
          >
            <div className="py-10 lg:py-12 lg:pr-12 flex flex-col gap-5 justify-center">
              <span className="bg-accent text-white px-2.5 py-1.5 font-semibold text-[10px] tracking-[0.16em] uppercase self-start">
                Lead story
              </span>
              <h2 className="m-0 font-bold text-4xl sm:text-[52px] leading-[0.95] tracking-[-0.012em]">
                {lead.title}
              </h2>
              <p className="m-0 max-w-[52ch] text-lg leading-[1.55] text-ink-800 text-pretty">
                {lead.blurb}
              </p>
              <span className="font-semibold text-xs tracking-[0.1em] uppercase text-ink-700">
                {formatDate(lead.date)} · {content.lead_location}
              </span>
            </div>
            <ImageTile
              src={lead.photo_path}
              alt={lead.title}
              aspect="auto"
              className="lg:border-l-2 border-ink min-h-[280px] lg:min-h-[460px]"
            />
          </Link>
        </section>
      )}

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            {news.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
          {news.length === 0 && !lead && (
            <p className="text-ink-700 text-base py-8">No news published yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
