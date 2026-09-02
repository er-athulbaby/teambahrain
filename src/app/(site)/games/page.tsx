import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedEditions } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Games — Team Bahrain",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function GamesIndexPage() {
  const editions = await getPublishedEditions();

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            Team Bahrain at the Games
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            Games
          </h1>
          <p className="m-0 max-w-[58ch] text-lg sm:text-[19px] leading-[1.5] text-ink-800 text-pretty">
            Delegation, players, fixtures, results and medals for every Games edition Bahrain has
            sent a team to.
          </p>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {editions.map((e) => (
              <Link
                key={e.id}
                href={`/games/${e.slug}`}
                className="border-2 border-ink p-6 flex flex-col gap-4 hover:bg-surface"
              >
                {e.logo_path && (
                  <Image src={e.logo_path} alt={e.name} width={56} height={56} className="h-14 w-14 object-contain" />
                )}
                <div>
                  <span className="font-semibold text-[11px] tracking-[0.16em] uppercase text-accent-700">
                    {e.edition_type}
                  </span>
                  <h2 className="m-0 font-bold text-2xl uppercase">{e.name}</h2>
                  <p className="m-0 text-sm text-ink-700 mt-1">
                    {e.city} · {formatDate(e.start_date)}
                  </p>
                </div>
              </Link>
            ))}
            {editions.length === 0 && <p className="text-ink-700">No Games editions published yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
