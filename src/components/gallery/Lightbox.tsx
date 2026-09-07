"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";

export type LightboxItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; title: string };

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const count = items.length;
  const current = items[index];

  const goPrev = useCallback(() => onNavigate((index - 1 + count) % count), [index, count, onNavigate]);
  const goNext = useCallback(() => onNavigate((index + 1) % count), [index, count, onNavigate]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (typeof document === "undefined" || !current) return null;

  const downloadName = current.src.split("/").pop() ?? "download";

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-white/80 hover:text-white z-10"
      >
        <X size={28} strokeWidth={1.75} />
      </button>

      <a
        href={current.src}
        download={downloadName}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download"
        className="absolute top-5 right-16 text-white/80 hover:text-white z-10"
      >
        <Download size={24} strokeWidth={1.75} />
      </a>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          >
            <ChevronLeft size={36} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10"
          >
            <ChevronRight size={36} strokeWidth={1.5} />
          </button>
        </>
      )}

      <div className="w-full h-full flex items-center justify-center px-4 sm:px-20 py-16" onClick={onClose}>
        {current.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.src}
            alt={current.alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <video
            src={current.src}
            controls
            autoPlay
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>,
    document.body
  );
}
