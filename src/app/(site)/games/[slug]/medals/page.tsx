import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEditionBySlug, getEditionMedals, getEditionSports } from "@/lib/data/games";
import { countMedals } from "@/lib/medals";
import EditionMedalTable from "@/components/games/EditionMedalTable";

export const metadata: Metadata = {
  title: "Medals — Team Bahrain",
};

export default async function EditionMedalsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const [medals, sports] = await Promise.all([getEditionMedals(edition.id), getEditionSports(edition.id)]);
  const totals = countMedals(medals);

  const cells = [
    { label: "Gold", value: totals.gold, color: "text-[#B8860B]", image: edition.gold_medal_image },
    { label: "Silver", value: totals.silver, color: "text-[#71797E]", image: edition.silver_medal_image },
    { label: "Bronze", value: totals.bronze, color: "text-[#A0522D]", image: edition.bronze_medal_image },
    { label: "Total", value: totals.total, color: "text-ink", image: null },
  ];

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4">
          {cells.map((c, i) => (
            <div
              key={c.label}
              className={`py-9 px-4 flex items-center justify-center gap-5 border-divider lg:border-b-0 ${
                i % 2 === 0 ? "border-r-2" : ""
              } ${i < 2 ? "border-b-2" : ""} ${i === 3 ? "lg:border-r-0" : "lg:border-r-2"}`}
            >
              {c.image && (
                <Image
                  src={c.image}
                  alt={`${c.label} medal — ${edition.name}`}
                  width={104}
                  height={104}
                  className="h-20 w-20 sm:h-[104px] sm:w-[104px] object-contain flex-none"
                />
              )}
              <div className="flex flex-col items-center text-center gap-1.5">
                <span className={`font-bold text-4xl sm:text-[52px] leading-[0.9] tracking-[-0.02em] tabular-nums ${c.color}`}>
                  {c.value}
                </span>
                <span className={`font-semibold text-[13px] tracking-[0.14em] uppercase ${c.color}`}>{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <EditionMedalTable medals={medals} sports={sports} />
        </div>
      </section>
    </>
  );
}
