"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageTile from "@/components/shared/ImageTile";
import { ATHLETE_FILTERS } from "@/lib/site.config";
import type { Athlete } from "@/types";

export default function AthleteRoster({ athletes }: { athletes: Athlete[] }) {
  const searchParams = useSearchParams();
  const sportParam = searchParams.get("sport");
  const initialFilter =
    sportParam && (ATHLETE_FILTERS as readonly string[]).includes(sportParam)
      ? sportParam
      : "All";
  const [filter, setFilter] = useState(initialFilter);

  const roster =
    filter === "All" ? athletes : athletes.filter((a) => a.sport === filter);

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap gap-0 overflow-x-auto">
          {ATHLETE_FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`border-r-2 border-divider px-5 py-4.5 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface ${
                  active ? "text-ink shadow-[inset_0_-4px_0_0_var(--color-accent)]" : "text-ink-700"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </section>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {roster.map((a) => (
              <article key={a.id} className="border-2 border-ink bg-ground flex flex-col">
                <ImageTile
                  src={a.photo_path}
                  alt={a.name}
                  aspect="3/4"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="border-b-2 border-ink"
                />
                <div className="p-4.5 flex flex-col gap-2.5">
                  <span className="font-semibold text-[10px] tracking-[0.16em] uppercase text-accent-700">
                    {a.sport}
                  </span>
                  <h3 className="m-0 font-bold text-[22px] leading-none tracking-[-0.02em] uppercase">
                    {a.name}
                  </h3>
                  <p className="m-0 text-[13px] leading-[1.45] text-ink-800">{a.line}</p>
                  <span className="font-semibold text-[11px] tracking-[0.1em] uppercase text-ink-700 pt-1.5 border-t-2 border-divider">
                    {a.event}
                  </span>
                </div>
              </article>
            ))}
            {roster.length === 0 && (
              <p className="text-ink-700 text-base py-8">
                No athletes recorded in this sport yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
