import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { getEditionBySlug, getEditionSports } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Sports — Team Bahrain",
};

export default async function EditionSportsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const sports = await getEditionSports(edition.id);

  return (
    <section className="border-b-2 border-ink">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-7">
          {sports.map((s) => (
            <article
              key={s.id}
              className="border-2 border-ink bg-ground flex flex-col items-center gap-3 p-6 text-center"
            >
              <span className="h-16 w-16 flex-none flex items-center justify-center">
                {s.icon_path ? (
                  <Image
                    src={s.icon_path}
                    alt={s.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <ImageOff size={22} className="text-ink-400" />
                )}
              </span>
              <h3 className="m-0 font-bold text-base uppercase leading-tight">{s.name}</h3>
            </article>
          ))}
          {sports.length === 0 && (
            <p className="text-ink-700 text-base py-8 col-span-full">No sports listed for this edition yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
