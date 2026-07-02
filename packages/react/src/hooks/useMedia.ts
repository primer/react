import {useCallback, useContext, useSyncExternalStore} from 'react'
import {warning} from '../utils/warning'
import {MatchMediaContext} from './MatchMediaContext'

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

      const mediaQueryList = window.matchMedia(mediaQueryString)

      // Support fallback to `addListener` for broader browser support
      // @ts-ignore this is not present in Safari <14
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', onStoreChange)
        return () => {
          mediaQueryList.removeEventListener('change', onStoreChange)
        }
      }

      mediaQueryList.addListener(onStoreChange)
      return () => {
        mediaQueryList.removeListener(onStoreChange)
      }
    },
    [contextValue, mediaQueryString],
  )

  const getSnapshot = useCallback(() => {
    if (contextValue !== undefined) {
      return contextValue
    }
    return window.matchMedia(mediaQueryString).matches
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
    warning(
      true,
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.',
    )

    return false
  }, [contextValue, defaultState])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export {MatchMedia} from './MatchMedia'
