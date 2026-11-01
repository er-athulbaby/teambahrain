export default function LiveEmbed({ html }: { html: string }) {
  return <div className="live-embed h-full [&_iframe]:w-full [&_iframe]:h-full" dangerouslySetInnerHTML={{ __html: html }} />;
}
