"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageTile from "@/components/shared/ImageTile";
import type { HeroSlide } from "@/types";

const FOLD_MS = 800;

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [foldTarget, setFoldTarget] = useState<number | null>(null);
  const [foldActive, setFoldActive] = useState(false);

  function goTo(next: number) {
    if (foldTarget !== null || next === index) return;
    setFoldTarget(next);
  }

  // Mount the outgoing page flat first, then flip it on the next frame so
  // the CSS transition has a starting value to animate from.
  useEffect(() => {
    if (foldTarget === null) return;
    const raf = requestAnimationFrame(() => setFoldActive(true));
    const commit = setTimeout(() => {
      setIndex(foldTarget);
      setFoldTarget(null);
      setFoldActive(false);
    }, FOLD_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(commit);
    };
  }, [foldTarget]);

  useEffect(() => {
    if (slides.length < 2 || foldTarget !== null) return;
    const timer = setTimeout(() => goTo((index + 1) % slides.length), 6000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, foldTarget, slides.length]);

  return (
    <>
      <div className="absolute inset-0" style={{ perspective: "1600px" }}>
        {/* Incoming slide sits flat underneath, revealed as the outgoing page folds away. */}
        <div className="absolute inset-0">
          <ImageTile src={slides[foldTarget ?? index].image_path} alt="" aspect="auto" className="h-full" />
        </div>

        {foldTarget !== null && (
          <div
            className="absolute inset-0 transition-transform ease-in-out"
            style={{
              transformOrigin: "left center",
              transitionDuration: `${FOLD_MS}ms`,
              transform: foldActive ? "rotateY(-150deg)" : "rotateY(0deg)",
            }}
          >
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
              <ImageTile src={slides[index].image_path} alt="" aspect="auto" className="h-full" />
              <div
                className="absolute inset-0 transition-opacity"
                style={{
                  transitionDuration: `${FOLD_MS}ms`,
                  opacity: foldActive ? 1 : 0,
                  background: "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.4) 100%)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo((index - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-ground border-2 border-ink p-2 hover:bg-surface"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo((index + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-ground border-2 border-ink p-2 hover:bg-surface"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </>
      )}
    </>
  );
}
