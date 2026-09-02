"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator === "undefined" || navigator.webdriver) return;

    const payload = JSON.stringify({ path: pathname, referrer: document.referrer || null });
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
  }, [pathname]);

  return null;
}
