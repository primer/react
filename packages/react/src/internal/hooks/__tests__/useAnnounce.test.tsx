import {act, fireEvent, render} from '@testing-library/react'
import type React from 'react'
import {useRef, useState} from 'react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {useAnnounce} from '../useAnnounce'
import {getLiveRegion} from '../../../live-region/__tests__/test-helpers'
import {createRenderCounter} from '../../../utils/testing/profiler'

describe('useAnnounce', () => {
  beforeEach(() => {
    document.body.appendChild(document.createElement('live-region'))
  })

  afterEach(() => {
    getLiveRegion().clear()
    getLiveRegion().remove()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('announces explicit messages politely with delayMs and cancels superseded messages', async () => {
    vi.useFakeTimers()
    const liveRegion = getLiveRegion()
    const announceSpy = vi.spyOn(liveRegion, 'announce')

    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref, {delayMs: 150})
      return (
        <div ref={ref}>
          <button type="button" onClick={() => announce('1 row selected')}>
            Select 1
          </button>
          <button type="button" onClick={() => announce('2 rows selected')}>
            Select 2
          </button>
        </div>
      )
    }

    render(<Demo />)

    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Select 1'}).element())
    })
    await act(async () => vi.advanceTimersByTime(100))
    expect(liveRegion.getMessage('polite')).toBe('')

    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Select 2'}).element())
    })
    await act(async () => vi.advanceTimersByTime(149))
    expect(liveRegion.getMessage('polite')).toBe('')

    await act(async () => vi.advanceTimersByTime(1))
    expect(liveRegion.getMessage('polite')).toBe('2 rows selected')
    expect(announceSpy).toHaveBeenCalledTimes(2)
    expect(announceSpy).toHaveBeenLastCalledWith('2 rows selected', {politeness: 'polite', delayMs: 150})
  })

  it('supports assertive announcements', async () => {
    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref, {politeness: 'assertive'})
      return (
        <div ref={ref}>
          <button type="button" onClick={() => announce('Action failed')}>
            Trigger
          </button>
        </div>
      )
    }

    render(<Demo />)
    await userEvent.click(page.getByRole('button', {name: 'Trigger'}))

    const liveRegion = getLiveRegion()
    expect(liveRegion.getMessage('assertive')).toBe('Action failed')
    expect(liveRegion.getMessage('polite')).toBe('')
  })

  it('deduplicates repeated messages and ignores empty or whitespace-only text', async () => {
    const liveRegion = getLiveRegion()
    const announceSpy = vi.spyOn(liveRegion, 'announce')

    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref)
      return (
        <div ref={ref}>
          <button type="button" onClick={() => announce('   ')}>
            Blank
          </button>
          <button type="button" onClick={() => announce('  Saved  ')}>
            Save
          </button>
        </div>
      )
    }

    render(<Demo />)
    await userEvent.click(page.getByRole('button', {name: 'Blank'}))
    expect(announceSpy).not.toHaveBeenCalled()

    const saveButton = page.getByRole('button', {name: 'Save'})
    await userEvent.click(saveButton)
    await userEvent.click(saveButton)
    expect(liveRegion.getMessage('polite')).toBe('Saved')
    expect(announceSpy).toHaveBeenCalledTimes(1)
  })

  it('skips announcements when hidden by prop, display: none, or visibility: hidden', async () => {
    const liveRegion = getLiveRegion()
    const announceSpy = vi.spyOn(liveRegion, 'announce')

    function Demo({hidden, style}: {hidden?: boolean; style?: React.CSSProperties}) {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref, {hidden})
      return (
        <>
          <div ref={ref} style={style}>
            Target
          </div>
          <button type="button" onClick={() => announce('Should not announce')}>
            Announce
          </button>
        </>
      )
    }

    const {rerender} = render(<Demo hidden />)
    await userEvent.click(page.getByRole('button', {name: 'Announce'}))
    expect(announceSpy).not.toHaveBeenCalled()

    rerender(<Demo style={{display: 'none'}} />)
    await userEvent.click(page.getByRole('button', {name: 'Announce'}))
    expect(announceSpy).not.toHaveBeenCalled()

    rerender(<Demo style={{visibility: 'hidden'}} />)
    await userEvent.click(page.getByRole('button', {name: 'Announce'}))
    expect(announceSpy).not.toHaveBeenCalled()

    // Becoming visible later allows the previously skipped message to announce.
    rerender(<Demo />)
    await userEvent.click(page.getByRole('button', {name: 'Announce'}))
    expect(liveRegion.getMessage('polite')).toBe('Should not announce')
    expect(announceSpy).toHaveBeenCalledTimes(1)
  })

  it('cancels pending announcements on explicit cancel() and allows re-announcing', async () => {
    vi.useFakeTimers()
    const liveRegion = getLiveRegion()

    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce, cancel} = useAnnounce(ref, {delayMs: 150})
      return (
        <div ref={ref}>
          <button type="button" onClick={() => announce('1 row selected')}>
            Select
          </button>
          <button type="button" onClick={() => cancel()}>
            Cancel
          </button>
        </div>
      )
    }

    render(<Demo />)

    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Select'}).element())
    })
    await act(async () => vi.advanceTimersByTime(100))
    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Cancel'}).element())
    })
    await act(async () => vi.advanceTimersByTime(200))
    expect(liveRegion.getMessage('polite')).toBe('')

    // After cancel(), the same message can be announced again.
    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Select'}).element())
    })
    await act(async () => vi.advanceTimersByTime(150))
    expect(liveRegion.getMessage('polite')).toBe('1 row selected')
  })

  it('cancels pending announcement on unmount before delivery', async () => {
    vi.useFakeTimers()
    const liveRegion = getLiveRegion()

    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref, {delayMs: 150})
      return (
        <div ref={ref}>
          <button type="button" onClick={() => announce('Pending message')}>
            Select
          </button>
        </div>
      )
    }

    const {unmount} = render(<Demo />)

    await act(async () => {
      fireEvent.click(page.getByRole('button', {name: 'Select'}).element())
    })
    await act(async () => vi.advanceTimersByTime(149))
    unmount()
    await act(async () => vi.advanceTimersByTime(200))
    expect(liveRegion.getMessage('polite')).toBe('')
  })

  it('reads element aria-label or textContent when message is omitted and causes zero extra renders', async () => {
    const [Wrap, counter] = createRenderCounter()
    const liveRegion = getLiveRegion()

    function Demo() {
      const ref = useRef<HTMLDivElement>(null)
      const {announce} = useAnnounce(ref)
      const [label, setLabel] = useState('First label')
      return (
        <Wrap>
          <div ref={ref} role="status" aria-label={label}>
            Ignored child text
          </div>
          <button type="button" onClick={() => announce()}>
            Read
          </button>
          <button type="button" onClick={() => setLabel('Second label')}>
            Rename
          </button>
        </Wrap>
      )
    }

    render(<Demo />)
    counter.reset()

    await userEvent.click(page.getByRole('button', {name: 'Read'}))
    expect(liveRegion.getMessage('polite')).toBe('First label')
    expect(counter.updateCount).toBe(0)

    await userEvent.click(page.getByRole('button', {name: 'Rename'}))
    await userEvent.click(page.getByRole('button', {name: 'Read'}))
    await expect.poll(() => liveRegion.getMessage('polite')).toBe('Second label')
    expect(counter.updateCount).toBe(1)
  })
})
