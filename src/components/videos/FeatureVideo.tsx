"use client";

import { useState } from "react";
import ImageTile from "@/components/shared/ImageTile";
import type { Video } from "@/types";

function Caption({ video, interactive }: { video: Video; interactive: boolean }) {
  return (
    <div
      className={`absolute left-0 bottom-0 bg-ground border-t-2 border-r-2 border-ink px-5 sm:px-7 py-4 sm:py-6 flex items-center gap-4 sm:gap-6 ${
        interactive ? "" : "pointer-events-none"
      }`}
    >
      <span className="w-10 h-10 sm:w-14 sm:h-14 bg-accent text-white flex items-center justify-center text-lg sm:text-xl flex-none">
        ▶
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="font-semibold text-[10px] tracking-[0.16em] uppercase text-accent-700">
          {video.series} · {video.duration}
        </span>
        <span className="font-bold text-xl sm:text-[32px] leading-none tracking-[-0.01em] uppercase">
          {video.title}
        </span>
      </span>
    </div>
  );
}

export default function FeatureVideo({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (playing && video.video_path) {
    return (
      <div className="relative border-2 border-ink">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "21/9" }}>
          <video
            src={video.video_path}
            controls
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    );
  }

  if (!video.video_path) {
    return (
      <div className="relative border-2 border-ink">
        <ImageTile src={video.photo_path} alt={video.title} aspect="21/9" />
        <Caption video={video} interactive={false} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="relative block w-full border-2 border-ink text-left"
    >
      <ImageTile src={video.photo_path} alt={video.title} aspect="21/9" />
      <Caption video={video} interactive />
    </button>
  );
}
