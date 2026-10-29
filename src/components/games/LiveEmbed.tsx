"use client";

import { useEffect, useRef } from "react";

// Script tags injected via innerHTML never execute — rebuild them as real
// <script> elements so the Olympics.com embed actually runs.
export default function LiveEmbed({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = html;
    container.querySelectorAll("script").forEach((oldScript) => {
      const script = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) script.setAttribute(attr.name, attr.value);
      script.textContent = oldScript.textContent;
      oldScript.replaceWith(script);
    });
  }, [html]);

  return <div ref={ref} className="live-embed" />;
}
