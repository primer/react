import {act, render, screen} from '@testing-library/react'
import {StrictMode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {RelativeTime} from './RelativeTime'
import {elapsedTime} from './duration'
import {formatRelativeTime} from './format'

it('renders a localized fallback with semantic time semantics', () => {
  render(<RelativeTime datetime="2024-01-02T12:00:00.000Z" />)
  expect(screen.getByText(/Jan 2, 2024/)).toHaveAttribute('datetime', '2024-01-02T12:00:00.000Z')
})

it('does not throw for an invalid date', () => {
  const {container} = render(<RelativeTime datetime="not-a-date" />)

  expect(container.querySelector('time')).not.toHaveAttribute('datetime')
})

it('applies the formatting contract to the rendered text', async () => {
  const {container} = render(
    <RelativeTime
      datetime="2024-01-02T12:00:00.000Z"
      format="datetime"
      hour="numeric"
      minute="2-digit"
      prefix=""
      noTitle
    />,
  )

  await act(async () => {
    await Promise.resolve()
  })

  const element = container.querySelector('time')
  expect(element).not.toHaveAttribute('title')
  expect(element).toHaveTextContent(/\d{1,2}:\d{2}/)
})

it('supports expanded units for elapsed time', () => {
  vi.useFakeTimers()
  try {
    const now = new Date('2024-01-02T12:00:00.000Z')
    vi.setSystemTime(now)
    const {container} = render(
      <RelativeTime date={new Date(now.getTime() - 62_000)} format="elapsed" formatStyle="long" noTitle />,
    )
    const units = ['minute', 'second'].map(unit =>
      new Intl.NumberFormat(undefined, {style: 'unit', unit, unitDisplay: 'long'}).format(unit === 'minute' ? 1 : 2),
    )
    expect(container.querySelector('time')?.textContent).toBe(
      new Intl.ListFormat(undefined, {type: 'unit', style: 'long'}).format(units),
    )
  } finally {
    vi.useRealTimers()
  }
})

it.each([
  {name: 'default past', tense: undefined, direction: -1},
  {name: 'automatic past', tense: 'auto', direction: -1},
  {name: 'automatic future', tense: 'auto', direction: 1},
  {name: 'forced past', tense: 'past', direction: -1},
  {name: 'forced future', tense: 'future', direction: 1},
] as const)('uses the supported long micro style for $name', ({tense, direction}) => {
  vi.useFakeTimers()
  try {
    const now = new Date('2024-01-02T12:00:00.000Z')
    vi.setSystemTime(now)
    const {container, unmount} = render(
      <RelativeTime
        date={new Date(now.getTime() + direction * 62_000)}
        format="micro"
        formatStyle="long"
        tense={tense}
        noTitle
      />,
    )
    const expected =
      tense === undefined || tense === 'auto'
        ? new Intl.NumberFormat(undefined, {style: 'unit', unit: 'minute', unitDisplay: 'long'}).format(1)
        : new Intl.RelativeTimeFormat(undefined, {numeric: 'always', style: 'narrow'}).format(direction, 'minute')
    expect(container.querySelector('time')?.textContent).toBe(expected)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    vi.useRealTimers()
  }
})

it('calls onRelativeTimeUpdated when the rendered text changes', async () => {
  const onRelativeTimeUpdated = vi.fn()
  render(<RelativeTime date={new Date(Date.now() - 60_000)} onRelativeTimeUpdated={onRelativeTimeUpdated} />)

  await act(async () => {
    await Promise.resolve()
  })

  expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
  expect(onRelativeTimeUpdated.mock.calls[0][0]).toMatchObject({
    newText: expect.any(String),
    newTitle: expect.any(String),
    oldText: expect.any(String),
    oldTitle: expect.any(String),
  })
})

it('keeps rendered text consistent with the last update across unrelated rerenders', () => {
  vi.useFakeTimers()
  try {
    const now = new Date('2024-03-01T05:59:59.600Z')
    vi.setSystemTime(now)
    const date = new Date('2024-01-30T23:59:59.500Z')
    const onRelativeTimeUpdated = vi.fn()
    const example = (renderCount: number, prefix?: string) => (
      <RelativeTime
        data-render-count={renderCount}
        date={date}
        format="relative"
        threshold="P30DT6H"
        lang="en-US"
        timeZone="UTC"
        noTitle
        onRelativeTimeUpdated={onRelativeTimeUpdated}
        {...(prefix === undefined ? {} : {prefix})}
      />
    )
    const {container, rerender, unmount} = render(example(0))
    const time = container.querySelector('time')
    expect(time).toHaveTextContent('on Jan 30')
    onRelativeTimeUpdated.mockClear()

    vi.setSystemTime(new Date('2024-03-01T06:00:00.000Z'))
    rerender(example(1))
    expect(time).toHaveTextContent('on Jan 30')
    expect(onRelativeTimeUpdated).not.toHaveBeenCalled()

    rerender(example(2, 'at'))
    expect(time).toHaveTextContent('last month')
    expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
    expect(onRelativeTimeUpdated.mock.calls[0][0]).toMatchObject({
      oldText: 'on Jan 30',
      newText: 'last month',
    })
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    vi.useRealTimers()
  }
})

it.each(
  (['relative', 'micro'] as const).flatMap(format => ['P30DT6H', '-P30DT6H'].map(threshold => ({format, threshold}))),
)('uses the supplied time for $format comparisons with threshold $threshold', ({format, threshold}) => {
  vi.useFakeTimers()
  try {
    const now = new Date('2024-03-01T05:59:59.600Z').getTime()
    const date = new Date('2024-01-30T23:59:59.500Z')
    const options = {format, threshold, locale: 'en-US', timeZone: 'UTC'} as const
    vi.setSystemTime(now)
    const expected = formatRelativeTime(date, now, options)
    expect(expected.resolvedFormat).toBe('datetime')

    vi.setSystemTime(new Date('2024-03-01T06:00:00.000Z'))
    expect(formatRelativeTime(date, now, options)).toEqual(expected)
  } finally {
    vi.useRealTimers()
  }
})

it.each([
  {format: 'relative', tense: 'auto'},
  {format: 'relative', tense: 'past'},
  {format: 'micro', tense: 'auto'},
  {format: 'micro', tense: 'past'},
  {format: 'micro', tense: 'future'},
] as const)('uses the supplied time for $format rounding with $tense tense', ({format, tense}) => {
  vi.useFakeTimers()
  try {
    const now = new Date('2024-03-01T12:00:00.000Z').getTime()
    const date = new Date(now - 27 * 86_400_000)
    const options = {format, tense, threshold: 'P6M', locale: 'en-US', timeZone: 'UTC'} as const
    vi.setSystemTime(now)
    const expected = formatRelativeTime(date, now, options)

    vi.setSystemTime(new Date('2024-01-31T12:00:00.000Z'))
    expect(formatRelativeTime(date, now, options)).toEqual(expected)
  } finally {
    vi.useRealTimers()
  }
})

describe('automatic updates', () => {
  it.each(['duration', 'elapsed'] as const)(
    'updates %s with the default second precision at the next elapsed-second boundary',
    format => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const date = new Date(now.getTime() - 3_700_250)
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime date={date} format={format} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
        )
        const time = container.querySelector('time')
        const initialText = formatRelativeTime(date, now.getTime(), {format}).text
        const nextText = formatRelativeTime(date, now.getTime() + 750, {format}).text

        expect(initialText).not.toEqual(nextText)
        expect(time).toHaveTextContent(initialText)
        onRelativeTimeUpdated.mockClear()
        act(() => vi.advanceTimersByTime(749))
        expect(time).toHaveTextContent(initialText)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()

        act(() => vi.advanceTimersByTime(1))
        expect(time).toHaveTextContent(nextText)
        expect(onRelativeTimeUpdated).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({oldText: initialText, newText: nextText}),
        )

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    },
  )

  it.each([
    {elapsed: 59_999, nextUnit: 'minute'},
    {elapsed: 3_599_999, nextUnit: 'hour'},
  ])('keeps a datetime-backed elapsed timer current through the $nextUnit boundary', ({elapsed, nextUnit}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const startedAt = new Date(now.getTime() - elapsed).toISOString()
      const onRelativeTimeUpdated = vi.fn()
      const {rerender} = render(
        <span role="timer" aria-label="Time elapsed in this turn" aria-live="off">
          <RelativeTime datetime={startedAt} format="elapsed" onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />
        </span>,
      )
      const timer = screen.getByRole('timer', {name: 'Time elapsed in this turn'})
      const expected = new Intl.NumberFormat(undefined, {style: 'unit', unit: nextUnit, unitDisplay: 'narrow'}).format(
        1,
      )
      expect(timer).toHaveAttribute('aria-live', 'off')
      expect(timer).not.toHaveTextContent(expected)
      onRelativeTimeUpdated.mockClear()
      act(() => vi.advanceTimersByTime(1))
      expect(timer).toHaveTextContent(expected)
      expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()

      rerender(
        <span role="timer" aria-label="Time elapsed in this turn" aria-live="off">
          Completed duration
        </span>,
      )
      expect(vi.getTimerCount()).toBe(0)
      act(() => vi.advanceTimersByTime(10_000))
      expect(timer).toHaveTextContent('Completed duration')
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates a future countdown at the next second boundary', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() + 3_700_000)
      const {container} = render(<RelativeTime date={date} format="elapsed" noTitle />)
      const time = container.querySelector('time')
      const initialText = formatRelativeTime(date, now.getTime(), {format: 'elapsed'}).text
      const nextText = formatRelativeTime(date, now.getTime() + 1, {format: 'elapsed'}).text

      expect(initialText).not.toEqual(nextText)
      expect(time).toHaveTextContent(initialText)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(nextText)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates minute-precision durations at the next minute boundary', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 3_705_000)
      const options = {format: 'elapsed', precision: 'minute'} as const
      const {container} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const initialText = formatRelativeTime(date, now.getTime(), options).text
      const nextText = formatRelativeTime(date, now.getTime() + 15_000, options).text

      expect(initialText).not.toEqual(nextText)
      act(() => vi.advanceTimersByTime(14_999))
      expect(time).toHaveTextContent(initialText)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(nextText)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates a future minute-precision duration when the remaining minute changes', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() + 3_705_000)
      const options = {format: 'duration', precision: 'minute'} as const
      const {container} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const initialText = formatRelativeTime(date, now.getTime(), options).text
      const nextText = formatRelativeTime(date, now.getTime() + 45_001, options).text

      expect(initialText).not.toEqual(nextText)
      act(() => vi.advanceTimersByTime(45_000))
      expect(time).toHaveTextContent(initialText)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(nextText)
    } finally {
      vi.useRealTimers()
    }
  })

  describe.each(['duration', 'elapsed'] as const)('%s with coarse precision', format => {
    it.each([
      ['hour', 3_600_000],
      ['day', 86_400_000],
      ['week', 7 * 86_400_000],
      ['month', 30 * 86_400_000],
      ['year', 360 * 86_400_000],
    ] as const)('updates past %s values at the represented boundary', (precision, unit) => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const date = new Date(now.getTime() - unit + 250)
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime
            date={date}
            format={format}
            formatStyle="long"
            precision={precision}
            onRelativeTimeUpdated={onRelativeTimeUpdated}
            noTitle
          />,
        )
        const time = container.querySelector('time')
        const formatter = new Intl.NumberFormat(undefined, {style: 'unit', unit: precision, unitDisplay: 'long'})

        expect(time?.textContent).toBe(formatter.format(0))
        onRelativeTimeUpdated.mockClear()
        act(() => vi.advanceTimersByTime(249))
        expect(time?.textContent).toBe(formatter.format(0))
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(formatter.format(1))
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })

    it.each([
      ['hour', 3_600_000],
      ['day', 86_400_000],
      ['week', 7 * 86_400_000],
      ['month', 30 * 86_400_000],
      ['year', 360 * 86_400_000],
    ] as const)('updates future %s values after the represented boundary', (precision, unit) => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const date = new Date(now.getTime() + unit)
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime
            date={date}
            format={format}
            formatStyle="long"
            precision={precision}
            onRelativeTimeUpdated={onRelativeTimeUpdated}
            noTitle
          />,
        )
        const time = container.querySelector('time')
        const formatter = new Intl.NumberFormat(undefined, {style: 'unit', unit: precision, unitDisplay: 'long'})

        expect(time?.textContent).toBe(formatter.format(1))
        onRelativeTimeUpdated.mockClear()
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(formatter.format(0))
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })

    it.each(['past', 'future'] as const)('updates week precision at a %s month boundary', direction => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const month = 30 * 86_400_000
        const date = new Date(now.getTime() + (direction === 'past' ? -month + 250 : month))
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime
            date={date}
            format={format}
            formatStyle="long"
            precision="week"
            onRelativeTimeUpdated={onRelativeTimeUpdated}
            noTitle
          />,
        )
        const time = container.querySelector('time')
        const weeks = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'week', unitDisplay: 'long'}).format(4)
        const monthText = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'month', unitDisplay: 'long'}).format(
          1,
        )
        const before = direction === 'past' ? weeks : monthText
        const after = direction === 'past' ? monthText : weeks
        const delay = direction === 'past' ? 250 : 1

        expect(time?.textContent).toBe(before)
        onRelativeTimeUpdated.mockClear()
        act(() => vi.advanceTimersByTime(delay - 1))
        expect(time?.textContent).toBe(before)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(after)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })

    it.each(['past', 'future'] as const)('updates a %s week within a represented month', direction => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const duration = 37 * 86_400_000
        const date = new Date(now.getTime() + (direction === 'past' ? -duration + 250 : duration))
        const {container, unmount} = render(
          <RelativeTime date={date} format={format} formatStyle="long" precision="week" noTitle />,
        )
        const time = container.querySelector('time')
        const monthText = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'month', unitDisplay: 'long'}).format(
          1,
        )
        const weekText = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'week', unitDisplay: 'long'}).format(1)
        const monthAndWeek = new Intl.ListFormat(undefined, {type: 'unit', style: 'long'}).format([monthText, weekText])
        const before = direction === 'past' ? monthText : monthAndWeek
        const after = direction === 'past' ? monthAndWeek : monthText
        const delay = direction === 'past' ? 250 : 1

        expect(time?.textContent).toBe(before)
        act(() => vi.advanceTimersByTime(delay - 1))
        expect(time?.textContent).toBe(before)
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(after)

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })

    it.each(['past', 'future'] as const)('updates week precision at a %s year boundary', direction => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-02T12:00:00.000Z')
        vi.setSystemTime(now)
        const year = 360 * 86_400_000
        const date = new Date(now.getTime() + (direction === 'past' ? -year + 250 : year))
        const {container, unmount} = render(
          <RelativeTime date={date} format={format} formatStyle="long" precision="week" noTitle />,
        )
        const time = container.querySelector('time')
        const formatUnit = (unit: 'year' | 'month' | 'week', value: number) =>
          new Intl.NumberFormat(undefined, {style: 'unit', unit, unitDisplay: 'long'}).format(value)
        const lastMonth = new Intl.ListFormat(undefined, {type: 'unit', style: 'long'}).format([
          formatUnit('month', 11),
          formatUnit('week', 4),
        ])
        const yearText = formatUnit('year', 1)
        const before = direction === 'past' ? lastMonth : yearText
        const after = direction === 'past' ? yearText : lastMonth
        const delay = direction === 'past' ? 250 : 1

        expect(time?.textContent).toBe(before)
        act(() => vi.advanceTimersByTime(delay - 1))
        expect(time?.textContent).toBe(before)
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(after)

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })
  })

  it.each(['relative', 'micro'] as const)('updates %s with week precision when the first week is reached', format => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 7 * 86_400_000 + 250)
      const options = {format, precision: 'week'} as const
      const {container, unmount} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const initialText = formatRelativeTime(date, now.getTime(), options).text
      const nextText =
        format === 'relative'
          ? new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'}).format(-1, 'week')
          : new Intl.NumberFormat(undefined, {style: 'unit', unit: 'week', unitDisplay: 'narrow'}).format(1)

      expect(initialText).not.toBe(nextText)
      expect(time?.textContent).toBe(initialText)
      act(() => vi.advanceTimersByTime(249))
      expect(time?.textContent).toBe(initialText)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(nextText)

      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(
    (
      [
        {name: 'default', options: {format: undefined, precision: undefined}, forced: false},
        {name: 'auto', options: {format: 'auto', precision: undefined}, forced: false},
        {name: 'relative', options: {format: 'relative', precision: undefined}, forced: false},
        {name: 'forced relative', options: {format: 'relative', precision: undefined}, forced: true},
        {name: 'micro with second precision', options: {format: 'micro', precision: 'second'}, forced: false},
        {name: 'forced micro with second precision', options: {format: 'micro', precision: 'second'}, forced: true},
      ] as const
    ).flatMap(format =>
      (
        [
          {name: 'minute', distance: 115_000, lower: {value: 1, unit: 'minute'}, upper: {value: 2, unit: 'minute'}},
          {name: 'hour', distance: 3_295_000, lower: {value: 54, unit: 'minute'}, upper: {value: 1, unit: 'hour'}},
          {name: 'second hour', distance: 6_895_000, lower: {value: 1, unit: 'hour'}, upper: {value: 2, unit: 'hour'}},
          {name: 'first day', distance: 75_295_000, lower: {value: 20, unit: 'hour'}, upper: {value: 1, unit: 'day'}},
          {name: 'second day', distance: 129_295_000, lower: {value: 1, unit: 'day'}, upper: {value: 2, unit: 'day'}},
        ] as const
      ).flatMap(boundary => (['past', 'future'] as const).map(direction => ({format, boundary, direction}))),
    ),
  )('updates $format.name at the $direction rounded $boundary.name boundary', ({format, boundary, direction}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const distance = direction === 'past' ? boundary.distance - 250 : boundary.distance
      const date = new Date(now.getTime() + (direction === 'past' ? -distance : distance))
      const delay = direction === 'past' ? 250 : 1
      const onRelativeTimeUpdated = vi.fn()
      const options = {...format.options, ...(format.forced ? {tense: direction} : {})}
      const {container, unmount} = render(
        <RelativeTime date={date} {...options} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
      )
      const time = container.querySelector('time')
      const formatUnit = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
        format.options.format === 'micro' && !format.forced
          ? new Intl.NumberFormat(undefined, {style: 'unit', unit, unitDisplay: 'narrow'}).format(value)
          : new Intl.RelativeTimeFormat(undefined, {
              numeric: format.options.format === 'micro' ? 'always' : 'auto',
              style: format.options.format === 'micro' ? 'narrow' : 'long',
            }).format(direction === 'past' ? -value : value, unit)
      const lower = formatUnit(boundary.lower.value, boundary.lower.unit)
      const upper = formatUnit(boundary.upper.value, boundary.upper.unit)
      const before = direction === 'past' ? lower : upper
      const after = direction === 'past' ? upper : lower

      expect(formatRelativeTime(date, now.getTime(), options).text).toBe(before)
      expect(formatRelativeTime(date, now.getTime() + delay, options).text).toBe(after)
      expect(time?.textContent).toBe(before)
      onRelativeTimeUpdated.mockClear()
      act(() => vi.advanceTimersByTime(delay - 1))
      expect(time?.textContent).toBe(before)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(after)
      expect(onRelativeTimeUpdated).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({oldText: before, newText: after}),
      )

      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(
    (
      [
        {name: 'default micro', options: {format: 'micro', precision: undefined}},
        {name: 'minute-precision micro', options: {format: 'micro', precision: 'minute'}},
        {name: 'minute-precision relative', options: {format: 'relative', precision: 'minute'}},
      ] as const
    ).flatMap(format =>
      (
        [
          {name: 'minute', distance: 120_000, lower: {value: 1, unit: 'minute'}, upper: {value: 2, unit: 'minute'}},
          {name: 'hour', distance: 3_300_000, lower: {value: 54, unit: 'minute'}, upper: {value: 1, unit: 'hour'}},
        ] as const
      ).flatMap(boundary => (['past', 'future'] as const).map(direction => ({format, boundary, direction}))),
    ),
  )('updates $format.name at the $direction represented $boundary.name boundary', ({format, boundary, direction}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const distance = direction === 'past' ? boundary.distance - 250 : boundary.distance
      const date = new Date(now.getTime() + (direction === 'past' ? -distance : distance))
      const delay = direction === 'past' ? 250 : 1
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime date={date} {...format.options} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
      )
      const time = container.querySelector('time')
      const formatUnit = (value: number, unit: Intl.RelativeTimeFormatUnit) =>
        format.options.format === 'micro'
          ? new Intl.NumberFormat(undefined, {style: 'unit', unit, unitDisplay: 'narrow'}).format(value)
          : new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'}).format(
              direction === 'past' ? -value : value,
              unit,
            )
      const lower = formatUnit(boundary.lower.value, boundary.lower.unit)
      const upper = formatUnit(boundary.upper.value, boundary.upper.unit)
      const before = direction === 'past' ? lower : upper
      const after = direction === 'past' ? upper : lower

      expect(formatRelativeTime(date, now.getTime(), format.options).text).toBe(before)
      expect(formatRelativeTime(date, now.getTime() + delay, format.options).text).toBe(after)
      expect(time?.textContent).toBe(before)
      onRelativeTimeUpdated.mockClear()
      act(() => vi.advanceTimersByTime(delay - 1))
      expect(time?.textContent).toBe(before)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(after)
      expect(onRelativeTimeUpdated).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({oldText: before, newText: after}),
      )
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(
    (
      [
        {name: 'hour', precision: 'hour', distance: 75_600_000},
        {name: 'day', precision: 'day', distance: 518_400_000},
      ] as const
    ).flatMap(boundary =>
      (['relative', 'micro'] as const).flatMap(format =>
        (['past', 'future'] as const).map(direction => ({boundary, format, direction})),
      ),
    ),
  )('updates $format with $boundary.name precision at the $direction boundary', ({boundary, format, direction}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const distance = direction === 'past' ? boundary.distance - 250 : boundary.distance
      const date = new Date(now.getTime() + (direction === 'past' ? -distance : distance))
      const delay = direction === 'past' ? 250 : 1
      const options = {format, precision: boundary.precision}
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime date={date} {...options} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
      )
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), options).text
      const after = formatRelativeTime(date, now.getTime() + delay, options).text

      expect(before).not.toBe(after)
      expect(time?.textContent).toBe(before)
      onRelativeTimeUpdated.mockClear()
      act(() => vi.advanceTimersByTime(delay - 1))
      expect(time?.textContent).toBe(before)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(after)
      expect(onRelativeTimeUpdated).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({oldText: before, newText: after}),
      )
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(['relative', 'micro'] as const)('updates a %s value at the subminute rounding boundary', format => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 54_750)
      const options = {format, precision: 'second'} as const
      const {container, unmount} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), options).text
      const after = formatRelativeTime(date, now.getTime() + 250, options).text

      expect(before).not.toBe(after)
      expect(time?.textContent).toBe(before)
      act(() => vi.advanceTimersByTime(249))
      expect(time?.textContent).toBe(before)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(after)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(
    (['relative', 'micro'] as const).flatMap(format =>
      (['past', 'future'] as const).map(direction => ({format, direction})),
    ),
  )('keeps successive $direction $format updates aligned to their rounding boundaries', ({format, direction}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const offset = direction === 'past' ? -61_250 : 230_000
      const firstDelay = direction === 'past' ? 53_750 : 55_001
      const date = new Date(now.getTime() + offset)
      const options = {format, precision: 'second'} as const
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime date={date} {...options} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
      )
      const time = container.querySelector('time')
      const initial = formatRelativeTime(date, now.getTime(), options).text
      const first = formatRelativeTime(date, now.getTime() + firstDelay, options).text
      const second = formatRelativeTime(date, now.getTime() + firstDelay + 60_000, options).text

      expect(initial).not.toBe(first)
      expect(first).not.toBe(second)
      expect(time?.textContent).toBe(initial)
      onRelativeTimeUpdated.mockClear()
      act(() => vi.advanceTimersByTime(firstDelay - 1))
      expect(time?.textContent).toBe(initial)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(first)
      act(() => vi.advanceTimersByTime(59_999))
      expect(time?.textContent).toBe(first)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(second)
      expect(onRelativeTimeUpdated.mock.calls.map(([event]) => [event.oldText, event.newText])).toEqual([
        [initial, first],
        [first, second],
      ])
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reschedules rounded updates when precision changes and clears the previous timer', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 114_750)
      const {container, rerender, unmount} = render(<RelativeTime date={date} format="micro" noTitle />)
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), {format: 'micro'}).text
      const after = formatRelativeTime(date, now.getTime() + 250, {format: 'micro', precision: 'second'}).text

      expect(before).not.toBe(after)
      expect(time?.textContent).toBe(before)
      act(() => vi.advanceTimersByTime(249))
      rerender(<RelativeTime date={date} format="micro" precision="second" noTitle />)
      expect(vi.getTimerCount()).toBe(1)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(after)
      rerender(<RelativeTime date={date} format="datetime" noTitle />)
      expect(vi.getTimerCount()).toBe(0)
      unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not notify or poll every second when a forced relative value stays unchanged', () => {
    vi.useFakeTimers()
    const schedule = vi.spyOn(window, 'setTimeout')
    try {
      const now = new Date('2026-03-01T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 3 * 86_400_000 - 20_000)
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime
          date={date}
          format="relative"
          tense="future"
          onRelativeTimeUpdated={onRelativeTimeUpdated}
          noTitle
        />,
      )
      const before = container.querySelector('time')?.textContent
      onRelativeTimeUpdated.mockClear()
      schedule.mockClear()

      act(() => vi.advanceTimersByTime(3_600_000))
      expect(container.querySelector('time')?.textContent).toBe(before)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      expect(schedule.mock.calls.length).toBeLessThanOrEqual(2)
      expect(vi.getTimerCount()).toBe(1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      schedule.mockRestore()
      vi.useRealTimers()
    }
  })

  it.each([
    {offset: 61_000, advance: 7_000},
    {offset: 3_601_000, advance: 362_000},
  ])('increases update frequency as a future relative time enters a shorter unit', ({offset, advance}) => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() + offset)
      const {container} = render(<RelativeTime date={date} format="relative" noTitle />)
      const time = container.querySelector('time')
      const initialText = formatRelativeTime(date, now.getTime(), {format: 'relative'}).text
      const nextText = formatRelativeTime(date, now.getTime() + advance, {format: 'relative'}).text

      expect(initialText).not.toEqual(nextText)
      expect(time).toHaveTextContent(initialText)
      act(() => vi.advanceTimersByTime(advance))
      expect(time).toHaveTextContent(nextText)
    } finally {
      vi.useRealTimers()
    }
  })

  describe.each([
    {name: 'default', format: undefined},
    {name: 'auto', format: 'auto'},
    {name: 'relative', format: 'relative'},
  ] as const)('$name format with a fixed threshold', ({format}) => {
    it.each(
      (
        [
          {name: 'default', precision: undefined, threshold: 'PT2M', distance: 120_000},
          {name: 'second', precision: 'second', threshold: '-PT2M', distance: 120_000},
          {name: 'minute', precision: 'minute', threshold: '-PT121S', distance: 180_000},
          {name: 'hour', precision: 'hour', threshold: 'PT30M', distance: 3_600_000},
          {name: 'day', precision: 'day', threshold: 'P3D', distance: 3 * 86_400_000},
          {name: 'week', precision: 'week', threshold: 'P8D', distance: 14 * 86_400_000},
        ] as const
      ).flatMap(testCase => [
        {...testCase, direction: 'past' as const},
        {...testCase, direction: 'future' as const},
      ]),
    )('updates at the $direction threshold with $name precision', ({direction, distance, precision, threshold}) => {
      vi.useFakeTimers()
      try {
        const now = new Date('2024-01-30T12:00:00.000Z')
        vi.setSystemTime(now)
        const date = new Date(now.getTime() + (direction === 'past' ? -distance + 250 : distance))
        const options = {
          ...(format ? {format} : {}),
          ...(precision ? {precision} : {}),
          threshold,
        }
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime date={date} {...options} onRelativeTimeUpdated={onRelativeTimeUpdated} noTitle />,
        )
        const time = container.querySelector('time')
        const before = formatRelativeTime(date, now.getTime(), options)
        const delay = direction === 'past' ? 250 : 1

        expect(before.resolvedFormat).toBe(direction === 'past' ? 'relative' : 'datetime')
        expect(time?.textContent).toBe(before.text)
        onRelativeTimeUpdated.mockClear()
        act(() => vi.advanceTimersByTime(delay - 1))
        expect(time?.textContent).toBe(before.text)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()

        act(() => vi.advanceTimersByTime(1))
        const after = formatRelativeTime(date, Date.now(), options)
        expect(after.resolvedFormat).toBe(direction === 'past' ? 'datetime' : 'relative')
        expect(time?.textContent).toBe(after.text)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })
  })

  it.each(['date', 'datetime'] as const)(
    'switches a workflow creation time to an absolute date at the default one-hour threshold with %s',
    dateProp => {
      vi.useFakeTimers()
      try {
        const now = new Date('2026-03-01T12:59:59.000Z')
        vi.setSystemTime(now)
        const createdAt = new Date('2026-03-01T12:00:00.000Z')
        const props = dateProp === 'date' ? {date: createdAt} : {datetime: createdAt.toISOString()}
        const {container, unmount} = render(<RelativeTime {...props} threshold="PT1H" />)
        const time = container.querySelector('time')
        const relative = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto', style: 'long'}).format(-1, 'hour')
        const absolute = `on ${new Intl.DateTimeFormat(undefined, {month: 'short', day: 'numeric'}).format(createdAt)}`

        expect(time?.textContent).toBe(relative)
        act(() => vi.advanceTimersByTime(999))
        expect(time?.textContent).toBe(relative)
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(absolute)
        act(() => vi.advanceTimersByTime(1_000))
        expect(time?.textContent).toBe(absolute)

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    },
  )

  describe.each([
    {name: 'default format', format: undefined},
    {name: 'auto format', format: 'auto'},
    {name: 'relative format', format: 'relative'},
    {name: 'micro format', format: 'micro'},
  ] as const)('30-day rollover in the $name', ({format}) => {
    it.each(
      [
        {name: 'default threshold', threshold: undefined},
        {name: 'fixed threshold', threshold: 'P30D'},
        {name: 'calendar threshold', threshold: 'P1M'},
      ].filter(({threshold}) => format !== 'micro' || threshold === 'P30D'),
    )('updates at the past rollover with a $name', ({threshold}) => {
      vi.useFakeTimers()
      try {
        const now = new Date('2026-04-01T11:59:59.750Z')
        const date = new Date('2026-03-02T12:00:00.000Z')
        const options = {format, threshold}
        vi.setSystemTime(now)
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime date={date} {...options} noTitle onRelativeTimeUpdated={onRelativeTimeUpdated} />,
        )
        const time = container.querySelector('time')
        const before = formatRelativeTime(date, Date.now(), options)
        expect(before.resolvedFormat).toBe(format === 'micro' ? 'duration' : 'relative')
        expect(time?.textContent).toBe(before.text)
        onRelativeTimeUpdated.mockClear()

        act(() => vi.advanceTimersByTime(249))
        expect(time?.textContent).toBe(before.text)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
        act(() => vi.advanceTimersByTime(1))

        const after = formatRelativeTime(date, Date.now(), options)
        expect(after.resolvedFormat).toBe('datetime')
        expect(time?.textContent).toBe(after.text)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
        expect(onRelativeTimeUpdated.mock.calls[0][0].newText).toBe(after.text)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })

    it.each(
      [
        {name: 'default threshold', threshold: undefined},
        {name: 'fixed threshold', threshold: 'P30D'},
        {name: 'calendar threshold', threshold: 'P1M'},
      ].filter(({threshold}) => format !== 'micro' || threshold === 'P30D'),
    )('updates just after the future rollover with a $name', ({threshold}) => {
      vi.useFakeTimers()
      try {
        const now = new Date('2026-03-02T12:00:00.000Z')
        const date = new Date('2026-04-01T12:00:00.000Z')
        const options = {format, threshold}
        vi.setSystemTime(now)
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime date={date} {...options} noTitle onRelativeTimeUpdated={onRelativeTimeUpdated} />,
        )
        const time = container.querySelector('time')
        const before = formatRelativeTime(date, Date.now(), options)
        expect(before.resolvedFormat).toBe('datetime')
        expect(time?.textContent).toBe(before.text)
        onRelativeTimeUpdated.mockClear()

        act(() => vi.advanceTimersByTime(1))
        const after = formatRelativeTime(date, Date.now(), options)
        expect(after.resolvedFormat).toBe(format === 'micro' ? 'duration' : 'relative')
        expect(time?.textContent).toBe(after.text)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
        expect(onRelativeTimeUpdated.mock.calls[0][0].newText).toBe(after.text)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    })
  })

  it.each(
    (
      [
        {
          name: 'default format with a calendar threshold',
          format: undefined,
          precision: undefined,
          now: '2024-02-13T12:34:55.873Z',
          date: '2024-01-15T12:34:56.123Z',
          threshold: 'P1M',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'auto format',
          format: 'auto',
          precision: undefined,
          now: '2024-02-13T12:34:55.873Z',
          date: '2024-01-15T12:34:56.123Z',
          threshold: 'P1M',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'relative format',
          format: 'relative',
          precision: undefined,
          now: '2024-02-13T12:34:55.873Z',
          date: '2024-01-15T12:34:56.123Z',
          threshold: 'P1M',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'future relative format',
          format: 'relative',
          precision: undefined,
          now: '2023-12-11T12:34:56.123Z',
          date: '2024-01-15T12:34:56.123Z',
          threshold: 'P1M5D',
          delay: 1,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'default format and threshold for a past date',
          format: undefined,
          precision: undefined,
          now: '2024-03-02T12:34:55.873Z',
          date: '2024-01-31T12:34:56.123Z',
          threshold: undefined,
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'default format and threshold for a future date',
          format: undefined,
          precision: undefined,
          now: '2024-02-13T12:34:56.123Z',
          date: '2024-03-15T12:34:56.123Z',
          threshold: undefined,
          delay: 1,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'calendar threshold with minute precision',
          format: 'relative',
          precision: 'minute',
          now: '2024-02-13T12:34:55.873Z',
          date: '2024-01-15T12:34:56.123Z',
          threshold: 'P1M',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'fixed threshold with week precision',
          format: 'relative',
          precision: 'week',
          now: '2024-03-05T12:34:55.873Z',
          date: '2024-01-28T12:34:56.123Z',
          threshold: 'P30D',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'past calendar threshold with a time component',
          format: 'relative',
          precision: undefined,
          now: '2024-02-03T15:39:00.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1M5DT3H4M5S',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'future calendar threshold with a time component',
          format: 'relative',
          precision: undefined,
          now: '2023-11-27T09:30:51.123Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1M5DT3H4M5S',
          delay: 1,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'calendar threshold with a time component and minute precision',
          format: 'relative',
          precision: 'minute',
          now: '2024-02-03T15:39:55.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1M5DT3H4M5S',
          delay: 250,
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'past micro calendar threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-01-31T15:34:56.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1MT3H',
          delay: 250,
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'past micro negative calendar threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-01-31T15:34:56.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: '-P1MT3H',
          delay: 250,
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'past micro calendar threshold with a forced tense',
          format: 'micro',
          precision: undefined,
          tense: 'past',
          now: '2024-01-31T15:34:56.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1MT3H',
          delay: 250,
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'future micro calendar threshold',
          format: 'micro',
          precision: undefined,
          now: '2023-11-27T09:30:50.123Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P1M5DT3H4M5S',
          delay: 1,
          before: 'datetime',
          after: 'duration',
        },
        {
          name: 'past micro fixed threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-02-29T12:34:56.873Z',
          date: '2024-01-01T12:34:56.123Z',
          threshold: 'P60D',
          delay: 250,
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'future micro fixed threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-02-13T12:34:55.123Z',
          date: '2024-03-15T12:34:56.123Z',
          threshold: 'P30D',
          delay: 1,
          before: 'datetime',
          after: 'duration',
        },
        {
          name: 'past relative reference day shifted by a negative threshold',
          format: 'relative',
          precision: undefined,
          now: '2024-01-01T02:59:59.750Z',
          date: '2023-12-01T03:00:12.345Z',
          threshold: '-P1MT3H',
          delay: 250,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'future relative reference day shifted by a negative threshold',
          format: 'relative',
          precision: undefined,
          now: '2024-01-01T02:59:59.750Z',
          date: '2024-01-31T03:00:12.345Z',
          threshold: '-P1MT3H',
          delay: 250,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'past micro reference day shifted by a negative threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-01-01T02:59:59.750Z',
          date: '2023-12-01T03:00:12.345Z',
          threshold: '-P1MT3H',
          delay: 250,
          before: 'datetime',
          after: 'duration',
        },
        {
          name: 'future micro reference day shifted by a negative threshold',
          format: 'micro',
          precision: undefined,
          now: '2024-01-01T02:59:59.750Z',
          date: '2024-01-31T03:00:12.345Z',
          threshold: '-P1MT3H',
          delay: 250,
          before: 'datetime',
          after: 'duration',
        },
      ] as const
    ).flatMap(testCase => ['UTC', 'America/Los_Angeles'].map(timeZone => ({tense: undefined, ...testCase, timeZone}))),
  )(
    'updates at the threshold boundary for $name in $timeZone',
    ({now, date: dateString, format, precision, tense, threshold, delay, before, after, timeZone}) => {
      vi.useFakeTimers()
      try {
        vi.setSystemTime(new Date(now))
        const date = new Date(dateString)
        const options = {format, precision, tense, threshold, locale: 'en-US', timeZone}
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime
            date={date}
            format={format}
            precision={precision}
            tense={tense}
            threshold={threshold}
            lang="en-US"
            timeZone={timeZone}
            noTitle
            onRelativeTimeUpdated={onRelativeTimeUpdated}
          />,
        )
        const time = container.querySelector('time')
        const initial = formatRelativeTime(date, Date.now(), options)
        expect(initial.resolvedFormat).toBe(before)
        expect(time?.textContent).toBe(initial.text)
        onRelativeTimeUpdated.mockClear()

        act(() => vi.advanceTimersByTime(delay - 1))
        expect(time?.textContent).toBe(initial.text)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()

        act(() => vi.advanceTimersByTime(1))
        const next = formatRelativeTime(date, Date.now(), options)
        expect(next.resolvedFormat).toBe(after)
        expect(next.text).not.toBe(initial.text)
        expect(time?.textContent).toBe(next.text)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
        expect(onRelativeTimeUpdated.mock.calls[0][0]).toMatchObject({oldText: initial.text, newText: next.text})
        expect(vi.getTimerCount()).toBe(1)

        unmount()
        expect(vi.getTimerCount()).toBe(0)
        act(() => vi.advanceTimersByTime(86_400_000))
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
      } finally {
        vi.useRealTimers()
      }
    },
  )

  it('does not notify or add timers when a calendar threshold check leaves text unchanged', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2024-01-31T15:34:56.873Z'))
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime
          datetime="2024-01-01T12:34:56.123Z"
          format="micro"
          threshold="P1YT3H"
          noTitle
          onRelativeTimeUpdated={onRelativeTimeUpdated}
        />,
      )
      const initialText = container.querySelector('time')?.textContent
      onRelativeTimeUpdated.mockClear()

      act(() => vi.advanceTimersByTime(250))
      expect(container.querySelector('time')?.textContent).toBe(initialText)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(1)

      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(
    (
      [
        {
          name: 'default threshold in the default format',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-03-03T12:00:00.123Z',
          format: undefined,
          threshold: undefined,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'default threshold in the auto format',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-03-03T12:00:00.123Z',
          format: 'auto',
          threshold: undefined,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'default threshold in the relative format',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-03-03T12:00:00.123Z',
          format: 'relative',
          threshold: undefined,
          before: 'datetime',
          after: 'relative',
        },
        {
          name: 'calendar threshold for a past relative time',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-01-02T11:59:59.877Z',
          format: 'relative',
          threshold: 'P1M',
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'calendar threshold for a future relative time',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-03-02T12:00:00.123Z',
          format: 'relative',
          threshold: 'P1M',
          before: 'relative',
          after: 'datetime',
        },
        {
          name: 'calendar threshold for a past micro time',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-01-02T11:59:59.877Z',
          format: 'micro',
          threshold: 'P1M',
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'calendar threshold for a future micro time',
          now: '2025-01-31T23:59:59.750Z',
          date: '2025-03-02T12:00:00.123Z',
          format: 'micro',
          threshold: 'P1M',
          before: 'duration',
          after: 'datetime',
        },
        {
          name: 'fixed threshold for a future micro time',
          now: '2024-12-31T23:59:59.750Z',
          date: '2025-03-02T12:00:00.123Z',
          format: 'micro',
          threshold: 'P60D',
          before: 'datetime',
          after: 'duration',
        },
      ] as const
    ).flatMap(testCase => ['UTC', 'America/Los_Angeles'].map(timeZone => ({...testCase, timeZone}))),
  )(
    'updates at UTC midnight when a $name changes in $timeZone',
    ({now, date: dateString, format, threshold, before, after, timeZone}) => {
      vi.useFakeTimers()
      try {
        vi.setSystemTime(new Date(now))
        const date = new Date(dateString)
        const options = {format, threshold, locale: 'en-US', timeZone}
        const onRelativeTimeUpdated = vi.fn()
        const {container, unmount} = render(
          <RelativeTime
            date={date}
            format={format}
            threshold={threshold}
            lang="en-US"
            timeZone={timeZone}
            noTitle
            onRelativeTimeUpdated={onRelativeTimeUpdated}
          />,
        )
        const time = container.querySelector('time')
        const initial = formatRelativeTime(date, Date.now(), options)
        expect(initial.resolvedFormat).toBe(before)
        expect(time?.textContent).toBe(initial.text)
        onRelativeTimeUpdated.mockClear()

        act(() => vi.advanceTimersByTime(249))
        expect(time?.textContent).toBe(initial.text)
        expect(onRelativeTimeUpdated).not.toHaveBeenCalled()

        act(() => vi.advanceTimersByTime(1))
        const next = formatRelativeTime(date, Date.now(), options)
        expect(next.resolvedFormat).toBe(after)
        expect(next.text).not.toBe(initial.text)
        expect(time?.textContent).toBe(next.text)
        expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
        expect(onRelativeTimeUpdated.mock.calls[0][0]).toMatchObject({oldText: initial.text, newText: next.text})
        expect(vi.getTimerCount()).toBe(1)

        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    },
  )

  it('keeps a single timer when a 30-day rollover does not change the rendered format', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2026-04-01T11:59:59.750Z'))
      const onRelativeTimeUpdated = vi.fn()
      const {container, unmount} = render(
        <RelativeTime
          datetime="2026-03-02T12:00:00.000Z"
          threshold="P1Y"
          onRelativeTimeUpdated={onRelativeTimeUpdated}
        />,
      )
      const text = container.querySelector('time')?.textContent
      onRelativeTimeUpdated.mockClear()

      act(() => vi.advanceTimersByTime(250))
      expect(container.querySelector('time')?.textContent).toBe(text)
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
      expect(vi.getTimerCount()).toBe(1)
      act(() => vi.advanceTimersByTime(1000))
      expect(vi.getTimerCount()).toBe(1)

      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('retains the calendar comparison when week precision crosses a 30-day threshold', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-30T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 30 * 86_400_000 + 250)
      const options = {format: 'relative', precision: 'week', threshold: 'P29D'} as const
      const {container} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), options)

      expect(before.resolvedFormat).toBe('relative')
      expect(time?.textContent).toBe(before.text)
      act(() => vi.advanceTimersByTime(250))
      const after = formatRelativeTime(date, Date.now(), options)
      expect(after.resolvedFormat).toBe('datetime')
      expect(time?.textContent).toBe(after.text)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reschedules a changed threshold and preserves explicitly forced relative phrasing', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-30T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 119_250)
      const {container, rerender, unmount} = render(
        <RelativeTime date={date} format="relative" threshold="PT3M" noTitle />,
      )
      const time = container.querySelector('time')

      rerender(<RelativeTime date={date} format="relative" threshold="PT2M" noTitle />)
      const before = formatRelativeTime(date, Date.now(), {format: 'relative', threshold: 'PT2M'})
      expect(before.resolvedFormat).toBe('relative')
      expect(time?.textContent).toBe(before.text)
      act(() => vi.advanceTimersByTime(750))
      const after = formatRelativeTime(date, Date.now(), {format: 'relative', threshold: 'PT2M'})
      expect(after.resolvedFormat).toBe('datetime')
      expect(time?.textContent).toBe(after.text)

      rerender(<RelativeTime date={date} format="relative" threshold="PT2M" tense="past" noTitle />)
      const forced = formatRelativeTime(date, Date.now(), {format: 'relative', threshold: 'PT2M', tense: 'past'})
      expect(forced.resolvedFormat).toBe('relative')
      expect(time?.textContent).toBe(forced.text)
      expect(vi.getTimerCount()).toBe(1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(['PT2M', '-PT2M'])('updates a past micro time after it passes a %s threshold', threshold => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 119_250)
      const options = {format: 'micro', threshold} as const
      const {container} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), options)
      const represented = formatRelativeTime(date, now.getTime() + 750, options)
      const after = formatRelativeTime(date, now.getTime() + 1_750, options)

      expect(before.resolvedFormat).toBe('duration')
      expect(represented.resolvedFormat).toBe('duration')
      expect(represented.text).not.toBe(before.text)
      expect(after.resolvedFormat).toBe('datetime')
      expect(time).toHaveTextContent(before.text)
      act(() => vi.advanceTimersByTime(749))
      expect(time).toHaveTextContent(before.text)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(represented.text)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(after.text)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates past and future micro timestamps when they cross an explicit threshold', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-06-15T12:00:00.000Z')
      vi.setSystemTime(now)
      const past = new Date(now.getTime() - 3_600_000 + 500)
      const future = new Date(now.getTime() + 3_600_000 + 500)
      const updated = vi.fn()
      const {getByTestId} = render(
        <>
          <RelativeTime
            date={past}
            format="micro"
            threshold="PT1H"
            onRelativeTimeUpdated={updated}
            data-testid="past"
          />
          <RelativeTime
            date={future}
            format="micro"
            threshold="PT1H"
            onRelativeTimeUpdated={updated}
            data-testid="future"
          />
        </>,
      )
      const pastTime = getByTestId('past')
      const futureTime = getByTestId('future')
      const pastBefore = pastTime.textContent
      const futureBefore = futureTime.textContent
      updated.mockClear()

      act(() => vi.advanceTimersByTime(502))

      expect(pastTime.textContent).not.toBe(pastBefore)
      expect(futureTime.textContent).not.toBe(futureBefore)
      expect(updated).toHaveBeenCalledTimes(2)
      expect(updated.mock.calls.map(([event]) => [event.oldText, event.newText])).toEqual(
        expect.arrayContaining([
          [pastBefore, pastTime.textContent],
          [futureBefore, futureTime.textContent],
        ]),
      )
    } finally {
      vi.useRealTimers()
    }
  })

  it.each(['PT2M', '-PT2M'])('updates a future micro time as soon as it enters a %s threshold', threshold => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() + 121_000)
      const options = {format: 'micro', threshold} as const
      const {container} = render(<RelativeTime date={date} {...options} noTitle />)
      const time = container.querySelector('time')
      const before = formatRelativeTime(date, now.getTime(), options)
      const equality = formatRelativeTime(date, now.getTime() + 1_000, options)
      const after = formatRelativeTime(date, now.getTime() + 1_001, options)

      expect(before.resolvedFormat).toBe('datetime')
      expect(after.resolvedFormat).toBe('duration')
      expect(time).toHaveTextContent(before.text)
      act(() => vi.advanceTimersByTime(999))
      expect(time).toHaveTextContent(before.text)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(equality.text)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(after.text)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reschedules updates when precision and format change', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const date = new Date(now.getTime() - 3_705_250)
      const {container, rerender, unmount} = render(
        <RelativeTime date={date} format="elapsed" precision="minute" noTitle />,
      )
      const time = container.querySelector('time')
      expect(vi.getTimerCount()).toBe(1)

      act(() => vi.advanceTimersByTime(1_000))
      rerender(<RelativeTime date={date} format="elapsed" noTitle />)
      expect(time).toHaveTextContent(formatRelativeTime(date, now.getTime() + 1_000, {format: 'elapsed'}).text)
      act(() => vi.advanceTimersByTime(750))
      expect(time).toHaveTextContent(formatRelativeTime(date, now.getTime() + 1_750, {format: 'elapsed'}).text)
      expect(vi.getTimerCount()).toBe(1)

      rerender(<RelativeTime date={date} format="datetime" noTitle />)
      expect(vi.getTimerCount()).toBe(0)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('reschedules a changed date and cleans up in StrictMode', () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2024-01-02T12:00:00.000Z')
      vi.setSystemTime(now)
      const initialDate = new Date(now.getTime() - 200)
      const nextDate = new Date(now.getTime() - 3_250)
      const {container, rerender, unmount} = render(
        <StrictMode>
          <RelativeTime date={initialDate} format="duration" noTitle />
        </StrictMode>,
      )
      expect(vi.getTimerCount()).toBe(1)
      act(() => vi.advanceTimersByTime(500))
      rerender(
        <StrictMode>
          <RelativeTime date={nextDate} format="duration" noTitle />
        </StrictMode>,
      )
      const time = container.querySelector('time')
      const before = formatRelativeTime(nextDate, now.getTime() + 500, {format: 'duration'}).text
      const after = formatRelativeTime(nextDate, now.getTime() + 750, {format: 'duration'}).text
      expect(before).not.toEqual(after)
      expect(time).toHaveTextContent(before)
      act(() => vi.advanceTimersByTime(249))
      expect(time).toHaveTextContent(before)
      act(() => vi.advanceTimersByTime(1))
      expect(time).toHaveTextContent(after)
      expect(vi.getTimerCount()).toBe(1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not schedule recurring updates for datetime format', () => {
    vi.useFakeTimers()
    try {
      vi.setSystemTime(new Date('2024-01-02T12:00:00.000Z'))
      const onRelativeTimeUpdated = vi.fn()
      render(
        <RelativeTime
          datetime="2024-01-01T12:00:00.000Z"
          format="datetime"
          onRelativeTimeUpdated={onRelativeTimeUpdated}
        />,
      )
      onRelativeTimeUpdated.mockClear()

      expect(vi.getTimerCount()).toBe(0)
      act(() => vi.advanceTimersByTime(3_600_000))
      expect(onRelativeTimeUpdated).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })
})

it('honors year precision without including smaller elapsed units', () => {
  const now = new Date('2024-01-02T12:00:00.000Z')
  const date = new Date(now.getTime() - 400 * 86_400_000 - 3_600_000)
  expect(elapsedTime(date, 'year', now.getTime())).toMatchObject({
    years: -1,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  vi.useFakeTimers()
  try {
    vi.setSystemTime(now)
    const {container} = render(<RelativeTime date={date} format="duration" precision="year" noTitle />)
    const expected = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'year', unitDisplay: 'long'}).format(1)
    expect(container.querySelector('time')?.textContent).toBe(expected)
  } finally {
    vi.useRealTimers()
  }
})

it('retains days rather than splitting them into weeks at default duration precision', () => {
  const now = new Date('2024-01-02T12:00:00.000Z')
  const date = new Date(now.getTime() - 15 * 86_400_000)
  const expected = new Intl.NumberFormat(undefined, {style: 'unit', unit: 'day', unitDisplay: 'long'}).format(15)

  expect(formatRelativeTime(date, now.getTime(), {format: 'duration', formatStyle: 'long'}).text).toBe(expected)
})

describe('preferred absolute time', () => {
  const now = new Date('2024-06-15T12:00:00.000Z')
  const options = {locale: 'en-US', timeZone: 'UTC'} as const

  it('formats relative, micro, and datetime output as absolute date and time, but leaves durations', () => {
    const lastYear = new Date('2023-03-02T09:05:00.000Z')
    const thisYear = new Date('2024-03-02T09:05:00.000Z')
    const today = new Date('2024-06-15T09:05:00.000Z')
    const prefers = {...options, prefersAbsoluteTime: true}

    expect(formatRelativeTime(lastYear, now.getTime(), {...prefers, format: 'relative', tense: 'past'}).text).toBe(
      'Mar 2, 2023, 9:05 AM UTC',
    )
    expect(formatRelativeTime(thisYear, now.getTime(), {...prefers, format: 'micro'}).text).toBe('Mar 2, 9:05 AM UTC')
    expect(formatRelativeTime(today, now.getTime(), {...prefers, format: 'datetime'}).text).toBe('Today 9:05 AM UTC')
    expect(formatRelativeTime(today, now.getTime(), {...prefers, format: 'auto'}).text).toBe('Today 9:05 AM UTC')
    expect(formatRelativeTime(today, now.getTime(), {...prefers, format: 'duration'}).text).toBe(
      formatRelativeTime(today, now.getTime(), {...options, format: 'duration'}).text,
    )
    expect(formatRelativeTime(today, now.getTime(), {...prefers, format: 'elapsed'}).text).toBe(
      formatRelativeTime(today, now.getTime(), {...options, format: 'elapsed'}).text,
    )
  })

  it.each(['html', 'body'] as const)('follows live changes to the %s preference attribute', async element => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(now)
    const target = element === 'html' ? document.documentElement : document.body
    try {
      const {container} = render(
        <RelativeTime datetime="2023-03-02T09:05:00.000Z" format="relative" tense="past" timeZone="UTC" />,
      )
      const time = container.querySelector('time')
      expect(time?.textContent).toBe('last year')

      await act(async () => {
        target.setAttribute('data-prefers-absolute-time', 'true')
        await Promise.resolve()
      })
      expect(time?.textContent).toMatch(/^Mar 2, 2023, 9:05\sAM UTC$/)

      await act(async () => {
        target.removeAttribute('data-prefers-absolute-time')
        await Promise.resolve()
      })
      expect(time?.textContent).toBe('last year')
    } finally {
      target.removeAttribute('data-prefers-absolute-time')
      vi.useRealTimers()
    }
  })

  it('lets an explicit prop override the document preference', async () => {
    document.body.setAttribute('data-prefers-absolute-time', 'true')
    try {
      const {container, rerender} = render(
        <RelativeTime datetime="2023-03-02T09:05:00.000Z" format="relative" tense="past" prefersAbsoluteTime={false} />,
      )
      await act(async () => {})
      expect(container.querySelector('time')?.textContent).toMatch(/ago$|^last year$/)

      document.body.removeAttribute('data-prefers-absolute-time')
      rerender(
        <RelativeTime datetime="2023-03-02T09:05:00.000Z" format="relative" prefersAbsoluteTime timeZone="UTC" />,
      )
      await act(async () => {})
      expect(container.querySelector('time')?.textContent).toMatch(/2023/)
    } finally {
      document.body.removeAttribute('data-prefers-absolute-time')
    }
  })

  it('does not schedule a datetime update when the absolute preference is explicitly disabled', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(now)
    document.body.setAttribute('data-prefers-absolute-time', 'true')
    try {
      const {unmount} = render(
        <RelativeTime datetime="2024-06-15T09:05:00.000Z" format="datetime" prefersAbsoluteTime={false} />,
      )
      expect(vi.getTimerCount()).toBe(0)
      unmount()
    } finally {
      document.body.removeAttribute('data-prefers-absolute-time')
      vi.useRealTimers()
    }
  })

  it('checks preferred absolute dates at day boundaries without notifying when text is unchanged', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(now)
    try {
      const {container, unmount} = render(<RelativeTime date={new Date(now.getTime() - 60_000)} prefersAbsoluteTime />)
      expect(container.querySelector('time')?.textContent).toMatch(/^Today /)
      expect(vi.getTimerCount()).toBe(1)
      unmount()

      const onUpdate = vi.fn()
      const older = render(
        <RelativeTime
          datetime="2020-01-01T00:00:00.000Z"
          prefersAbsoluteTime
          timeZone="UTC"
          onRelativeTimeUpdated={onUpdate}
        />,
      )
      const previous = older.container.querySelector('time')?.textContent
      const callsBeforeBoundary = onUpdate.mock.calls.length
      expect(vi.getTimerCount()).toBe(1)
      act(() => vi.advanceTimersByTime(12 * 60 * 60_000))
      expect(older.container.querySelector('time')?.textContent).toBe(previous)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary)
      older.unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each([
    {
      name: 'quarter-hour zone',
      timeZone: 'Asia/Kathmandu',
      before: '2024-06-02T18:14:59.999Z',
      date: '2024-06-02T17:00:00.000Z',
    },
    {
      name: 'half-hour zone',
      timeZone: 'America/St_Johns',
      before: '2024-06-03T02:29:59.999Z',
      date: '2024-06-03T01:30:00.000Z',
    },
    {
      name: 'spring daylight-saving transition',
      timeZone: 'America/New_York',
      before: '2024-03-11T03:59:59.999Z',
      date: '2024-03-11T03:30:00.000Z',
    },
    {
      name: 'fall daylight-saving transition',
      timeZone: 'America/New_York',
      before: '2024-11-04T04:59:59.999Z',
      date: '2024-11-04T04:30:00.000Z',
    },
  ])('updates preferred today text at midnight in a $name', ({timeZone, before, date}) => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date(before))
    try {
      const onUpdate = vi.fn()
      const value = new Date(date)
      const {container, unmount} = render(
        <RelativeTime
          date={value}
          lang="en-US"
          timeZone={timeZone}
          hourCycle="h23"
          prefersAbsoluteTime
          onRelativeTimeUpdated={onUpdate}
        />,
      )
      const time = container.querySelector('time')
      const previous = time?.textContent
      expect(previous).toMatch(/^Today /)
      const callsBeforeBoundary = onUpdate.mock.calls.length
      act(() => vi.advanceTimersByTime(0))
      expect(time?.textContent).toBe(previous)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary)

      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(
        formatRelativeTime(value, Date.now(), {locale: 'en-US', timeZone, hourCycle: 'h23', prefersAbsoluteTime: true})
          .text,
      )
      expect(time?.textContent).not.toBe(previous)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary + 1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each([
    {name: 'Gregorian year', locale: 'en-US', before: '2024-12-31T23:59:59.999Z', date: '2025-03-02T09:05:00.000Z'},
    {
      name: 'Islamic calendar year',
      locale: 'en-US-u-ca-islamic',
      before: '2024-07-05T23:59:59.999Z',
      date: '2024-07-20T12:00:00.000Z',
    },
    {
      name: 'Japanese calendar era',
      locale: 'en-US-u-ca-japanese',
      before: '2019-04-30T23:59:59.999Z',
      date: '2019-05-10T12:00:00.000Z',
    },
  ])('updates a future timestamp at the start of its $name', ({locale, before, date}) => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date(before))
    try {
      const onUpdate = vi.fn()
      const value = new Date(date)
      const {container, unmount} = render(
        <RelativeTime
          date={value}
          lang={locale}
          timeZone="UTC"
          hourCycle="h23"
          prefersAbsoluteTime
          onRelativeTimeUpdated={onUpdate}
        />,
      )
      const time = container.querySelector('time')
      const previous = time?.textContent
      const callsBeforeBoundary = onUpdate.mock.calls.length
      expect(vi.getTimerCount()).toBe(1)
      act(() => vi.advanceTimersByTime(0))
      expect(time?.textContent).toBe(previous)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary)

      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(
        formatRelativeTime(value, Date.now(), {
          locale,
          timeZone: 'UTC',
          hourCycle: 'h23',
          prefersAbsoluteTime: true,
        }).text,
      )
      expect(time?.textContent).not.toBe(previous)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary + 1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates and keeps checking after a past timestamp leaves the current year', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date('2024-12-31T23:59:59.999Z'))
    try {
      const date = new Date('2024-06-02T17:00:00.000Z')
      const {container, unmount} = render(
        <RelativeTime date={date} lang="en-US" timeZone="UTC" hourCycle="h23" prefersAbsoluteTime />,
      )
      const time = container.querySelector('time')
      const previous = time?.textContent
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toBe(
        formatRelativeTime(date, Date.now(), {
          locale: 'en-US',
          timeZone: 'UTC',
          hourCycle: 'h23',
          prefersAbsoluteTime: true,
        }).text,
      )
      expect(time?.textContent).not.toBe(previous)
      expect(vi.getTimerCount()).toBe(1)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates a past timestamp when a time-zone rollback reenters its calendar year', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date('1944-01-01T06:00:59.999Z'))
    try {
      const onUpdate = vi.fn()
      const {container, unmount} = render(
        <RelativeTime
          datetime="1943-12-31T12:00:00.000Z"
          lang="en-US"
          timeZone="America/Phoenix"
          prefersAbsoluteTime
          onRelativeTimeUpdated={onUpdate}
        />,
      )
      const time = container.querySelector('time')
      expect(time?.textContent).toContain('1943')
      const callsBeforeBoundary = onUpdate.mock.calls.length
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toMatch(/^Today /)
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary + 1)
      act(() => vi.advanceTimersByTime(59 * 60_000))
      expect(time?.textContent).toContain('1943')
      expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary + 2)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each([
    {
      name: '23-hour spring day',
      start: '2024-03-10T05:00:00.000Z',
      boundary: '2024-03-11T04:00:00.000Z',
    },
    {
      name: '25-hour fall day',
      start: '2024-11-03T04:00:00.000Z',
      boundary: '2024-11-04T05:00:00.000Z',
    },
  ])('tracks midnight across a $name', ({start, boundary}) => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date(start))
    try {
      const {container, unmount} = render(
        <RelativeTime date={new Date(start)} lang="en-US" timeZone="America/New_York" prefersAbsoluteTime />,
      )
      const time = container.querySelector('time')
      const previous = time?.textContent
      expect(previous).toMatch(/^Today /)
      const interval = new Date(boundary).getTime() - Date.now()
      act(() => vi.advanceTimersByTime(interval - 1))
      expect(time?.textContent).toBe(previous)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).not.toBe(previous)
      expect(time?.textContent).not.toMatch(/^Today /)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('updates each time a daylight-saving rollback crosses midnight', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date('2009-11-01T02:59:59.999Z'))
    try {
      const onUpdate = vi.fn()
      const {container, unmount} = render(
        <RelativeTime
          datetime="2009-11-01T02:30:00.000Z"
          lang="en-US"
          timeZone="America/Goose_Bay"
          prefersAbsoluteTime
          onRelativeTimeUpdated={onUpdate}
        />,
      )
      const time = container.querySelector('time')
      expect(time?.textContent).toMatch(/^Today /)
      const initialCalls = onUpdate.mock.calls.length
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).not.toMatch(/^Today /)
      act(() => vi.advanceTimersByTime(59_999))
      expect(time?.textContent).not.toMatch(/^Today /)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toMatch(/^Today /)
      act(() => vi.advanceTimersByTime(59 * 60_000))
      expect(time?.textContent).not.toMatch(/^Today /)
      expect(onUpdate).toHaveBeenCalledTimes(initialCalls + 3)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it('changes a future timestamp to today at the start of its local day', () => {
    vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
    vi.setSystemTime(new Date('2024-06-02T18:14:59.999Z'))
    try {
      const {container, unmount} = render(
        <RelativeTime datetime="2024-06-03T04:00:00.000Z" lang="en-US" timeZone="Asia/Kathmandu" prefersAbsoluteTime />,
      )
      const time = container.querySelector('time')
      expect(time?.textContent).not.toMatch(/^Today /)
      act(() => vi.advanceTimersByTime(1))
      expect(time?.textContent).toMatch(/^Today /)
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })

  it.each([false, true])(
    'follows a live zone change while respecting an explicit override: %s',
    async explicitOverride => {
      vi.useFakeTimers({toFake: ['Date', 'setTimeout', 'clearTimeout']})
      vi.setSystemTime(new Date('2024-06-02T18:14:59.999Z'))
      try {
        const onUpdate = vi.fn()
        const {container, getByTestId, unmount} = render(
          <div data-testid="ancestor" {...{'time-zone': 'Asia/Kathmandu'}}>
            <RelativeTime
              datetime="2024-06-02T18:00:00.000Z"
              lang="en-US"
              {...(explicitOverride ? {timeZone: 'UTC'} : {})}
              prefersAbsoluteTime
              onRelativeTimeUpdated={onUpdate}
            />
          </div>,
        )
        await act(async () => {
          getByTestId('ancestor').setAttribute('time-zone', 'UTC')
          await Promise.resolve()
        })
        const time = container.querySelector('time')
        const previous = time?.textContent
        const callsBeforeBoundary = onUpdate.mock.calls.length
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).toBe(previous)
        expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary)

        const interval = new Date('2024-06-03T00:00:00.000Z').getTime() - Date.now()
        act(() => vi.advanceTimersByTime(interval - 1))
        expect(time?.textContent).toBe(previous)
        act(() => vi.advanceTimersByTime(1))
        expect(time?.textContent).not.toBe(previous)
        expect(onUpdate).toHaveBeenCalledTimes(callsBeforeBoundary + 1)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
      } finally {
        vi.useRealTimers()
      }
    },
  )
})
