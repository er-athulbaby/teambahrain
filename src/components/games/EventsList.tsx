"use client";

import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import type { GameEditionEvent, GameEditionSport } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function EventsList({
  events,
  sports,
  showResults,
}: {
  events: GameEditionEvent[];
  sports: GameEditionSport[];
  showResults: boolean;
}) {
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? events : events.filter((e) => e.sport === filter);

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-wrap gap-0 overflow-x-auto">
          {["All", ...sports.map((s) => s.name)].map((name) => {
            const active = filter === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                className={`border-r-2 border-divider px-5 py-4.5 font-semibold text-xs tracking-[0.14em] uppercase hover:bg-surface ${
                  active ? "text-ink shadow-[inset_0_-4px_0_0_var(--color-accent)]" : "text-ink-700"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12 flex flex-col gap-5">
          {list.map((e) => (
            <div key={e.id} className="border-2 border-ink bg-ink text-white p-6 flex flex-col gap-4">
              {showResults && (
                <div className="flex gap-3">
                  {e.result_time && (
                    <span className="bg-ink-700 px-4 py-2.5 font-bold text-lg">Time : {e.result_time}</span>
                  )}
                  {e.result_rank && (
                    <span className="bg-ink-700 px-4 py-2.5 font-bold text-lg">Rank : {e.result_rank}</span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-200">
                  {e.sport}
                </span>
                <h3 className="m-0 font-bold text-xl uppercase">{e.title}</h3>
                <span className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span>{e.venue}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-accent" />
                    {formatDate(e.event_date)}
                  </span>
                  {e.event_time && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-accent" />
                      {e.event_time}
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <p className="text-ink-700 text-base py-4">
              No {showResults ? "results" : "upcoming events"} for this sport yet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
