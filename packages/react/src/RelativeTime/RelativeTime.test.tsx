import {act, render} from '@testing-library/react'
import type {ReactElement} from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import RelativeTime, {type ExperimentalRelativeTimeProps} from '.'
import {FeatureFlags} from '../FeatureFlags'
import {implementsClassName} from '../utils/testing'

const emptyDateTimeOptions = {
  second: '',
  minute: '',
  hour: '',
  weekday: '',
  day: '',
  month: '',
  year: '',
  timeZoneName: '',
} as unknown as Pick<
  ExperimentalRelativeTimeProps,
  'second' | 'minute' | 'hour' | 'weekday' | 'day' | 'month' | 'year' | 'timeZoneName'
>

function renderWithReactRelativeTime(ui: ReactElement) {
  return render(<FeatureFlags flags={{primer_react_relative_time: true}}>{ui}</FeatureFlags>)
}

function renderReactRelativeTimeToString(ui: ReactElement) {
  return renderToString(<FeatureFlags flags={{primer_react_relative_time: true}}>{ui}</FeatureFlags>)
}

describe('RelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  implementsClassName(RelativeTime)

  it('preserves the custom-element output by default', () => {
    const {container} = render(<RelativeTime />)
    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('relative-time')
  })

  it('preserves custom-element formatting attributes by default', () => {
    const {container} = render(<RelativeTime date={null} format="micro" precision="week" />)

    expect(container.firstChild).toHaveAttribute('format', 'micro')
    expect(container.firstChild).toHaveAttribute('precision', 'week')
  })

  it('renders the React implementation when the feature flag is enabled', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = renderWithReactRelativeTime(<RelativeTime date={date} />)

    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('time')
    expect(container.firstChild).toHaveAttribute('data-component', 'RelativeTime')
    expect(container.firstChild).toHaveAttribute('datetime', date.toISOString())
  })

  it('keeps legacy output for precision values not supported by the experiment', () => {
    const {container} = renderWithReactRelativeTime(<RelativeTime precision="week" />)

    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('relative-time')
  })

  it('formats relative dates with tense and precision', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const {rerender, container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />,
    )
    expect(container).toHaveTextContent('1 minute ago')

    rerender(
      <FeatureFlags flags={{primer_react_relative_time: true}}>
        <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} tense="future" precision="minute" />
      </FeatureFlags>,
    )
    expect(container).toHaveTextContent('now')
  })

  it('uses an absolute date outside the threshold', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-01-01T12:00:00.000Z')} threshold="P0S" />,
    )
    expect(container).toHaveTextContent('on Jan 1')
  })

  it('supports datetime and micro formats', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {rerender, container} = renderWithReactRelativeTime(
      <RelativeTime datetime="2024-03-07T12:23:18.123Z" format="micro" />,
    )
    expect(container).toHaveTextContent('1m')

    rerender(
      <FeatureFlags flags={{primer_react_relative_time: true}}>
        <RelativeTime datetime="2024-03-07T12:23:18.123Z" format="datetime" />
      </FeatureFlags>,
    )
    expect(container).toHaveTextContent('Mar 7')
  })

  it('treats empty date-time formatting options as unset', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T12:23:18.123Z')} format="datetime" {...emptyDateTimeOptions} />,
    )

    expect(container).toHaveTextContent('Thu, Mar 7')
    expect(container.firstChild).not.toHaveAttribute('timezonename')
  })

  it('formats elapsed durations', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))

    const {container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T11:20:48.123Z')} format="elapsed" />,
    )

    expect(container).toHaveTextContent('1h 2m')
  })

  it('updates relative text as time passes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))
    const {container} = renderWithReactRelativeTime(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />)

    expect(container).toHaveTextContent('now')
    act(() => vi.advanceTimersByTime(10_000))
    expect(container).toHaveTextContent('10 seconds ago')
  })

  it('notifies when the formatted text updates', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:22:48.123Z'))
    const onRelativeTimeUpdated = vi.fn()
    renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} onRelativeTimeUpdated={onRelativeTimeUpdated} />,
    )

    act(() => vi.advanceTimersByTime(10_000))

    expect(onRelativeTimeUpdated).toHaveBeenCalledWith(
      expect.objectContaining({
        oldText: 'now',
        newText: '10 seconds ago',
        oldTitle: expect.any(String),
        newTitle: expect.any(String),
      }),
    )
  })

  it('honors noTitle', () => {
    const {container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} noTitle />,
    )
    expect(container.firstChild).not.toHaveAttribute('title')
  })

  it('renders formatted text during server rendering', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const markup = renderReactRelativeTimeToString(<RelativeTime date={new Date('2024-03-07T12:22:48.123Z')} />)

    expect(markup).toMatch(/<time/)
    expect(markup).toContain('dateTime="2024-03-07T12:22:48.123Z"')
    expect(markup).toContain('1 minute ago')
  })

  it('replaces a supplied server fallback with formatted text after mounting', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-03-07T12:23:48.123Z'))

    const {container} = renderWithReactRelativeTime(
      <RelativeTime date={new Date('2024-03-07T12:22:48.123Z')}>server rendered date</RelativeTime>,
    )

    expect(container).toHaveTextContent('1 minute ago')
  })
})
