import type React from 'react'
import {act, render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {FeatureFlags} from '../../FeatureFlags'
import {PlatformSelectPanel, PlatformSelectPanelTestFixture} from './PlatformSelectPanel'

interface Flags {
  nativeDialog?: boolean
  invokers?: boolean
  cssAnchorPositioning?: boolean
}

function fixture(
  props: React.ComponentProps<typeof PlatformSelectPanelTestFixture> = {},
  {nativeDialog = true, invokers = false, cssAnchorPositioning = false}: Flags = {},
) {
  return (
    <BaseStyles>
      <FeatureFlags
        flags={{
          primer_react_select_panel_native_dialog: nativeDialog,
          primer_react_select_panel_native_invokers: invokers,
          primer_react_css_anchor_positioning: cssAnchorPositioning,
        }}
      >
        <PlatformSelectPanelTestFixture {...props} />
      </FeatureFlags>
    </BaseStyles>
  )
}

function getNativeDialog(container: HTMLElement) {
  const dialog = container.querySelector('dialog')
  if (!dialog) throw new Error('Expected the mounted native dialog target')
  return dialog
}

const trigger = () => page.getByRole('button', {name: 'Labels', exact: true})
const search = () => page.getByRole('combobox', {name: 'Filter labels', exact: true})
const closeButton = () => page.getByRole('button', {name: 'Close picker', exact: true})
const rootState = () => page.getByText(/^Picker (open|closed)$/)

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('SelectPanel story-local platform fixture', () => {
  it('uses the existing overlay when both flags are off', async () => {
    const {container} = render(
      <BaseStyles>
        <PlatformSelectPanel />
      </BaseStyles>,
    )
    await expect.element(page.getByRole('status')).toHaveTextContent('native dialog flag off')
    await userEvent.click(trigger())
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
    expect(
      page.getByRole('dialog', {name: 'Choose labels'}).element().closest('[data-component="Portal"]'),
    ).not.toBeNull()
    expect(container.querySelector('dialog')).toBeNull()
    await userEvent.click(closeButton())
    await expect.element(trigger()).toHaveFocus()
  })

  it('does not activate invokers without the native dialog flag', async () => {
    render(fixture({}, {nativeDialog: false, invokers: true}))
    await userEvent.click(trigger())
    expect(trigger().element()).not.toHaveAttribute('command')
    await expect.element(page.getByRole('status')).toHaveTextContent('native dialog flag off')
    await userEvent.keyboard('{Escape}')
    await expect.element(rootState()).toHaveTextContent('Picker closed')
  })

  it('renders the active native popover inline and preserves the trigger target ID', async () => {
    await act(async () => page.viewport(1000, 800))
    const {container} = render(fixture({renderAs: 'popover'}, {nativeDialog: false, cssAnchorPositioning: true}))
    await expect.element(page.getByRole('status')).toHaveTextContent('Native Popover API active')
    await userEvent.click(trigger())
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.poll(() => dialog.element().matches(':popover-open')).toBe(true)
    expect(dialog.element()).toHaveAttribute('popover', 'manual')
    expect(container.contains(dialog.element())).toBe(true)
    expect(dialog.element().closest('[data-component="Portal"]')).toBeNull()
    expect(dialog.element().parentElement).toBe(trigger().element().parentElement)
    // This composed trigger is external to AnchoredOverlay's renderAnchor;
    // Root's relationship is aria-controls, not a native popovertarget.
    expect(trigger().element()).toHaveAttribute('aria-controls', dialog.element().id)
    await userEvent.click(closeButton())
    await expect.element(trigger()).toHaveFocus()
  })

  it('preserves search, active descendants, selection, and focus trapping without an overlay portal', async () => {
    await act(async () => page.viewport(1000, 800))
    render(fixture({renderAs: 'popover'}, {nativeDialog: false, cssAnchorPositioning: true}))
    await userEvent.click(trigger())
    await expect.element(search()).toHaveFocus()
    await userEvent.tab({shift: true})
    await expect.element(closeButton()).toHaveFocus()
    await userEvent.tab({shift: true})
    await expect.element(page.getByRole('button', {name: 'Done', exact: true})).toHaveFocus()
    await userEvent.tab()
    await expect.element(closeButton()).toHaveFocus()
    await userEvent.tab()
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    await expect
      .element(search())
      .toHaveAttribute(
        'aria-activedescendant',
        page.getByRole('option', {name: 'Accessibility', exact: true}).element().id,
      )
    await userEvent.keyboard('{ArrowDown}')
    await expect
      .element(search())
      .toHaveAttribute('aria-activedescendant', page.getByRole('option', {name: 'Bug', exact: true}).element().id)
    expect(search().element()).toHaveFocus()
    await userEvent.fill(search(), 'access')
    await expect.element(page.getByRole('option', {name: 'Bug', exact: true})).not.toBeInTheDocument()
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect
      .element(page.getByRole('option', {name: 'Accessibility', exact: true}))
      .toHaveAttribute('aria-selected', 'true')
    await expect.poll(() => page.getByRole('dialog').element().matches(':popover-open')).toBe(true)
    await userEvent.click(page.getByRole('button', {name: 'Done', exact: true}))
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
    await expect.element(page.getByText('Selected labels: Accessibility', {exact: true})).toBeVisible()
  })

  it.each(['escape', 'outside'] as const)('dismisses the inline popover on %s and restores focus', async gesture => {
    await act(async () => page.viewport(1000, 800))
    const onOpenChange = vi.fn()
    render(fixture({renderAs: 'popover', onOpenChange}, {nativeDialog: false, cssAnchorPositioning: true}))
    await userEvent.click(trigger())
    await expect.element(search()).toHaveFocus()
    if (gesture === 'escape') await userEvent.keyboard('{Escape}')
    else await userEvent.click(page.getByRole('status'), {force: true})
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false, gesture === 'escape' ? 'escape' : 'click-outside')
    await expect.element(trigger()).toHaveFocus()
  })

  it('keeps a controlled inline popover open when dismissal is rejected', async () => {
    await act(async () => page.viewport(1000, 800))
    const onOpenChange = vi.fn()
    const {container} = render(
      fixture({renderAs: 'popover', open: true, onOpenChange}, {nativeDialog: false, cssAnchorPositioning: true}),
    )
    await expect.element(search()).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')
    expect(page.getByRole('dialog').element().matches(':popover-open')).toBe(true)
    expect(container.contains(page.getByRole('dialog').element())).toBe(true)
    await expect.element(search()).toHaveFocus()
  })

  it('reports a portal fallback when popover is requested with the CSS anchor flag off', async () => {
    render(fixture({renderAs: 'popover'}, {nativeDialog: false}))
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Popover requested, but CSS anchor positioning flag is off; using portal overlay.')
    await userEvent.click(trigger())
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).not.toHaveAttribute('popover')
    expect(
      page.getByRole('dialog', {name: 'Choose labels'}).element().closest('[data-component="Portal"]'),
    ).not.toBeNull()
    await userEvent.click(closeButton())
  })

  it('reports a portal fallback when the native CSS anchor capability gate fails', async () => {
    const style = document.documentElement.style
    // Hide one capability from both the fixture and AnchoredOverlay, without
    // disabling the browser's real layout/style engine.
    vi.spyOn(document.documentElement, 'style', 'get').mockReturnValue(
      new Proxy(style, {
        has: (target, property) => property !== 'positionVisibility' && Reflect.has(target, property),
      }),
    )
    render(fixture({renderAs: 'popover'}, {nativeDialog: false, cssAnchorPositioning: true}))
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('Popover requested, but native CSS anchor positioning is unsupported; using portal overlay.')
    await userEvent.click(trigger())
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).not.toHaveAttribute('popover')
    expect(
      page.getByRole('dialog', {name: 'Choose labels'}).element().closest('[data-component="Portal"]'),
    ).not.toBeNull()
    await userEvent.click(closeButton())
  })

  it('reports the narrow fullscreen portal fallback instead of claiming popover is active', async () => {
    await act(async () => page.viewport(375, 800))
    try {
      render(fixture({renderAs: 'popover'}, {nativeDialog: false, cssAnchorPositioning: true}))
      await expect
        .element(page.getByRole('status'))
        .toHaveTextContent('Popover requested, but the narrow fullscreen presentation uses a portal overlay.')
      await userEvent.click(trigger())
      await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).not.toHaveAttribute('popover')
      expect(
        page.getByRole('dialog', {name: 'Choose labels'}).element().closest('[data-component="Portal"]'),
      ).not.toBeNull()
      await userEvent.click(closeButton())
    } finally {
      await act(async () => page.viewport(1000, 800))
    }
  })

  it('calls real showModal, focuses search, and leaves background inert to focus', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const {container} = render(fixture())
    const dialog = getNativeDialog(container)
    expect(dialog.open).toBe(false)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    expect(showModal).toHaveBeenCalledTimes(1)
    await expect.element(search()).toHaveFocus()
    expect(trigger().element()).toHaveAttribute('aria-controls', dialog.id)
    expect(dialog).toHaveAccessibleName('Choose labels')
    expect(dialog).toHaveAccessibleDescription('Pick labels for this issue. Archived is unavailable.')
    act(() => trigger().element().focus())
    expect(search().element()).toHaveFocus()
    expect(container.querySelectorAll('dialog')).toHaveLength(1)
    // No AnchoredOverlay / second role=dialog and no JS focus-trap sentinels.
    expect(container.querySelectorAll('[role="dialog"]')).toHaveLength(0)
    await userEvent.click(closeButton())
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    expect(dialog).toBeInTheDocument()
  })

  it('prevents native cancel, requests Escape once, and restores trigger focus', async () => {
    const onOpenChange = vi.fn()
    const {container} = render(fixture({onOpenChange}))
    const dialog = getNativeDialog(container)
    const canceled: boolean[] = []
    dialog.addEventListener('cancel', event => canceled.push(event.defaultPrevented))
    await userEvent.click(trigger())
    await userEvent.keyboard('{Escape}')
    await expect.poll(() => dialog.open).toBe(false)
    expect(canceled).toEqual([true])
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'escape'],
    ])
    await expect.element(trigger()).toHaveFocus()
  })

  it('filters, skips disabled selection, shows a summary, and supports a programmatic Apply close', async () => {
    const {container} = render(fixture())
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    await expect
      .element(page.getByRole('option', {name: 'Archived', exact: true}))
      .toHaveAttribute('aria-disabled', 'true')
    act(() => {
      const option = page.getByRole('option', {name: 'Archived', exact: true}).element()
      if (!(option instanceof HTMLElement)) throw new Error('Expected an HTML listbox option')
      option.click()
    })
    await expect.element(page.getByText('Selected labels: None', {exact: true})).toBeVisible()
    await userEvent.fill(search(), 'access')
    await expect.element(page.getByRole('option', {name: 'Bug', exact: true})).not.toBeInTheDocument()
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect.element(page.getByText('Selected labels: Accessibility', {exact: true})).toBeVisible()
    expect(dialog.matches(':modal')).toBe(true)
    await userEvent.fill(search(), 'no such label')
    await expect.element(page.getByText('No matching labels', {exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('button', {name: 'Done', exact: true}))
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it('keeps native state aligned with Root for selection and external prop closes', async () => {
    const {container, unmount} = render(fixture({closeOnSelect: true}))
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole('option', {name: 'Bug', exact: true}))
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    await expect.element(page.getByText('Selected labels: Bug', {exact: true})).toBeVisible()
    unmount()
    const controlled = render(fixture({open: true}))
    const controlledDialog = getNativeDialog(controlled.container)
    await expect.poll(() => controlledDialog.matches(':modal')).toBe(true)
    controlled.rerender(fixture({open: false}))
    await expect.poll(() => controlledDialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it('hit-tests the backdrop using both target and coordinates', async () => {
    const {container} = render(fixture())
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    // Child clicks and empty dialog padding must not count as backdrop clicks.
    await userEvent.click(page.getByRole('heading', {name: 'Choose labels'}))
    act(() => {
      const {left, top} = dialog.getBoundingClientRect()
      dialog.dispatchEvent(new MouseEvent('click', {bubbles: true, clientX: left + 1, clientY: top + 1}))
    })
    expect(dialog.matches(':modal')).toBe(true)
    await userEvent.click(page.getByRole('dialog', {name: 'Choose labels'}), {
      position: {x: -10, y: -10},
      force: true,
    })
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it('keeps rejected Escape, close, and external native close transitions modal', async () => {
    const onOpenChange = vi.fn()
    const {container} = render(fixture({open: true, onOpenChange}))
    const dialog = getNativeDialog(container)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.keyboard('{Escape}')
    expect(dialog.matches(':modal')).toBe(true)
    await userEvent.click(closeButton())
    expect(dialog.matches(':modal')).toBe(true)
    act(() => dialog.close())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.element(search()).toHaveFocus()
    expect(onOpenChange.mock.calls).toEqual([
      [false, 'escape'],
      [false, 'close'],
    ])
  })

  it('explicitly falls back to the existing overlay when dialog is unsupported', async () => {
    vi.stubGlobal('HTMLDialogElement', undefined)
    const {container} = render(fixture())
    await expect.element(page.getByRole('status')).toHaveTextContent('Native dialog unsupported')
    await userEvent.click(trigger())
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
    expect(container.querySelector('dialog')).toBeNull()
    await userEvent.click(closeButton())
    await expect.element(trigger()).toHaveFocus()
  })

  it('explicitly falls back to JS controls, retaining real modal dialog, when commands are unsupported', async () => {
    vi.stubGlobal('CommandEvent', undefined)
    const {container} = render(fixture({}, {invokers: true}))
    await expect.element(page.getByRole('status')).toHaveTextContent('Native command invokers unsupported')
    expect(trigger().element()).not.toHaveAttribute('command')
    await userEvent.click(trigger())
    const dialog = getNativeDialog(container)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(closeButton())
    await expect.poll(() => dialog.open).toBe(false)
  })
})

describe('native command invokers', () => {
  it('lets trusted browser commands open/close without JS showModal/close or double toggling Root', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const close = vi.spyOn(HTMLDialogElement.prototype, 'close')
    const onOpenChange = vi.fn()
    const {container} = render(fixture({onOpenChange}, {invokers: true}))
    const dialog = getNativeDialog(container)
    const commands: {command: string; trusted: boolean; openBeforeDefault: boolean}[] = []
    dialog.addEventListener('command', event => {
      if (event instanceof CommandEvent) {
        commands.push({command: event.command, trusted: event.isTrusted, openBeforeDefault: dialog.open})
      }
    })
    await expect.element(page.getByRole('status')).toHaveTextContent('browser command invokers')
    expect(trigger().element()).toHaveAttribute('command', 'show-modal')
    expect(trigger().element()).toHaveAttribute('commandfor', dialog.id)
    for (let cycle = 0; cycle < 2; cycle++) {
      await userEvent.click(trigger())
      await expect.poll(() => dialog.matches(':modal')).toBe(true)
      await expect.element(rootState()).toHaveTextContent('Picker open')
      await expect.element(search()).toHaveFocus()
      expect(closeButton().element()).toHaveAttribute('command', 'close')
      await userEvent.click(closeButton())
      await expect.poll(() => dialog.open).toBe(false)
      await expect.element(rootState()).toHaveTextContent('Picker closed')
      await expect.element(trigger()).toHaveFocus()
    }
    expect(commands).toEqual([
      {command: 'show-modal', trusted: true, openBeforeDefault: false},
      {command: 'close', trusted: true, openBeforeDefault: true},
      {command: 'show-modal', trusted: true, openBeforeDefault: false},
      {command: 'close', trusted: true, openBeforeDefault: true},
    ])
    expect(showModal).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'close'],
      [true, 'anchor-click'],
      [false, 'close'],
    ])
  })

  it('reconciles rejected command opens and closes back to controlled Root state', async () => {
    const onOpenChange = vi.fn()
    const {container, rerender} = render(fixture({open: false, onOpenChange}, {invokers: true}))
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(rootState()).toHaveTextContent('Picker closed')
    await expect.element(trigger()).toHaveFocus()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
    rerender(fixture({open: true, onOpenChange}, {invokers: true}))
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(closeButton())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.element(rootState()).toHaveTextContent('Picker open')
    await expect.element(search()).toHaveFocus()
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'close'],
    ])
  })

  it('respects consumer-canceled command defaults for both opening and closing', async () => {
    const onOpenChange = vi.fn()
    const {container} = render(fixture({onOpenChange}, {invokers: true}))
    const dialog = getNativeDialog(container)
    const preventDefault = (event: Event) => event.preventDefault()
    dialog.addEventListener('command', preventDefault)
    await userEvent.click(trigger())
    expect(dialog.open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    dialog.removeEventListener('command', preventDefault)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    dialog.addEventListener('command', preventDefault)
    await userEvent.click(closeButton())
    expect(dialog.matches(':modal')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
  })

  it('respects consumer-canceled clicks instead of forcing commands or JS toggles', async () => {
    const onOpenChange = vi.fn()
    const preventDefault = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault()
    const {container, rerender} = render(fixture({onOpenChange, onTriggerClick: preventDefault}, {invokers: true}))
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    expect(dialog.open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    rerender(fixture({onOpenChange, onCloseClick: preventDefault}, {invokers: true}))
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(closeButton())
    expect(dialog.matches(':modal')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
  })

  it('still supports selection, Escape, and programmatic Root closes in invoker mode', async () => {
    const {container, unmount} = render(fixture({closeOnSelect: true}, {invokers: true}))
    const dialog = getNativeDialog(container)
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole('option', {name: 'Bug', exact: true}))
    await expect.poll(() => dialog.open).toBe(false)
    await userEvent.click(trigger())
    await userEvent.keyboard('{Escape}')
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    unmount()
    const controlled = render(fixture({open: true}, {invokers: true}))
    const controlledDialog = getNativeDialog(controlled.container)
    await expect.poll(() => controlledDialog.matches(':modal')).toBe(true)
    controlled.rerender(fixture({open: false}, {invokers: true}))
    await expect.poll(() => controlledDialog.open).toBe(false)
  })
})
