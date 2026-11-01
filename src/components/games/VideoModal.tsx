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
    <>
      <div className="fixed inset-0 z-[1] bg-black/90" onClick={onClose} />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed top-5 right-5 z-[150] text-white/80 hover:text-white"
      >
        <X size={28} strokeWidth={1.75} />
      </button>
      <h2 className="fixed top-5 left-1/2 -translate-x-1/2 z-[150] m-0 font-bold text-lg uppercase text-white text-center pointer-events-none">
        {title}
      </h2>
      <div className="fixed inset-0 z-[2]">{children}</div>
    </>,
    document.body
  );
}
