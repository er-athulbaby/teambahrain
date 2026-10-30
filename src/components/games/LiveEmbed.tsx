"use client";

import { useEffect, useRef } from "react";

// Script tags injected via innerHTML never execute — rebuild them as real
// <script> elements so the Olympics.com embed actually runs. A src-loaded
// script and an inline script right after it (which calls a global the src
// script defines) must run in that order: an inline script always executes
// immediately on insertion (no fetch delay), so each src script's onload is
// awaited before moving on, rather than inserting every script at once.
export default function LiveEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = html;

    let cancelled = false;
    const oldScripts = Array.from(container.querySelectorAll("script"));

    (async () => {
      for (const oldScript of oldScripts) {
        if (cancelled) return;
        const script = document.createElement("script");
        for (const attr of Array.from(oldScript.attributes)) script.setAttribute(attr.name, attr.value);
        script.textContent = oldScript.textContent;

        if (script.src) {
          await new Promise<void>((resolve) => {
            script.onload = () => resolve();
            script.onerror = () => resolve();
            oldScript.replaceWith(script);
          });
        } else {
          oldScript.replaceWith(script);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  return <div ref={ref} className="live-embed" />;
}
