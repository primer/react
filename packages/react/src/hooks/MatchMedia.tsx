import type React from 'react'
import {useState} from 'react'
import {MatchMediaContext, type MediaQueryFeatures} from './MatchMediaContext'

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
