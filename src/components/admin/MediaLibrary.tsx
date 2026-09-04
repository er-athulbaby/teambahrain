"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageOff, Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadFile } from "@/lib/admin/uploadClient";
import Card from "@/components/admin/ui/Card";

interface MediaItem {
  id: number;
  url: string;
  content_type: string;
  filename: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/media");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the flagged setState only runs after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      await uploadFile(file);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    if (
      !confirm(
        `Delete "${item.filename}"? This removes the file from storage — if anything on the site still uses it, that image or video will break.`
      )
    )
      return;
    await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Media</h1>
      <p className="mb-6 text-sm text-slate-500">
        {items.length} file{items.length === 1 ? "" : "s"} uploaded — every image and video ever
        uploaded through the admin panel, in one place.
      </p>

      <div className="mb-6">
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer">
          <UploadCloud size={15} strokeWidth={1.75} />
          {uploading ? "Uploading…" : "Upload new file"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon,video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </label>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 size={15} className="animate-spin" /> Loading…
        </p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-400">
          Nothing uploaded yet — files uploaded anywhere in the admin panel will show up here.
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-2 flex flex-col gap-2">
              <span className="aspect-square rounded-md border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                {item.content_type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                ) : item.content_type.startsWith("video/") ? (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                ) : (
                  <ImageOff size={18} className="text-slate-300" />
                )}
              </span>
              <p className="text-xs text-slate-600 truncate" title={item.filename}>
                {item.filename}
              </p>
              <button
                onClick={() => handleDelete(item)}
                className="inline-flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-red-600"
              >
                <Trash2 size={12} strokeWidth={1.75} />
                Delete
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
