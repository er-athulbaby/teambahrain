import type { Metadata } from "next";
import ImageTile from "@/components/shared/ImageTile";
import { getPhotos } from "@/lib/data/photos";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "Photos — Team Bahrain",
};

export default async function PhotosPage() {
  const [photos, content] = await Promise.all([getPhotos(), getPageContent("photos")]);

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
        </div>
      </section>

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((p) => (
              <figure key={p.id} className="border-2 border-ink bg-ground flex flex-col m-0">
                <ImageTile src={p.image_path} alt={p.caption ?? ""} aspect="4/3" />
                {p.caption && (
                  <figcaption className="p-4 text-sm text-ink-700">{p.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
          {photos.length === 0 && (
            <p className="text-ink-700 text-base py-8">No photos uploaded yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
