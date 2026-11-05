import {PlusIcon} from '@primer/octicons-react'
import {render, screen} from '@testing-library/react'
import {expect, it} from 'vitest'
import {IconButton} from './IconButton'

it('renders an accessible icon-only button and forwards DOM props', () => {
  render(<IconButton aria-label="Add item" data-testid="icon-button" icon={PlusIcon} />)

  expect(screen.getByRole('button', {name: 'Add item'})).toHaveAttribute('data-component', 'IconButton')
  expect(screen.getByTestId('icon-button')).toBeInTheDocument()
})

it('preserves its accessible name while loading', () => {
  const {container} = render(<IconButton aria-label="Download" icon={PlusIcon} loading />)

  expect(container.firstElementChild).toHaveAccessibleName('Download')
  expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true')
  expect(container.firstElementChild).not.toHaveAttribute('aria-labelledby')
})

it('renders element icons and the icon notification indicator', () => {
  render(<IconButton aria-label="Inbox" icon={<PlusIcon data-testid="element-icon" />} notificationIndicator="icon" />)

  const button = screen.getByRole('button', {name: 'Inbox'})
  expect(screen.getByTestId('element-icon')).toBeInTheDocument()
  expect(button).toHaveAttribute('data-notification-indicator', 'icon')
  expect(button.className).toContain('before:size-2')
})

it('describes the button with its tooltip description and keybinding hints', () => {
  render(
    <IconButton
      aria-label="Bold text"
      description="Make the selection bold"
      icon={PlusIcon}
      keybindingHint={['Control+B', 'Shift+B']}
    />,
  )

  const button = screen.getByRole('button', {name: 'Bold text'})
  expect(button).toHaveAttribute('data-component', 'IconButton')
  expect(button).toHaveAccessibleDescription('Make the selection bold (control b or shift b)')
})

it('labels without duplicating the description and skips nested or disabled tooltips', () => {
  render(
    <>
      <IconButton aria-label="Plain label" icon={PlusIcon} />
      {/* eslint-disable-next-line primer-react/a11y-remove-disable-tooltip -- covers the escape hatch itself */}
      <IconButton aria-label="No tooltip" icon={PlusIcon} unsafeDisableTooltip />
    </>,
  )

  expect(screen.getByRole('button', {name: 'Plain label'})).not.toHaveAttribute('aria-describedby')
  expect(screen.getByRole('button', {name: 'No tooltip'})).not.toHaveAttribute('aria-describedby')
})

it('keeps label tooltips named by aria-label and describes keybinding hints', () => {
  render(<IconButton aria-label="Italic text" icon={PlusIcon} keybindingHint="Control+I" />)

  const button = screen.getByRole('button', {name: 'Italic text'})
  expect(button).toHaveAccessibleDescription('(control i)')
})
