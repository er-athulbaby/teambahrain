import Link from "next/link";
import Image from "next/image";
import SectionHead from "@/components/shared/SectionHead";
import type { GameEdition } from "@/types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function GamesPreview({ editions }: { editions: GameEdition[] }) {
  if (editions.length === 0) return null;

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <SectionHead title="Games" href="/games" linkLabel="All editions →" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {editions.map((e) => (
            <Link
              key={e.id}
              href={`/games/${e.slug}`}
              className="border-2 border-ink p-6 flex flex-col gap-4 hover:bg-surface"
            >
              {e.logo_path && (
                <Image
                  src={e.logo_path}
                  alt={e.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 object-contain"
                />
              )}
              <div>
                <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                  {e.edition_type}
                </span>
                <h3 className="m-0 font-bold text-2xl uppercase">{e.name}</h3>
                <p className="m-0 text-sm text-ink-700 mt-1">
                  {e.city} · {formatDate(e.start_date)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
