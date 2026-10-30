import {StrictMode} from 'react'
import {describe, expect, it, beforeEach, afterEach, vi, type MockInstance} from 'vitest'
import {render, act} from '@testing-library/react'
import {page} from 'vitest/browser'
import {Announce} from '../Announce'
import {implementsClassName} from '../../utils/testing'
import {createRenderCounter} from '../../utils/testing/profiler'

describe('Announce', () => {
  let ariaNotify: MockInstance<Element['ariaNotify']>

  implementsClassName(Announce)

  beforeEach(() => {
    vi.useFakeTimers()
    ariaNotify = vi.spyOn(Element.prototype, 'ariaNotify').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should have a default politeness of `polite`', async () => {
    render(<Announce>test</Announce>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'normal',
    })
  })

  it('should support an `assertive` politeness', async () => {
    render(<Announce politeness="assertive">test</Announce>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'high',
    })
  })

  it('should pass additional props to the container element', () => {
    const {container} = render(<Announce data-testid="container">test</Announce>)

    expect(container.firstChild).toHaveAttribute('data-testid', 'container')
  })

  it('should support customizing the container element with `as`', () => {
    render(
      <Announce as="span" data-testid="container">
        test
      </Announce>,
    )
    expect(page.getByTestId('container').element().tagName).toBe('SPAN')
  })

  it('should not announce the contents of the container if `hidden={true}`', async () => {
    render(<Announce hidden>test</Announce>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('should not announce the contents of the container if `display: none`', async () => {
    render(
      <Announce
        style={{
          display: 'none',
        }}
      >
        test
      </Announce>,
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('should not announce the contents of the container if `visibility: hidden`', async () => {
    render(
      <Announce
        style={{
          visibility: 'hidden',
        }}
      >
        test
      </Announce>,
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('does not announce hidden descendant text', async () => {
    render(
      <Announce>
        Visible message
        <span
          style={{
            display: 'none',
          }}
        >
          Hidden message
        </span>
      </Announce>,
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('Visible message', {
      priority: 'normal',
    })
  })

  it.each(['polite', 'assertive'] as const)(
    'announces once on mount in StrictMode with %s politeness',
    async politeness => {
      render(
        <StrictMode>
          <Announce politeness={politeness}>test</Announce>
        </StrictMode>,
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
        priority: politeness === 'assertive' ? 'high' : 'normal',
      })
    },
  )

  it('delays polite announcements and replaces pending content', async () => {
    const {rerender} = render(<Announce delayMs={100}>First message</Announce>)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(99)
    })
    expect(ariaNotify).not.toHaveBeenCalled()

    rerender(<Announce delayMs={100}>Updated message</Announce>)

    await act(async () => {
      await Promise.resolve()
      await vi.advanceTimersByTimeAsync(99)
    })
    expect(ariaNotify).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('Updated message', {
      priority: 'normal',
    })
  })

  it('ignores delayMs for assertive announcements', async () => {
    render(
      <Announce politeness="assertive" delayMs={1000}>
        test
      </Announce>,
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })

    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('test', {
      priority: 'high',
    })
  })

  it.each(['message A', ''])('cancels pending content when the content changes back to "%s"', async message => {
    const {rerender} = render(<Announce delayMs={100}>message A</Announce>)

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenCalledExactlyOnceWith('message A', {
      priority: 'normal',
    })
    ariaNotify.mockClear()

    rerender(<Announce delayMs={100}>message B</Announce>)
    await act(async () => {})

    rerender(<Announce delayMs={100}>{message}</Announce>)
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('cancels a pending announcement on unmount', async () => {
    const {unmount} = render(<Announce delayMs={100}>test</Announce>)

    unmount()

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(ariaNotify).not.toHaveBeenCalled()
  })

  it('does not commit an extra render when its content changes', async () => {
    // Regression guard: the previous announcement text is tracked in a ref, so
    // the MutationObserver-driven announcement must not trigger an additional
    // React commit on every content change (which would cascade one render per
    // keystroke when tied to an input). Each content change should produce
    // exactly one render — the prop update — and no follow-up commit.
    const [Wrap, counter] = createRenderCounter()
    const {rerender} = render(
      <Wrap>
        <Announce>message 0</Announce>
      </Wrap>,
    )
    // Flush the initial mount announcement before measuring.
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    counter.reset()

    const changes = 5
    for (let i = 1; i <= changes; i += 1) {
      rerender(
        <Wrap>
          <Announce>message {i}</Announce>
        </Wrap>,
      )
      // Flush the MutationObserver callback so a regressed setState would commit.
      await act(async () => {})
    }

    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(ariaNotify).toHaveBeenLastCalledWith('message 5', {
      priority: 'normal',
    })
    expect(counter.updateCount).toBe(changes)
  })
})
