/**
 * Joins id references for attributes such as `aria-describedby`, `aria-labelledby`, and `headers`, keeping their
 * order while dropping empty entries and duplicates. Returns `undefined` when nothing remains so the attribute is
 * omitted.
 */
export function joinIdRefs(...ids: Array<string | false | null | undefined>): string | undefined {
  const tokens = ids.flatMap(id => (id ? id.split(/\s+/).filter(Boolean) : []))
  return tokens.length > 0 ? Array.from(new Set(tokens)).join(' ') : undefined
}
