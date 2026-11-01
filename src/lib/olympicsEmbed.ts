// Olympics.com's syndicated iframe needs our partner identity in the query
// string or it withholds consent and serves a blank player — confirmed
// working by their partner support team for teambahrain.bh.
export function olympicsEmbedCode(liveUrl: string) {
  const slug = liveUrl.replace(/\/+$/, "").split("/").pop();
  if (!slug) return null;
  const src = `https://olympics.com/video/syndicated/detail/${slug}?partner_name=www.teambahrain.bh%2F&partnerdomain=www.olympics.com%2F`;
  return `<iframe frameborder="0" scrolling="no" allowfullscreen="true" width="950" height="534" src="${src}"></iframe>`;
}
