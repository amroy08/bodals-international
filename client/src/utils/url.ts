/**
 * Formats a URL to ensure it is absolute (starts with http:// or https://)
 * so the browser does not treat it as a relative path.
 */
export function formatSocialUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return trimmed;
  
  // Check if it's already an absolute URL (http:// or https://)
  if (/^(https?:\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  
  // Check if it's a mailto or tel link
  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  
  // Prepend https:// for domains/sub-paths entered directly
  return `https://${trimmed}`;
}
