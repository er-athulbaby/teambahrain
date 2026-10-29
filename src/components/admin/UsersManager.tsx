"use client";

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, Pencil, ShieldOff, Trash2, X } from "lucide-react";
import Card from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";

type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: "admin" | "editor" | "media" | "sports_editor";
  totp_enabled: boolean;
  created_at: string;
};

const emptyForm = { name: "", email: "", username: "", password: "", role: "editor" as User["role"] };

const ROLE_LABELS: Record<User["role"], string> = {
  admin: "admin",
  editor: "editor",
  media: "media",
  sports_editor: "sports editor",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

export default function UsersManager({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "", role: "editor" as User["role"] });
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the flagged setState only runs after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not create user");
      return;
    }

    setForm(emptyForm);
    load();
  }

  function startEdit(u: User) {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, username: u.username, role: u.role });
    setEditError(null);
  }

  async function saveEdit(id: number) {
    setSavingEdit(true);
    setEditError(null);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSavingEdit(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.error ?? "Could not save changes");
      return;
    }
    setEditingId(null);
    load();
  }

  async function handleResetPassword(id: number, name: string) {
    const password = window.prompt(`New password for ${name} (at least 8 characters):`);
    if (!password) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not reset password");
    }
  }

  async function handleResetMfa(id: number, name: string) {
    if (!confirm(`Reset MFA for ${name}? They'll be asked to set up a new authenticator on next login.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetMfa: true }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not reset MFA");
      return;
    }
    load();
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete ${name}'s account? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not delete user");
      return;
    }
    load();
  }

  return (
    <div>
      <Card className="mb-8 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-slate-800">Add a user</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Username</label>
              <input
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
                className={inputClass}
              >
                <option value="editor">Editor — content only</option>
                <option value="admin">Admin — full access</option>
                <option value="media">Media — Photos, Videos & Media library only</option>
                <option value="sports_editor">Sports Editor — Games editions & Media library only</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Adding…" : "Add user"}
            </Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Email</th>
                <th className="px-4 py-2.5">Username</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="px-4 py-2.5">MFA</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) =>
                editingId === u.id ? (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0 bg-slate-50">
                    <td className="px-4 py-2 align-top">
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <input
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className={inputClass}
                      />
                    </td>
                    <td className="px-4 py-2 align-top">
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as User["role"] })}
                        className={inputClass}
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="media">Media</option>
                        <option value="sports_editor">Sports Editor</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-slate-400">—</td>
                    <td className="px-4 py-2 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => saveEdit(u.id)}
                          disabled={savingEdit}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                        >
                          {savingEdit ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                        >
                          <X size={13} strokeWidth={1.75} />
                          Cancel
                        </button>
                      </div>
                      {editError && <p className="mt-1 text-xs text-red-600">{editError}</p>}
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-slate-800">
                      {u.name}
                      {String(u.id) === currentUserId && (
                        <span className="ml-2 text-xs text-slate-400">(you)</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">{u.email}</td>
                    <td className="px-4 py-2.5 text-slate-500">{u.username}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={u.role === "admin" ? "indigo" : "slate"}>{ROLE_LABELS[u.role]}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge tone={u.totp_enabled ? "indigo" : "slate"}>{u.totp_enabled ? "enabled" : "not set up"}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => startEdit(u)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
                        >
                          <Pencil size={13} strokeWidth={1.75} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleResetPassword(u.id, u.name)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600"
                        >
                          <KeyRound size={13} strokeWidth={1.75} />
                          Reset password
                        </button>
                        {u.totp_enabled && (
                          <button
                            onClick={() => handleResetMfa(u.id, u.name)}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600"
                          >
                            <ShieldOff size={13} strokeWidth={1.75} />
                            Reset MFA
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
                        >
                          <Trash2 size={13} strokeWidth={1.75} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
