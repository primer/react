import React, {createContext, useContext, useState, useEffect} from 'react'
import {canUseDOM} from '../utils/environment'
import {warning} from '../utils/warning'

/**
 * `useMediaUnsafeSSR` will use the given `mediaQueryString` with `matchMedia` to
 * determine if the document matches the media query string.
 *
 * If `MatchMedia` is used as an ancestor, `useMediaUnsafeSSR` will instead use the
 * value of the media query string, if available
 *
 * Warning: If rendering on the server, and no `defaultState` is provided,
 * this could cause a hydration mismatch between server and client.
 *
 * @example
 * function Example() {
 *   const coarsePointer = useMediaUnsafeSSR('(pointer: coarse)');
 *   // ...
 * }
 */
export function useMediaUnsafeSSR(mediaQueryString: string, defaultState?: boolean) {
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
      '`useMediaUnsafeSSR` When server side rendering, defaultState should be defined to prevent a hydration mismatch.',
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

type MediaQueryFeatures = {
  [key: string]: boolean | undefined
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
 * queries to the `features` prop. If a component uses `useMediaUnsafeSSR` with the
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
