import {act, createRef} from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import type {RelativeTimeElement} from '@github/relative-time-element'
import RelativeTime from '.'
import {render} from '@testing-library/react'
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

  it('renders children if passed', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date}>server rendered date</RelativeTime>)
    expect(container.textContent).toEqual('server rendered date')
  })

  it('hydrates the fallback without errors when server and client time zones differ', async () => {
    const date = new Date('2024-03-07T00:30:00.000Z')
    const relativeTime = <RelativeTime date={date} />
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
  })

  it('does not render no-title attribute by default', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} />)
    expect(container.firstChild).not.toHaveAttribute('no-title')
  })

  it('server renders datetime and format attributes', () => {
    const html = renderToString(
      <RelativeTime
        date={new Date('2026-08-17T12:00:00Z')}
        month="short"
        day="numeric"
        year="numeric"
        prefix=""
        threshold="PT0S"
        tense="past"
        precision="day"
        format="datetime"
        formatStyle="long"
        timeZoneName="short"
        timeZone="UTC"
        noTitle
      />,
    )
    const container = document.createElement('div')
    container.innerHTML = html
    const element = container.firstElementChild!

    expect(element.nodeName.toLowerCase()).toEqual('relative-time')
    expect(element).toHaveAttribute('datetime', '2026-08-17T12:00:00.000Z')
    expect(element).toHaveAttribute('month', 'short')
    expect(element).toHaveAttribute('day', 'numeric')
    expect(element).toHaveAttribute('year', 'numeric')
    expect(element).toHaveAttribute('prefix', '')
    expect(element).toHaveAttribute('threshold', 'PT0S')
    expect(element).toHaveAttribute('tense', 'past')
    expect(element).toHaveAttribute('precision', 'day')
    expect(element).toHaveAttribute('format', 'datetime')
    expect(element).toHaveAttribute('format-style', 'long')
    expect(element).toHaveAttribute('time-zone-name', 'short')
    expect(element).toHaveAttribute('time-zone', 'UTC')
    expect(element).toHaveAttribute('no-title', '')
    expect(element).toHaveAttribute('data-component', 'RelativeTime')
    expect(element).toHaveTextContent('Aug 17, 2026')
  })

  it('server renders a datetime string as-is', () => {
    const html = renderToString(<RelativeTime datetime="2026-08-17T12:00:00Z" day="" />)
    const container = document.createElement('div')
    container.innerHTML = html

    expect(container.firstElementChild).toHaveAttribute('datetime', '2026-08-17T12:00:00Z')
    expect(container.firstElementChild).toHaveAttribute('day', '')
    expect(container.firstElementChild).not.toHaveAttribute('month')
  })

  it('renders an explicitly undefined optional format option as an empty attribute', () => {
    const {container} = render(<RelativeTime date={new Date('2026-08-17T12:00:00Z')} year={undefined} />)
    expect(container.firstElementChild).toHaveAttribute('year', '')
    expect(container.firstElementChild).not.toHaveAttribute('month')
  })

  it('applies attributes when rendered on the client', () => {
    const {container} = render(
      <RelativeTime date={new Date('2026-08-17T12:00:00Z')} prefix="" timeZoneName="short" formatStyle="narrow" />,
    )
    const element = container.firstElementChild!

    expect(element).toHaveAttribute('datetime', '2026-08-17T12:00:00.000Z')
    expect(element).toHaveAttribute('prefix', '')
    expect(element).toHaveAttribute('time-zone-name', 'short')
    expect(element).toHaveAttribute('format-style', 'narrow')
  })

  it('forwards refs to the <relative-time> element', () => {
    const ref = createRef<RelativeTimeElement>()
    render(<RelativeTime ref={ref} date={new Date('2026-08-17T12:00:00Z')} />)
    expect(ref.current?.nodeName.toLowerCase()).toEqual('relative-time')
  })

  it('calls onRelativeTimeUpdated when the element updates', async () => {
    const onRelativeTimeUpdated = vi.fn()
    const {container} = render(
      <RelativeTime date={new Date('2026-08-17T12:00:00Z')} onRelativeTimeUpdated={onRelativeTimeUpdated} />,
    )
    container.firstElementChild!.dispatchEvent(new Event('relative-time-updated'))
    expect(onRelativeTimeUpdated).toHaveBeenCalled()
  })

  it('adds no-title attribute if noTitle={true}', () => {
    const date = new Date('2024-03-07T12:22:48.123Z')
    const {container} = render(<RelativeTime date={date} noTitle={true} />)
    expect(container.firstChild).toHaveAttribute('no-title')
  })
})
