import type { Metadata } from "next";
import MedalTable from "@/components/medals/MedalTable";
import { getOlympicGames, getOlympicMedals, getMedalTotals, getContinentalStats } from "@/lib/data/medals";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "All-time medals — Team Bahrain",
};

export default async function MedalsPage() {
  const [games, medals, totals, continental, content] = await Promise.all([
    getOlympicGames(),
    getOlympicMedals(),
    getMedalTotals(),
    getContinentalStats(),
    getPageContent("medals"),
  ]);

  const totalCells = [
    { label: "Gold", value: totals.gold, note: content.gold_note, color: "text-accent" },
    { label: "Silver", value: totals.silver, note: content.silver_note, color: "text-ink" },
    { label: "Bronze", value: totals.bronze, note: content.bronze_note, color: "text-ink-500" },
    { label: "Total medals", value: totals.total, note: content.total_note, color: "text-ink" },
  ];
  const headlineLines = content.headline.split("\n");

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 lg:items-end">
          <div className="flex flex-col gap-5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              {content.eyebrow}
            </span>
            <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
              {headlineLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headlineLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
          </div>
          <p className="m-0 text-lg leading-[1.5] text-ink-800 text-pretty">{content.intro}</p>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4">
          {totalCells.map((c, i) => (
            <div
              key={c.label}
              className={`py-9 pr-7 flex flex-col gap-2.5 border-divider lg:border-b-0 ${
                i % 2 === 0 ? "border-r-2" : ""
              } ${i < 2 ? "border-b-2" : ""} ${i === 3 ? "lg:border-r-0" : "lg:border-r-2"}`}
            >
              <span className={`font-bold text-4xl sm:text-[64px] leading-[0.85] tracking-[-0.04em] tabular-nums ${c.color}`}>
                {c.value}
              </span>
              <span className="font-semibold text-[13px] tracking-[0.14em] uppercase">
                {c.label}
              </span>
              <span className="text-sm leading-[1.45] text-ink-700">{c.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-10 sm:pb-14">
          <MedalTable games={games} medals={medals} />
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
          <div className="flex flex-col gap-3.5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              {content.continental_eyebrow}
            </span>
            <p className="m-0 font-bold text-3xl sm:text-4xl leading-[0.98] tracking-[-0.012em] uppercase">
              {content.continental_headline}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {continental.map((c) => (
              <div key={c.id} className="pr-6 flex flex-col gap-2">
                <span className="font-bold text-4xl leading-[0.9] tracking-[-0.012em] text-accent tabular-nums">
                  {c.value}
                </span>
                <span className="font-bold text-[13px] leading-[1.35] text-ink-800">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
