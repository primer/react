import React, {createContext, useContext, useState, useEffect} from 'react'
import {canUseDOM} from './environment'

/**
 * `useMatchMedia` will use the given `mediaQueryString` with `matchMedia` to
 * determine if the document matches the media query string.
 *
 * If `MatchMedia` is used as an ancestor, `useMatchMedia` will instead use the
 * value of the media query string, if available
 *
 * @example
 * function Example() {
 *   const coarsePointer = useMatchMedia('(pointer: coarse)');
 *   // ...
 * }
 */
export function useMatchMedia(mediaQueryString: string): boolean {
  const features = useContext(MatchMediaContext)
  const [matches, setMatches] = useState(() => {
    if (features[mediaQueryString] !== undefined) {
      return features[mediaQueryString]
    }

    if (canUseDOM) {
      const mediaQueryList = window.matchMedia(mediaQueryString)
      return mediaQueryList.matches
    }

    return false
  })

  useEffect(() => {
    if (features[mediaQueryString] !== undefined) {
      setMatches(features[mediaQueryString])
    }
  }, [features, mediaQueryString])

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
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else {
      mediaQueryList.addListener(listener)
    }

    // Make sure the media query list is in sync with the matches state
    setMatches(mediaQueryList.matches)

    return () => {
      // @ts-ignore this is not present in Safari <14
      if (mediaQueryList.addEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else {
        mediaQueryList.removeListener(listener)
      }
    }
  }, [features, mediaQueryString])

  return matches
}

type MediaQueryFeatures = {
  [key: string]: boolean
}

// Used to keep track of overrides to specific media query features, this should
// be used for development and demo purposes to emulate specific features if
// unavailable through devtools
const MatchMediaContext = createContext<MediaQueryFeatures>({})

type MatchMediaProps = {
  children: React.ReactNode
  features?: MediaQueryFeatures
}

const defaultFeatures = {}

/**
 * Use `MatchMedia` to emulate media conditions by passing in feature
 * queries to the `features` prop. If a component uses `useMatchMedia` with the
 * feature passed in to `MatchMedia` it will force its value to match what is
 * provided to `MatchMedia`
 *
 * This should be used for development and documentation only in situations
 * where devtools cannot emulate this feature
 *
 * @example
 * <MatchMedia features={{ "(pointer: coarse)": true}}>
 *   <Children />
 * </MatchMedia>
 */
export function MatchMedia({children, features = defaultFeatures}: MatchMediaProps) {
  const value = useShallowObject(features)
  return <MatchMediaContext.Provider value={value}>{children}</MatchMediaContext.Provider>
}

type SimpleObject = {
  [key: string]: boolean | number | string | null | undefined
}

/**
 * Utility hook to provide a stable identity for a "simple" object which
 * contains only primitive values. This provides a `useMemo`-esque signature
 * without dealing with shallow equality checks in the dependency array.
 *
 * Note (perf): this hook iterates through keys and values of the object if the
 * shallow equality check is false each time the hook is called
 */
function useShallowObject<T extends SimpleObject>(object: T): T {
  const [value, setValue] = useState(object)

  if (value !== object) {
    const match = Object.keys(object).every(key => {
      return object[key] === value[key]
    })
    if (!match) {
      setValue(object)
    }
  }

  return value
}
