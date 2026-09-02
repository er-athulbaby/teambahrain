"use client";

import { useState } from "react";
import ImageTile from "@/components/shared/ImageTile";
import SportFilterDropdown from "@/components/games/SportFilterDropdown";
import type { GameEditionPlayer, GameEditionSport } from "@/types";

export default function PlayerRoster({
  players,
  sports,
}: {
  players: GameEditionPlayer[];
  sports: GameEditionSport[];
}) {
  const [filter, setFilter] = useState("All");

  const roster = filter === "All" ? players : players.filter((p) => p.sport === filter);

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4">
          <SportFilterDropdown sports={sports} value={filter} onChange={setFilter} />
        </div>
      </section>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {roster.map((p) => (
              <article key={p.id} className="border-2 border-ink bg-ground flex flex-col">
                <ImageTile src={p.photo_path} alt={p.name} aspect="3/4" className="border-b-2 border-ink" />
                <div className="p-4.5 flex flex-col gap-2">
                  <span className="font-semibold text-[10px] tracking-[0.16em] uppercase text-accent-700">
                    {p.sport}
                  </span>
                  <h3 className="m-0 font-bold text-lg leading-none uppercase">{p.name}</h3>
                </div>
              </article>
            ))}
            {roster.length === 0 && (
              <p className="text-ink-700 text-base py-8">No players listed for this sport yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
