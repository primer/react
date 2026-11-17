import React from 'react'
import {act, render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {SelectPanel, type SelectPanelRootProps} from '..'
import {ConfiguredSelectPanelOverlay, type SelectPanelOverlayProps} from '../SelectPanelOverlay'
import {useSelectPanelContext} from '../SelectPanelContext'
import {HeaderActions, ResponsiveImmediateSelection} from '../SelectPanel.composition.stories'

function preventDefault(event: Event | React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault()
}

function ConfiguredOverlay({children}: SelectPanelOverlayProps) {
  const state = useSelectPanelContext()
  return (
    <ConfiguredSelectPanelOverlay
      open={state.open}
      anchorRef={state.anchorRef}
      overlayProps={{role: 'dialog', 'aria-labelledby': state.labelledBy}}
      focusTrapSettings={{initialFocusRef: state.inputRef}}
    >
      {children}
    </ConfiguredSelectPanelOverlay>
  )
}

interface PickerProps extends SelectPanelRootProps {
  overlay?: SelectPanelOverlayProps
  onTriggerClick?: React.MouseEventHandler<HTMLButtonElement>
  onCloseClick?: React.MouseEventHandler<HTMLButtonElement>
  configured?: boolean
}

function Picker({overlay, onTriggerClick, onCloseClick, configured, ...props}: PickerProps) {
  const Overlay = configured ? ConfiguredOverlay : SelectPanel.Overlay
  return (
    <SelectPanel.Root {...props}>
      <SelectPanel.Trigger onClick={onTriggerClick}>Open picker</SelectPanel.Trigger>
      <Overlay {...overlay}>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <SelectPanel.Title>Choose labels</SelectPanel.Title>
            <SelectPanel.CloseButton aria-label="Close picker" onClick={onCloseClick} />
          </SelectPanel.Header>
          <SelectPanel.Description>Choose issue labels</SelectPanel.Description>
          <SelectPanel.SearchInput aria-label="Filter labels" />
          <SelectPanel.List aria-label="Available labels">
            <SelectPanel.Item value="bug">Bug</SelectPanel.Item>
            <SelectPanel.Item value="archived" disabled>
              Archived
            </SelectPanel.Item>
            <SelectPanel.Item value="enhancement">Enhancement</SelectPanel.Item>
          </SelectPanel.List>
          <SelectPanel.SubmitButton>Apply labels</SelectPanel.SubmitButton>
        </SelectPanel.Content>
      </Overlay>
    </SelectPanel.Root>
  )
}

function fixture(children: React.ReactNode, invokers = true) {
  if (!invokers) vi.stubGlobal('CommandEvent', undefined)
  return <BaseStyles>{children}</BaseStyles>
}

const trigger = () => page.getByRole('button', {name: 'Open picker', exact: true})
const close = () => page.getByRole('button', {name: 'Close picker', exact: true})
const search = () => page.getByRole('combobox', {name: 'Filter labels', exact: true})

function nativeDialog(container: HTMLElement) {
  const dialog = container.querySelector('dialog')
  if (!dialog) throw new Error('Expected a native dialog')
  return dialog
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

afterEach(async () => {
  await page.viewport(1000, 800)
})

describe('composable SelectPanel native platform defaults', () => {
  it.each([false, true])('uses a real modal with invokers=%s and preserves list behavior', async invokers => {
    const onOpenChange = vi.fn()
    const onSelectedChange = vi.fn()
    const {container} = render(
      fixture(<Picker onOpenChange={onOpenChange} onSelectedChange={onSelectedChange} />, invokers),
    )
    const dialog = nativeDialog(container)
    expect(dialog.open).toBe(false)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.element(search()).toHaveFocus()
    expect(dialog).toHaveAccessibleName('Choose labels')
    expect(dialog).toHaveAccessibleDescription('Choose issue labels')
    await expect.element(trigger()).toHaveAttribute('aria-controls', dialog.id)
    await userEvent.keyboard('{ArrowDown}')
    await expect
      .element(search())
      .toHaveAttribute(
        'aria-activedescendant',
        page.getByRole('option', {name: 'Enhancement', exact: true}).element().id,
      )
    expect(search().element()).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['enhancement'])
    expect(dialog.matches(':modal')).toBe(true)
    await userEvent.click(close())
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'close'],
    ])
  })

  it('lets browser invokers open and close without duplicate imperative calls', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    const closeDialog = vi.spyOn(HTMLDialogElement.prototype, 'close')
    const onOpenChange = vi.fn()
    const {container} = render(
      fixture(<Picker onOpenChange={onOpenChange} overlay={{overlayProps: {id: 'custom-native-panel'}}} />),
    )
    const dialog = nativeDialog(container)
    const commands: string[] = []
    dialog.addEventListener('command', event => {
      if (event instanceof CommandEvent && event.isTrusted) commands.push(event.command)
    })
    expect(trigger().element()).toHaveAttribute('command', 'show-modal')
    expect(trigger().element()).toHaveAttribute('commandfor', 'custom-native-panel')
    await userEvent.click(trigger())
    await expect.element(close()).toHaveAttribute('command', 'close')
    await userEvent.click(close())
    await expect.poll(() => dialog.open).toBe(false)
    expect(commands).toEqual(['show-modal', 'close'])
    expect(showModal).not.toHaveBeenCalled()
    expect(closeDialog).not.toHaveBeenCalled()
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'close'],
    ])
  })

  it('honors canceled clicks and canceled browser commands', async () => {
    const onOpenChange = vi.fn()
    const {container, rerender} = render(
      fixture(<Picker onOpenChange={onOpenChange} onTriggerClick={preventDefault} />),
    )
    const dialog = nativeDialog(container)
    await userEvent.click(trigger())
    expect(dialog.open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    rerender(fixture(<Picker onOpenChange={onOpenChange} onCloseClick={preventDefault} />))
    dialog.addEventListener('command', preventDefault)
    await userEvent.click(trigger())
    expect(dialog.open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    dialog.removeEventListener('command', preventDefault)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(close())
    expect(dialog.matches(':modal')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
  })

  it('uses native commands for an explicitly requested automatic close control', async () => {
    await page.viewport(390, 844)
    const onOpenChange = vi.fn()
    const {container} = render(fixture(<Picker onOpenChange={onOpenChange} overlay={{displayCloseButton: true}} />))
    await userEvent.click(trigger())
    await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true')
    const automaticClose = page.getByRole('button', {name: 'Close', exact: true})
    await expect.element(automaticClose).toHaveAttribute('command', 'close')
    await userEvent.click(automaticClose)
    await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(nativeDialog(container).open).toBe(false)
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'anchor-click'],
      [false, 'close'],
    ])
  })

  it.each([false, true])('preserves automatic close visibility and placement with invokers=%s', async invokers => {
    await page.viewport(1200, 900)
    render(fixture(<Picker overlay={{displayCloseButton: true}} />, invokers))
    await userEvent.click(trigger())
    await expect.element(search()).toHaveFocus()
    const automaticClose = page.getByRole('button', {name: 'Close', exact: true, includeHidden: true})
    expect(automaticClose.element()).toBeInTheDocument()
    expect(automaticClose.element()).not.toBeVisible()
    await page.viewport(390, 844)
    await expect.element(automaticClose).toBeVisible()
    const dialog = page.getByRole('dialog', {name: 'Choose labels', exact: true})
    await expect
      .poll(() => {
        const panel = dialog.element().getBoundingClientRect()
        const button = automaticClose.element().getBoundingClientRect()
        return {top: Math.round(button.top - panel.top), right: Math.round(panel.right - button.right)}
      })
      .toEqual({top: 8, right: 8})
    await userEvent.click(automaticClose)
    await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false')
    await expect.element(trigger()).toHaveFocus()
  })

  it('reconciles rejected controlled commands and Escape', async () => {
    const onOpenChange = vi.fn()
    const {container, rerender} = render(fixture(<Picker open={false} onOpenChange={onOpenChange} />))
    const dialog = nativeDialog(container)
    await userEvent.click(trigger())
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
    rerender(fixture(<Picker open onOpenChange={onOpenChange} />))
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(close())
    await expect.poll(() => onOpenChange.mock.calls.length).toBe(2)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.keyboard('{Escape}')
    expect(dialog.matches(':modal')).toBe(true)
    await expect.poll(() => onOpenChange.mock.calls.at(-1)).toEqual([false, 'escape'])
  })

  it('supports keyboard opening, selection close, and submit close', async () => {
    const onOpenChange = vi.fn()
    const {container, rerender} = render(fixture(<Picker closeOnSelect onOpenChange={onOpenChange} />))
    const dialog = nativeDialog(container)
    act(() => trigger().element().focus())
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(search()).toHaveFocus()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-key-press')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(trigger()).toHaveFocus()
    rerender(fixture(<Picker onOpenChange={onOpenChange} />))
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole('button', {name: 'Apply labels', exact: true}))
    await expect.poll(() => dialog.open).toBe(false)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'submit')
  })

  it('preserves overlay refs, width, positioning, and event overrides', async () => {
    await page.viewport(1200, 900)
    const ref = React.createRef<HTMLDivElement>()
    const onClose = vi.fn()
    const onEscape = vi.fn()
    const {container} = render(
      fixture(
        <div style={{padding: 100}}>
          <Picker overlay={{width: 'large', overlayProps: {ref, onEscape}, onClose}} />
        </div>,
      ),
    )
    await userEvent.click(trigger())
    const dialog = nativeDialog(container)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.getBoundingClientRect().width).toBe(480)
    await expect
      .poll(() => {
        const anchor = trigger().element().getBoundingClientRect()
        const surface = dialog.getBoundingClientRect()
        return {left: Math.round(surface.left - anchor.left), gap: Math.round(surface.top - anchor.bottom)}
      })
      .toEqual({left: 0, gap: 4})
    await userEvent.keyboard('{Escape}')
    expect(onEscape).toHaveBeenCalledOnce()
    expect(onClose).not.toHaveBeenCalled()
    expect(dialog.matches(':modal')).toBe(true)
    await userEvent.click(close())
    await expect.poll(() => onClose.mock.calls.length).toBe(1)
    expect(onClose).toHaveBeenCalledWith('close')
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
  })

  it.each(
    (['outside-top', 'outside-bottom', 'outside-left', 'outside-right'] as const).flatMap(side =>
      (['start', 'center', 'end'] as const).map(align => ({side, align})),
    ),
  )('uses native CSS anchors for $side / $align without JavaScript coordinates', async ({side, align}) => {
    await page.viewport(1600, 1400)
    render(
      fixture(
        <div style={{padding: '500px 600px'}}>
          <Picker defaultOpen overlay={{side, align, anchorOffset: 12}} />
        </div>,
      ),
    )
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.element(dialog).toHaveAttribute('data-anchor-position', 'true')
    expect(dialog.element().style.getPropertyValue('--native-top')).toBe('')
    expect(dialog.element().style.getPropertyValue('--native-left')).toBe('')
    await expect
      .poll(() => {
        const anchor = trigger().element().getBoundingClientRect()
        const panel = dialog.element().getBoundingClientRect()
        const vertical = side === 'outside-top' || side === 'outside-bottom'
        const gap =
          side === 'outside-top'
            ? anchor.top - panel.bottom
            : side === 'outside-bottom'
              ? panel.top - anchor.bottom
              : side === 'outside-left'
                ? anchor.left - panel.right
                : panel.left - anchor.right
        const alignment =
          align === 'center'
            ? vertical
              ? panel.left + panel.width / 2 - (anchor.left + anchor.width / 2)
              : panel.top + panel.height / 2 - (anchor.top + anchor.height / 2)
            : align === 'end'
              ? vertical
                ? panel.right - anchor.right
                : panel.bottom - anchor.bottom
              : vertical
                ? panel.left - anchor.left
                : panel.top - anchor.top
        return {gap: Math.round(gap), alignment: Math.round(alignment)}
      })
      .toEqual({gap: 12, alignment: 0})
  })

  it('lets CSS flip the anchored dialog at the viewport edge', async () => {
    await page.viewport(1200, 900)
    render(
      fixture(
        <div style={{position: 'fixed', bottom: 20, right: 20}}>
          <Picker defaultOpen />
        </div>,
      ),
    )
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.element(dialog).toHaveAttribute('data-anchor-position', 'true')
    await expect
      .poll(() => {
        const panel = dialog.element().getBoundingClientRect()
        const anchor = trigger().element().getBoundingClientRect()
        return {gap: Math.round(anchor.top - panel.bottom), right: Math.round(panel.right - anchor.right)}
      })
      .toEqual({gap: 4, right: 0})
  })

  it('lets CSS follow a scrolling anchor without JavaScript position updates', async () => {
    await page.viewport(1200, 1000)
    render(
      fixture(
        <div data-testid="scroller" style={{height: 600, overflow: 'auto'}}>
          <div style={{padding: '200px 100px', height: 1000}}>
            <Picker defaultOpen />
          </div>
        </div>,
      ),
    )
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    const top = dialog.element().getBoundingClientRect().top
    act(() => {
      page.getByTestId('scroller').element().scrollTop = 50
    })
    await expect.poll(() => Math.round(dialog.element().getBoundingClientRect().top - top)).toBe(-50)
    expect(dialog.element().style.getPropertyValue('--native-top')).toBe('')
    expect(dialog.element().style.getPropertyValue('--native-left')).toBe('')
  })

  it('retains shared JavaScript positioning for explicit opt-outs', async () => {
    render(fixture(<Picker defaultOpen overlay={{cssAnchorPositioningSettings: {disable: true}}} />))
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.element(dialog).toHaveAttribute('data-anchor-position', 'false')
    await expect.poll(() => dialog.element().style.getPropertyValue('--native-top')).not.toBe('')
    expect(dialog.element().matches(':modal')).toBe(true)
  })

  it.each([true, false])('honors explicit displayInViewport=%s using shared positioning', async displayInViewport => {
    render(fixture(<Picker defaultOpen overlay={{displayInViewport}} />))
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.element(dialog).toHaveAttribute('data-anchor-position', 'false')
    await expect.poll(() => dialog.element().style.getPropertyValue('--native-top')).not.toBe('')
    expect(dialog.element().matches(':modal')).toBe(true)
  })

  it('retains native modality with shared positioning when CSS anchors are unsupported', async () => {
    vi.spyOn(CSS, 'supports').mockReturnValue(false)
    render(fixture(<Picker defaultOpen />))
    const dialog = page.getByRole('dialog', {name: 'Choose labels'})
    await expect.element(dialog).toHaveAttribute('data-anchor-position', 'false')
    await expect.poll(() => dialog.element().style.getPropertyValue('--native-top')).not.toBe('')
    expect(dialog.element().matches(':modal')).toBe(true)
  })

  it.each([
    ['none', 'none'],
    ['opposite-side', 'flip-block'],
  ] as const)('honors the explicit CSS anchor fallback strategy %s', (strategy, expected) => {
    render(fixture(<Picker defaultOpen overlay={{cssAnchorPositioningSettings: {fallbackStrategy: strategy}}} />))
    const dialog = page.getByRole('dialog', {name: 'Choose labels'}).element()
    expect(dialog).toHaveAttribute('data-anchor-position', 'true')
    expect(dialog.style.getPropertyValue('position-try-fallbacks')).toBe(expected)
  })

  it('preserves consumer-owned anchor names and cleans up its own name on unmount', () => {
    const anchorRef = React.createRef<HTMLButtonElement>()
    const anchorStyle: React.CSSProperties & {anchorName: string} = {anchorName: '--consumer-anchor'}
    const {unmount} = render(
      fixture(
        <SelectPanel.Root>
          <SelectPanel.Trigger ref={anchorRef} style={anchorStyle}>
            Choose
          </SelectPanel.Trigger>
          <SelectPanel.Overlay>
            <SelectPanel.Title>Choose labels</SelectPanel.Title>
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    const anchor = anchorRef.current!
    expect(anchor.style.getPropertyValue('anchor-name')).toBe('--consumer-anchor')
    expect(document.querySelector('dialog')?.style.getPropertyValue('position-anchor')).toBe('--consumer-anchor')
    unmount()
    expect(anchor.style.getPropertyValue('anchor-name')).toBe('--consumer-anchor')
    const next = render(
      fixture(
        <SelectPanel.Root>
          <SelectPanel.Trigger ref={anchorRef}>Choose</SelectPanel.Trigger>
          <SelectPanel.Overlay>
            <SelectPanel.Title>Choose labels</SelectPanel.Title>
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    const ownedAnchor = anchorRef.current!
    expect(ownedAnchor.style.getPropertyValue('anchor-name')).toContain('--select-panel-')
    next.unmount()
    expect(ownedAnchor.style.getPropertyValue('anchor-name')).toBe('')
  })

  it('leaves configured overlays unchanged without the adapter', async () => {
    const {container} = render(fixture(<Picker configured />))
    expect(trigger().element()).not.toHaveAttribute('command')
    await userEvent.click(trigger())
    expect(container.querySelector('dialog')).toBeNull()
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
  })

  it('retains native modality without browser command support', async () => {
    vi.stubGlobal('CommandEvent', undefined)
    const next = render(fixture(<Picker />))
    expect(trigger().element()).not.toHaveAttribute('command')
    await userEvent.click(trigger())
    expect(nativeDialog(next.container).matches(':modal')).toBe(true)
  })

  it('upgrades the existing HeaderActions composition without story-specific adapters', async () => {
    const {container} = render(fixture(<HeaderActions />))
    const button = page.getByRole('button', {name: 'Labels with header actions (1)', exact: true})
    await expect.element(button).toHaveAttribute('command', 'show-modal')
    await userEvent.click(button)
    const dialog = nativeDialog(container)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await userEvent.click(page.getByRole('button', {name: 'Select all', exact: true}))
    expect(dialog.matches(':modal')).toBe(true)
    await expect.element(page.getByRole('option', {name: 'Bug', exact: true})).toHaveAttribute('aria-selected', 'true')
    await expect
      .element(page.getByRole('option', {name: 'Archived', exact: true}))
      .toHaveAttribute('aria-selected', 'false')
    const closeButton = page.getByRole('button', {name: 'Close label picker', exact: true})
    await expect.element(closeButton).toHaveAttribute('command', 'close')
    await userEvent.click(closeButton)
    await expect.poll(() => dialog.open).toBe(false)
    await expect.element(page.getByRole('button', {name: 'Labels with header actions (4)', exact: true})).toHaveFocus()
    await userEvent.click(page.getByRole('button', {name: 'Labels with header actions (4)', exact: true}))
    await userEvent.keyboard('{Escape}')
    await expect.poll(() => dialog.open).toBe(false)
  })

  it('retains the native host and selection when browser command support changes', async () => {
    const {container, rerender} = render(fixture(<Picker />, false))
    const original = nativeDialog(container)
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole('option', {name: 'Bug', exact: true}))
    vi.unstubAllGlobals()
    rerender(fixture(<Picker />))
    const dialog = nativeDialog(container)
    expect(dialog).toBe(original)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.element(page.getByRole('option', {name: 'Bug', exact: true})).toHaveAttribute('aria-selected', 'true')
    await expect.element(trigger()).toHaveAttribute('command', 'show-modal')
    rerender(fixture(<Picker />, false))
    expect(nativeDialog(container)).toBe(original)
    await expect.element(page.getByRole('dialog', {name: 'Choose labels'})).toBeVisible()
    expect(trigger().element()).not.toHaveAttribute('command')
    await expect.element(page.getByRole('option', {name: 'Bug', exact: true})).toHaveAttribute('aria-selected', 'true')
  })

  it.each(['fullscreen', 'bottom-sheet'] as const)('preserves narrow %s presentation', async variant => {
    await page.viewport(390, 844)
    const {container} = render(fixture(<Picker overlay={{variant: {narrow: variant}}} />))
    await userEvent.click(trigger())
    const dialog = nativeDialog(container)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    expect(dialog).toHaveAttribute('data-variant', variant)
    await expect.poll(() => Math.round(dialog.getBoundingClientRect().width)).toBe(390)
    expect(Math.round(dialog.getBoundingClientRect().left)).toBe(0)
    const surface = dialog.firstElementChild
    if (!surface) throw new Error('Expected the visible panel surface')
    expect(Math.round(surface.getBoundingClientRect().width)).toBe(390)
    expect(Math.round(surface.getBoundingClientRect().left)).toBe(0)
    if (variant === 'fullscreen') expect(Math.round(dialog.getBoundingClientRect().height)).toBe(844)
    else expect(Math.round(dialog.getBoundingClientRect().bottom)).toBe(844)
  })

  it.each([false, true])('centers a FormControl modal with invokers=%s', async invokers => {
    await page.viewport(1200, 900)
    const {container} = render(fixture(<ResponsiveImmediateSelection />, invokers))
    const button = page.getByRole('button', {name: 'Primary label', exact: true})
    await userEvent.click(button)
    const dialog = nativeDialog(container)
    await expect.element(button).toHaveAttribute('aria-expanded', 'true')
    expect(dialog).toHaveAttribute('data-variant', 'modal')
    const surface = dialog.firstElementChild
    if (!surface) throw new Error('Expected the visible panel surface')
    const centerOffset = (element: Element) => {
      const rect = element.getBoundingClientRect()
      return {
        x: Math.round(rect.left + rect.width / 2 - window.innerWidth / 2),
        y: Math.round(rect.top + rect.height / 2 - window.innerHeight / 2),
      }
    }
    await expect.poll(() => centerOffset(dialog)).toEqual({x: 0, y: 0})
    expect(centerOffset(surface)).toEqual({x: 0, y: 0})
    await page.viewport(390, 844)
    await expect.element(dialog).toHaveAttribute('data-variant', 'bottom-sheet')
    await expect
      .poll(() => ({
        width: Math.round(surface.getBoundingClientRect().width),
        bottom: Math.round(surface.getBoundingClientRect().bottom),
      }))
      .toEqual({width: 390, bottom: 844})
    await page.viewport(1000, 800)
    await expect.element(dialog).toHaveAttribute('data-variant', 'modal')
    await expect.poll(() => centerOffset(dialog)).toEqual({x: 0, y: 0})
    expect(centerOffset(surface)).toEqual({x: 0, y: 0})
  })

  it('supports an anchorless native modal and restores body scrolling after unmount', async () => {
    const overflow = document.body.style.overflow
    const {container, unmount} = render(
      fixture(
        <SelectPanel.Root defaultOpen>
          <SelectPanel.Overlay variant={{regular: 'modal'}}>
            <SelectPanel.Title>Anchorless picker</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    const dialog = nativeDialog(container)
    await expect.poll(() => dialog.matches(':modal')).toBe(true)
    await expect.poll(() => document.body.style.overflow).toBe('hidden')
    expect(dialog.getBoundingClientRect().width).toBeGreaterThan(0)
    unmount()
    expect(document.body.style.overflow).toBe(overflow)
  })

  it('does not steal focus when an unopened native overlay is removed', async () => {
    function content(showOverlay: boolean) {
      return fixture(
        <>
          <button type="button">Outside action</button>
          <SelectPanel.Root>
            <SelectPanel.Trigger>Open picker</SelectPanel.Trigger>
            {showOverlay ? (
              <SelectPanel.Overlay>
                <SelectPanel.Title>Choose labels</SelectPanel.Title>
              </SelectPanel.Overlay>
            ) : null}
          </SelectPanel.Root>
        </>,
      )
    }
    const {rerender} = render(content(true))
    const outside = page.getByRole('button', {name: 'Outside action', exact: true})
    await userEvent.click(outside)
    rerender(content(false))
    expect(outside.element()).toHaveFocus()
    expect(trigger().element()).not.toHaveAttribute('command')
  })

  it('keeps nested native commands scoped to their owning picker', async () => {
    const onOpenChange = vi.fn()
    render(
      fixture(
        <SelectPanel.Root onOpenChange={onOpenChange}>
          <SelectPanel.Trigger>Outer picker</SelectPanel.Trigger>
          <SelectPanel.Overlay>
            <SelectPanel.Title>Outer labels</SelectPanel.Title>
            <Picker />
            <SelectPanel.CloseButton aria-label="Close outer picker" />
          </SelectPanel.Overlay>
        </SelectPanel.Root>,
      ),
    )
    const outerTrigger = page.getByRole('button', {name: 'Outer picker', exact: true})
    await userEvent.click(outerTrigger)
    await expect.element(trigger()).toBeVisible()
    await userEvent.click(trigger())
    await expect.element(search()).toHaveFocus()
    await userEvent.click(close())
    await expect.element(trigger()).toHaveFocus()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true, 'anchor-click')
    expect(document.body.style.overflow).toBe('hidden')
    await userEvent.click(page.getByRole('button', {name: 'Close outer picker', exact: true}))
    await expect.element(outerTrigger).toHaveFocus()
    await expect.poll(() => document.body.style.overflow).not.toBe('hidden')
  })
})
