import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventsList from "@/components/games/EventsList";
import { getEditionBySlug, getEditionEvents, getEditionSports } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Results — Team Bahrain",
};

export default async function EditionResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const [results, sports] = await Promise.all([
    getEditionEvents(edition.id, true),
    getEditionSports(edition.id),
  ]);

  return <EventsList events={results} sports={sports} showResults={true} />;
}
