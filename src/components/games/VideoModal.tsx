"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Olympics.com's syndicated player doesn't render inside the container we
// give it — its own CSS forces `body { position: relative }` and makes its
// `.player-container` `position: absolute; inset: 0`, so it escapes to a
// full-page overlay on <body> at z-index: 3. Our chrome has to sit ABOVE
// that (not wrap it), or it just covers the video. The backdrop click-to-
// close layer stays below it instead, since the player's own opaque
// background already covers the page once it loads.
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
      // The player's elements live outside React's tree (appended straight
      // to <body>), so they're not torn down when this component unmounts —
      // clean up anything it left behind, or closing leaves a stuck
      // full-page black overlay on the site.
      document.querySelectorAll(".player-container").forEach((el) => el.remove());
      document.getElementById("ocplayer1")?.remove();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2] bg-black/90" onClick={onClose} />
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
      <div className="fixed inset-0 z-[1]">{children}</div>
    </>,
    document.body
  );
}
