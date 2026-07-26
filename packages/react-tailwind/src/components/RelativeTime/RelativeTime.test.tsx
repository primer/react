import {act, render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {RelativeTime} from './RelativeTime'

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
