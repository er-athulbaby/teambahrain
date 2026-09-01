"use client";

import { useCallback, useEffect, useState } from "react";

type Medal = { id: number; game_id: number; sport: string; event_name: string; athlete_name: string; medal: "G" | "S" | "B" };
type Game = { id: number; year: string; city: string; sort_order: number; medals: Medal[] };

const emptyMedalForm = { sport: "", event_name: "", athlete_name: "", medal: "G" as Medal["medal"] };

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  return data.error ?? fallback;
}

export default function MedalsManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newGame, setNewGame] = useState({ year: "", city: "" });
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [editGame, setEditGame] = useState({ year: "", city: "" });

  const [medalForm, setMedalForm] = useState(emptyMedalForm);
  const [editingMedalId, setEditingMedalId] = useState<number | null>(null);
  const [editMedalForm, setEditMedalForm] = useState(emptyMedalForm);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/games");
    if (res.ok) setGames(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the flagged setState only runs after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function addGame(e: React.FormEvent) {
    e.preventDefault();
    if (!newGame.year.trim() || !newGame.city.trim()) return;
    setError(null);
    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    });
    if (!res.ok) {
      setError(await readError(res, "Could not add that Games entry"));
      return;
    }
    setNewGame({ year: "", city: "" });
    load();
  }

  function startEditGame(g: Game) {
    setEditingGameId(g.id);
    setEditGame({ year: g.year, city: g.city });
    setError(null);
  }

  async function saveGame(id: number) {
    setError(null);
    const res = await fetch(`/api/admin/games/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGame),
    });
    if (!res.ok) {
      setError(await readError(res, "Could not save changes"));
      return;
    }
    setEditingGameId(null);
    load();
  }

  async function deleteGame(id: number) {
    if (!confirm("Delete this Games entry and all its medal records?")) return;
    await fetch(`/api/admin/games/${id}`, { method: "DELETE" });
    load();
  }

  async function addMedal(gameId: number, e: React.FormEvent) {
    e.preventDefault();
    if (!medalForm.sport.trim() || !medalForm.event_name.trim() || !medalForm.athlete_name.trim()) return;
    setError(null);
    const res = await fetch(`/api/admin/games/${gameId}/medals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medalForm),
    });
    if (!res.ok) {
      setError(await readError(res, "Could not add that medal record"));
      return;
    }
    setMedalForm(emptyMedalForm);
    load();
  }

  function startEditMedal(m: Medal) {
    setEditingMedalId(m.id);
    setEditMedalForm({ sport: m.sport, event_name: m.event_name, athlete_name: m.athlete_name, medal: m.medal });
    setError(null);
  }

  async function saveMedal(id: number) {
    setError(null);
    const res = await fetch(`/api/admin/medals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editMedalForm),
    });
    if (!res.ok) {
      setError(await readError(res, "Could not save changes"));
      return;
    }
    setEditingMedalId(null);
    load();
  }

  async function deleteMedal(id: number) {
    if (!confirm("Delete this medal record?")) return;
    await fetch(`/api/admin/medals/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Olympic medals</h1>
      <p className="mb-6 text-sm text-slate-500">
        Manage the Games Bahrain has attended and the medal records within each — totals on the public
        site are always computed from these records, so add every Games (even zero-medal ones) for the
        table to render correctly.
      </p>

      {error && (
        <div className="mb-4 max-w-lg rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={addGame} className="mb-8 flex gap-2 items-end max-w-lg">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Year</label>
          <input
            value={newGame.year}
            onChange={(e) => setNewGame({ ...newGame, year: e.target.value })}
            placeholder="2024"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm w-28"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-600">Host city</label>
          <input
            value={newGame.city}
            onChange={(e) => setNewGame({ ...newGame, city: e.target.value })}
            placeholder="Paris"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Add Games
        </button>
      </form>

      {loading && <p className="text-sm text-slate-400">Loading…</p>}

      <div className="flex flex-col gap-3">
        {games.map((game) => (
          <div key={game.id} className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              {editingGameId === game.id ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editGame.year}
                    onChange={(e) => setEditGame({ ...editGame, year: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm w-20"
                  />
                  <input
                    value={editGame.city}
                    onChange={(e) => setEditGame({ ...editGame, city: e.target.value })}
                    className="rounded-md border border-slate-300 px-2 py-1 text-sm w-40"
                  />
                  <button onClick={() => saveGame(game.id)} className="text-xs font-medium text-slate-900 hover:underline">
                    Save
                  </button>
                  <button onClick={() => setEditingGameId(null)} className="text-xs text-slate-400 hover:underline">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExpanded(expanded === game.id ? null : game.id)}
                  className="text-sm font-medium text-slate-900"
                >
                  {game.city} {game.year}{" "}
                  <span className="text-slate-400">({game.medals.length} medal{game.medals.length === 1 ? "" : "s"})</span>
                </button>
              )}
              <div className="flex items-center gap-3">
                {editingGameId !== game.id && (
                  <button onClick={() => startEditGame(game)} className="text-xs text-slate-400 hover:text-slate-700">
                    Edit
                  </button>
                )}
                <button onClick={() => deleteGame(game.id)} className="text-xs text-slate-400 hover:text-red-600">
                  Delete
                </button>
              </div>
            </div>

            {expanded === game.id && (
              <div className="border-t border-slate-100 px-4 py-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Medal records</p>
                <ul className="mb-3 flex flex-col gap-1.5">
                  {game.medals.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      {editingMedalId === m.id ? (
                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          <input
                            value={editMedalForm.sport}
                            onChange={(e) => setEditMedalForm({ ...editMedalForm, sport: e.target.value })}
                            placeholder="Sport"
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm w-28"
                          />
                          <input
                            value={editMedalForm.event_name}
                            onChange={(e) => setEditMedalForm({ ...editMedalForm, event_name: e.target.value })}
                            placeholder="Event"
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm w-40"
                          />
                          <input
                            value={editMedalForm.athlete_name}
                            onChange={(e) => setEditMedalForm({ ...editMedalForm, athlete_name: e.target.value })}
                            placeholder="Athlete"
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm w-40"
                          />
                          <select
                            value={editMedalForm.medal}
                            onChange={(e) => setEditMedalForm({ ...editMedalForm, medal: e.target.value as Medal["medal"] })}
                            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                          >
                            <option value="G">Gold</option>
                            <option value="S">Silver</option>
                            <option value="B">Bronze</option>
                          </select>
                          <button onClick={() => saveMedal(m.id)} className="text-xs font-medium text-slate-900 hover:underline">
                            Save
                          </button>
                          <button onClick={() => setEditingMedalId(null)} className="text-xs text-slate-400 hover:underline">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span>
                            <span className="font-medium">{m.athlete_name}</span> — {m.sport} · {m.event_name}{" "}
                            <span className="text-xs text-slate-400">
                              ({m.medal === "G" ? "Gold" : m.medal === "S" ? "Silver" : "Bronze"})
                            </span>
                          </span>
                          <span className="flex items-center gap-3">
                            <button onClick={() => startEditMedal(m)} className="text-xs text-slate-400 hover:text-slate-700">
                              Edit
                            </button>
                            <button onClick={() => deleteMedal(m.id)} className="text-xs text-slate-400 hover:text-red-600">
                              Remove
                            </button>
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                  {game.medals.length === 0 && <li className="text-sm text-slate-400">No medals recorded.</li>}
                </ul>

                <form onSubmit={(e) => addMedal(game.id, e)} className="flex flex-wrap items-end gap-2">
                  <input
                    value={medalForm.sport}
                    onChange={(e) => setMedalForm({ ...medalForm, sport: e.target.value })}
                    placeholder="Sport"
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm w-28"
                  />
                  <input
                    value={medalForm.event_name}
                    onChange={(e) => setMedalForm({ ...medalForm, event_name: e.target.value })}
                    placeholder="Event"
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm w-40"
                  />
                  <input
                    value={medalForm.athlete_name}
                    onChange={(e) => setMedalForm({ ...medalForm, athlete_name: e.target.value })}
                    placeholder="Athlete"
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm w-40"
                  />
                  <select
                    value={medalForm.medal}
                    onChange={(e) => setMedalForm({ ...medalForm, medal: e.target.value as Medal["medal"] })}
                    className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  >
                    <option value="G">Gold</option>
                    <option value="S">Silver</option>
                    <option value="B">Bronze</option>
                  </select>
                  <button className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
                    Add medal
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
        {!loading && games.length === 0 && <p className="text-sm text-slate-400">No Games added yet.</p>}
      </div>
    </div>
  );
}
