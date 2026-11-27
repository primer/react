import {page, userEvent} from 'vitest/browser'
import type React from 'react'
import {createRef, useState} from 'react'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {act, fireEvent, render as HTMLRender, waitFor} from '@testing-library/react'
import {XIcon} from '@primer/octicons-react'
import {Button, IconButton} from '../../Button'
import {Tooltip, type TooltipOpenChange} from '../Tooltip'
import {withExpectedConsoleError} from '../../utils/testing'
import classes from '../Tooltip.module.css'

function CustomTrigger({label}: {label: string}) {
  return <Tooltip.Trigger render={<Button>{label}</Button>} />
}

describe('Tooltip parts composition', () => {
  it('renders default trigger and popup, opens on keyboard focus and hover, and dismisses on Escape', async () => {
    HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Popup direction="n">Save changes</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const trigger = page.getByRole('button', {name: 'Save'})
    const popup = page.getByText('Save changes')

    await expect.element(trigger).toHaveAttribute('type', 'button')
    await expect.element(trigger).toHaveAttribute('data-component', 'Tooltip.Trigger')
    await expect.element(popup).toHaveAttribute('data-component', 'Tooltip')
    await expect.element(popup).toHaveAttribute('data-direction', 'n')
    await expect.element(popup).toHaveAttribute('role', 'tooltip')
    await expect.element(popup).toHaveAttribute('aria-hidden', 'true')
    expect(trigger.element().getAttribute('aria-describedby')).toContain(popup.element().id)

    await userEvent.tab()
    await expect.element(trigger).toHaveAttribute('data-open', '')
    await expect.element(popup).toHaveAttribute('data-open', '')
    expect(popup.element().matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')
    await expect.element(trigger).not.toHaveAttribute('data-open')
    await expect.element(popup).not.toHaveAttribute('data-open')
    expect(popup.element().matches(':popover-open')).toBe(false)
    expect(document.activeElement).toBe(trigger.element())

    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(true)
    })

    await userEvent.unhover(trigger)
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(false)
    })
  })

  it('merges refs, className, ARIA, and event handlers onto a single element with render element and extracted components', async () => {
    const consumerButtonRef = createRef<HTMLButtonElement>()
    const triggerRef = createRef<HTMLElement>()
    const onMouseEnter = vi.fn()
    const onClick = vi.fn()
    const onFocus = vi.fn()

    const {container} = HTMLRender(
      <>
        <span id="extra-desc">Extra context</span>
        <Tooltip.Root>
          <Tooltip.Trigger
            ref={triggerRef}
            className="trigger-class"
            render={
              <Button
                ref={consumerButtonRef}
                className="button-class"
                aria-describedby="extra-desc"
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                onFocus={onFocus}
              >
                Action
              </Button>
            }
          />
          <Tooltip.Popup className="popup-class">Action details</Tooltip.Popup>
        </Tooltip.Root>
      </>,
    )

    expect(container.querySelectorAll('button')).toHaveLength(1)
    const button = container.querySelector('button')!
    expect(button.getAttribute('data-component')).toBe('Button')
    expect(consumerButtonRef.current).toBe(button)
    expect(triggerRef.current).toBe(button)
    expect(button.className).toContain('trigger-class')
    expect(button.className).toContain('button-class')

    const popup = page.getByText('Action details').element()
    expect(button.getAttribute('aria-describedby')).toContain('extra-desc')
    expect(button.getAttribute('aria-describedby')).toContain(popup.id)

    const popupClasses = Array.from(popup.classList)
    expect(popupClasses.indexOf(classes.Tooltip)).toBeLessThan(popupClasses.indexOf('popup-class'))

    fireEvent.mouseEnter(button)
    expect(onMouseEnter).toHaveBeenCalledTimes(1)

    // Mouse click focuses without :focus-visible; consumer onFocus still runs
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('supports extracted custom trigger components and render functions receiving live state', async () => {
    const states: Array<boolean> = []

    HTMLRender(
      <>
        <Tooltip.Root>
          <CustomTrigger label="Extracted" />
          <Tooltip.Popup>Extracted tooltip</Tooltip.Popup>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={(props, state) => {
              states.push(state.open)
              return (
                <button type="button" {...props} data-state-open={String(state.open)}>
                  Render fn
                </button>
              )
            }}
          />
          <Tooltip.Popup>Render fn tooltip</Tooltip.Popup>
        </Tooltip.Root>
      </>,
    )

    await expect.element(page.getByRole('button', {name: 'Extracted'})).toBeInTheDocument()
    const renderFnButton = page.getByRole('button', {name: 'Render fn'})
    await expect.element(renderFnButton).toHaveAttribute('data-state-open', 'false')

    await userEvent.tab()
    await userEvent.tab()
    await expect.element(renderFnButton).toHaveAttribute('data-state-open', 'true')
    expect(states).toContain(true)
  })

  it('deduplicates IconButton built-in tooltip when composed via Tooltip.Trigger render', () => {
    const {container} = HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger render={<IconButton icon={XIcon} aria-label="Close" />} />
        <Tooltip.Popup>Close dialog</Tooltip.Popup>
      </Tooltip.Root>,
    )

    expect(container.querySelectorAll('button')).toHaveLength(1)
    expect(container.querySelectorAll('[data-component="Tooltip"]')).toHaveLength(1)
    const button = container.querySelector('button')!
    const popup = container.querySelector('[data-component="Tooltip"]')!
    expect(button.getAttribute('data-component')).toBe('IconButton')
    expect(button.getAttribute('aria-label')).toBe('Close')
    expect(button.getAttribute('aria-describedby')).toContain(popup.id)
  })

  it('invokes onOpenChange with reason and supports synchronous cancel() in uncontrolled mode', async () => {
    const changes: Array<Pick<TooltipOpenChange, 'open' | 'reason'>> = []
    let blockOpen = true

    HTMLRender(
      <>
        <button type="button">Before</button>
        <Tooltip.Root
          onOpenChange={change => {
            changes.push({open: change.open, reason: change.reason})
            if (blockOpen && change.open) {
              change.cancel()
            }
          }}
        >
          <Tooltip.Trigger>Inspect</Tooltip.Trigger>
          <Tooltip.Popup>Inspect details</Tooltip.Popup>
        </Tooltip.Root>
      </>,
    )

    const popup = page.getByText('Inspect details').element()

    await userEvent.tab()
    await userEvent.tab()
    expect(changes).toEqual([{open: true, reason: 'trigger-focus'}])
    expect(popup.matches(':popover-open')).toBe(false)

    blockOpen = false
    await userEvent.tab({shift: true})
    await userEvent.tab()
    expect(popup.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')
    expect(popup.matches(':popover-open')).toBe(false)
    expect(changes).toEqual([
      {open: true, reason: 'trigger-focus'},
      {open: true, reason: 'trigger-focus'},
      {open: false, reason: 'escape-key'},
    ])
  })

  it('supports controlled open state and disabled closing open tooltips', async () => {
    const onOpenChange = vi.fn()

    function ControlledHarness() {
      const [open, setOpen] = useState(false)
      const [disabled, setDisabled] = useState(false)
      return (
        <div>
          <button type="button" onClick={() => setOpen(v => !v)}>
            Toggle open
          </button>
          <button type="button" onClick={() => setDisabled(v => !v)}>
            Toggle disabled
          </button>
          <Tooltip.Root
            open={open}
            disabled={disabled}
            onOpenChange={change => {
              onOpenChange(change)
              setOpen(change.open)
            }}
          >
            <Tooltip.Trigger>Target</Tooltip.Trigger>
            <Tooltip.Popup>Controlled popup</Tooltip.Popup>
          </Tooltip.Root>
        </div>
      )
    }

    HTMLRender(<ControlledHarness />)
    const popup = page.getByText('Controlled popup').element()
    expect(popup.matches(':popover-open')).toBe(false)

    await userEvent.click(page.getByRole('button', {name: 'Toggle open'}))
    expect(popup.matches(':popover-open')).toBe(true)

    await userEvent.click(page.getByRole('button', {name: 'Toggle disabled'}))
    expect(popup.matches(':popover-open')).toBe(false)
    expect(onOpenChange).toHaveBeenCalledWith(expect.objectContaining({open: false, reason: 'disabled'}))
  })

  it('preserves consumer onFocus on configured Tooltip even without :focus-visible', async () => {
    const onFocus = vi.fn()
    HTMLRender(
      <Tooltip text="Configured hint" className="custom-tooltip">
        <Button onFocus={onFocus}>Click me</Button>
      </Tooltip>,
    )

    const popup = page.getByText('Configured hint').element()
    const popupClasses = Array.from(popup.classList)
    expect(popupClasses.indexOf(classes.Tooltip)).toBeLessThan(popupClasses.indexOf('custom-tooltip'))

    await userEvent.click(page.getByRole('button', {name: 'Click me'}))
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('throws on conflicting as+render props and emits a dev warning for interactive popup content', () => {
    const conflictingTriggerProps = {
      as: 'a',
      render: <button type="button">Both</button>,
    } as unknown as React.ComponentProps<typeof Tooltip.Trigger>
    const conflictingPopupProps = {
      as: 'div',
      render: <span>Popup</span>,
    } as unknown as React.ComponentProps<typeof Tooltip.Popup>

    withExpectedConsoleError(() => {
      expect(() => {
        HTMLRender(
          <Tooltip.Root>
            <Tooltip.Trigger {...conflictingTriggerProps} />
            <Tooltip.Popup>Hint</Tooltip.Popup>
          </Tooltip.Root>,
        )
      }).toThrow('[Tooltip/conflicting-render-props] Tooltip.Trigger')

      expect(() => {
        HTMLRender(
          <Tooltip.Root>
            <Tooltip.Trigger>Open</Tooltip.Trigger>
            <Tooltip.Popup {...conflictingPopupProps} />
          </Tooltip.Root>,
        )
      }).toThrow('[Tooltip/conflicting-render-props] Tooltip.Popup')
    })

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      HTMLRender(
        <Tooltip.Root>
          <Tooltip.Trigger>Info</Tooltip.Trigger>
          <Tooltip.Popup>
            Read <a href="https://example.com">docs</a>
          </Tooltip.Popup>
        </Tooltip.Root>,
      )

      expect(warnSpy).toHaveBeenCalledWith('Warning:', expect.stringContaining('[Tooltip/interactive-popup-content]'))
    } finally {
      warnSpy.mockRestore()
    }
  })

  it('supports polymorphic as="a" on Tooltip.Trigger with anchor props, ref forwarding, and tooltip interactions', async () => {
    const anchorRef = createRef<HTMLAnchorElement>()

    HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger as="a" href="/docs" ref={anchorRef}>
          Docs
        </Tooltip.Trigger>
        <Tooltip.Popup>Read documentation</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const link = page.getByRole('link', {name: 'Docs'})
    const popup = page.getByText('Read documentation')

    await expect.element(link).toHaveAttribute('href', '/docs')
    await expect.element(link).toHaveAttribute('data-component', 'Tooltip.Trigger')
    expect(link.element().tagName).toBe('A')
    expect(anchorRef.current).toBe(link.element())

    await userEvent.tab()
    await expect.element(link).toHaveAttribute('data-open', '')
    expect(popup.element().matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')
    expect(popup.element().matches(':popover-open')).toBe(false)

    await userEvent.hover(link)
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(true)
    })
  })

  it('supports polymorphic as={Button} on Tooltip.Trigger with Button props and ref forwarding', async () => {
    const buttonRef = createRef<HTMLButtonElement>()

    HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger as={Button} variant="primary" ref={buttonRef}>
          Save
        </Tooltip.Trigger>
        <Tooltip.Popup>Save document</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const button = page.getByRole('button', {name: 'Save'})
    const popup = page.getByText('Save document')

    await expect.element(button).toHaveAttribute('data-variant', 'primary')
    await expect.element(button).toHaveAttribute('data-component', 'Button')
    expect(buttonRef.current).toBe(button.element())

    await userEvent.hover(button)
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(true)
    })
  })

  it('supports polymorphic as="div" and render function with state on Tooltip.Popup', async () => {
    const divRef = createRef<HTMLDivElement>()

    HTMLRender(
      <>
        <Tooltip.Root>
          <Tooltip.Trigger>First</Tooltip.Trigger>
          <Tooltip.Popup as="div" ref={divRef} direction="e">
            Div popup
          </Tooltip.Popup>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>Second</Tooltip.Trigger>
          <Tooltip.Popup
            direction="n"
            render={(props, state) => (
              <div {...props} data-state-dir={state.direction} data-state-open={String(state.open)} />
            )}
          >
            Render fn popup
          </Tooltip.Popup>
        </Tooltip.Root>
      </>,
    )

    const divPopup = page.getByText('Div popup')
    expect(divPopup.element().tagName).toBe('DIV')
    expect(divRef.current).toBe(divPopup.element())
    await expect.element(divPopup).toHaveAttribute('data-direction', 'e')

    const renderFnPopup = page.getByText('Render fn popup')
    expect(renderFnPopup.element().tagName).toBe('DIV')
    await expect.element(renderFnPopup).toHaveAttribute('data-state-dir', 'n')
    await expect.element(renderFnPopup).toHaveAttribute('data-state-open', 'false')

    await userEvent.tab()
    await userEvent.tab()
    await expect.element(renderFnPopup).toHaveAttribute('data-state-open', 'true')
  })

  it('keeps uncontrolled tooltip open when moving pointer from trigger to popup in the same tick', async () => {
    HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger>Hover target</Tooltip.Trigger>
        <Tooltip.Popup>Popup content</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const trigger = page.getByRole('button', {name: 'Hover target'})
    const popup = page.getByText('Popup content')

    await userEvent.hover(trigger)
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(true)
    })

    // Simulate direct pointer transition from trigger onto popup within one event turn before React commits
    act(() => {
      fireEvent.mouseLeave(trigger.element())
      fireEvent.mouseEnter(popup.element())
    })

    await expect.element(trigger).toHaveAttribute('data-open', '')
    await expect.element(popup).toHaveAttribute('data-open', '')
    expect(popup.element().matches(':popover-open')).toBe(true)

    fireEvent.mouseLeave(popup.element())
    await waitFor(() => {
      expect(popup.element().matches(':popover-open')).toBe(false)
    })
  })

  it('preserves keybindingHint and inner accessible id when Tooltip.Popup render element owns children', () => {
    const {container} = HTMLRender(
      <Tooltip.Root id="save-hint">
        <Tooltip.Trigger>Save</Tooltip.Trigger>
        <Tooltip.Popup keybindingHint="Control+k" render={<span className="custom-popup">Save</span>} />
      </Tooltip.Root>,
    )

    const trigger = container.querySelector('button')!
    const popup = container.querySelector('.custom-popup')!
    const keybindingContainer = popup.querySelector('[data-component="Tooltip.KeybindingHintContainer"]')
    const describedSpan = popup.querySelector('#save-hint')

    expect(keybindingContainer).not.toBeNull()
    expect(describedSpan).not.toBeNull()
    expect(describedSpan?.textContent).toContain('Save')
    expect(trigger.getAttribute('aria-describedby')).toBe('save-hint')
    expect(popup.getAttribute('id')).toBeNull()
  })

  it('links Tooltip.Trigger and Tooltip.Popup deterministically during SSR when id is on Tooltip.Root', () => {
    let html = ''
    withExpectedConsoleError(() => {
      html = renderToString(
        <Tooltip.Root id="ssr-tooltip-id">
          <Tooltip.Trigger>Save</Tooltip.Trigger>
          <Tooltip.Popup>Save details</Tooltip.Popup>
        </Tooltip.Root>,
      )
    })

    expect(html).toContain('aria-describedby="ssr-tooltip-id"')
    expect(html).toContain('id="ssr-tooltip-id"')

    const {container} = HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger>Fallback</Tooltip.Trigger>
        <Tooltip.Popup id="popup-fallback-id">Fallback details</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const trigger = container.querySelector('button')!
    const popup = container.querySelector('[data-component="Tooltip"]')!
    expect(popup.id).toBe('popup-fallback-id')
    expect(trigger.getAttribute('aria-describedby')).toBe('popup-fallback-id')
  })

  it('preserves data-component on render function targets without injecting Tooltip.Trigger', () => {
    const {container} = HTMLRender(
      <Tooltip.Root>
        <Tooltip.Trigger render={props => <Button {...props}>Render Button</Button>} />
        <Tooltip.Popup>Render button tooltip</Tooltip.Popup>
      </Tooltip.Root>,
    )

    const button = container.querySelector('button')!
    expect(button.getAttribute('data-component')).toBe('Button')
  })
})

function _typeChecks() {
  const anchorRef = createRef<HTMLAnchorElement>()
  const buttonRef = createRef<HTMLButtonElement>()
  const divRef = createRef<HTMLDivElement>()

  const validPolymorphicAnchor = (
    <Tooltip.Trigger as="a" href="/docs" ref={anchorRef}>
      Docs
    </Tooltip.Trigger>
  )
  const validPolymorphicButton = (
    <Tooltip.Trigger as={Button} variant="primary" ref={buttonRef}>
      Save
    </Tooltip.Trigger>
  )
  const validPolymorphicPopup = (
    <Tooltip.Popup as="div" ref={divRef} direction="n">
      Hint
    </Tooltip.Popup>
  )
  const invalidTriggerBoth = (
    // @ts-expect-error Tooltip.Trigger cannot combine `as` and `render`
    <Tooltip.Trigger as="a" href="/docs" render={<button type="button">Both</button>} />
  )
  const invalidPopupBoth = (
    // @ts-expect-error Tooltip.Popup cannot combine `as` and `render`
    <Tooltip.Popup as="div" render={<span>Both</span>} />
  )

  return [validPolymorphicAnchor, validPolymorphicButton, validPolymorphicPopup, invalidTriggerBoth, invalidPopupBoth]
}

void _typeChecks
