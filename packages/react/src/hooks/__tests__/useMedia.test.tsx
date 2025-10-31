import {render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {act} from 'react'
import ReactDOM from 'react-dom/server'
import {useMediaUnsafeSSR, MatchMedia} from '../useMediaUnsafeSSR'

type MediaQueryEventListener = (event: {matches: boolean}) => void

function mockMatchMedia({defaultMatch = false} = {}) {
  const listeners = new Set<MediaQueryEventListener>()

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: defaultMatch,
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
      for (const listener of listeners) {
        listener({
          matches,
        })
      }
    },
  }
}

describe('useMediaUnsafeSSR', () => {
  afterEach(() => {
    mockMatchMedia()
  })

  it('should default to the matchMedia value', () => {
    mockMatchMedia()

    const match: boolean[] = []

    function TestComponent() {
      const value = useMediaUnsafeSSR('(pointer: coarse)')
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
      const value = useMediaUnsafeSSR('(pointer: coarse)')
      match.push(value)
      return null
    }

    ReactDOM.renderToString(<TestComponent />)
    expect(match[0]).toBe(false)
  })

  it('should respond to change in matchMedia values', () => {
    const {change} = mockMatchMedia()

    const match: boolean[] = []

    function TestComponent() {
      const value = useMediaUnsafeSSR('(pointer: coarse)')
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
      const value = useMediaUnsafeSSR(feature)
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
