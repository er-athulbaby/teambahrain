import type { Metadata } from "next";
import ImageTile from "@/components/shared/ImageTile";
import { getTimeline, getLegends } from "@/lib/data/history";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "History — Team Bahrain",
};

export default async function HistoryPage() {
  const [timeline, legends, content] = await Promise.all([getTimeline(), getLegends(), getPageContent("history")]);

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
          <p className="m-0 max-w-[60ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            {content.intro}
          </p>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {timeline.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-1 sm:grid-cols-[140px_1fr] lg:grid-cols-[200px_1fr_1fr] gap-3 sm:gap-8 py-7 border-b-2 border-divider"
            >
              <span className="font-bold text-3xl sm:text-4xl leading-[0.9] tracking-[-0.012em] text-accent">
                {t.year}
              </span>
              <h3 className="m-0 font-semibold text-[22px] sm:text-2xl leading-[1.1] tracking-[-0.02em]">
                {t.title}
              </h3>
              <p className="m-0 text-base leading-[1.55] text-ink-800 text-pretty">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <h2 className="m-0 mb-8 font-bold text-4xl sm:text-[44px] leading-[0.95] tracking-[-0.012em] uppercase pb-6 border-b-2 border-ink">
            {content.legends_heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {legends.map((l) => (
              <article key={l.id} className="flex flex-col gap-4">
                <ImageTile
                  src={l.photo_path}
                  alt={l.name}
                  aspect="1/1"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="border-2 border-ink"
                />
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                  {l.era}
                </span>
                <h3 className="m-0 font-bold text-2xl leading-none tracking-[-0.02em] uppercase">
                  {l.name}
                </h3>
                <p className="m-0 text-[15px] leading-[1.5] text-ink-800 text-pretty">{l.line}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
