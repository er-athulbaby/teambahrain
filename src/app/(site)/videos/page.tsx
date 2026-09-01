import type { Metadata } from "next";
import ImageTile from "@/components/shared/ImageTile";
import { getFeatureVideo, getVideoList } from "@/lib/data/videos";

export const metadata: Metadata = {
  title: "Videos — Team Bahrain",
};

export default async function VideosPage() {
  const [feature, videos] = await Promise.all([getFeatureVideo(), getVideoList()]);

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
            Team Bahrain TV
          </span>
          <h1 className="m-0 font-bold text-6xl sm:text-8xl leading-[0.88] tracking-[-0.015em] uppercase">
            Videos
          </h1>
        </div>
      </section>

      {feature && (
        <section className="border-b-2 border-ink">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
            <div className="relative border-2 border-ink">
              <ImageTile
                src={feature.photo_path}
                alt={feature.title}
                aspect="21/9"
              />
              <div className="absolute left-0 bottom-0 bg-ground border-t-2 border-r-2 border-ink px-5 sm:px-7 py-4 sm:py-6 flex items-center gap-4 sm:gap-6 pointer-events-none">
                <span className="w-10 h-10 sm:w-14 sm:h-14 bg-accent text-white flex items-center justify-center text-lg sm:text-xl flex-none">
                  ▶
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-semibold text-[10px] tracking-[0.16em] uppercase text-accent-700">
                    {feature.series} · {feature.duration}
                  </span>
                  <span className="font-bold text-xl sm:text-[32px] leading-none tracking-[-0.01em] uppercase">
                    {feature.title}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div key={v.id} className="flex flex-col gap-3.5">
                <span className="relative block w-full">
                  <ImageTile
                    src={v.photo_path}
                    alt={v.title}
                    aspect="16/9"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="border-2 border-ink"
                  />
                </span>
                <span className="flex gap-2.5 items-center">
                  <span className="bg-ink text-white px-2 py-1 font-bold text-[11px] tracking-[0.06em] tabular-nums">
                    {v.duration}
                  </span>
                  <span className="font-semibold text-[11px] tracking-[0.14em] uppercase text-accent-700">
                    {v.series}
                  </span>
                </span>
                <span className="font-semibold text-[22px] leading-[1.1] tracking-[-0.02em]">
                  {v.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
