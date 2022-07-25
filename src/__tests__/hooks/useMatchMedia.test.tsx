import {renderHook, act} from '@testing-library/react-hooks'
import MatchMediaMock from 'jest-matchmedia-mock'
import useMatchMedia, {viewportRanges} from '../../hooks/useMatchMedia'
import {ViewportRangeKeys} from '../../utils/types/ViewportRangeKeys'

let matchMedia: MatchMediaMock

describe('useMatchMedia', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('should return true when the media query matches a viewport range key that is passed', () => {
    for (const viewportRangeKey of Object.keys(viewportRanges)) {
      matchMedia = new MatchMediaMock()
      const {result} = renderHook(() => useMatchMedia(viewportRangeKey as ViewportRangeKeys))

      act(() => {
        matchMedia.useMediaQuery(viewportRanges[viewportRangeKey as ViewportRangeKeys])
      })

      expect(result.current).toBe(true)
      matchMedia.clear()
    }
  })
  it('should return false when the media query does not match a viewport range key that is passed', () => {
    const {result} = renderHook(() => useMatchMedia('wide'))

    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    expect(result.current).toBe(false)
  })
  it('should return an object where there is one matching viewport range in the array that is passed', () => {
    const {result} = renderHook(() => useMatchMedia(['wide']))

    act(() => {
      matchMedia.useMediaQuery(viewportRanges.wide)
    })

    expect(result.current).toStrictEqual({
      narrow: false,
      narrowLandscape: false,
      regular: false,
      wide: true,
      landscape: false,
      portrait: false
    })
  })
})
