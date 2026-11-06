import React from 'react'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {AnchoredOverlay} from './AnchoredOverlay'

describe('AnchoredOverlay', () => {
  afterEach(cleanup)

  it('opens from its trigger and closes when pressing outside', async () => {
    const user = userEvent.setup()
    render(
      <>
        <AnchoredOverlay>
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content>Content</AnchoredOverlay.Content>
        </AnchoredOverlay>
        <button type="button">Outside</button>
      </>,
    )
    await user.click(screen.getByRole('button', {name: 'Options'}))
    expect(await screen.findByText('Content')).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Outside'}))
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('supports content refs and state-aware class names', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    render(
      <AnchoredOverlay>
        <AnchoredOverlay.Trigger className={({open}) => (open ? 'open' : 'closed')}>Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content ref={ref} data-testid="content">
          Content
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )
    const trigger = screen.getByRole('button', {name: 'Options'})
    expect(trigger).toHaveClass('closed')
    await user.click(trigger)
    expect(ref.current).toBe(screen.getByTestId('content'))
    expect(ref.current).toHaveAttribute('data-component', 'AnchoredOverlay.Content')
    expect(ref.current).toHaveClass('bg-[var(--overlay-bgColor)]')
    expect(trigger).toHaveClass('open')
  })

  it('renders in place when portal is false', async () => {
    const user = userEvent.setup()
    render(
      <div data-testid="container">
        <AnchoredOverlay>
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content portal={false}>Content</AnchoredOverlay.Content>
        </AnchoredOverlay>
      </div>,
    )
    await user.click(screen.getByRole('button', {name: 'Options'}))
    expect(screen.getByTestId('container')).toContainElement(await screen.findByText('Content'))
  })

  it('traps focus when modal and rendering a Close part', async () => {
    const user = userEvent.setup()
    render(
      <>
        <AnchoredOverlay modal="trap-focus">
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content aria-label="Options">
            <button type="button">First</button>
            <AnchoredOverlay.Close>Close</AnchoredOverlay.Close>
          </AnchoredOverlay.Content>
        </AnchoredOverlay>
        <button type="button">Outside</button>
      </>,
    )
    await user.click(screen.getByRole('button', {name: 'Options'}))
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement))
    const focused: string[] = []
    for (let index = 0; index < 4; index++) {
      await user.tab()
      // Tabbing past either end lands on a focus guard, which moves focus back into the popup.
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement))
      focused.push(document.activeElement?.textContent ?? '')
    }
    expect(focused).toEqual(['Close', 'First', 'Close', 'First'])
  })

  it('sizes content on the shared overlay scale', () => {
    render(
      <AnchoredOverlay open>
        <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content
          data-testid="content"
          width="large"
          height="small"
          maxHeight="xsmall"
          maxWidth="medium"
        >
          Content
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )

    const content = screen.getByTestId('content')
    expect(content).toHaveClass('w-[30rem]', 'h-64', 'max-h-[min(12rem,100dvh)]', 'max-w-80')
    expect(content).not.toHaveClass('max-h-dvh')
  })

  it('opens against an external anchor without a trigger', async () => {
    const user = userEvent.setup()
    function ExternalAnchor() {
      const anchorRef = React.useRef<HTMLButtonElement>(null)
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
            External anchor
          </button>
          <AnchoredOverlay open={open} onOpenChange={setOpen}>
            <AnchoredOverlay.Content anchor={anchorRef}>Content</AnchoredOverlay.Content>
          </AnchoredOverlay>
        </>
      )
    }
    render(<ExternalAnchor />)

    const anchor = screen.getByRole('button', {name: 'External anchor'})
    const getBoundingClientRect = vi.spyOn(anchor, 'getBoundingClientRect')
    await user.click(anchor)
    expect(await screen.findByText('Content')).toBeVisible()
    await waitFor(() => expect(getBoundingClientRect).toHaveBeenCalled())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByText('Content')).not.toBeInTheDocument())
  })

  it('names and describes dialog content with its styled Base UI parts', () => {
    render(
      <AnchoredOverlay open>
        <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content role="dialog">
          <AnchoredOverlay.Title>Repository options</AnchoredOverlay.Title>
          <AnchoredOverlay.Description>Manage this repository.</AnchoredOverlay.Description>
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )

    expect(screen.getByRole('dialog', {name: 'Repository options'})).toHaveAccessibleDescription(
      'Manage this repository.',
    )
  })

  it('merges state-aware arrow classes and keeps its marker immutable', () => {
    render(
      <AnchoredOverlay open>
        <AnchoredOverlay.Trigger data-component="consumer">Options</AnchoredOverlay.Trigger>
        <AnchoredOverlay.Content>
          <AnchoredOverlay.Arrow data-testid="arrow" className={({open}) => (open ? 'open' : 'closed')} />
        </AnchoredOverlay.Content>
      </AnchoredOverlay>,
    )

    expect(screen.getByRole('button', {name: 'Options'})).toHaveAttribute('data-component', 'AnchoredOverlay.Trigger')
    const arrow = screen.getByTestId('arrow')
    expect(arrow).toHaveClass(
      '[--arrow-bg-color:var(--overlay-bgColor)]',
      '[--arrow-border-color:var(--borderColor-default)]',
      'open',
    )
    expect(arrow.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  describe('narrow fullscreen variant', () => {
    it('closes from its close button, which takes closeButtonProps', async () => {
      const user = userEvent.setup()
      render(
        <AnchoredOverlay defaultOpen>
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content
            variant={{narrow: 'fullscreen', regular: 'anchored'}}
            closeButtonProps={{'aria-label': 'Close options'}}
          >
            Content
          </AnchoredOverlay.Content>
        </AnchoredOverlay>,
      )

      const closeButton = screen.getByRole('button', {name: 'Close options'})
      expect(closeButton).toHaveAttribute('data-component', 'AnchoredOverlay.CloseButton')
      expect(screen.getByText('Content').parentElement).toHaveAttribute('data-responsive', 'fullscreen')

      await user.click(closeButton)
      await waitFor(() => expect(screen.queryByText('Content')).not.toBeInTheDocument())
    })

    it.each([
      ['anchored', {}],
      ['fullscreen without displayCloseButton', {variant: {narrow: 'fullscreen'}, displayCloseButton: false}],
    ] as const)('omits the close button when %s', (_, props) => {
      render(
        <AnchoredOverlay open>
          <AnchoredOverlay.Trigger>Options</AnchoredOverlay.Trigger>
          <AnchoredOverlay.Content {...props}>Content</AnchoredOverlay.Content>
        </AnchoredOverlay>,
      )

      expect(screen.queryByRole('button', {name: 'Close'})).not.toBeInTheDocument()
    })
  })
})
