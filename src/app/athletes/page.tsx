import { Suspense } from "react";
import type { Metadata } from "next";
import AthleteRoster from "@/components/athletes/AthleteRoster";
import { getAthletes } from "@/lib/data/athletes";

export const metadata: Metadata = {
  title: "Athletes — Team Bahrain",
};

export default async function AthletesPage() {
  const athletes = await getAthletes();

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            National squad
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            Athletes
          </h1>
          <p className="m-0 max-w-[58ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            Current internationals and the legends who set the standard.
            Profiles carry personal bests, results and federation contact.
          </p>
        </div>
      </section>
      <Suspense>
        <AthleteRoster athletes={athletes} />
      </Suspense>
    </main>
  );
}
