import {render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {act} from 'react'
import ReactDOM from 'react-dom/server'
import {useMedia, MatchMedia} from '../useMedia'

type MediaQueryEventListener = (event: {matches: boolean}) => void

function mockMatchMedia({defaultMatch = false} = {}) {
  const listeners = new Set<MediaQueryEventListener>()
  // Track the current match state so that reading `matchMedia(query).matches`
  // reflects the latest value, mirroring real `MediaQueryList` behavior.
  let currentMatches = defaultMatch

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: currentMatches,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: (_type: string, listener: MediaQueryEventListener) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: string, listener: MediaQueryEventListener) => {
        listeners.delete(listener)
      },
      dispatchEvent: vi.fn(),
    })),
  })

  return {
    change({matches = false}) {
      currentMatches = matches
      for (const listener of listeners) {
        listener({
          matches,
        })
      }
    },
  }
}

describe('useMedia', () => {
  afterEach(() => {
    mockMatchMedia()
  })

  it('should default to the matchMedia value', () => {
    mockMatchMedia()

    const match: boolean[] = []

    function TestComponent() {
      const value = useMedia('(pointer: coarse)')
      match.push(value)
      return null
    }

    render(<TestComponent />)
    expect(match[0]).toBe(false)

    mockMatchMedia({defaultMatch: true})

    render(<TestComponent />)
    expect(match[1]).toBe(true)
  })

  it('should default to false when used during SSR', () => {
    const match: boolean[] = []

    function TestComponent() {
      const value = useMedia('(pointer: coarse)')
      match.push(value)
      return null
    }

    // `renderToString` uses the server snapshot, which defaults to `false` when
    // no `defaultState` is provided.
    ReactDOM.renderToString(<TestComponent />)
    expect(match[0]).toBe(false)
  })

  it('does not warn about a missing defaultState on the client', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    function TestComponent() {
      useMedia('(pointer: coarse)')
      return null
    }

    // On the client (where `window` is defined) the hook reads `matchMedia`
    // directly, so the SSR guidance warning must not appear in the browser
    // console — including during hydration, when `getServerSnapshot` runs.
    render(<TestComponent />)

    expect(warnSpy).not.toHaveBeenCalledWith(
      'Warning:',
      expect.stringContaining('`useMedia` When server side rendering'),
    )
    warnSpy.mockRestore()
  })

  it('should respond to change in matchMedia values', () => {
    const {change} = mockMatchMedia()

    const match: boolean[] = []

    function TestComponent() {
      const value = useMedia('(pointer: coarse)')
      match.push(value)
      return null
    }

    render(<TestComponent />)
    expect(match[0]).toBe(false)

    act(() => {
      change({matches: true})
    })

    expect(match[1]).toBe(true)
  })

  it('should default to the features value in context if available', () => {
    mockMatchMedia()

    const feature = '(pointer: coarse)'
    const match: boolean[] = []

    function TestComponent() {
      const value = useMedia(feature)
      match.push(value)
      return null
    }

    render(
      <MatchMedia features={{[feature]: true}}>
        <TestComponent />
      </MatchMedia>,
    )
    expect(match[0]).toBe(true)

    render(
      <MatchMedia features={{[feature]: false}}>
        <TestComponent />
      </MatchMedia>,
    )
    expect(match[1]).toBe(false)

    ReactDOM.renderToString(
      <MatchMedia features={{[feature]: true}}>
        <TestComponent />
      </MatchMedia>,
    )
    expect(match[2]).toBe(true)
  })
})
