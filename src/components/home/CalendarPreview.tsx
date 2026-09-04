import SectionHead from "@/components/shared/SectionHead";
import CalendarRow from "@/components/games/CalendarRow";
import type { GameEdition } from "@/types";

export default function CalendarPreview({ editions }: { editions: GameEdition[] }) {
  // Same sort_order as /games and /calendar — see calendar/page.tsx for why
  // this isn't sorted by date.
  const upcoming = editions.slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Calendar" href="/calendar" linkLabel="Full calendar →" />
        <div>
          {upcoming.map((edition) => (
            <CalendarRow key={edition.id} edition={edition} />
          ))}
        </div>
      </div>
    </section>
  );
}
