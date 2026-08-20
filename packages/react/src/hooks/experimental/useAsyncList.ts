import {useCallback, useEffect, useRef, useState} from 'react'

export type AsyncListLoadingState = 'idle' | 'loading' | 'loadingMore' | 'error'

export interface AsyncListLoadParams {
  /** The current filter text driving the load. */
  filterText: string
  /** Cursor returned by the previous load, when paginating. */
  cursor?: string
  /** Abort signal — cancelled when a newer load supersedes this one. */
  signal: AbortSignal
}

export interface AsyncListLoadResult<T> {
  items: T[]
  /** Cursor to pass to the next `loadMore` call. Omit when there are no more pages. */
  cursor?: string
}

export interface UseAsyncListOptions<T> {
  /** Loader invoked on mount, when `filterText` changes, and when paginating. */
  load: (params: AsyncListLoadParams) => Promise<AsyncListLoadResult<T>>

  /** Current filter text. Changing it triggers a fresh (non-paginated) load. */
  filterText?: string
}

export interface UseAsyncListReturn<T> {
  items: T[]
  loadingState: AsyncListLoadingState
  error: unknown
  /** Whether another page is available (a cursor was returned). */
  hasMore: boolean
  /** Load the next page, appending to `items`. */
  loadMore: () => void
  /** Re-run the initial load, replacing `items`. */
  reload: () => void
}

/**
 * A thin async-list capability with cursor pagination and request cancellation.
 *
 * Each tab in a SelectPanel can own its own `useAsyncList`, so switching tabs or
 * typing in the shared search input fetches that tab's data independently. Stale
 * responses are discarded via `AbortSignal`, so the most-recent load always wins.
 */
export function useAsyncList<T>(options: UseAsyncListOptions<T>): UseAsyncListReturn<T> {
  const {load, filterText = ''} = options

  const [items, setItems] = useState<T[]>([])
  const [loadingState, setLoadingState] = useState<AsyncListLoadingState>('idle')
  const [error, setError] = useState<unknown>(null)
  const [cursor, setCursor] = useState<string | undefined>(undefined)

  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  }, [load])
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(
    async (mode: 'replace' | 'append', currentCursor: string | undefined, currentFilter: string) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoadingState(mode === 'append' ? 'loadingMore' : 'loading')
      setError(null)

      try {
        const result = await loadRef.current({
          filterText: currentFilter,
          cursor: currentCursor,
          signal: controller.signal,
        })
        if (controller.signal.aborted) return

        setItems(prev => (mode === 'append' ? [...prev, ...result.items] : result.items))
        setCursor(result.cursor)
        setLoadingState('idle')
      } catch (err) {
        if (controller.signal.aborted || (err instanceof Error && err.name === 'AbortError')) return
        setError(err)
        setLoadingState('error')
      }
    },
    [],
  )

  // Fresh load on mount and whenever the filter text changes.
  useEffect(() => {
    run('replace', undefined, filterText)
    return () => abortRef.current?.abort()
  }, [filterText, run])

  const loadMore = useCallback(() => {
    if (cursor === undefined || loadingState === 'loading' || loadingState === 'loadingMore') return
    run('append', cursor, filterText)
  }, [cursor, loadingState, filterText, run])

  const reload = useCallback(() => {
    run('replace', undefined, filterText)
  }, [filterText, run])

  return {items, loadingState, error, hasMore: cursor !== undefined, loadMore, reload}
}
