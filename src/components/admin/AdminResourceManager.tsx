"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageOff, Loader2, Pencil, Trash2, UploadCloud } from "lucide-react";
import type { ResourceConfig } from "@/lib/admin/resources";
import Card from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";

type Row = Record<string, unknown> & { id: number };

function emptyForm(resource: ResourceConfig): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const field of resource.fields) {
    form[field.key] = field.type === "boolean" ? false : field.type === "select" ? field.options?.[0] ?? "" : "";
  }
  return form;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

export default function AdminResourceManager({ resource }: { resource: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyForm(resource));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageField = resource.fields.find((f) => f.type === "image");

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

  const shortFields = resource.fields.filter((f) => f.type !== "textarea" && f.type !== "image");
  const longFields = resource.fields.filter((f) => f.type === "textarea" || f.type === "image");

  function renderField(field: (typeof resource.fields)[number]) {
    return (
      <div key={field.key}>
        <label className="mb-1.5 block text-xs font-medium text-slate-600">
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>

        {field.type === "textarea" && (
          <textarea
            required={field.required}
            value={String(form[field.key] ?? "")}
            onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
            rows={3}
            className={inputClass}
          />
        )}

        {field.type === "boolean" && (
          <label className="flex items-center gap-2 text-sm text-slate-700 pt-1.5">
            <input
              type="checkbox"
              checked={Boolean(form[field.key])}
              onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Enabled
          </label>
        )}

        {field.type === "select" && (
          <select
            value={String(form[field.key] ?? "")}
            onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
            className={inputClass}
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
            <span className="h-16 w-16 flex-none rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
              {typeof form[field.key] === "string" && form[field.key] !== "" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(form[field.key])} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImageOff size={18} className="text-slate-300" />
              )}
            </span>
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
              <UploadCloud size={15} strokeWidth={1.75} />
              {uploading ? "Uploading…" : "Choose image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(field.key, file);
                }}
              />
            </label>
          </div>
        )}

        {(field.type === "text" || field.type === "number" || field.type === "date") && (
          <input
            type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
            required={field.required}
            value={String(form[field.key] ?? "")}
            onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
            className={inputClass}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">{resource.pluralLabel}</h1>
      <p className="mb-6 text-sm text-slate-500">
        {rows.length} {rows.length === 1 ? resource.label.toLowerCase() : resource.pluralLabel.toLowerCase()}
      </p>

      <Card className="mb-8 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-sm font-semibold text-slate-800">
            {editingId ? `Edit ${resource.label.toLowerCase()}` : `Add ${resource.label.toLowerCase()}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{shortFields.map(renderField)}</div>
          <div className="flex flex-col gap-4">{longFields.map(renderField)}</div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving || uploading} variant="primary">
              {uploading ? "Uploading…" : saving ? "Saving…" : editingId ? "Save changes" : "Add"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={startAdd}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </p>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  {imageField && <th className="px-4 py-2.5 w-16" />}
                  <th className="px-4 py-2.5">
                    {resource.fields.find((f) => f.key === resource.titleField)?.label ?? "Item"}
                  </th>
                  <th className="px-4 py-2.5">Order</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    {imageField && (
                      <td className="px-4 py-2.5">
                        <span className="block h-10 w-10 rounded-md border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                          {row[imageField.key] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={String(row[imageField.key])}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff size={14} className="text-slate-300" />
                          )}
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-2.5 text-slate-800 max-w-md truncate">
                      {String(row[resource.titleField] ?? "")}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge>{String(row.sort_order ?? "")}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => startEdit(row)}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 mr-4"
                      >
                        <Pencil size={13} strokeWidth={1.75} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
                      >
                        <Trash2 size={13} strokeWidth={1.75} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={imageField ? 4 : 3} className="px-4 py-8 text-center text-slate-400">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
