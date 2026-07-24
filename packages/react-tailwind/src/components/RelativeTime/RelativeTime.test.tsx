import {render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {RelativeTime} from './RelativeTime'

it('renders relative content with server-compatible time semantics', () => {
  vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-01-02T12:05:00.000Z').valueOf())
  render(<RelativeTime datetime="2024-01-02T12:00:00.000Z" />)
  expect(screen.getByText('on Jan 2, 2024')).toHaveAttribute('datetime', '2024-01-02T12:00:00.000Z')
})
