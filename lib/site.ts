export function getSiteName(sourceUrl: string) {
  try {
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "unknown source";
  }
}

export function getImageExtension(contentType: string | null, sourceUrl: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  if (contentType?.includes("avif")) return "avif";
  if (contentType?.includes("svg")) return "svg";

  const pathname = safePathname(sourceUrl);
  const match = pathname.match(/\.([a-z0-9]{2,5})$/i);
  return match?.[1]?.toLowerCase() || "jpg";
}

function safePathname(value: string) {
  try {
    return new URL(value).pathname;
  } catch {
    return "";
  }
}
