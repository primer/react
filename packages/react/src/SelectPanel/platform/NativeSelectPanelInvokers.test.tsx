import type React from 'react'
import {act, render, renderHook} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {FeatureFlags} from '../../FeatureFlags'
import {SelectPanel, type SelectPanelRootProps} from '..'
import type {SelectPanelOverlayProps} from '../SelectPanelOverlay'
import {PlatformSelectPanelTestFixture} from './PlatformSelectPanel'
import {useNativeSelectPanelInvokers} from './useNativeSelectPanelInvokers'

interface PickerProps extends SelectPanelRootProps {
  overlay?: SelectPanelOverlayProps
  onTriggerClick?: React.MouseEventHandler<HTMLButtonElement>
  onCloseClick?: React.MouseEventHandler<HTMLButtonElement>
}

function Picker({overlay, onTriggerClick, onCloseClick, ...props}: PickerProps) {
  return (
    <SelectPanel.Root {...props}>
      <SelectPanel.Trigger onClick={onTriggerClick}>Open picker</SelectPanel.Trigger>
      <SelectPanel.Overlay {...overlay}>
        <SelectPanel.Title>Choose labels</SelectPanel.Title>
        <SelectPanel.CloseButton aria-label="Close picker" onClick={onCloseClick} />
        <SelectPanel.SearchInput aria-label="Filter labels" />
        <SelectPanel.List aria-label="Available labels">
          <SelectPanel.Item value="bug">Bug</SelectPanel.Item>
          <SelectPanel.Item value="archived" disabled>
            Archived
          </SelectPanel.Item>
        </SelectPanel.List>
        <SelectPanel.SubmitButton>Apply labels</SelectPanel.SubmitButton>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

function fixture(children: React.ReactNode, dialog = true, invokers = true) {
  return (
    <BaseStyles>
      <FeatureFlags
        flags={{
          primer_react_select_panel_native_dialog: dialog,
          primer_react_select_panel_native_invokers: invokers,
        }}
      >
        {children}
      </FeatureFlags>
    </BaseStyles>
  )
}

const trigger = () => page.getByRole('button', {name: 'Open picker', exact: true})
const close = () => page.getByRole('button', {name: 'Close picker', exact: true})
const search = () => page.getByRole('combobox', {name: 'Filter labels', exact: true})
const variants = ['anchored', 'modal'] as const
const isOpen = (dialog: HTMLDialogElement, variant: (typeof variants)[number]) =>
  dialog.matches(variant === 'modal' ? ':modal' : ':popover-open')

function nativeDialog(container: HTMLElement) {
  const dialog = container.querySelector('dialog')
  if (!dialog) throw new Error('Expected a native host')
  return dialog
}

beforeEach(async () => {
  await page.viewport(1280, 900)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('optional native SelectPanel invokers', () => {
  it('keeps commands off by default even with native hosting enabled', async () => {
    render(
      <BaseStyles>
        <FeatureFlags flags={{primer_react_select_panel_native_dialog: true}}>
          <Picker />
        </FeatureFlags>
      </BaseStyles>,
    )
    expect(trigger().element()).not.toHaveAttribute('command')
    await userEvent.click(trigger())
    expect(close().element()).not.toHaveAttribute('command')
  })

  it('does not enable commands without native hosting', async () => {
    const {container} = render(fixture(<Picker />, false))
    expect(trigger().element()).not.toHaveAttribute('command')
    await userEvent.click(trigger())
    expect(container.querySelector('dialog')).toBeNull()
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
  })

  it('falls back to JavaScript controls when commands are unsupported', async () => {
    vi.stubGlobal('CommandEvent', undefined)
    const {container} = render(fixture(<PlatformSelectPanelTestFixture />))
    await expect.element(page.getByRole('status')).toHaveTextContent('Native command invokers unsupported')
    const button = page.getByRole('button', {name: 'Labels', exact: true})
    expect(button.element()).not.toHaveAttribute('command')
    await userEvent.click(button)
    await expect.poll(() => nativeDialog(container).matches(':modal')).toBe(true)
    await userEvent.click(close())
    await expect.poll(() => nativeDialog(container).open).toBe(false)
  })

  it.each(variants)(
    'lets trusted commands own %s opening and closing without duplicate imperative calls',
    async regular => {
      const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
      const closeDialog = vi.spyOn(HTMLDialogElement.prototype, 'close')
      const showPopover = vi.spyOn(HTMLElement.prototype, 'showPopover')
      const hidePopover = vi.spyOn(HTMLElement.prototype, 'hidePopover')
      const onOpenChange = vi.fn()
      const {container} = render(
        fixture(
          <Picker onOpenChange={onOpenChange} overlay={{variant: {regular}, overlayProps: {id: 'command-panel'}}} />,
        ),
      )
      const dialog = nativeDialog(container)
      const commands: string[] = []
      dialog.addEventListener('command', event => {
        if (event instanceof CommandEvent && event.isTrusted) commands.push(event.command)
      })
      expect(trigger().element()).toHaveAttribute('command', regular === 'modal' ? 'show-modal' : 'toggle-popover')
      expect(trigger().element()).toHaveAttribute('commandfor', 'command-panel')
      for (let cycle = 0; cycle < 2; cycle++) {
        await userEvent.click(trigger())
        await expect.poll(() => isOpen(dialog, regular)).toBe(true)
        await expect.element(search()).toHaveFocus()
        await expect.element(close()).toHaveAttribute('command', regular === 'modal' ? 'close' : 'hide-popover')
        await userEvent.click(close())
        await expect.poll(() => isOpen(dialog, regular)).toBe(false)
        await expect.element(trigger()).toHaveFocus()
      }
      expect(commands).toEqual(
        regular === 'modal'
          ? ['show-modal', 'close', 'show-modal', 'close']
          : ['toggle-popover', 'hide-popover', 'toggle-popover', 'hide-popover'],
      )
      expect(showModal).not.toHaveBeenCalled()
      expect(closeDialog).not.toHaveBeenCalled()
      expect(showPopover).not.toHaveBeenCalled()
      expect(hidePopover).not.toHaveBeenCalled()
      expect(onOpenChange.mock.calls).toEqual([
        [true, 'anchor-click'],
        [false, 'close'],
        [true, 'anchor-click'],
        [false, 'close'],
      ])
    },
  )

  it.each(variants)('reconciles rejected controlled %s commands and Escape', async regular => {
    const onOpenChange = vi.fn()
    const picker = (open: boolean) =>
      fixture(<Picker open={open} onOpenChange={onOpenChange} overlay={{variant: {regular}}} />)
    const {container, rerender} = render(picker(false))
    const dialog = nativeDialog(container)
    await userEvent.click(trigger())
    await expect.poll(() => onOpenChange.mock.calls).toEqual([[true, 'anchor-click']])
    await expect.poll(() => isOpen(dialog, regular)).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    rerender(picker(true))
    await expect.poll(() => isOpen(dialog, regular)).toBe(true)
    await userEvent.click(close())
    await expect.poll(() => onOpenChange.mock.calls.at(-1)).toEqual([false, 'close'])
    await expect.poll(() => isOpen(dialog, regular)).toBe(true)
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect.poll(() => onOpenChange.mock.calls.at(-1)).toEqual([false, 'escape'])
    expect(isOpen(dialog, regular)).toBe(true)
  })

  it.each(variants)('honors canceled clicks and command defaults in %s mode', async regular => {
    const onOpenChange = vi.fn()
    const preventDefault = (event: Event | React.MouseEvent<HTMLButtonElement>) => event.preventDefault()
    const picker = (cancelTrigger: boolean, cancelClose = true) =>
      fixture(
        <Picker
          onOpenChange={onOpenChange}
          onTriggerClick={cancelTrigger ? preventDefault : undefined}
          onCloseClick={cancelClose ? preventDefault : undefined}
          overlay={{variant: {regular}}}
        />,
      )
    const {container, rerender} = render(picker(true))
    const dialog = nativeDialog(container)
    await userEvent.click(trigger())
    expect(isOpen(dialog, regular)).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    rerender(picker(false))
    dialog.addEventListener('command', preventDefault)
    await userEvent.click(trigger())
    expect(isOpen(dialog, regular)).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    dialog.removeEventListener('command', preventDefault)
    await userEvent.click(trigger())
    await expect.poll(() => isOpen(dialog, regular)).toBe(true)
    await userEvent.click(close())
    expect(isOpen(dialog, regular)).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
    rerender(picker(false, false))
    dialog.addEventListener('command', preventDefault)
    await userEvent.click(close())
    expect(isOpen(dialog, regular)).toBe(true)
  })

  it('keeps non-button anchors on JavaScript activation', async () => {
    render(
      fixture(
        <SelectPanel.Root>
          <SelectPanel.Overlay
            renderAnchor={props => (
              <a {...props} href="#labels">
                Open link picker
              </a>
            )}
          >
            <SelectPanel.Title>Link labels</SelectPanel.Title>
            <SelectPanel.CloseButton aria-label="Close link picker" />
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    const link = page.getByRole('link', {name: 'Open link picker', exact: true})
    expect(link.element()).not.toHaveAttribute('command')
    await userEvent.click(link)
    await expect.element(page.getByRole('dialog', {name: 'Link labels', exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('button', {name: 'Close link picker', exact: true}))
    await expect.element(link).toHaveAttribute('aria-expanded', 'false')
    await expect.element(link).toHaveFocus()
  })

  it('keeps clicked-control focus after outside dismissal and restores focus on a later command close', async () => {
    render(
      fixture(
        <>
          <Picker />
          <button type="button" style={{marginLeft: 500}}>
            Background action
          </button>
        </>,
      ),
    )
    await userEvent.click(trigger())
    const background = page.getByRole('button', {name: 'Background action', exact: true})
    await userEvent.click(background)
    await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false')
    await expect.element(background).toHaveFocus()
    await userEvent.click(trigger())
    await userEvent.click(close())
    await expect.element(trigger()).toHaveFocus()
  })

  it('scopes nested commands and shared dismissal to the topmost picker', async () => {
    const parentDismiss = vi.fn()
    const childDismiss = vi.fn()
    render(
      fixture(
        <SelectPanel.Root onDismiss={parentDismiss}>
          <SelectPanel.Trigger>Outer picker</SelectPanel.Trigger>
          <SelectPanel.Overlay variant={{regular: 'modal'}}>
            <SelectPanel.Title>Outer labels</SelectPanel.Title>
            <button type="button">Parent action</button>
            <Picker onDismiss={childDismiss} />
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    await userEvent.click(page.getByRole('button', {name: 'Outer picker', exact: true}))
    await userEvent.click(trigger())
    await userEvent.keyboard('{Escape}')
    await expect.element(trigger()).toHaveFocus()
    expect(childDismiss).toHaveBeenCalledExactlyOnceWith('escape')
    expect(parentDismiss).not.toHaveBeenCalled()
    await userEvent.click(trigger())
    const parentAction = page.getByRole('button', {name: 'Parent action', exact: true})
    await userEvent.click(parentAction)
    await expect.element(parentAction).toHaveFocus()
    expect(childDismiss.mock.calls).toEqual([['escape'], ['click-outside']])
    expect(parentDismiss).not.toHaveBeenCalled()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('preserves focused content and changes commands during responsive modality switching', async () => {
    const onOpenChange = vi.fn()
    const {container} = render(fixture(<Picker onOpenChange={onOpenChange} />))
    const dialog = nativeDialog(container)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':popover-open')).toBe(true)
    const input = search().element()
    await page.viewport(390, 844)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.element(trigger()).toHaveAttribute('command', 'close')
    await expect.element(search()).toHaveFocus()
    await page.viewport(1280, 900)
    await expect.poll(() => dialog.matches(':popover-open')).toBe(true)
    await expect.element(trigger()).toHaveAttribute('command', 'toggle-popover')
    expect(search().element()).toBe(input)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
  })

  it('preserves keyboard opening, selection, submit, automatic close and external native hide reconciliation', async () => {
    const onOpenChange = vi.fn()
    const {container, rerender} = render(fixture(<Picker onOpenChange={onOpenChange} closeOnSelect />))
    const dialog = nativeDialog(container)
    act(() => trigger().element().focus())
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(search()).toHaveFocus()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-key-press')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect.poll(() => dialog.matches(':popover-open')).toBe(false)
    rerender(fixture(<Picker />))
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole('button', {name: 'Apply labels', exact: true}))
    await expect.poll(() => dialog.matches(':popover-open')).toBe(false)
    await page.viewport(390, 844)
    rerender(fixture(<Picker overlay={{displayCloseButton: true}} />))
    await userEvent.click(trigger())
    const automaticClose = page.getByRole('button', {name: 'Close', exact: true})
    await expect.element(automaticClose).toHaveAttribute('command', 'close')
    await userEvent.click(automaticClose)
    await expect.poll(() => dialog.open).toBe(false)
    await page.viewport(1280, 900)
    rerender(fixture(<Picker key="controlled" open />))
    const controlledDialog = nativeDialog(container)
    expect(dialog).not.toBeInTheDocument()
    await expect.poll(() => controlledDialog.matches(':popover-open')).toBe(true)
    act(() => controlledDialog.hidePopover())
    await expect.poll(() => controlledDialog.matches(':popover-open')).toBe(true)
    rerender(fixture(<Picker key="controlled" open={false} />))
    await expect.poll(() => controlledDialog.matches(':popover-open')).toBe(false)
  })
})

it.each([false, true])('reconciles only after a task, after consumer cancellation=%s is known', async canceled => {
  const dialog = document.createElement('dialog')
  const button = document.createElement('button')
  document.body.append(dialog, button)
  const onOpen = vi.fn()
  const onDismiss = vi.fn()
  const {unmount} = renderHook(() =>
    useNativeSelectPanelInvokers({
      enabled: true,
      open: false,
      modal: true,
      dialogRef: {current: dialog},
      anchorRef: {current: button},
      onOpen,
      onDismiss,
    }),
  )
  vi.useFakeTimers()
  const event = new CommandEvent('command', {command: 'show-modal', source: button, cancelable: true})
  if (canceled) dialog.addEventListener('command', value => value.preventDefault())
  act(() => {
    dialog.dispatchEvent(event)
  })
  expect(onOpen).not.toHaveBeenCalled()
  await act(async () => {
    await Promise.resolve()
  })
  expect(onOpen).not.toHaveBeenCalled()
  act(() => {
    vi.runOnlyPendingTimers()
  })
  expect(onOpen).toHaveBeenCalledTimes(canceled ? 0 : 1)
  expect(onDismiss).not.toHaveBeenCalled()
  unmount()
  dialog.remove()
  button.remove()
})
