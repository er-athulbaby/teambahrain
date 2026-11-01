export default function LiveEmbed({ html }: { html: string }) {
  return (
    <div
      className="live-embed h-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
