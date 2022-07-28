// Copied from https://github.com/streamich/react-use/blob/master/src/useMedia.ts

import React from 'react'

const getInitialState = (query: string, defaultState?: boolean) => {
  // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
  if (defaultState !== undefined) {
    return defaultState
  }

  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches
  }

  // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.'
    )
  }

  return false
}

export function useMedia(query: string, defaultState?: boolean) {
  const [state, setState] = React.useState(getInitialState(query, defaultState))

  React.useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) {
        return
      }
      setState(!!mql.matches)
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}
