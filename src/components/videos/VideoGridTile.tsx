"use client";

import { useState } from "react";
import ImageTile from "@/components/shared/ImageTile";
import type { Video } from "@/types";

function VideoMeta({ video }: { video: Video }) {
  return (
    <>
      <span className="flex gap-2.5 items-center">
        <span className="bg-ink text-white px-2 py-1 font-bold text-[11px] tracking-[0.06em] tabular-nums">
          {video.duration}
        </span>
        <span className="font-semibold text-[11px] tracking-[0.14em] uppercase text-accent-700">
          {video.series}
        </span>
      </span>
      <span className="font-semibold text-[22px] leading-[1.1] tracking-[-0.02em]">{video.title}</span>
    </>
  );
}

export default function VideoGridTile({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (playing && video.video_path) {
    return (
      <div className="flex flex-col gap-3.5">
        <div className="relative w-full overflow-hidden border-2 border-ink" style={{ aspectRatio: "16/9" }}>
          <video
            src={video.video_path}
            controls
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <VideoMeta video={video} />
      </div>
    );
  }

  const thumbnail = (
    <ImageTile
      src={video.photo_path}
      alt={video.title}
      aspect="16/9"
      sizes="(max-width: 1024px) 100vw, 33vw"
      className="border-2 border-ink"
    />
  );

  return (
    <div className="flex flex-col gap-3.5">
      {video.video_path ? (
        <button type="button" onClick={() => setPlaying(true)} className="relative block w-full text-left">
          {thumbnail}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 bg-accent text-white flex items-center justify-center text-lg">▶</span>
          </span>
        </button>
      ) : (
        <span className="relative block w-full">{thumbnail}</span>
      )}
      <VideoMeta video={video} />
    </div>
  );
}
