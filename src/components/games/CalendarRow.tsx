import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { GameEdition } from "@/types";

function DateBox({ date, year }: { date: string | null; year: number | null }) {
  if (!date) {
    if (!year) return null;
    return (
      <div className="w-[76px] h-[76px] flex-none border-2 border-ink flex items-center justify-center">
        <span className="font-bold text-3xl leading-none tabular-nums">{year}</span>
      </div>
    );
  }

  const d = new Date(date);
  const day = d.getUTCDate();
  const month = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase();
  const displayYear = d.getUTCFullYear();

  return (
    <div className="w-[76px] flex-none border-2 border-ink flex flex-col items-center justify-center py-2.5 gap-0.5">
      <span className="font-bold text-2xl leading-none tabular-nums">{day}</span>
      <span className="font-semibold text-[10px] tracking-[0.1em] uppercase text-accent-700">{month}</span>
      <span className="text-[11px] text-ink-700 tabular-nums">{displayYear}</span>
    </div>
  );
}

export default function CalendarRow({ edition }: { edition: GameEdition }) {
  const hasEnd = Boolean(edition.end_date || edition.end_year);
  const isLive = edition.status === "live";
  const className =
    "flex flex-col sm:flex-row sm:items-center gap-5 py-8 border-b-2 border-ink last:border-0 text-ink hover:bg-surface";

  const content = (
    <>
      <span className="w-24 h-24 flex-none border-2 border-ink overflow-hidden flex items-center justify-center bg-surface">
        {edition.logo_path ? (
          <Image
            src={edition.logo_path}
            alt={edition.name}
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        ) : null}
      </span>

      <div className="flex items-center gap-3 flex-none">
        <DateBox date={edition.start_date} year={edition.start_year} />
        {hasEnd && (
          <>
            <ChevronRight size={16} className="text-ink-400 flex-none" />
            <DateBox date={edition.end_date} year={edition.end_year} />
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
    </>
  );

  if (!isLive) return <div className={className}>{content}</div>;

  return (
    <Link href={`/games/${edition.slug}`} className={className}>
      {content}
    </Link>
  );
}
