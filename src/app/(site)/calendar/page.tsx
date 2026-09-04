import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getPublishedEditions } from "@/lib/data/games";
import type { GameEdition } from "@/types";

export const metadata: Metadata = {
  title: "Calendar — Team Bahrain",
};

function DateBox({ date }: { date: string }) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  const year = d.getFullYear();

  return (
    <div className="w-[76px] flex-none border-2 border-ink flex flex-col items-center justify-center py-2.5 gap-0.5">
      <span className="font-bold text-2xl leading-none tabular-nums">{day}</span>
      <span className="font-semibold text-[10px] tracking-[0.1em] uppercase text-accent-700">{month}</span>
      <span className="text-[11px] text-ink-700 tabular-nums">{year}</span>
    </div>
  );
}

function CalendarRow({ edition }: { edition: GameEdition }) {
  return (
    <Link
      href={`/games/${edition.slug}`}
      className="flex flex-col sm:flex-row sm:items-center gap-5 py-8 border-b-2 border-ink last:border-0 text-ink hover:bg-surface"
    >
      <span className="w-16 h-16 flex-none border-2 border-ink overflow-hidden flex items-center justify-center bg-surface">
        {edition.logo_path ? (
          <Image
            src={edition.logo_path}
            alt={edition.name}
            width={64}
            height={64}
            className="h-full w-full object-contain p-1.5"
          />
        ) : null}
      </span>

      <div className="flex items-center gap-3 flex-none">
        <DateBox date={edition.start_date} />
        {edition.end_date && (
          <>
            <ChevronRight size={16} className="text-ink-400 flex-none" />
            <DateBox date={edition.end_date} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="inline-flex w-fit bg-accent text-white px-2.5 py-1 font-semibold text-[10px] tracking-[0.12em] uppercase">
          {edition.edition_type}
        </span>
        <span className="text-sm text-ink-700">{edition.city}</span>
        <h2 className="m-0 font-bold text-xl sm:text-2xl uppercase leading-tight">{edition.name}</h2>
      </div>
    </Link>
  );
}

export default async function CalendarPage() {
  const editions = await getPublishedEditions();
  const sorted = [...editions].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            Team Bahrain at the Games
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            Calendar
          </h1>
          <p className="m-0 max-w-[58ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            Every Games edition on the road ahead, in order.
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {sorted.map((edition) => (
            <CalendarRow key={edition.id} edition={edition} />
          ))}
          {sorted.length === 0 && (
            <p className="py-14 text-ink-700">No Games editions published yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
