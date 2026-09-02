import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventsList from "@/components/games/EventsList";
import { getEditionBySlug, getEditionEvents, getEditionSports } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Events — Team Bahrain",
};

export default async function EditionEventsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const [events, sports] = await Promise.all([
    getEditionEvents(edition.id, false),
    getEditionSports(edition.id),
  ]);

  return <EventsList events={events} sports={sports} showResults={false} />;
}
