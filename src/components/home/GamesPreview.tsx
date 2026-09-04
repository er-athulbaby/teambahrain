import SectionHead from "@/components/shared/SectionHead";
import GameEditionCard from "@/components/games/GameEditionCard";
import type { GameEdition } from "@/types";

export default function GamesPreview({ editions }: { editions: GameEdition[] }) {
  if (editions.length === 0) return null;

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Games" href="/games" linkLabel="All editions →" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {editions.map((e) => (
            <GameEditionCard key={e.id} edition={e} headingLevel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
