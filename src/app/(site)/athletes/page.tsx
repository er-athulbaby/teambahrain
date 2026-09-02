import { Suspense } from "react";
import type { Metadata } from "next";
import AthleteRoster from "@/components/athletes/AthleteRoster";
import { getAthletes } from "@/lib/data/athletes";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "Athletes — Team Bahrain",
};

export default async function AthletesPage() {
  const [athletes, content] = await Promise.all([getAthletes(), getPageContent("athletes")]);

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            {content.eyebrow}
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            {content.headline}
          </h1>
          <p className="m-0 max-w-[58ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            {content.intro}
          </p>
        </div>
      </section>
      <Suspense>
        <AthleteRoster athletes={athletes} />
      </Suspense>
    </main>
  );
}
