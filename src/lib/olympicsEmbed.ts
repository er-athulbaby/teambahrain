// The Olympics.com syndicated player just needs the video's slug — the last
// segment of its own page URL — so the embed can be rebuilt from a plain
// live_url link instead of sending visitors to olympics.com.
export function olympicsEmbedCode(liveUrl: string) {
  const slug = liveUrl.replace(/\/+$/, "").split("/").pop();
  if (!slug) return null;
  return `<script src="https://olympics.com/static/js/syndicated/v1/embed.js"></script><div id="ocplayer1"></div><script>var player = new OLYMPIC_CHANNEL.Syndicated('${slug}', {dimensions: [950,534], id: 'ocplayer1'})</script>`;
}
