import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LiveSessionsList from "@/components/games/LiveSessionsList";
import { getEditionBySlug, getEditionLiveEvents, getEditionLiveSessions } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Live — Team Bahrain",
};

export default async function EditionLivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const [events, sessions] = await Promise.all([
    getEditionLiveEvents(edition.id),
    getEditionLiveSessions(edition.id),
  ]);
  return <LiveSessionsList events={events} editionStart={edition.start_date} sessions={sessions} />;
}
