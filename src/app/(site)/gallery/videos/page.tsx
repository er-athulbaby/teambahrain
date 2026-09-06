import type { Metadata } from "next";
import FeatureVideo from "@/components/videos/FeatureVideo";
import VideoGridTile from "@/components/videos/VideoGridTile";
import { getFeatureVideo, getVideoList } from "@/lib/data/videos";
import { getPageContent } from "@/lib/data/pageContent";

export const metadata: Metadata = {
  title: "Videos — Team Bahrain",
};

export default async function VideosPage() {
  const [feature, videos, content] = await Promise.all([getFeatureVideo(), getVideoList(), getPageContent("videos")]);

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

      {feature && (
        <section className="border-b-2 border-ink">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
            <FeatureVideo video={feature} />
          </div>
        </section>
      )}

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((v) => (
              <VideoGridTile key={v.id} video={v} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
