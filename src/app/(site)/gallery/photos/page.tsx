import type { Metadata } from "next";
import PhotoGrid from "@/components/gallery/PhotoGrid";
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
          <PhotoGrid photos={photos} />
        </div>
      </section>
    </main>
  );
}
