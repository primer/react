import {useLayoutEffect, useReducer} from 'react'
import {ViewportRangeKeys} from '../utils/types/ViewportRangeKeys'

// TODO: import from Primer Primitives https://primer.style/primitives/spacing/
// TODO: file an issue that the proposed values for `narrow` and `narrowLandscape` don't work for JS media queries
export const viewportRanges = {
  narrow: '(max-width: 47.9999rem)',
  narrowLandscape: '(max-width: 63.2499rem)',
  regular: '(min-width: 48rem)',
  wide: '(min-width: 90rem)',
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)'
}

const initialState = {
  narrow: undefined,
  narrowLandscape: undefined,
  regular: undefined,
  wide: undefined,
  portrait: undefined,
  landscape: undefined
}

const reducer = (
  state: Record<ViewportRangeKeys, boolean | undefined>,
  action: {type: ViewportRangeKeys; payload: boolean | undefined}
) => {
  const {type, payload} = action
  return {...state, [type]: payload}
}

const useMatchMedia = (viewportRange: ViewportRangeKeys | ViewportRangeKeys[]) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useLayoutEffect(() => {
    // This could have gone in global scope, but then Jest can't mock `window.matchMedia`
    const mediaQueries = Object.keys(initialState).reduce<Record<ViewportRangeKeys, MediaQueryList | undefined>>(
      (acc, viewportRangeKey) => {
        acc[viewportRangeKey as ViewportRangeKeys] = window.matchMedia(
          viewportRanges[viewportRangeKey as ViewportRangeKeys]
        )
        return acc
      },
      {
        narrow: undefined,
        narrowLandscape: undefined,
        regular: undefined,
        wide: undefined,
        portrait: undefined,
        landscape: undefined
      }
    )
    const matchMediaListeners = {
      narrow: () => {
        dispatch({type: 'narrow', payload: mediaQueries.narrow?.matches})
      },
      narrowLandscape: () => {
        dispatch({type: 'narrowLandscape', payload: mediaQueries.narrowLandscape?.matches})
      },
      regular: () => {
        dispatch({type: 'regular', payload: mediaQueries.regular?.matches})
      },
      wide: () => {
        dispatch({type: 'wide', payload: mediaQueries.wide?.matches})
      },
      portrait: () => {
        dispatch({type: 'portrait', payload: mediaQueries.portrait?.matches})
      },
      landscape: () => {
        dispatch({type: 'landscape', payload: mediaQueries.landscape?.matches})
      }
    }

    // if a single string was passed for viewport range, just dispatch an update to that viewport range
    if (typeof viewportRange === 'string' && state[viewportRange] !== mediaQueries[viewportRange]?.matches) {
      dispatch({type: viewportRange, payload: mediaQueries[viewportRange]?.matches})
    }

    // if a responsive object was passed for viewport range:
    // - add matchMedia event listeners to all viewport ranges
    // - dispatch updates to all viewport ranges
    for (const rangeKey of Object.keys(mediaQueries) as ViewportRangeKeys[]) {
      mediaQueries[rangeKey as ViewportRangeKeys]?.addEventListener(
        'change',
        matchMediaListeners[rangeKey as ViewportRangeKeys]
      )

      if (state[rangeKey] !== mediaQueries[rangeKey]?.matches) {
        dispatch({type: rangeKey, payload: mediaQueries[rangeKey]?.matches})
      }
    }

    // remove matchMedia event listeners on unmount
    return () => {
      for (const rangeKey of Object.keys(mediaQueries)) {
        mediaQueries[rangeKey as ViewportRangeKeys]?.removeEventListener(
          'change',
          matchMediaListeners[rangeKey as ViewportRangeKeys]
        )
      }
    }
  }, [state, viewportRange])

  return typeof viewportRange === 'string' ? state[viewportRange] : state
}

export default useMatchMedia
