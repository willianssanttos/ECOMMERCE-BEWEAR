export function cleanImageUrl(url: string): string {
    if (!url) return "";
  
    if (url.startsWith("{") && url.endsWith("}")) {
      url = url.slice(1, -1);
    }
  
    return url.replace(/^"|"$/g, "").trim();
  }