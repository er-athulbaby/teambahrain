export default function LiveEmbed({ html }: { html: string }) {
  return (
    <div
      className="live-embed h-full flex items-center justify-center [&_iframe]:w-full [&_iframe]:max-h-full [&_iframe]:aspect-video"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
