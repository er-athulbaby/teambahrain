import Image from "next/image";

export default function ImageTile({
  src,
  alt,
  aspect = "4/3",
  sizes = "100vw",
  className = "",
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
