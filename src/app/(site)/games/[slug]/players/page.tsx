import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlayerRoster from "@/components/games/PlayerRoster";
import { getEditionBySlug, getEditionPlayers, getEditionSports } from "@/lib/data/games";

export const metadata: Metadata = {
  title: "Players — Team Bahrain",
};

export default async function PlayersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const [players, sports] = await Promise.all([
    getEditionPlayers(edition.id),
    getEditionSports(edition.id),
  ]);

  return <PlayerRoster players={players} sports={sports} />;
}
