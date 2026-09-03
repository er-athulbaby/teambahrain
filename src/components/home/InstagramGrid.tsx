import type { InstagramPost } from "@/types";

function extractInstagramCode(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  const embeddable = posts
    .map((p) => ({ id: p.id, code: extractInstagramCode(p.reel_url) }))
    .filter((p): p is { id: number; code: string } => p.code !== null);

  if (embeddable.length === 0) return null;

  return (
    <section className="border-b-2 border-ink bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-6 pb-6 border-b-2 border-ink mb-8 flex-wrap">
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-xs tracking-[0.2em] uppercase text-accent-700">
              Instagram
            </span>
            <h2 className="m-0 font-bold text-4xl sm:text-[46px] leading-[0.98] tracking-[-0.012em] uppercase">
              @teambahrain
            </h2>
          </div>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="border-2 border-ink px-5 py-3.5 font-semibold text-[13px] tracking-[0.12em] uppercase text-ink hover:bg-ink hover:text-white"
          >
            Follow the team →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {embeddable.map((p) => (
            <div
              key={p.id}
              className="border-2 border-ink bg-ink overflow-hidden aspect-[9/16] max-h-[560px]"
            >
              <iframe
                src={`https://www.instagram.com/reel/${p.code}/embed/`}
                className="h-full w-full border-0"
                allowFullScreen
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                loading="lazy"
                title="Instagram reel"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
