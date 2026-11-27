const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for safe use inside HTML. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Escape text, then turn `backtick` spans into <code> elements. */
export function prose(value) {
  return esc(value).replace(/`([^`]+)`/g, '<code>$1</code>');
}
