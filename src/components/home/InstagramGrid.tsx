import ImageTile from "@/components/shared/ImageTile";
import type { InstagramPost } from "@/types";

export default function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {posts.map((p) => (
            <a
              key={p.id}
              href={p.permalink}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col gap-2.5 text-ink hover:text-accent-700"
            >
              <ImageTile
                src={p.photo_path}
                alt={p.caption}
                aspect="1/1"
                sizes="(max-width: 1024px) 33vw, 16vw"
                className="border-2 border-ink"
              />
              <span className="font-semibold text-[11px] tracking-[0.1em] uppercase">
                ♥ {p.likes}
              </span>
              <span className="text-[13px] leading-[1.4] text-ink-700">{p.caption}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
