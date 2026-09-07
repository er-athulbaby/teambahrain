"use client";

import { useState } from "react";
import FeatureVideo from "./FeatureVideo";
import VideoGridTile from "./VideoGridTile";
import Lightbox, { type LightboxItem } from "@/components/gallery/Lightbox";
import type { Video } from "@/types";

export default function VideoGallery({
  feature,
  videos,
}: {
  feature: Video | null | undefined;
  videos: Video[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Feature video (if playable) leads the sequence, then the grid — one
  // combined order so prev/next in the lightbox moves through every video
  // on the page, not just the grid.
  const playable = [feature, ...videos].filter((v): v is Video => Boolean(v?.video_path));
  const items: LightboxItem[] = playable.map((v) => ({ type: "video", src: v.video_path!, title: v.title }));

  function openFor(video: Video) {
    const i = playable.findIndex((v) => v.id === video.id);
    if (i !== -1) setOpenIndex(i);
  }

  return (
    <>
      {feature && (
        <section className="border-b-2 border-ink">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
            <FeatureVideo video={feature} onPlay={feature.video_path ? () => openFor(feature) : undefined} />
          </div>
        </section>
      )}

      <section className="border-b-2 border-ink bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((v) => (
              <VideoGridTile key={v.id} video={v} onPlay={v.video_path ? () => openFor(v) : undefined} />
            ))}
          </div>
        </div>
      </section>

      {openIndex !== null && (
        <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </>
  );
}
