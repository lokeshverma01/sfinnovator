/**
 * Solution presentation helpers — shared by the portfolio card and detail page
 * so status labels and action links stay consistent.
 */
import type { CollectionEntry } from 'astro:content';

type SolutionData = CollectionEntry<'portfolio'>['data'];

/** Status slug → { variant (badge class), label }. Undefined if no status. */
export function statusBadge(status?: string) {
  switch (status) {
    case 'shipped':
      return { variant: 'shipped' as const, label: 'Shipped' };
    case 'in-progress':
      return { variant: 'in-progress' as const, label: 'In progress' };
    case 'concept':
      return { variant: 'concept' as const, label: 'Concept' };
    default:
      return undefined;
  }
}

/** Build the list of action links a solution actually has (skips missing ones). */
export function actionLinks(data: SolutionData) {
  const links: { label: string; href: string; primary?: boolean }[] = [];
  if (data.useUrl) links.push({ label: '▶ Use it live', href: data.useUrl, primary: true });
  if (data.validateUrl) links.push({ label: '✓ Validate', href: data.validateUrl });
  if (data.repoUrl) links.push({ label: '👁 Source', href: data.repoUrl });
  if (data.blogSlug) links.push({ label: '📝 Read the write-up', href: `/blog/${data.blogSlug}/` });
  return links;
}

/** Initials from a title, for the thumbnail fallback (max 2 chars). */
export function initialsOf(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
