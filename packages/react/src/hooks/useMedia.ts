import {useCallback, useContext, useSyncExternalStore} from 'react'
import {warning} from '../utils/warning'
import {MatchMediaContext} from './MatchMediaContext'

/**
 * One shared subscription per distinct media query string.
 *
 * `window.matchMedia` returns a new `MediaQueryList` on every call, so
 * without sharing, every `useMedia` instance allocates its own list and
 * registers its own `change` listener (for example, one closed `ActionMenu`
 * held 9 live listeners across 3 distinct queries). Sharing one list and one
 * listener per query keeps that cost flat however many components subscribe.
 */
type SharedMediaQuery = {
  /** The `matchMedia` implementation that produced `mediaQueryList`. */
  matchMediaFn: (query: string) => MediaQueryList
  mediaQueryList: MediaQueryList
  /** Subscriber callbacks, with a count per callback so repeated
   * subscribe/unsubscribe pairs (for example, StrictMode double effects)
   * stay balanced. */
  listeners: Map<() => void, number>
  /** Shared `change` handler attached to `mediaQueryList`, if any. */
  handleChange: ((event: MediaQueryListEvent) => void) | null
  listening: boolean
}

const sharedMediaQueries = new Map<string, SharedMediaQuery>()

function attachSharedListener(entry: SharedMediaQuery) {
  if (entry.listening || !entry.handleChange) {
    return
  }
  // Support fallback to `addListener` for broader browser support
  // @ts-ignore this is not present in Safari <14
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (entry.mediaQueryList.addEventListener) {
    entry.mediaQueryList.addEventListener('change', entry.handleChange)
  } else {
    entry.mediaQueryList.addListener(entry.handleChange)
  }
  entry.listening = true
}

function detachSharedListener(entry: SharedMediaQuery) {
  if (!entry.listening || !entry.handleChange) {
    return
  }
  // @ts-ignore this is not present in Safari <14
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (entry.mediaQueryList.removeEventListener) {
    entry.mediaQueryList.removeEventListener('change', entry.handleChange)
  } else {
    entry.mediaQueryList.removeListener(entry.handleChange)
  }
  entry.listening = false
}

function createSharedMediaQuery(mediaQueryString: string): SharedMediaQuery {
  const mediaQueryList = window.matchMedia(mediaQueryString)
  const entry: SharedMediaQuery = {
    matchMediaFn: window.matchMedia,
    mediaQueryList,
    listeners: new Map(),
    handleChange: null,
    listening: false,
  }
  entry.handleChange = () => {
    for (const listener of entry.listeners.keys()) {
      listener()
    }
  }
  return entry
}

function getSharedMediaQuery(mediaQueryString: string): SharedMediaQuery | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const existing = sharedMediaQueries.get(mediaQueryString)
  if (existing) {
    if (existing.matchMediaFn === window.matchMedia) {
      return existing
    }
    // The `matchMedia` implementation was replaced (for example, by a test
    // mock) so the cached list is stale. Rebuild the entry, carrying any live
    // subscribers over to the new list.
    const listeners = existing.listeners
    detachSharedListener(existing)
    const fresh = createSharedMediaQuery(mediaQueryString)
    fresh.listeners = listeners
    sharedMediaQueries.set(mediaQueryString, fresh)
    if (fresh.listeners.size > 0) {
      attachSharedListener(fresh)
    }
    return fresh
  }

  const entry = createSharedMediaQuery(mediaQueryString)
  sharedMediaQueries.set(mediaQueryString, entry)
  return entry
}

/**
 * `useMedia` will use the given `mediaQueryString` with `matchMedia` to
 * determine if the document matches the media query string.
 *
 * If `MatchMedia` is used as an ancestor, `useMedia` will instead use the
 * value of the media query string, if available
 *
 * @example
 * function Example() {
 *   const coarsePointer = useMedia('(pointer: coarse)');
 *   // ...
 * }
 */
export function useMedia(mediaQueryString: string, defaultState?: boolean) {
  const features = useContext(MatchMediaContext)
  // When the query is provided through `MatchMedia` context, that value always
  // wins and there is nothing external to subscribe to.
  const contextValue = features[mediaQueryString] as boolean | undefined

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (contextValue !== undefined) {
        return () => {}
      }

      const entry = getSharedMediaQuery(mediaQueryString)
      if (!entry) {
        return () => {}
      }

      const count = entry.listeners.get(onStoreChange) ?? 0
      entry.listeners.set(onStoreChange, count + 1)
      if (entry.listeners.size === 1) {
        attachSharedListener(entry)
      }

      return () => {
        const remaining = (entry.listeners.get(onStoreChange) ?? 1) - 1
        if (remaining <= 0) {
          entry.listeners.delete(onStoreChange)
        } else {
          entry.listeners.set(onStoreChange, remaining)
        }
        if (entry.listeners.size === 0) {
          detachSharedListener(entry)
          // Only drop the entry if it is still the cached one for this query;
          // a `matchMedia` replacement may have swapped in a fresh entry.
          if (sharedMediaQueries.get(mediaQueryString) === entry) {
            sharedMediaQueries.delete(mediaQueryString)
          }
        }
      }
    },
    [contextValue, mediaQueryString],
  )

  const getSnapshot = useCallback(() => {
    if (contextValue !== undefined) {
      return contextValue
    }
    // Read the live list even when its first subscriber has not mounted yet.
    return getSharedMediaQuery(mediaQueryString)?.mediaQueryList.matches ?? false
  }, [contextValue, mediaQueryString])

  const getServerSnapshot = useCallback(() => {
    if (contextValue !== undefined) {
      return contextValue
    }

    // Prevent a React hydration mismatch when a default value is provided by not
    // defaulting to `window.matchMedia(query).matches`.
    if (defaultState !== undefined) {
      return defaultState
    }

    // A default value has not been provided, and you are rendering on the
    // server, warn of a possible hydration mismatch when defaulting to false.
    // `getServerSnapshot` also runs on the client during hydration; only warn on
    // the actual server so we don't surface this message in the browser console
    // (matching the previous behavior, where the client read `matchMedia` and
    // stayed quiet).
    warning(
      typeof window === 'undefined',
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.',
    )

    return false
  }, [contextValue, defaultState])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export {MatchMedia} from './MatchMedia'
