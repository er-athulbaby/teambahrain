"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageTile from "@/components/shared/ImageTile";
import type { HeroSlide } from "@/types";

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
      <ImageTile src={slides[index].image_path} alt="" aspect="auto" className="h-full" />
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-ground border-2 border-ink p-2 hover:bg-surface"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-ground border-2 border-ink p-2 hover:bg-surface"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </>
      )}
    </>
  );
}
