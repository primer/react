import {useState, useLayoutEffect} from 'react'
import {ViewportRangeKeys} from '../utils/types/ViewportRangeKeys'

// TODO: import from Primer Primitives https://primer.style/primitives/spacing/
const primer = {
  viewportRange: {
    narrow: '(max-width: calc(48rem - 0.02px))',
    narrowLandscape: '(max-width: calc(63.25rem - 0.02px))',
    regular: '(min-width: 48rem)',
    wide: '(min-width: 90rem)',
    portrait: '(orientation: portrait)',
    landscape: '(orientation: portrait)'
  }
}

const useMatchMedia = (viewportRange?: ViewportRangeKeys | ViewportRangeKeys[]) => {
  const [matchesByKey, setMatchesByKey] = useState<Record<ViewportRangeKeys, boolean | undefined>>({
    narrow: undefined,
    narrowLandscape: undefined,
    regular: undefined,
    wide: undefined,
    portrait: undefined,
    landscape: undefined
  })

  useLayoutEffect(() => {
    const updateMatches = (viewportRangeKeyArg: ViewportRangeKeys) => {
      const media = window.matchMedia(primer.viewportRange[viewportRangeKeyArg])

      if (media.matches !== matchesByKey[viewportRangeKeyArg]) {
        setMatchesByKey({...matchesByKey, [viewportRangeKeyArg]: media.matches})
      }

      const listener = () => {
        setMatchesByKey({...matchesByKey, [viewportRangeKeyArg]: media.matches})
      }

      media.addEventListener('change', listener)

      // TODO: figure out how remove event listeners in a for...of loop
      return () => {
        media.removeEventListener('change', listener)
      }
    }

    if (!viewportRange || !viewportRange.length) {
      return
    }

    if (typeof viewportRange === 'string') {
      return updateMatches(viewportRange)
    }

    // can't remove event listeners in a for..of loop because I'd have to do `return updateMatches()`, but then the loop stops on return
    for (const rangeKey of viewportRange) {
      updateMatches(rangeKey)
    }
  }, [matchesByKey, viewportRange])

  return typeof viewportRange === 'string' ? matchesByKey[viewportRange] : matchesByKey
}

export default useMatchMedia
