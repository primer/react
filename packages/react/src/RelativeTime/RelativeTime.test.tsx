import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import RelativeTime from '.'
import {act, render} from '@testing-library/react'
import {implementsClassName} from '../utils/testing'

describe('RelativeTime', () => {
  implementsClassName(RelativeTime)
  it('renders a <relative-time>', () => {
    const {container} = render(<RelativeTime />)
    expect(container.firstChild?.nodeName.toLowerCase()).toEqual('relative-time')
  })

  it('renders data-component attribute', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)

    expect(container.firstChild).toHaveAttribute('data-component', 'RelativeTime')
  })

  it('renders a date inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)
    expect(container.textContent).toEqual('Mar 7, 2024')
  })

  it('renders a datetime inside', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime datetime={date.toJSON()} />)
    expect(container.textContent).toEqual('Mar 7, 2024')
  })

  it.each([undefined, 'compact'] as const)('renders children if passed (absoluteFormat: %s)', absoluteFormat => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(
      <RelativeTime date={date} absoluteFormat={absoluteFormat}>
        server rendered date
      </RelativeTime>,
    )
    expect(container.textContent).toEqual('server rendered date')
  })

  it.each([undefined, 'compact'] as const)(
    'hydrates the fallback without errors when server and client time zones differ (absoluteFormat: %s)',
    async absoluteFormat => {
      const date = new Date('2024-03-07T00:30:00.000Z')
      const relativeTime = <RelativeTime date={date} absoluteFormat={absoluteFormat} />
      const toLocaleDateStringSpy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Mar 7, 2024')
      const container = document.createElement('div')
      container.innerHTML = renderToString(relativeTime)
      document.body.appendChild(container)

      toLocaleDateStringSpy.mockImplementation((_locales, options) =>
        options?.timeZone === 'UTC' ? 'Mar 7, 2024' : 'Mar 6, 2024',
      )

      const recoverableErrors: unknown[] = []
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      let root: Root | undefined

      try {
        expect(container.firstChild).toHaveTextContent('Mar 7, 2024')

        await act(async () => {
          root = hydrateRoot(container, relativeTime, {
            onRecoverableError: error => recoverableErrors.push(error),
          })
        })

        expect(recoverableErrors).toEqual([])
        expect(consoleErrorSpy).not.toHaveBeenCalled()
        expect(container.firstChild).toHaveTextContent('Mar 7, 2024')
      } finally {
        toLocaleDateStringSpy.mockRestore()
        consoleErrorSpy.mockRestore()
        await act(async () => root?.unmount())
        container.remove()
      }
    },
  )

  it('does not render no-title attribute by default', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)
    expect(container.firstChild).not.toHaveAttribute('no-title')
  })

  it('adds no-title attribute if noTitle={true}', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} noTitle={true} />)
    expect(container.firstChild).toHaveAttribute('no-title')
  })

  describe('compact absolute output', () => {
    const date = new Date('2026-11-03T15:04:00.000Z')

    beforeEach(() => {
      vi.useFakeTimers({toFake: ['Date']})
      vi.setSystemTime(new Date('2026-11-03T16:04:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('updates and restores absolute text without changing the datetime or full title', async () => {
      const props = {
        date,
        format: 'datetime',
        lang: 'en-US',
        'time-zone': 'UTC',
        'hour-cycle': 'h23',
        prefix: 'Uploaded:',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      } as const
      const {container, rerender} = render(<RelativeTime {...props} />)
      const element = container.querySelector('relative-time')
      const displayedText = () => element?.shadowRoot?.textContent

      await expect.poll(displayedText).toContain('Uploaded:')
      const standardText = displayedText()
      const fullTitle = element?.getAttribute('title')
      expect(fullTitle).toContain('15:04 UTC')

      rerender(<RelativeTime {...props} absoluteFormat="compact" />)
      await expect.poll(displayedText).toBe('today at 3:04 PM')
      expect(element).toHaveAttribute('datetime', date.toISOString())
      expect(element).toHaveAttribute('title', fullTitle)

      rerender(<RelativeTime {...props} />)
      await expect.poll(displayedText).toBe(standardText)
    })

    it.each([
      {name: 'a custom title', title: 'Uploaded earlier', noTitle: false},
      {name: 'noTitle', title: undefined, noTitle: true},
    ])('renders a compact non-today datetime with $name when absolute time is preferred', async ({title, noTitle}) => {
      const datetime = '2026-11-02T15:04:00.000Z'
      const preference = 'data-prefers-absolute-time'
      const previousPreference = document.body.getAttribute(preference)
      document.body.setAttribute(preference, 'true')

      try {
        const {container} = render(
          <RelativeTime
            datetime={datetime}
            format="relative"
            lang="en-US"
            time-zone="UTC"
            absoluteFormat="compact"
            title={title}
            noTitle={noTitle}
          />,
        )
        const element = container.querySelector('relative-time')

        await expect.poll(() => element?.shadowRoot?.textContent).toBe('Nov 2, 2026')
        expect(element).toHaveAttribute('datetime', datetime)
        expect(element?.getAttribute('title')).toBe(title ?? null)
      } finally {
        if (previousPreference === null) document.body.removeAttribute(preference)
        else document.body.setAttribute(preference, previousPreference)
      }
    })

    it.each([
      {format: 'relative', text: '1 hour ago'},
      {format: 'duration', text: '1 hour'},
      {format: 'micro', text: '1h'},
    ] as const)('does not force absolute output in $format mode', async ({format, text}) => {
      const {container} = render(
        <RelativeTime date={date} format={format} lang="en-US" time-zone="UTC" absoluteFormat="compact" />,
      )
      const element = container.querySelector('relative-time')

      await expect.poll(() => element?.shadowRoot?.textContent).toBe(text)
    })
  })
})
