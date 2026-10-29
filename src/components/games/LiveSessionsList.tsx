import { PlayCircle } from "lucide-react";
import LiveEmbed from "@/components/games/LiveEmbed";
import type { GameEditionLiveSession } from "@/types";

function timeRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  return [start, end].filter(Boolean).join(" – ");
}

export default function LiveSessionsList({ sessions }: { sessions: GameEditionLiveSession[] }) {
  return (
    <section className="border-b-2 border-ink bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12 flex flex-col gap-8">
        {sessions.map((s) => {
          const scheduled = timeRange(s.announced_start_time, s.announced_end_time);
          const actual = timeRange(s.actual_start_time, s.actual_end_time);
          return (
            <div key={s.id} className="border-2 border-ink bg-white p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-left">
                {s.series_title && (
                  <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                    {s.series_title}
                    {s.episode_number ? ` · Episode ${s.episode_number}` : ""}
                  </span>
                )}
                <h3 className="m-0 font-bold text-xl uppercase">{s.title}</h3>
                <span className="flex flex-wrap items-center gap-4 text-sm text-ink-700">
                  {actual && <span>Live: {actual}</span>}
                  {!actual && scheduled && <span>Scheduled: {scheduled}</span>}
                </span>
              </div>

              {s.embed_code ? (
                <LiveEmbed html={s.embed_code} />
              ) : s.frontend_url ? (
                <a
                  href={s.frontend_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start font-semibold text-sm text-accent-700 hover:underline"
                >
                  <PlayCircle size={16} />
                  Watch on Olympics.com
                </a>
              ) : null}
            </div>
          );
        })}
        {sessions.length === 0 && (
          <p className="text-ink-700 text-base py-4">No live sessions for this edition yet.</p>
        )}
      </div>
    </section>
  );
}
