import type { Metadata } from "next";
import ImageTile from "@/components/shared/ImageTile";
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
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
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
          </div>
        </section>
      )}

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {news.map((n) => (
            <div
              key={n.id}
              className="w-full text-left border-b-2 border-divider py-7 grid grid-cols-1 sm:grid-cols-[minmax(110px,140px)_minmax(90px,130px)_minmax(0,1fr)_40px] gap-2 sm:gap-7 sm:items-center hover:bg-surface"
            >
              <span className="font-semibold text-xs tracking-[0.1em] uppercase text-ink-700">
                {formatDate(n.date)}
              </span>
              <span className="font-semibold text-[10px] tracking-[0.14em] uppercase text-accent-700">
                {n.kicker}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="font-semibold text-2xl leading-[1.1] tracking-[-0.02em]">
                  {n.title}
                </span>
                <span className="text-[15px] leading-[1.5] text-ink-700 max-w-[80ch]">
                  {n.blurb}
                </span>
              </span>
              <span className="hidden sm:block font-semibold text-xl text-accent">→</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
