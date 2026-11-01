export default function LiveEmbed({ html }: { html: string }) {
  return <div className="live-embed [&_iframe]:w-full [&_iframe]:aspect-video" dangerouslySetInnerHTML={{ __html: html }} />;
}
