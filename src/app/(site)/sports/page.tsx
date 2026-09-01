import Link from "next/link";
import type { Metadata } from "next";
import ImageTile from "@/components/shared/ImageTile";
import { getSports } from "@/lib/data/sports";

export const metadata: Metadata = {
  title: "Sports — Team Bahrain",
};

export default async function SportsPage() {
  const sports = await getSports();

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-10 lg:items-end">
          <div className="flex flex-col gap-5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              Federations &amp; pathways
            </span>
            <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
              Sports
            </h1>
          </div>
          <p className="m-0 text-lg leading-[1.5] text-ink-800 text-pretty">
            Each federation runs its own national squads, domestic league
            and youth intake. Select a sport for fixtures, rankings and club
            contacts.
          </p>
        </div>
      </section>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {sports.map((s) => (
            <Link
              key={s.id}
              href={`/athletes?sport=${encodeURIComponent(s.name)}`}
              className="text-left border-r-2 border-b-2 border-divider flex flex-col hover:bg-surface"
            >
              <ImageTile
                src={s.photo_path}
                alt={s.name}
                aspect="16/10"
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="border-b-2 border-divider"
              />
              <span className="px-5 pt-5 pb-6 flex flex-col gap-2">
                <span className="font-bold text-lg leading-[1.05] tracking-[-0.015em] uppercase whitespace-nowrap">
                  {s.name}
                </span>
                <span className="font-semibold text-[11px] tracking-[0.14em] uppercase text-accent-700">
                  {s.squads_label}
                </span>
                <span className="text-sm leading-[1.45] text-ink-700">{s.note}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
