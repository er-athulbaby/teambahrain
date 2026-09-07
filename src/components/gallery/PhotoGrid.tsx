"use client";

import { useState } from "react";
import Lightbox, { type LightboxItem } from "./Lightbox";
import type { Photo } from "@/types";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items: LightboxItem[] = photos.map((p) => ({
    type: "image",
    src: p.image_path,
    alt: p.caption ?? "",
  }));

  return (
    <>
      {/* Masonry via CSS columns — each photo keeps its own natural aspect
          ratio (no cropping, no letterbox gaps), since box heights can't be
          uniform without either cropping content or leaving empty space. */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="border-2 border-ink bg-ground flex flex-col text-left w-full mb-8 break-inside-avoid"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image_path} alt={p.caption ?? ""} loading="lazy" className="w-full h-auto block" />
            {p.caption && <span className="p-4 text-sm text-ink-700">{p.caption}</span>}
          </button>
        ))}
      </div>
      {photos.length === 0 && <p className="text-ink-700 text-base py-8">No photos uploaded yet.</p>}

      {openIndex !== null && (
        <Lightbox items={items} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </>
  );
}
