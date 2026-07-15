import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {createRef} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Close, Popover, Root, Trigger} from './BasePopover'

describe('BasePopover', () => {
  it('connects the trigger and popover with a generated id', () => {
    render(
      <Root>
        <Trigger>Toggle popover</Trigger>
        <Popover data-testid="popover">
          Popover content
          <Close>Close popover</Close>
        </Popover>
      </Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Toggle popover'})
    const close = screen.getByRole('button', {name: 'Close popover', hidden: true})
    const popover = screen.getByTestId('popover')

    expect(popover.id).not.toBe('')
    expect(trigger).toHaveAttribute('commandfor', popover.id)
    expect(trigger).toHaveAttribute('command', 'toggle-popover')
    expect(close).toHaveAttribute('commandfor', popover.id)
    expect(close).toHaveAttribute('command', 'hide-popover')
  })

  it('uses a custom id to connect the trigger and popover', () => {
    render(
      <Root id="custom-popover">
        <Trigger>Toggle popover</Trigger>
        <Popover>
          Popover content
          <Close>Close popover</Close>
        </Popover>
      </Root>,
    )

    expect(screen.getByRole('button', {name: 'Toggle popover'})).toHaveAttribute('commandfor', 'custom-popover')
    expect(screen.getByRole('button', {name: 'Close popover', hidden: true})).toHaveAttribute(
      'commandfor',
      'custom-popover',
    )
    expect(screen.getByText('Popover content')).toHaveAttribute('id', 'custom-popover')
  })

  it('uses an auto popover by default', () => {
    render(
      <Root>
        <Trigger>Toggle popover</Trigger>
        <Popover>Popover content</Popover>
      </Root>,
    )

    expect(screen.getByText('Popover content')).toHaveAttribute('popover', 'auto')
  })

  it.each(['auto', 'hint', 'manual'] as const)('supports popover="%s"', popover => {
    render(
      <Root popover={popover}>
        <Trigger>Toggle popover</Trigger>
        <Popover>Popover content</Popover>
      </Root>,
    )

    expect(screen.getByText('Popover content')).toHaveAttribute('popover', popover)
  })

  it('forwards props to the trigger, popover, and close elements', () => {
    const triggerRef = createRef<HTMLButtonElement>()
    const popoverRef = createRef<HTMLElement>()
    const closeRef = createRef<HTMLButtonElement>()

    render(
      <Root>
        <Trigger className="custom-trigger" aria-label="Custom trigger" ref={triggerRef}>
          Toggle popover
        </Trigger>
        <Popover className="custom-popover" data-testid="popover" data-variant="custom" ref={popoverRef}>
          Popover content
          <Close className="custom-close" aria-label="Custom close" ref={closeRef}>
            Close popover
          </Close>
        </Popover>
      </Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Custom trigger'})
    const close = screen.getByRole('button', {name: 'Custom close', hidden: true})
    const popover = screen.getByTestId('popover')

    expect(trigger).toHaveClass('custom-trigger')
    expect(trigger).toHaveAttribute('type', 'button')
    expect(popover).toHaveClass('custom-popover')
    expect(popover).toHaveAttribute('data-variant', 'custom')
    expect(close).toHaveClass('custom-close')
    expect(close).toHaveAttribute('type', 'button')
    expect(triggerRef.current).toBe(trigger)
    expect(popoverRef.current).toBe(popover)
    expect(closeRef.current).toBe(close)
  })

  it('composes props and refs with custom rendered elements', () => {
    const triggerRef = createRef<HTMLButtonElement>()
    const renderedTriggerRef = createRef<HTMLButtonElement>()
    const popoverRef = createRef<HTMLElement>()
    const renderedPopoverRef = createRef<HTMLElement>()
    const closeRef = createRef<HTMLButtonElement>()
    const renderedCloseRef = createRef<HTMLButtonElement>()

    render(
      <Root id="custom-render-popover">
        <Trigger
          className="trigger"
          ref={triggerRef}
          render={
            <button className="rendered-trigger" ref={renderedTriggerRef} type="button">
              Toggle popover
            </button>
          }
        />
        <Popover
          className="popover"
          ref={popoverRef}
          render={
            <section className="rendered-popover" data-testid="popover" ref={renderedPopoverRef}>
              Popover content
              <Close
                className="close"
                ref={closeRef}
                render={
                  <button className="rendered-close" ref={renderedCloseRef} type="button">
                    Close popover
                  </button>
                }
              />
            </section>
          }
        />
      </Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Toggle popover'})
    const popover = screen.getByTestId('popover')
    const close = screen.getByRole('button', {name: 'Close popover', hidden: true})

    expect(trigger).toHaveClass('trigger', 'rendered-trigger')
    expect(trigger).toHaveAttribute('commandfor', 'custom-render-popover')
    expect(popover).toHaveClass('popover', 'rendered-popover')
    expect(popover).toHaveAttribute('id', 'custom-render-popover')
    expect(popover).toHaveAttribute('popover', 'auto')
    expect(close).toHaveClass('close', 'rendered-close')
    expect(close).toHaveAttribute('commandfor', 'custom-render-popover')
    expect(triggerRef.current).toBe(trigger)
    expect(renderedTriggerRef.current).toBe(trigger)
    expect(popoverRef.current).toBe(popover)
    expect(renderedPopoverRef.current).toBe(popover)
    expect(closeRef.current).toBe(close)
    expect(renderedCloseRef.current).toBe(close)
  })

  it('opens the popover from the trigger', async () => {
    render(
      <Root>
        <Trigger>Toggle popover</Trigger>
        <Popover data-testid="popover">Popover content</Popover>
      </Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Toggle popover'})
    const popover = screen.getByTestId('popover')

    expect(popover).not.toBeVisible()
    await userEvent.click(trigger)
    expect(popover).toBeVisible()
  })

  it('closes a manual popover from the close button', async () => {
    render(
      <Root popover="manual">
        <Trigger>Toggle popover</Trigger>
        <Popover data-testid="popover">
          Popover content
          <Close>Close popover</Close>
        </Popover>
      </Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Toggle popover'})
    const popover = screen.getByTestId('popover')

    await userEvent.click(trigger)
    expect(popover).toBeVisible()

    await userEvent.click(screen.getByRole('button', {name: 'Close popover'}))
    expect(popover).not.toBeVisible()
  })

  it('throws when compound components are rendered outside of Root', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      expect(() => render(<Trigger>Toggle popover</Trigger>)).toThrow(
        'useBasePopover must be used within a BasePopoverContext.Provider',
      )
      expect(() => render(<Popover>Popover content</Popover>)).toThrow(
        'useBasePopover must be used within a BasePopoverContext.Provider',
      )
      expect(() => render(<Close>Close popover</Close>)).toThrow(
        'useBasePopover must be used within a BasePopoverContext.Provider',
      )
    } finally {
      consoleError.mockRestore()
    }
  })
})
