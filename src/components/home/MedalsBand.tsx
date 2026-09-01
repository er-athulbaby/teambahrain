import Link from "next/link";
import type { MedalCounts } from "@/types";

const MEDAL_CELLS = (totals: MedalCounts) => [
  { label: "Gold", value: totals.gold, color: "text-accent" },
  { label: "Silver", value: totals.silver, color: "text-ink" },
  { label: "Bronze", value: totals.bronze, color: "text-ink-500" },
  { label: "Total", value: totals.total, color: "text-ink" },
];

export default function MedalsBand({ totals }: { totals: MedalCounts }) {
  const cells = MEDAL_CELLS(totals);

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-3.5 text-accent">
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              Since 1984
            </span>
          </span>
          <h2 className="m-0 font-bold text-4xl sm:text-[46px] leading-[0.98] tracking-[-0.012em] uppercase">
            All-time
            <br />
            Olympic medals
          </h2>
          <p className="m-0 text-base leading-[1.5] text-ink-800 text-pretty">
            Six medals across eleven summer Games. Open the table to break
            them down by Games, sport, event and athlete.
          </p>
          <Link
            href="/all-time-medals"
            className="bg-accent text-white border-2 border-accent px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase self-start min-w-[240px] hover:bg-accent-600 hover:border-accent-600"
          >
            See the medal table →
          </Link>
        </div>
        <Link
          href="/all-time-medals"
          className="border-2 border-ink grid grid-cols-2 sm:grid-cols-4 hover:bg-surface"
        >
          {cells.map((c, i) => (
            <span
              key={c.label}
              className={`px-5 py-7 sm:py-8 flex flex-col gap-2 border-divider ${
                i % 2 === 0 ? "border-r-2" : ""
              } ${i < 2 ? "border-b-2 sm:border-b-0" : ""} ${
                i === 3 ? "sm:border-r-0" : "sm:border-r-2"
              }`}
            >
              <span className={`block pb-1.5 ${c.color}`}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                  <path d="M11 12 5.12 2.2" />
                  <path d="m13 12 5.88-9.8" />
                  <path d="M8 7h8" />
                  <circle cx="12" cy="17" r="5" />
                  <path d="M12 18v-2h-.5" />
                </svg>
              </span>
              <span
                className={`font-bold text-[44px] sm:text-[58px] leading-[0.85] tracking-[-0.02em] tabular-nums ${c.color}`}
              >
                {c.value}
              </span>
              <span className="font-semibold text-xs tracking-[0.16em] uppercase">
                {c.label}
              </span>
            </span>
          ))}
        </Link>
      </div>
    </section>
  );
}
