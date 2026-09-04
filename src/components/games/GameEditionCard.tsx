import Link from "next/link";
import Image from "next/image";
import { formatEditionDate } from "@/lib/formatEditionDate";
import type { GameEdition } from "@/types";

export default function GameEditionCard({
  edition,
  headingLevel: Heading = "h2",
}: {
  edition: GameEdition;
  /** "h2" on /games (page has one h1); "h3" in the home page section (nested under SectionHead's h2). */
  headingLevel?: "h2" | "h3";
}) {
  const isLive = edition.status === "live";
  const className = "border-2 border-ink p-6 flex flex-col gap-4 hover:bg-surface";

  const content = (
    <>
      {edition.logo_path && (
        <Image
          src={edition.logo_path}
          alt={edition.name}
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
        />
      )}
      <div>
        <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
          {edition.edition_type}
        </span>
        <Heading className="m-0 font-bold text-2xl uppercase">{edition.name}</Heading>
        <p className="m-0 text-sm text-ink-700 mt-1">
          {edition.city} · {formatEditionDate(edition.start_date, edition.start_year)}
        </p>
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
