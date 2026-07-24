import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {LinkButton} from './LinkButton'

it('composes button styling onto an anchor and forwards anchor props', () => {
  render(
    <LinkButton data-testid="link-button" href="/settings">
      Settings
    </LinkButton>,
  )

  expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('href', '/settings')
  expect(screen.getByTestId('link-button')).toHaveAttribute('data-component', 'LinkButton')
})
