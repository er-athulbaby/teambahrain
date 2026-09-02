"use client";

import { useState } from "react";
import Image from "next/image";
import ImageTile from "@/components/shared/ImageTile";
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap gap-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`border-r-2 border-divider px-5 py-4.5 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface ${
              filter === "All" ? "text-ink shadow-[inset_0_-4px_0_0_var(--color-accent)]" : "text-ink-700"
            }`}
          >
            All
          </button>
          {sports.map((s) => {
            const active = filter === s.name;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilter(s.name)}
                className={`flex items-center gap-2 border-r-2 border-divider px-5 py-3.5 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface ${
                  active ? "text-ink shadow-[inset_0_-4px_0_0_var(--color-accent)]" : "text-ink-700"
                }`}
              >
                {s.icon_path && (
                  <Image src={s.icon_path} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                )}
                {s.name}
              </button>
            );
          })}
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
