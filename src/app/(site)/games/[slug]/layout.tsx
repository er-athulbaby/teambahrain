import { notFound } from "next/navigation";
import Image from "next/image";
import { getEditionBySlug } from "@/lib/data/games";
import GameEditionTabs from "@/components/games/GameEditionTabs";
import { formatEditionDate } from "@/lib/formatEditionDate";

export default async function GameEditionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const startLabel = formatEditionDate(edition.start_date, edition.start_year);
  const dateRange =
    edition.end_date || edition.end_year
      ? `${startLabel} – ${formatEditionDate(edition.end_date, edition.end_year)}`
      : startLabel;

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8">
          <div
            className={`py-10 sm:py-14 flex flex-wrap items-center gap-6 sm:gap-8 ${
              edition.mascot_image ? "sm:pr-40" : ""
            }`}
          >
            {edition.logo_path && (
              <Image
                src={edition.logo_path}
                alt={edition.name}
                width={72}
                height={72}
                className="h-16 w-16 sm:h-[72px] sm:w-[72px] object-contain flex-none"
              />
            )}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
                {edition.edition_type}
              </span>
              <h1 className="m-0 font-bold text-4xl sm:text-6xl leading-[0.95] tracking-[-0.015em] uppercase">
                {edition.name}
              </h1>
              <span className="font-semibold text-sm text-ink-700">
                {edition.city} · {dateRange}
              </span>
            </div>
          </div>
          {edition.mascot_image && (
            <Image
              src={edition.mascot_image}
              alt={`${edition.name} mascot`}
              width={140}
              height={140}
              className="hidden sm:block absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-[140px] w-[140px] object-contain"
            />
          )}
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <GameEditionTabs slug={slug} />
        </div>
      </section>

      {children}
    </main>
  );
}
