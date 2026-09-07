import type { Metadata } from "next";
import VideoGallery from "@/components/videos/VideoGallery";
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

      <VideoGallery feature={feature} videos={videos} />
    </main>
  );
}
