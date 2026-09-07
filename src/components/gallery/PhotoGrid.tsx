"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="border-2 border-ink bg-ground flex flex-col text-left"
          >
            <span className="relative w-full aspect-[4/3] bg-surface overflow-hidden">
              <Image
                src={p.image_path}
                alt={p.caption ?? ""}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-contain"
              />
            </span>
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
