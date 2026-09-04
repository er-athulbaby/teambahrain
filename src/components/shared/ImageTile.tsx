import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function ImageTile({
  src,
  alt,
  aspect = "4/3",
  sizes = "100vw",
  className = "",
  objectPosition = "center",
}: {
  src: string | null | undefined;
  alt: string;
  aspect?: string;
  sizes?: string;
  className?: string;
  /** Where to anchor the crop within the frame — "top" keeps faces in frame on headshot-style photos. */
  objectPosition?: "center" | "top";
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={objectPosition === "top" ? "object-cover object-top" : "object-cover"}
        />
      ) : (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <ImageOff size={24} className="text-ink-400" />
        </div>
      )}
    </div>
  );
}
