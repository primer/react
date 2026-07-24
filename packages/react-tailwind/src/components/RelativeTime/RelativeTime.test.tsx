import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {RelativeTime} from './RelativeTime'
it('renders server-compatible time semantics', () => {
  render(<RelativeTime datetime="2024-01-02T12:00:00.000Z" />)
  expect(screen.getByText('Jan 2, 2024')).toHaveAttribute('datetime', '2024-01-02T12:00:00.000Z')
})
