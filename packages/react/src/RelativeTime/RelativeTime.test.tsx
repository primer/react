import {act, render} from '@testing-library/react'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import RelativeTime from '.'
import {implementsClassName} from '../utils/testing'

describe('RelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  implementsClassName(RelativeTime)

  it('renders a <time>', () => {
    const {container} = render(<RelativeTime />)
    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('time')
  })

  it('renders data-component and datetime attributes', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)

    expect(container.firstChild).toHaveAttribute('data-component', 'RelativeTime')
    expect(container.firstChild).toHaveAttribute('datetime', date.toISOString())
  })

  it('formats relative dates with tense and precision', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const {rerender, container} = render(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />)
    expect(container).toHaveTextContent('1 minute ago')

    rerender(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} tense="future" precision="minute" />)
    expect(container).toHaveTextContent('now')
  })

  it('uses an absolute date outside the threshold', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {container} = render(<RelativeTime date={new Date('2024-01-01T12:00:00.000Z')} threshold="P0S" />)
    expect(container).toHaveTextContent('on Jan 1')
  })

  it('supports datetime and micro formats', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {rerender, container} = render(<RelativeTime datetime="2024-03-07T12:23:18.123Z" format="micro" />)
    expect(container).toHaveTextContent('1m')

    rerender(<RelativeTime datetime="2024-03-07T12:23:18.123Z" format="datetime" />)
    expect(container).toHaveTextContent('Mar 7')
  })

  it('formats elapsed durations', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {container} = render(<RelativeTime date={new Date('2024-03-07T11:20:48.123Z')} format="elapsed" />)

    expect(container).toHaveTextContent('1h 2m')
  })

  it('updates relative text as time passes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))
    const {container} = render(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />)

    expect(container).toHaveTextContent('now')
    act(() => vi.advanceTimersByTime(10_000))
    expect(container).toHaveTextContent('10 seconds ago')
  })

  it('notifies when the formatted text updates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))
    const onRelativeTimeUpdated = vi.fn()
    render(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} onRelativeTimeUpdated={onRelativeTimeUpdated} />)

    act(() => vi.advanceTimersByTime(10_000))

    expect(onRelativeTimeUpdated).toHaveBeenCalledWith({
      oldText: 'now',
      newText: '10 seconds ago',
      oldTitle: expect.any(String),
      newTitle: expect.any(String),
    })
  })

  it('honors noTitle', () => {
    const {container} = render(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} noTitle />)
    expect(container.firstChild).not.toHaveAttribute('title')
  })

  it('renders formatted text during server rendering', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const markup = renderToString(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />)

    expect(markup).toMatch(/<time/)
    expect(markup).toContain('dateTime="2024-03-07T12:22:48.123Z"')
    expect(markup).toContain('1 minute ago')
  })

  it('replaces a supplied server fallback with formatted text after mounting', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const {container} = render(
      <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')}>server rendered date</RelativeTime>,
    )

    expect(container).toHaveTextContent('1 minute ago')
  })
})
