import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageTile from "@/components/shared/ImageTile";
import { getEditionBySlug, getEditionDelegates } from "@/lib/data/games";
import type { GameEditionDelegate } from "@/types";

export const metadata: Metadata = {
  title: "Delegation — Team Bahrain",
};

function DelegateGrid({ delegates }: { delegates: GameEditionDelegate[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-7">
      {delegates.map((d) => (
        <article key={d.id} className="flex flex-col gap-3">
          <ImageTile
            src={d.photo_path}
            alt={d.name}
            aspect="1/1"
            objectPosition="top"
            className="border-2 border-ink"
          />
          <div>
            <h3 className="m-0 font-bold text-base leading-tight uppercase">{d.name}</h3>
            <p className="m-0 text-sm text-ink-700">{d.title}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function DelegationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const delegates = await getEditionDelegates(edition.id);
  const official = delegates.filter((d) => d.group_name === "official");
  const administrative = delegates.filter((d) => d.group_name === "administrative");

  return (
    <>
      {official.length > 0 && (
        <section className="border-b-2 border-ink">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
            <h2 className="m-0 mb-8 font-bold text-3xl sm:text-4xl uppercase pb-6 border-b-2 border-ink">
              Official Delegation
            </h2>
            <DelegateGrid delegates={official} />
          </div>
        </section>
      )}

      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <h2 className="m-0 mb-8 font-bold text-3xl sm:text-4xl uppercase pb-6 border-b-2 border-ink">
            Administrative Delegation
          </h2>
          {administrative.length > 0 ? (
            <DelegateGrid delegates={administrative} />
          ) : (
            <p className="text-ink-700">No administrative delegation listed yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
