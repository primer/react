import type {UniqueRow} from './row'

// ---------------------------------------------------------------------------
// Filter strategies
// ---------------------------------------------------------------------------

/**
 * Filter strategy: case-insensitive substring match against the stringified
 * cell value. This is the most common default for free-text column filtering.
 */
export function substring(value: unknown, query: string): boolean {
  return stringifyForFilter(value).toLowerCase().includes(query.toLowerCase())
}

/**
 * Filter strategy: case-insensitive starts-with match against the stringified
 * cell value.
 */
export function startsWith(value: unknown, query: string): boolean {
  return stringifyForFilter(value).toLowerCase().startsWith(query.toLowerCase())
}

export const strategies = {
  substring,
  startsWith,
}

export type FilterStrategy = keyof typeof strategies
export type CustomFilterStrategy<Data extends UniqueRow> = (value: unknown, query: string, row: Data) => boolean

/**
 * Stringify a value for filter comparison. Arrays are joined with `, ` to
 * mirror common cell rendering; plain objects are JSON-stringified; nullish
 * values become the empty string. The same helper is used by both built-in
 * strategies so consumers get consistent results.
 */
export function stringifyForFilter(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) {
    return value.map(v => stringifyForFilter(v)).join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }
  return String(value)
}

/**
 * Decide whether a row matches a single column's filter query. Returns `true`
 * when the trimmed query is empty so consumers can leave inputs blank without
 * collapsing the row set.
 */
export function matches<Data extends UniqueRow>(
  filterBy: true | FilterStrategy | CustomFilterStrategy<Data>,
  value: unknown,
  query: string,
  row: Data,
): boolean {
  const trimmed = query.trim()
  if (trimmed === '') return true

  if (filterBy === true) {
    return substring(value, trimmed)
  }

  if (typeof filterBy === 'function') {
    return filterBy(value, trimmed, row)
  }

  return strategies[filterBy](value, trimmed)
}
