import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEditionBySlug, getEditionMedals } from "@/lib/data/games";
import { countMedals } from "@/lib/medals";

export const metadata: Metadata = {
  title: "Medals — Team Bahrain",
};

const MEDAL_LABEL = { G: "Gold", S: "Silver", B: "Bronze" } as const;

export default async function EditionMedalsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const medals = await getEditionMedals(edition.id);
  const totals = countMedals(medals);

  const cells = [
    { label: "Gold", value: totals.gold, color: "text-accent" },
    { label: "Silver", value: totals.silver, color: "text-ink" },
    { label: "Bronze", value: totals.bronze, color: "text-ink-500" },
    { label: "Total", value: totals.total, color: "text-ink" },
  ];

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4">
          {cells.map((c, i) => (
            <div
              key={c.label}
              className={`py-9 pr-7 flex flex-col gap-2.5 border-divider lg:border-b-0 ${
                i % 2 === 0 ? "border-r-2" : ""
              } ${i < 2 ? "border-b-2" : ""} ${i === 3 ? "lg:border-r-0" : "lg:border-r-2"}`}
            >
              <span className={`font-bold text-4xl sm:text-[52px] leading-[0.9] tracking-[-0.02em] tabular-nums ${c.color}`}>
                {c.value}
              </span>
              <span className="font-semibold text-[13px] tracking-[0.14em] uppercase">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          {medals.length === 0 ? (
            <p className="text-ink-700 text-base">No medals recorded for this edition yet.</p>
          ) : (
            <div className="flex flex-col">
              {medals.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr_1fr] gap-4 items-center py-4 border-b-2 border-divider"
                >
                  <span className="font-semibold text-xs tracking-[0.1em] uppercase text-accent-700">
                    {MEDAL_LABEL[m.medal]}
                  </span>
                  <span className="font-semibold text-base">{m.athlete_name}</span>
                  <span className="text-sm text-ink-700">
                    {m.sport} · {m.event_name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
