import {PlusIcon} from '@primer/octicons-react'
import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {IconButton} from './IconButton'

it('renders an accessible icon-only button and forwards DOM props', () => {
  render(<IconButton aria-label="Add item" data-testid="icon-button" icon={PlusIcon} />)

  expect(screen.getByRole('button', {name: 'Add item'})).toHaveAttribute('data-component', 'IconButton')
  expect(screen.getByTestId('icon-button')).toBeInTheDocument()
})
