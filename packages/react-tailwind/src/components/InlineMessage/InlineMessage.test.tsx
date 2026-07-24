import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {InlineMessage} from './InlineMessage'
it('renders an icon appropriate to its variant', () => {
  render(
    <InlineMessage data-testid="message" size="small" variant="success">
      Saved
    </InlineMessage>,
  )
  expect(screen.getByTestId('message')).toHaveAttribute('data-variant', 'success')
  expect(screen.getByTestId('message').querySelector('svg')).toBeTruthy()
})
