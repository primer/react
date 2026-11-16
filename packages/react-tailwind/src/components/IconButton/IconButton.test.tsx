import {PlusIcon} from '@primer/octicons-react'
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {expect, it} from 'vitest'
import {Tooltip} from '../Tooltip'
import {IconButton, type IconButtonProps} from './IconButton'

// @ts-expect-error Icon-only buttons require either an aria-label or an aria-labelledby.
const unnamedButton: IconButtonProps = {icon: PlusIcon}
void unnamedButton

it('renders an accessible icon-only button and forwards DOM props', () => {
  render(<IconButton aria-label="Add item" data-testid="icon-button" icon={PlusIcon} />)

  expect(screen.getByRole('button', {name: 'Add item'})).toHaveAttribute('data-component', 'IconButton')
  expect(screen.getByTestId('icon-button')).toBeInTheDocument()
})

it('allows consumer size and dimension utilities to override its default sizing', () => {
  render(
    <>
      <IconButton aria-label="Custom size" className="size-5" icon={PlusIcon} size="small" />
      <IconButton aria-label="Custom dimensions" className="h-10 w-12" icon={PlusIcon} size="small" />
    </>,
  )

  const customSize = screen.getByRole('button', {name: 'Custom size'})
  expect(customSize).toHaveClass('size-5')
  expect(customSize).not.toHaveClass('primer:size-[max(28px,calc(var(--base-size-4)*7))]')
  expect(screen.getByRole('button', {name: 'Custom dimensions'})).toHaveClass('h-10', 'w-12')
})

it('drops aria-label when aria-labelledby names the button', () => {
  render(
    <>
      <span id="external-label">Close dialog</span>
      <IconButton aria-label="Close" aria-labelledby="external-label" icon={PlusIcon} />
    </>,
  )

  const button = screen.getByRole('button', {name: 'Close dialog'})
  expect(button).not.toHaveAttribute('aria-label')
})

it('accepts an external accessible name without requiring aria-label', () => {
  render(
    <>
      <span id="button-name">Close dialog</span>
      <IconButton aria-labelledby="button-name" description="Return to the page" icon={PlusIcon} />
    </>,
  )

  const button = screen.getByRole('button', {name: 'Close dialog'})
  expect(button).not.toHaveAttribute('aria-label')
  expect(button).toHaveAttribute('aria-labelledby', 'button-name')
  expect(button).toHaveAccessibleDescription('Return to the page')
})

it('preserves its accessible name while loading', () => {
  const {container} = render(<IconButton aria-label="Download" icon={PlusIcon} loading />)

  expect(container.firstElementChild).toHaveAccessibleName('Download')
  expect(container.firstElementChild).not.toHaveAttribute('aria-busy')
})

it('supports an external loading announcer without losing its tooltip description', () => {
  render(
    <IconButton
      aria-label="Download"
      description="Download the report"
      icon={PlusIcon}
      loading
      loadingAnnouncement=""
    />,
  )

  const button = screen.getByRole('button', {name: 'Download'})
  expect(button).toHaveAttribute('aria-disabled', 'true')
  expect(button).toHaveAccessibleDescription('Download the report')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('mutes only default icons so other variants keep their own icon colors', () => {
  render(
    <>
      <IconButton aria-label="Default" icon={PlusIcon} />
      <IconButton aria-label="Primary" icon={PlusIcon} variant="primary" />
      <IconButton aria-label="Danger" icon={PlusIcon} variant="danger" />
    </>,
  )

  expect(screen.getByRole('button', {name: 'Default'})).toHaveClass('primer:text-muted')
  expect(screen.getByRole('button', {name: 'Primary'})).not.toHaveClass('primer:text-muted')
  expect(screen.getByRole('button', {name: 'Danger'})).not.toHaveClass('primer:text-muted')
  expect(screen.getByRole('button', {name: 'Danger'})).toHaveAttribute('data-variant', 'danger')
})

it('renders element icons and the icon notification indicator', () => {
  render(<IconButton aria-label="Inbox" icon={<PlusIcon data-testid="element-icon" />} notificationIndicator="icon" />)

  const button = screen.getByRole('button', {name: 'Inbox'})
  expect(screen.getByTestId('element-icon')).toBeInTheDocument()
  expect(button).toHaveAttribute('data-notification-indicator', 'icon')
  expect(button.className).toContain('primer:before:size-2')
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

it('associates its built-in tooltip popup without changing its name or shortcut description', () => {
  render(<IconButton aria-label="Italic text" icon={PlusIcon} keybindingHint="Control+I" />)

  const button = screen.getByRole('button', {name: 'Italic text'})
  const owner = button.getAttribute('data-tooltip-trigger')
  const popup = document.querySelector('[data-component="Tooltip.Content"]')
  expect(owner).toBeTruthy()
  expect(popup?.getAttribute('data-tooltip-popup')).toBe(owner)
  expect(button).not.toHaveAttribute('aria-labelledby')
  expect(button).toHaveAccessibleDescription('(control i)')
})

it('forwards an enclosing tooltip association to a composed icon button', () => {
  render(
    <Tooltip type="label">
      <Tooltip.Trigger render={<IconButton aria-label="Close" icon={PlusIcon} />} />
      <Tooltip.Content>Close</Tooltip.Content>
    </Tooltip>,
  )

  const button = screen.getByRole('button', {name: 'Close'})
  const owner = button.getAttribute('data-tooltip-trigger')
  const popups = document.querySelectorAll('[data-tooltip-popup]')
  expect(owner).toBeTruthy()
  expect(popups).toHaveLength(1)
  expect(popups[0].getAttribute('data-tooltip-popup')).toBe(owner)
  expect(button).not.toHaveAttribute('aria-labelledby')
})

it('merges consumer ARIA references with its tooltip instead of replacing them', () => {
  render(
    <>
      <span id="underline-note">Applies to the selection</span>
      <span id="strike-name">Strike</span>
      <IconButton
        aria-describedby="underline-note"
        aria-label="Underline text"
        description="Underline the selection"
        icon={PlusIcon}
      />
      <IconButton aria-label="Strikethrough text" aria-labelledby="strike-name" icon={PlusIcon} />
    </>,
  )

  expect(screen.getByRole('button', {name: 'Underline text'})).toHaveAccessibleDescription(
    'Applies to the selection Underline the selection',
  )
  expect(screen.getByRole('button', {name: 'Strike'})).toHaveAttribute('data-component', 'IconButton')
})

it('preserves a custom rendered button description alongside its tooltip', () => {
  render(
    <>
      <span id="existing-description">Existing context.</span>
      <IconButton
        aria-label="Account settings"
        description="Opens account settings."
        icon={PlusIcon}
        render={<button aria-describedby="existing-description" type="button" />}
      />
    </>,
  )

  expect(screen.getByRole('button', {name: 'Account settings'})).toHaveAccessibleDescription(
    'Existing context. Opens account settings.',
  )
})

it('keeps aria-label as its only name source while showing the label tooltip', () => {
  render(<IconButton aria-label="Add item" icon={PlusIcon} />)
  const button = screen.getByRole('button', {name: 'Add item'})
  expect(button).toHaveAttribute('aria-label', 'Add item')
  expect(button).not.toHaveAttribute('aria-labelledby')
})

it('tracks its tooltip open state when given its own id', async () => {
  render(<IconButton id="archive-button" aria-label="Archive item" icon={PlusIcon} />)

  const button = screen.getByRole('button', {name: 'Archive item'})
  expect(button).toHaveAttribute('id', 'archive-button')
  fireEvent.keyDown(document.body, {key: 'Tab'})
  act(() => button.focus())
  await waitFor(() => expect(button).toHaveAttribute('data-popup-open'))
})
