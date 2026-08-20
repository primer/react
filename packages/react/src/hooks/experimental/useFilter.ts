import {useCallback, useMemo, useState} from 'react'

export interface UseFilterOptions {
  /** Initial query (uncontrolled). */
  defaultQuery?: string

  /** Controlled query value. */
  query?: string

  /** Called whenever the query changes. */
  onQueryChange?: (query: string) => void

  /**
   * Custom predicate used to test an item's searchable text against the query.
   * Defaults to a case-insensitive substring match.
   */
  contains?: (itemText: string, query: string) => boolean
}

export interface UseFilterReturn {
  /** The current query string. */
  query: string
  /** Update the query string. */
  setQuery: (query: string) => void
  /** Test whether a single piece of text matches the current query. */
  matches: (itemText: string) => boolean
  /**
   * Filter an arbitrary dataset by deriving searchable text from each item.
   * The same hook instance (one shared query) can filter many datasets — this
   * is what lets one search input drive several tabs.
   */
  filter: <T>(items: readonly T[], getText: (item: T) => string) => T[]
  /** Count of items in a dataset that match the current query (for tab badges). */
  count: <T>(items: readonly T[], getText: (item: T) => string) => number
}

const defaultContains = (itemText: string, query: string) => itemText.toLowerCase().includes(query.toLowerCase())

/**
 * A single, shareable text filter. The query is decoupled from any particular
 * dataset, so one `useFilter` instance can filter several arrays — e.g. one
 * search input filtering both a Branches list and a Tags list, and producing
 * per-tab match counts without re-implementing the matching logic.
 */
export function useFilter(options: UseFilterOptions = {}): UseFilterReturn {
  const {defaultQuery = '', query: controlledQuery, onQueryChange, contains = defaultContains} = options

  const [internalQuery, setInternalQuery] = useState(defaultQuery)
  const isControlled = controlledQuery !== undefined
  const query = isControlled ? controlledQuery : internalQuery

  const setQuery = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalQuery(next)
      }
      onQueryChange?.(next)
    },
    [isControlled, onQueryChange],
  )

  const matches = useCallback(
    (itemText: string) => query.trim() === '' || contains(itemText, query.trim()),
    [query, contains],
  )

  const filter = useCallback(
    <T>(items: readonly T[], getText: (item: T) => string): T[] => items.filter(item => matches(getText(item))),
    [matches],
  )

  const count = useCallback(
    <T>(items: readonly T[], getText: (item: T) => string): number => filter(items, getText).length,
    [filter],
  )

  return useMemo(() => ({query, setQuery, matches, filter, count}), [query, setQuery, matches, filter, count])
}
