import type React from 'react'
import {createContext, useContext, useState, useCallback, useMemo, useSyncExternalStore} from 'react'
import {warning} from '../utils/warning'
import {canUseDOM} from '../utils/environment'

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
  const mediaQueryMatch = useMediaQuery(mediaQueryString, defaultState)

  // If feature is overridden via context, use that value instead
  const featureOverride = features[mediaQueryString]
  if (featureOverride !== undefined) {
    return featureOverride
  }

  return mediaQueryMatch
}

function useMediaQuery(mediaQueryString: string, defaultState?: boolean): boolean {
  // Safe to use canUseDOM here because it's a module-level constant evaluated at load time.
  // SSR safety is handled by useSyncExternalStore's getServerSnapshot, which React uses
  // during server rendering and hydration instead of getSnapshot.
  const mediaQueryList = useMemo(() => (canUseDOM ? window.matchMedia(mediaQueryString) : null), [mediaQueryString])

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!mediaQueryList) {
        return () => {}
      }

      // Support fallback to `addListener` for broader browser support
      // @ts-ignore this is not present in Safari <14
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener('change', callback)
      } else {
        mediaQueryList.addListener(callback)
      }

      return () => {
        // @ts-ignore this is not present in Safari <14
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener('change', callback)
        } else {
          mediaQueryList.removeListener(callback)
        }
      }
    },
    [mediaQueryList],
  )

  const getSnapshot = useCallback(() => {
    return mediaQueryList?.matches ?? false
  }, [mediaQueryList])

  const getServerSnapshot = useCallback(() => {
    if (defaultState !== undefined) {
      return defaultState
    }

    warning(
      true,
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.',
    )

    return false
  }, [defaultState])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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
 * queries to the `features` prop. If a component uses `useMedia` with the
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
