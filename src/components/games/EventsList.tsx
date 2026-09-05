"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import SportFilterDropdown from "@/components/games/SportFilterDropdown";
import { flagSrc, countryName } from "@/lib/flags";
import type { GameEditionEvent, GameEditionSport } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

function FlagBadge({ code }: { code: string }) {
  const src = flagSrc(code);
  if (!src) return null;
  return (
    <span className="flex flex-col items-center gap-1.5 flex-none">
      <Image
        src={src}
        alt={countryName(code) ?? code}
        width={40}
        height={30}
        unoptimized
        className="w-10 h-auto border border-white/20"
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80 whitespace-nowrap">
        {countryName(code)}
      </span>
    </span>
  );
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
  const iconBySport = new Map(sports.map((s) => [s.name, s.icon_path]));

  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4">
          <SportFilterDropdown sports={sports} value={filter} onChange={setFilter} />
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12 flex flex-col gap-5">
          {list.map((e) => {
            const sportIcon = iconBySport.get(e.sport);
            return (
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
                <div className="flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    {sportIcon && (
                      <span className="h-14 w-14 rounded-full border-2 border-white/20 bg-white/5 overflow-hidden flex items-center justify-center flex-none">
                        <Image src={sportIcon} alt="" width={40} height={40} className="h-8 w-8 object-contain" />
                      </span>
                    )}
                    <div className="flex flex-col gap-2 text-left">
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
                  <div className="flex items-center gap-4 flex-none">
                    <FlagBadge code="BH" />
                    {e.opponent_country && (
                      <>
                        <span className="font-bold text-xs uppercase text-white/40">vs</span>
                        <FlagBadge code={e.opponent_country} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
