/**
 * Estimate reading time in minutes from raw post body text.
 * ~200 words/minute, rounded up, minimum 1.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
