import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { queryOne } from "@/lib/db";
import { RESOURCES } from "@/lib/admin/resources";
import AdminResourceManager from "@/components/admin/AdminResourceManager";

export default async function ManageGameEditionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edition = await queryOne<{ id: number; name: string }>(
    `SELECT id, name FROM game_editions WHERE id = $1`,
    [id]
  );
  if (!edition) notFound();

  return (
    <div>
      <Link
        href="/admin/game_editions"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 mb-4"
      >
        <ArrowLeft size={13} strokeWidth={1.75} />
        All games editions
      </Link>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">{edition.name}</h1>
      <p className="mb-8 text-sm text-slate-500">
        Manage this edition&apos;s Delegation, Players, Events &amp; Results, Sports and Medals.
      </p>

      <div className="flex flex-col gap-12">
        <AdminResourceManager resource={RESOURCES.game_edition_delegates} scopeValue={edition.id} />
        <AdminResourceManager resource={RESOURCES.game_edition_players} scopeValue={edition.id} />
        <AdminResourceManager resource={RESOURCES.game_edition_sports} scopeValue={edition.id} />
        <AdminResourceManager resource={RESOURCES.game_edition_events} scopeValue={edition.id} />
        <AdminResourceManager resource={RESOURCES.game_edition_medals} scopeValue={edition.id} />
      </div>
    </div>
  );
}
