import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ImageTile from "@/components/shared/ImageTile";
import { getNewsBySlug } from "@/lib/data/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  return { title: article ? `${article.title} — Team Bahrain` : "News — Team Bahrain" };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const bodyText = article.body?.trim() ? article.body : article.blurb;
  const paragraphs = bodyText.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <main>
      <section className="border-b-2 border-ink">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex flex-col gap-5">
          <div className="flex gap-2.5 items-center">
            <span className="bg-accent-200 text-accent-800 px-2.5 py-1 font-semibold text-[10px] tracking-[0.14em] uppercase">
              {article.kicker}
            </span>
            <span className="font-medium text-xs tracking-[0.08em] uppercase text-ink-700">
              {formatDate(article.date)}
            </span>
          </div>
          <h1 className="m-0 font-bold text-4xl sm:text-6xl leading-[0.98] tracking-[-0.015em] text-pretty">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-10 sm:py-12">
          <ImageTile
            src={article.photo_path}
            alt={article.title}
            aspect="16/9"
            className="border-2 border-ink mb-10"
          />
          <div className="flex flex-col gap-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="m-0 text-lg leading-[1.65] text-ink-800 text-pretty">
                {p.trim()}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
