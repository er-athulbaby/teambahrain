import type { Metadata } from "next";
import CalendarRow from "@/components/games/CalendarRow";
import { getPublishedEditions } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Calendar — Team Bahrain",
};

export default async function CalendarPage() {
  const editions = await getPublishedEditions();
  const sorted = [...editions].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            Team Bahrain at the Games
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            Calendar
          </h1>
          <p className="m-0 max-w-[58ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            Every Games edition on the road ahead, in order.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {sorted.map((edition) => (
            <CalendarRow key={edition.id} edition={edition} />
          ))}
          {sorted.length === 0 && (
            <p className="py-14 text-ink-700">No Games editions published yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
