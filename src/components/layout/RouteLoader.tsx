"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    function startsInternalNavigation(target: EventTarget | null): boolean {
      const anchor = (target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return false;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return false;
      return true;
    }

    function handleClick(e: MouseEvent) {
      if (!startsInternalNavigation(e.target)) return;
      setVisible(true);
      setProgress(15);
      trickleRef.current = setInterval(() => {
        setProgress((p) => (p < 80 ? p + (80 - p) * 0.1 : p));
      }, 200);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled]);

  useEffect(() => {
    if (!visible) return;
    if (trickleRef.current) clearInterval(trickleRef.current);
    const completeTimeout = setTimeout(() => setProgress(100), 0);
    const hideTimeout = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
    return () => {
      clearTimeout(completeTimeout);
      clearTimeout(hideTimeout);
    };
    // Deliberately pathname-only: this should complete the bar when navigation
    // lands, not re-run every time `visible` itself flips on from a click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!enabled || !visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
