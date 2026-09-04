import SectionHead from "@/components/shared/SectionHead";
import CalendarRow from "@/components/games/CalendarRow";
import type { GameEdition } from "@/types";

export default function CalendarPreview({ editions }: { editions: GameEdition[] }) {
  const upcoming = [...editions]
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 3);

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
