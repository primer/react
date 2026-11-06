import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Button} from './Button'

describe('Button', () => {
  it('overlays a lone loading indicator without changing the label width', () => {
    const {unmount} = render(<Button loading>Submit</Button>)

    expect(screen.getByText('Submit').previousElementSibling).toHaveClass('absolute', 'left-1/2', '-translate-x-1/2')
    unmount()
  })

  it('uses Base UI button semantics and forwards its ref and props', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Button ref={ref} data-testid="button">
        Save
      </Button>,
    )
    expect(screen.getByRole('button', {name: 'Save'})).toHaveAttribute('data-component', 'Button')
    expect(screen.getByTestId('button')).toBe(ref.current)
  })

  it('submits a form only when explicitly given type="submit"', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <Button>Preview</Button>
        <Button type="submit">Create account</Button>
      </form>,
    )

    const preview = screen.getByRole('button', {name: 'Preview'})
    const submit = screen.getByRole('button', {name: 'Create account'})
    expect(preview).toHaveAttribute('type', 'button')
    expect(submit).toHaveAttribute('type', 'submit')
    await user.click(preview)
    expect(onSubmit).not.toHaveBeenCalled()
    await user.click(submit)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('keeps its action label accessible while loading with a keybinding hint', () => {
    render(
      <Button loading trailingVisual={<kbd>⌘↵</kbd>} variant="primary">
        Submit
      </Button>,
    )

    expect(screen.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', {name: /Submit/})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button', {name: /Submit/})).not.toBeDisabled()
    expect(screen.queryByText('⌘↵')).not.toBeInTheDocument()
  })

  it('keeps consumer descriptions alongside the loading announcement', () => {
    render(
      <>
        <Button aria-describedby="publish-hint" loading>
          Publish
        </Button>
        <span id="publish-hint">Saves the draft</span>
      </>,
    )

    expect(screen.getByRole('button', {name: 'Publish'})).toHaveAccessibleDescription('Loading Saves the draft')
  })

  it('renders Primer-compatible visual, counter, and inactive parts', () => {
    render(
      <Button count={3} inactive leadingVisual={() => <span data-testid="icon" />}>
        Watch
      </Button>,
    )

    const button = screen.getByRole('button', {name: /Watch/})
    expect(button).toHaveAttribute('data-inactive', 'true')
    expect(button).not.toBeDisabled()
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('data-component', 'leadingVisual')
    expect(screen.getByText('3')).toHaveAttribute('data-component', 'ButtonCounter')
  })

  it('drops hover, pressed, and expanded feedback while inactive', () => {
    const {rerender} = render(<Button>Merge</Button>)
    expect(screen.getByRole('button', {name: 'Merge'})).toHaveClass(
      'hover:bg-[var(--button-default-bgColor-hover)]',
      'aria-expanded:bg-[var(--button-default-bgColor-active)]',
    )

    rerender(<Button inactive>Merge</Button>)
    const button = screen.getByRole('button', {name: 'Merge'})
    expect(button).toHaveClass('bg-[var(--button-inactive-bgColor)]')
    expect(button).not.toHaveClass('hover:bg-[var(--button-default-bgColor-hover)]')
    expect(button).not.toHaveClass('aria-expanded:bg-[var(--button-default-bgColor-active)]')
  })

  it('does not add a native button type to a non-button render target', () => {
    const {container} = render(
      <Button nativeButton={false} render={<span />}>
        Save
      </Button>,
    )

    expect(container.querySelector('[role="button"]')).not.toHaveAttribute('type')
  })

  it('places the notification indicator on the button or leading visual', () => {
    const {rerender} = render(<Button notificationIndicator="button">Inbox</Button>)
    expect(screen.getByRole('button', {name: 'Inbox'})).toHaveAttribute('data-notification-indicator', 'button')
    expect(screen.getByRole('button', {name: 'Inbox'}).className).toContain('before:size-2')

    rerender(
      <Button leadingVisual={() => <svg aria-hidden="true" data-testid="gear" />} notificationIndicator="leadingVisual">
        View
      </Button>,
    )
    const leadingVisual = screen.getByTestId('gear').closest('[data-component="leadingVisual"]')
    expect(leadingVisual?.className).toContain('before:size-2')
    expect(screen.getByRole('button', {name: 'View'}).className).not.toContain('before:size-2')
  })
})
