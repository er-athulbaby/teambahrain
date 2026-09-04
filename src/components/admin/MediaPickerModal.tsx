"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ImageOff, Loader2, X } from "lucide-react";

interface MediaItem {
  id: number;
  url: string;
  content_type: string;
  filename: string;
}

export default function MediaPickerModal({
  type,
  onSelect,
  onClose,
}: {
  type: "image" | "video";
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/media?type=${type}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, [type]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-slate-900/40 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-none">
          <h2 className="text-sm font-semibold text-slate-800">
            Choose from media library — {type === "image" ? "images" : "videos"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading && (
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={15} className="animate-spin" /> Loading…
            </p>
          )}
          {!loading && items.length === 0 && (
            <p className="text-sm text-slate-400">
              No {type === "image" ? "images" : "videos"} uploaded yet — use &ldquo;Choose{" "}
              {type === "image" ? "image" : "video"}&rdquo; to upload the first one.
            </p>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.url)}
                title={item.filename}
                className="aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50 hover:ring-2 hover:ring-indigo-500 flex items-center justify-center"
              >
                {type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                ) : item.content_type.startsWith("video/") ? (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                ) : (
                  <ImageOff size={18} className="text-slate-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
