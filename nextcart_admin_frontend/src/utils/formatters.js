export function prettifySlug(value) {
  if (!value) return '—'
  return value.replaceAll('-', ' ')
}
