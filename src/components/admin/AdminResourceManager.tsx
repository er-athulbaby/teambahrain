"use client";

import { useCallback, useEffect, useState } from "react";
import type { ResourceConfig } from "@/lib/admin/resources";

type Row = Record<string, unknown> & { id: number };

function emptyForm(resource: ResourceConfig): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const field of resource.fields) {
    form[field.key] = field.type === "boolean" ? false : field.type === "select" ? field.options?.[0] ?? "" : "";
  }
  return form;
}

export default function AdminResourceManager({ resource }: { resource: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyForm(resource));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/${resource.key}`);
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }, [resource.key]);

  useEffect(() => {
    // Fetch-on-mount: the flagged setState only runs after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm(resource));
    setError(null);
  }

  function startEdit(row: Row) {
    setEditingId(row.id);
    const next: Record<string, unknown> = {};
    for (const field of resource.fields) next[field.key] = row[field.key] ?? "";
    setForm(next);
    setError(null);
  }

  async function handleUpload(fieldKey: string, file: File) {
    setUploading(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed");
      return;
    }
    const data = await res.json();
    setForm((f) => ({ ...f, [fieldKey]: data.path }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/admin/${resource.key}/${editingId}` : `/api/admin/${resource.key}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      return;
    }

    startAdd();
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm(`Delete this ${resource.label.toLowerCase()}?`)) return;
    await fetch(`/api/admin/${resource.key}/${id}`, { method: "DELETE" });
    if (editingId === id) startAdd();
    load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">{resource.pluralLabel}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {rows.length} {rows.length === 1 ? resource.label.toLowerCase() : resource.pluralLabel.toLowerCase()}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-lg border border-slate-200 bg-white p-5 flex flex-col gap-4 max-w-xl"
      >
        <h2 className="text-sm font-semibold text-slate-800">
          {editingId ? `Edit ${resource.label.toLowerCase()}` : `Add ${resource.label.toLowerCase()}`}
        </h2>

        {resource.fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>

            {field.type === "textarea" && (
              <textarea
                required={field.required}
                value={String(form[field.key] ?? "")}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            )}

            {field.type === "boolean" && (
              <input
                type="checkbox"
                checked={Boolean(form[field.key])}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.checked }))}
                className="h-4 w-4"
              />
            )}

            {field.type === "select" && (
              <select
                value={String(form[field.key] ?? "")}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "image" && (
              <div className="flex items-center gap-3">
                {typeof form[field.key] === "string" && form[field.key] !== "" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={String(form[field.key])}
                    alt=""
                    className="h-14 w-14 object-cover rounded border border-slate-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(field.key, file);
                  }}
                  className="text-sm"
                />
              </div>
            )}

            {(field.type === "text" || field.type === "number" || field.type === "date") && (
              <input
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                required={field.required}
                value={String(form[field.key] ?? "")}
                onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
            )}
          </div>
        ))}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : saving ? "Saving…" : editingId ? "Save changes" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={startAdd}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5">{resource.fields.find((f) => f.key === resource.titleField)?.label ?? "Item"}</th>
                <th className="px-4 py-2.5">Order</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5 text-slate-800 max-w-md truncate">
                    {String(row[resource.titleField] ?? "")}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{String(row.sort_order ?? "")}</td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">
                    <button onClick={() => startEdit(row)} className="text-xs text-slate-500 hover:text-slate-900 mr-3">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(row.id)} className="text-xs text-slate-500 hover:text-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    Nothing here yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
