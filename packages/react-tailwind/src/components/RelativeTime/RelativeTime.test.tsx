import {render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {RelativeTime} from './RelativeTime'

it('renders a localized fallback with custom-element time semantics', () => {
  render(<RelativeTime datetime="2024-01-02T12:00:00.000Z" />)
  expect(screen.getByText('Jan 2, 2024')).toHaveAttribute('datetime', '2024-01-02T12:00:00.000Z')
})

it('does not throw for an invalid date', () => {
  const {container} = render(<RelativeTime datetime="not-a-date" />)

  expect(container.querySelector('relative-time')).not.toHaveAttribute('datetime')
})

it('forwards the legacy formatting contract to the relative-time element', () => {
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
  const element = container.querySelector('relative-time')

  expect(element).toHaveAttribute('format', 'datetime')
  expect(element).toHaveAttribute('hour', 'numeric')
  expect(element).toHaveAttribute('minute', '2-digit')
  expect(element).toHaveAttribute('prefix', '')
  expect((element as HTMLElement & {noTitle: boolean}).noTitle).toBe(true)
})

it('forwards relative-time update events through React', () => {
  const onRelativeTimeUpdated = vi.fn()
  const {container} = render(
    <RelativeTime datetime="2024-01-02T12:00:00.000Z" onRelativeTimeUpdated={onRelativeTimeUpdated} />,
  )

  container.querySelector('relative-time')?.dispatchEvent(new CustomEvent('relative-time-updated'))

  expect(onRelativeTimeUpdated).toHaveBeenCalledOnce()
})
