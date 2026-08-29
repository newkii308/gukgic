import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user-submitted text and HTML content against XSS
 */
export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  // Strip any malicious HTML tags, JavaScript URLs, script blocks
  const clean = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Plain text only
    ALLOWED_ATTR: [],
  });
  return clean;
}

/**
 * Sanitize rich text / safe formatted content
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return '';
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span', 'code'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}
