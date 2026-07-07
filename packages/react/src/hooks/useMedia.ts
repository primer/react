import React, {useContext, useEffect} from 'react'
import {canUseDOM} from '../utils/environment'
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
  const [matches, setMatches] = React.useState(() => {
    if (features[mediaQueryString] !== undefined) {
      return features[mediaQueryString] as boolean
    }

    // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
    if (defaultState !== undefined) {
      return defaultState
    }

    if (canUseDOM) {
      return window.matchMedia(mediaQueryString).matches
    }

    // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.
    warning(
      true,
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.',
    )

    return false
  })

  if (features[mediaQueryString] !== undefined && matches !== features[mediaQueryString]) {
    setMatches(features[mediaQueryString] as boolean)
  }

  useEffect(() => {
    // If `mediaQueryString` is present in features through `context` defer to
    // the value present instead of checking with matchMedia
    if (features[mediaQueryString] !== undefined) {
      return
    }

    function listener(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    const mediaQueryList = window.matchMedia(mediaQueryString)

    // Support fallback to `addListener` for broader browser support
    // @ts-ignore this is not present in Safari <14
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else {
      mediaQueryList.addListener(listener)
    }

    // Make sure the media query list is in sync with the matches state
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-you-might-not-need-an-effect/no-external-store-subscription
    setMatches(mediaQueryList.matches)

    return () => {
      // @ts-ignore this is not present in Safari <14
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (mediaQueryList.addEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else {
        mediaQueryList.removeListener(listener)
      }
    }
  }, [features, mediaQueryString])

  return matches
}

export {MatchMedia} from './MatchMedia'
