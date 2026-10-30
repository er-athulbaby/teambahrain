"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function VideoModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-white/80 hover:text-white z-10"
      >
        <X size={28} strokeWidth={1.75} />
      </button>
      <div
        className="w-full max-w-3xl flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 font-bold text-lg uppercase text-white text-center">{title}</h2>
        <div className="w-full aspect-video bg-black">{children}</div>
      </div>
    </div>,
    document.body
  );
}
