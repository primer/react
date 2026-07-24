import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {Flash} from './Flash'
it('exposes its variant state on the root', () => {
  render(
    <Flash data-testid="flash" full variant="danger">
      Problem
    </Flash>,
  )
  expect(screen.getByTestId('flash')).toHaveAttribute('data-variant', 'danger')
  expect(screen.getByTestId('flash')).toHaveAttribute('data-full')
})
