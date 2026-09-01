import { MEDAL_SPORT_FILTERS } from "@/lib/site.config";

export default function SportFilterChips({
  value,
  onChange,
  onReset,
}: {
  value: string;
  onChange: (sport: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-[11px] tracking-[0.18em] uppercase text-ink-700 pr-3">
          Filter by sport
        </span>
        {MEDAL_SPORT_FILTERS.map((sport) => {
          const active = value === sport;
          return (
            <button
              key={sport}
              type="button"
              onClick={() => onChange(sport)}
              className={`border-2 border-ink px-3.5 py-2.5 font-semibold text-[11px] tracking-[0.12em] uppercase hover:bg-surface hover:text-ink ${
                active ? "bg-accent text-white" : "bg-transparent text-ink"
              }`}
            >
              {sport}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="font-semibold text-[11px] tracking-[0.14em] uppercase text-accent-700 hover:text-accent py-2"
      >
        ↺ Reset filters
      </button>
    </div>
  );
}
