import {describe, expect, it, beforeEach, afterEach} from 'vitest'
import {render, screen, act, waitFor} from '@testing-library/react'
import {Announce} from '../Announce'
import {getLiveRegion} from './test-helpers'
import {implementsClassName} from '../../utils/testing'
import {createRenderCounter} from '../../utils/testing/profiler'

describe('Announce', () => {
  implementsClassName(Announce)
  beforeEach(() => {
    const liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    // Reset the live-region after each test so that we do not have overlapping
    // messages from previous tests
    const liveRegion = getLiveRegion()
    document.body.removeChild(liveRegion)
  })

  it('should have a default politeness of `polite`', () => {
    render(<Announce>test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  it('should support an `assertive` politeness', () => {
    render(<Announce politeness="assertive">test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('test')
    expect(liveRegion.getMessage('polite')).toBe('')
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
    expect(screen.getByTestId('container').tagName).toBe('SPAN')
  })

  it('should not announce the contents of the container if `hidden={false}`', () => {
    render(<Announce hidden>test</Announce>)

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })

  it('should not announce the contents of the container if `display: none`', () => {
    render(
      <Announce
        style={{
          display: 'none',
        }}
      >
        test
      </Announce>,
    )

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
  })

  it('should not announce the contents of the container if `visibility: hidden`', () => {
    render(
      <Announce
        style={{
          visibility: 'hidden',
        }}
      >
        test
      </Announce>,
    )

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('polite')).not.toBe('test')
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
    await act(async () => {})
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

    // The announcement path actually ran (so the render-count assertion is not
    // vacuous): wait for the live region's throttle queue to drain and surface
    // the latest content...
    await waitFor(() => {
      expect(getLiveRegion().getMessage('polite')).toBe('message 5')
    })
    // ...and it did so without any extra commit beyond the prop updates.
    expect(counter.updateCount).toBe(changes)
  })
})
