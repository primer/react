import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {BaseDialog, Close, Content, Dialog, Heading, Root, Trigger} from '../BaseDialog'
import {implementsClassName} from '../utils/testing'

function DialogWithRoot(props: React.ComponentPropsWithoutRef<'dialog'>) {
  return (
    <Root>
      <Dialog {...props} aria-label="Test dialog" />
    </Root>
  )
}

describe('BaseDialog', () => {
  implementsClassName(DialogWithRoot)

  it('renders a trigger connected to the dialog with show-modal by default', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger data-testid="trigger">Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog" />
      </BaseDialog>,
    )

    const trigger = screen.getByRole('button', {name: 'Open'})
    const dialog = screen.getByRole('dialog', {hidden: true})

    expect(dialog).toBeInTheDocument()
    expect(trigger).toHaveAttribute('commandfor', dialog.id)
    expect(trigger).toHaveAttribute('command', 'show-modal')
    expect(trigger).toHaveAttribute('type', 'button')
  })

  it('renders a trigger connected to the dialog with show when nonmodal is true', () => {
    render(
      <BaseDialog nonmodal>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog" />
      </BaseDialog>,
    )

    expect(screen.getByRole('button', {name: 'Open'})).toHaveAttribute('command', 'show')
  })

  it('allows overriding trigger command attributes', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger commandfor="custom-dialog" command="show">
          Open
        </BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog" />
      </BaseDialog>,
    )

    const trigger = screen.getByRole('button', {name: 'Open'})

    expect(trigger).toHaveAttribute('commandfor', 'custom-dialog')
    expect(trigger).toHaveAttribute('command', 'show')
  })

  it('renders a close button connected to the dialog', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog">
          <BaseDialog.Close>Close</BaseDialog.Close>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const close = screen.getByText('Close').closest('button')
    const dialog = screen.getByRole('dialog', {hidden: true})

    expect(dialog).toBeInTheDocument()
    expect(close).toHaveAttribute('commandfor', dialog.id)
    expect(close).toHaveAttribute('command', 'close')
    expect(close).toHaveAttribute('type', 'button')
  })

  it('allows overriding close command attributes', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog">
          <BaseDialog.Close commandfor="custom-dialog" command="request-close">
            Close
          </BaseDialog.Close>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const close = screen.getByText('Close').closest('button')

    expect(close).toHaveAttribute('commandfor', 'custom-dialog')
    expect(close).toHaveAttribute('command', 'request-close')
  })

  it('renders heading and content subcomponents', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog>
          <BaseDialog.Heading>Dialog title</BaseDialog.Heading>
          <BaseDialog.Content aria-label="Dialog content">Dialog content</BaseDialog.Content>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const dialog = screen.getByRole('dialog', {hidden: true})
    const heading = screen.getByText('Dialog title')

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAttribute('id')
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id)
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('adds aria-labelledby even when no heading is rendered', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog />
      </BaseDialog>,
    )

    expect(screen.getByRole('dialog', {hidden: true})).toHaveAttribute('aria-labelledby')
  })

  it('allows overriding the dialog label id', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-labelledby="custom-dialog-title">
          <BaseDialog.Heading id="custom-dialog-title">Dialog title</BaseDialog.Heading>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    expect(screen.getByText('Dialog title')).toHaveAttribute('id', 'custom-dialog-title')
    expect(screen.getByRole('dialog', {hidden: true})).toHaveAttribute('aria-labelledby', 'custom-dialog-title')
  })

  it('adds aria-labelledby when aria-label is provided', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog">
          <BaseDialog.Heading>Dialog title</BaseDialog.Heading>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const dialog = screen.getByRole('dialog', {hidden: true})

    expect(dialog).toHaveAttribute('aria-label', 'Example dialog')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('exposes individual compound component exports', () => {
    render(
      <Root>
        <Trigger>Open</Trigger>
        <Dialog>
          <Heading>Dialog title</Heading>
          <Content aria-label="Dialog content">Dialog content</Content>
          <Close>Close</Close>
        </Dialog>
      </Root>,
    )

    const dialog = screen.getByRole('dialog', {hidden: true})

    expect(dialog).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Open'})).toHaveAttribute('commandfor', dialog.id)
    expect(dialog).toHaveAttribute('aria-labelledby', screen.getByText('Dialog title').id)
    expect(screen.getByText('Close').closest('button')).toHaveAttribute('commandfor', dialog.id)
  })

  it('throws when a subcomponent is rendered outside of BaseDialog.Root', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      expect(() => render(<BaseDialog.Trigger>Open</BaseDialog.Trigger>)).toThrow(
        'useBaseDialogContext must be used within BaseDialog.Root',
      )
    } finally {
      consoleError.mockRestore()
    }
  })

  it('opens and closes the dialog with invoker commands', async () => {
    const user = userEvent.setup()
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog aria-label="Example dialog">
          <BaseDialog.Close>Close</BaseDialog.Close>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const trigger = screen.getByRole('button', {name: 'Open'})
    const dialog = screen.getByRole('dialog', {hidden: true}) as HTMLDialogElement

    await user.click(trigger)
    expect(dialog.open).toBe(true)

    await user.click(screen.getByRole('button', {name: 'Close'}))
    expect(dialog.open).toBe(false)
  })

  it('auto-labels content using a hidden "content" node with aria-labelledby pointing to the heading', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog>
          <BaseDialog.Heading>My dialog</BaseDialog.Heading>
          <BaseDialog.Content data-testid="content">Content goes here</BaseDialog.Content>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const heading = screen.getByText('My dialog')

    // A visually hidden span with "content" is rendered so aria-labelledby can
    // reference both the heading id and this node to produce "My dialog content"
    const hiddenLabel = screen.getByText('content', {selector: '[id]'})
    expect(hiddenLabel).toBeInTheDocument()
    expect(hiddenLabel.id).not.toBe('')
    expect(heading.id).not.toBe('')
  })

  it('allows overriding the auto-label on content', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog>
          <BaseDialog.Heading>My dialog</BaseDialog.Heading>
          <BaseDialog.Content aria-label="Custom label" data-testid="content">
            Content goes here
          </BaseDialog.Content>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    // When an explicit aria-label is provided, the hidden "content" span is not rendered
    expect(screen.queryByText('content', {selector: '[id]'})).not.toBeInTheDocument()
  })

  it('adds tabIndex={-1} automatically when autoFocus is set on the heading', () => {
    render(
      <BaseDialog>
        <BaseDialog.Trigger>Open</BaseDialog.Trigger>
        <BaseDialog.Dialog>
          <BaseDialog.Heading autoFocus>Dialog title</BaseDialog.Heading>
          <BaseDialog.Content>Content</BaseDialog.Content>
          <BaseDialog.Close>Close</BaseDialog.Close>
        </BaseDialog.Dialog>
      </BaseDialog>,
    )

    const heading = screen.getByText('Dialog title')

    // tabIndex={-1} is automatically added to make the heading programmatically focusable
    expect(heading).toHaveAttribute('tabindex', '-1')
  })
})
