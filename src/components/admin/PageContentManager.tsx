"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageOff, Loader2, UploadCloud, VideoOff } from "lucide-react";
import type { PageContentConfig } from "@/lib/admin/pageContentConfig";
import { uploadFile } from "@/lib/admin/uploadClient";
import Card from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

export default function PageContentManager({
  page,
  config,
}: {
  page: string;
  config: PageContentConfig;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/page-content/${page}`);
    if (res.ok) setValues(await res.json());
    setLoading(false);
  }, [page]);

  useEffect(() => {
    // Fetch-on-mount: the flagged setState only runs after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleUpload(fieldKey: string, file: File) {
    setUploadingField(fieldKey);
    setError(null);
    try {
      const url = await uploadFile(file);
      setValues((v) => ({ ...v, [fieldKey]: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/page-content/${page}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Save failed");
      return;
    }
    setSaved(true);
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-400">
        <Loader2 size={15} className="animate-spin" /> Loading…
      </p>
    );
  }

  return (
    <Card className="p-6 max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {config.fields.map((field) => (
          <div key={field.key}>
            {field.type === "boolean" ? (
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={values[field.key] === "true"}
                  onChange={(e) => {
                    setSaved(false);
                    setValues((v) => ({ ...v, [field.key]: e.target.checked ? "true" : "false" }));
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                {field.label}
              </label>
            ) : (
              <label className="mb-1.5 block text-xs font-medium text-slate-600">{field.label}</label>
            )}
            {field.hint && <p className="mb-1.5 text-xs text-slate-400">{field.hint}</p>}

            {field.type === "textarea" && (
              <textarea
                value={values[field.key] ?? ""}
                onChange={(e) => {
                  setSaved(false);
                  setValues((v) => ({ ...v, [field.key]: e.target.value }));
                }}
                rows={field.key.includes("headline") ? 2 : 3}
                className={inputClass}
              />
            )}

            {(field.type === "text" || field.type === "date") && (
              <input
                type={field.type}
                value={values[field.key] ?? ""}
                onChange={(e) => {
                  setSaved(false);
                  setValues((v) => ({ ...v, [field.key]: e.target.value }));
                }}
                className={inputClass}
              />
            )}

            {field.type === "image" && (
              <div className="flex items-center gap-3">
                <span className="h-16 w-16 flex-none rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                  {values[field.key] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values[field.key]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff size={18} className="text-slate-300" />
                  )}
                </span>
                <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                  <UploadCloud size={15} strokeWidth={1.75} />
                  {uploadingField === field.key ? "Uploading…" : "Choose image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(field.key, file);
                    }}
                  />
                </label>
              </div>
            )}

            {field.type === "video" && (
              <div className="flex items-center gap-3">
                <span className="h-16 w-28 flex-none rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                  {values[field.key] ? (
                    <video src={values[field.key]} controls className="h-full w-full object-cover" />
                  ) : (
                    <VideoOff size={18} className="text-slate-300" />
                  )}
                </span>
                <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
                  <UploadCloud size={15} strokeWidth={1.75} />
                  {uploadingField === field.key ? "Uploading…" : "Choose video"}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(field.key, file);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        {saved && !error && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Saved.
          </div>
        )}

        <div>
          <Button type="submit" variant="primary" disabled={saving || uploadingField !== null}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
