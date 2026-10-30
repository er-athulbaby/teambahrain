"use client";

import { Clock, PlayCircle } from "lucide-react";
import type { GameEditionEvent } from "@/types";

function dayNumber(eventDate: string, editionStart: string | null) {
  if (!editionStart) return null;
  const diff = Math.round(
    (new Date(eventDate + "T00:00:00Z").getTime() - new Date(editionStart + "T00:00:00Z").getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return diff >= 0 ? diff + 1 : null;
}

function status(eventDate: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (eventDate === today) return "LIVE NOW";
  if (eventDate > today) return "UPCOMING EVENT";
  return "REPLAY AVAILABLE";
}

function startTimeLabel(eventDate: string, eventTime: string | null) {
  const match = eventTime?.match(/^(\d{1,2}:\d{2})/);
  const dateLabel = new Date(eventDate + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return match ? `Starts at ${dateLabel} ${match[1]} GMT+3` : dateLabel;
}

export default function LiveEventCard({ event, editionStart }: { event: GameEditionEvent; editionStart: string | null }) {
  const day = dayNumber(event.event_date, editionStart);
  const label = status(event.event_date);

  const card = (
    <div className="border-2 border-ink bg-white flex flex-col overflow-hidden group cursor-pointer">
      <div className="relative bg-gradient-to-br from-accent-700 via-accent to-accent-600 text-white px-6 py-8 flex flex-col items-center text-center gap-2">
        {day && (
          <span className="font-bold text-4xl uppercase tracking-tight opacity-90">Day {day}</span>
        )}
        <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/40 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]">
          <Clock size={12} />
          {label}
        </span>
        <span className="font-semibold text-sm">{startTimeLabel(event.event_date, event.event_time)}</span>
      </div>
      <div className="p-5 flex flex-col gap-2">
        <span className="self-start bg-surface border border-ink-400 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-700">
          {event.sport}
        </span>
        <h3 className="m-0 font-bold text-lg uppercase leading-snug">{event.title}</h3>
        <p className="m-0 text-sm text-ink-700">{event.venue}</p>
        <span className="inline-flex items-center gap-1.5 mt-1 font-semibold text-sm text-accent-700 group-hover:underline">
          <PlayCircle size={15} />
          Watch on Olympics.com
        </span>
      </div>
    </div>
  );

  return (
    <a href={event.live_url ?? "#"} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  );
}
