import React from 'react'
import {act, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent as browserUserEvent} from 'vitest/browser'
import BaseStyles from '../BaseStyles'
import FormControl from '../FormControl'
import TextInput from '../TextInput'
import {FeatureFlags} from '../FeatureFlags'
import {registerPortalRoot} from '../Portal'
import {
  SelectPanelContent,
  SelectPanelDescription,
  SelectPanelRoot,
  type SelectPanelRootProps,
  SelectPanelSearchInput,
  SelectPanelTitle,
  SelectPanelTrigger,
} from './SelectPanelParts'
import {ConfiguredSelectPanelOverlay, SelectPanelOverlay, type SelectPanelOverlayProps} from './SelectPanelOverlay'
import {useSelectPanelContext} from './SelectPanelContext'

type ConfiguredOverlayProps = Omit<React.ComponentProps<typeof ConfiguredSelectPanelOverlay>, 'open' | 'anchorRef'>

function ConfiguredOverlay({children, overlayProps, ...props}: ConfiguredOverlayProps) {
  const state = useSelectPanelContext()
  return (
    <ConfiguredSelectPanelOverlay
      {...props}
      open={state.open}
      anchorRef={state.anchorRef}
      focusTrapSettings={{initialFocusRef: state.inputRef}}
      overlayProps={{
        role: 'dialog',
        'aria-labelledby': state.labelledBy,
        'aria-describedby': state.describedBy,
        ...overlayProps,
      }}
    >
      {children}
    </ConfiguredSelectPanelOverlay>
  )
}

interface PickerProps extends SelectPanelRootProps {
  overlay?: SelectPanelOverlayProps
  configuredOverlay?: ConfiguredOverlayProps
}

function Picker({overlay, configuredOverlay, ...props}: PickerProps) {
  const content = (
    <SelectPanelContent>
      <SelectPanelTitle id="picker-title" as="h3">
        Choose a fruit
      </SelectPanelTitle>
      <SelectPanelDescription id="picker-description">Choose your favorite fruit</SelectPanelDescription>
      <SelectPanelSearchInput aria-label="Filter fruit" />
      <button type="button">Last action</button>
    </SelectPanelContent>
  )
  return (
    <BaseStyles>
      <SelectPanelRoot {...props}>
        <SelectPanelTrigger>Open picker</SelectPanelTrigger>
        {configuredOverlay ? (
          <ConfiguredOverlay {...configuredOverlay}>{content}</ConfiguredOverlay>
        ) : (
          <SelectPanelOverlay {...overlay}>{content}</SelectPanelOverlay>
        )}
      </SelectPanelRoot>
    </BaseStyles>
  )
}

beforeEach(async () => {
  await act(async () => {
    await page.viewport(1000, 800)
  })
})

afterEach(async () => {
  await act(async () => {
    await page.viewport(1000, 800)
  })
})

describe('SelectPanel.Overlay presentation', () => {
  it.each([false, true])('preserves popover state and trigger relationships with CSS anchors=%s', async native => {
    render(
      <FeatureFlags flags={{primer_react_css_anchor_positioning: native}}>
        <Picker
          overlay={{
            renderAs: 'popover',
            variant: {narrow: 'anchored'},
            overlayProps: {id: 'consumer-picker'},
          }}
        />
      </FeatureFlags>,
    )
    const trigger = page.getByRole('button', {name: 'Open picker', exact: true})
    const dialog = page.getByRole('dialog', {name: 'Choose a fruit', exact: true})
    for (let opening = 0; opening < 2; opening++) {
      await browserUserEvent.click(trigger)
      await expect.element(dialog).toBeVisible()
      expect(dialog.element().id).toBe('consumer-picker')
      expect(trigger.element()).toHaveAttribute('aria-controls', dialog.element().id)
      expect(dialog.element().matches(':popover-open')).toBe(native)
      expect(screen.getByRole('combobox', {name: 'Filter fruit'})).toHaveFocus()
      await browserUserEvent.keyboard('{Escape}')
      await expect.element(dialog).not.toBeInTheDocument()
      await expect.element(trigger).toHaveFocus()
    }
  })

  it.each([
    {native: false, disable: false, customPortal: false},
    {native: true, disable: false, customPortal: false},
    {native: true, disable: true, customPortal: false},
    {native: true, disable: false, customPortal: true},
  ])(
    'positions beneath the trigger with native=$native, disable=$disable, customPortal=$customPortal',
    async ({native, disable, customPortal}) => {
      const portalName = 'select-panel-positioning-test'
      render(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: native}}>
          <div
            ref={element => {
              if (element) registerPortalRoot(element, portalName)
            }}
            style={{position: 'absolute', top: 0, left: 0, width: '100%'}}
          />
          <div style={{padding: 120}}>
            <Picker
              overlay={{
                cssAnchorPositioningSettings: {disable},
                overlayProps: customPortal ? {portalContainerName: portalName} : undefined,
              }}
            />
          </div>
        </FeatureFlags>,
      )
      const trigger = page.getByRole('button', {name: 'Open picker', exact: true})
      const dialog = page.getByRole('dialog', {name: 'Choose a fruit', exact: true})
      for (let opening = 0; opening < 2; opening++) {
        await browserUserEvent.click(trigger)
        await expect.element(dialog).toBeVisible()
        await expect
          .element(dialog)
          .toHaveAttribute('data-anchor-position', String(native && !disable && !customPortal))
        await expect
          .poll(() => {
            const anchor = trigger.element().getBoundingClientRect()
            const panel = dialog.element().getBoundingClientRect()
            return {
              left: Math.round(panel.left - anchor.left),
              gap: Math.round(panel.top - anchor.bottom),
            }
          })
          .toEqual({left: 0, gap: 4})
        await browserUserEvent.keyboard('{Escape}')
        await expect.element(dialog).not.toBeInTheDocument()
      }
    },
  )

  it.each([
    {width: 1000, variant: {regular: 'anchored'}, native: true},
    {width: 1000, variant: {regular: 'modal'}, native: false},
    {width: 375, variant: {narrow: 'fullscreen'}, native: false},
    {width: 375, variant: {narrow: 'bottom-sheet'}, native: false},
  ] as const)('uses native anchor positioning=$native for $variant', async ({width, variant, native}) => {
    await act(async () => {
      await page.viewport(width, 800)
    })
    render(
      <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
        <Picker defaultOpen overlay={{variant}} />
      </FeatureFlags>,
    )
    await waitFor(() => {
      expect(screen.getByRole('dialog', {name: 'Choose a fruit'})).toHaveAttribute(
        'data-anchor-position',
        String(native),
      )
    })
  })

  it('preserves the native anchor positioning opt-out', () => {
    render(
      <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
        <Picker defaultOpen overlay={{cssAnchorPositioningSettings: {disable: true}}} />
      </FeatureFlags>,
    )
    expect(screen.getByRole('dialog', {name: 'Choose a fruit'})).toHaveAttribute('data-anchor-position', 'false')
  })

  it('isolates trigger FormControl props from the composed overlay', () => {
    render(
      <BaseStyles>
        <FormControl id="trigger-control" required disabled>
          <FormControl.Label>Fruit</FormControl.Label>
          <FormControl.Caption>Pick your favorite fruit</FormControl.Caption>
          <SelectPanelRoot defaultOpen>
            <SelectPanelTrigger>Open picker</SelectPanelTrigger>
            <SelectPanelOverlay>
              <SelectPanelTitle>Fruit picker</SelectPanelTitle>
              <SelectPanelSearchInput aria-label="Filter fruit" />
              <FormControl id="nested-control" required>
                <FormControl.Label>Notes</FormControl.Label>
                <TextInput />
              </FormControl>
            </SelectPanelOverlay>
          </SelectPanelRoot>
        </FormControl>
      </BaseStyles>,
    )
    const trigger = screen.getByRole('button', {name: /Fruit/})
    const search = screen.getByRole('combobox', {name: 'Filter fruit'})
    const nestedInput = screen.getByRole('textbox', {name: /Notes/})
    expect(trigger).toHaveAttribute('id', 'trigger-control')
    expect(trigger).toHaveAttribute('aria-describedby', 'trigger-control-caption')
    expect(trigger).toBeDisabled()
    expect(search).not.toHaveAttribute('id', 'trigger-control')
    expect(search).not.toHaveAttribute('aria-describedby', 'trigger-control-caption')
    expect(search).not.toBeRequired()
    expect(search).toBeEnabled()
    expect(nestedInput).toHaveAttribute('id', 'nested-control')
    expect(nestedInput).toBeRequired()
    expect(nestedInput).toBeEnabled()
  })

  it('is an anchored modal dialog with a level-one title and custom IDs by default', async () => {
    const user = userEvent.setup()
    render(<Picker overlay={{overlayProps: {id: 'custom-panel'}}} />)
    const trigger = screen.getByRole('button', {name: 'Open picker'})
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', {name: 'Choose a fruit'})
    expect(dialog).toHaveAttribute('id', 'custom-panel')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('data-variant', 'anchored')
    expect(dialog).toHaveAccessibleDescription('Choose your favorite fruit')
    expect(trigger).toHaveAttribute('aria-controls', 'custom-panel')
    expect(within(dialog).getByRole('heading', {name: 'Choose a fruit', level: 1})).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', {name: 'Close'})).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveFocus())

    await user.tab({shift: true})
    expect(screen.getByRole('button', {name: 'Last action'})).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('combobox')).toHaveFocus()
    expect(document.body).toHaveStyle({overflow: 'hidden'})
  })

  it('defaults to fullscreen on narrow viewports', async () => {
    await act(async () => {
      await page.viewport(600, 800)
    })
    render(<Picker defaultOpen />)
    const dialog = screen.getByRole('dialog', {name: 'Choose a fruit'})
    expect(dialog).toHaveAttribute('data-variant', 'fullscreen')
    expect(dialog).toHaveStyle({position: 'fixed', width: '600px', height: '800px'})
    expect(within(dialog).queryByRole('button', {name: 'Close'})).not.toBeInTheDocument()
  })

  it.each([
    {width: 1000, presentation: 'anchored', variant: {regular: 'anchored'}},
    {width: 1000, presentation: 'modal', variant: {regular: 'modal'}},
    {width: 375, presentation: 'fullscreen', variant: {narrow: 'fullscreen'}},
    {width: 375, presentation: 'bottom-sheet', variant: {narrow: 'bottom-sheet'}},
  ] as const)('keeps the input inset in $presentation presentation', async ({width, variant}) => {
    await act(async () => {
      await page.viewport(width, 800)
    })
    render(<Picker defaultOpen overlay={{variant}} />)
    const dialog = screen.getByRole('dialog', {name: 'Choose a fruit'})
    const field = screen.getByRole('combobox').closest('[data-block]')
    if (!field) throw new Error('Expected a block TextInput wrapper')

    await waitFor(() => {
      const panelBounds = dialog.getBoundingClientRect()
      const fieldBounds = field.getBoundingClientRect()
      expect(fieldBounds.width).toBeGreaterThan(0)
      expect(fieldBounds.left - panelBounds.left).toBeGreaterThanOrEqual(8)
      expect(panelBounds.right - fieldBounds.right).toBeGreaterThanOrEqual(8)
      expect(fieldBounds.top - panelBounds.top).toBeGreaterThanOrEqual(8)
      expect(panelBounds.bottom - fieldBounds.bottom).toBeGreaterThanOrEqual(8)
    })
  })

  it('supports modal presentation without an anchor', async () => {
    render(
      <BaseStyles>
        <SelectPanelRoot defaultOpen>
          <SelectPanelOverlay variant={{regular: 'modal'}}>
            <SelectPanelTitle>Unanchored modal</SelectPanelTitle>
            <button type="button">Modal action</button>
          </SelectPanelOverlay>
        </SelectPanelRoot>
      </BaseStyles>,
    )
    const dialog = screen.getByRole('dialog', {name: 'Unanchored modal'})
    expect(dialog).toBeVisible()
    expect(dialog).toHaveAttribute('data-variant', 'modal')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveStyle({position: 'fixed'})
    await waitFor(() => expect(screen.getByRole('button', {name: 'Modal action'})).toHaveFocus())
  })

  it('supports bottom-sheet and anchored narrow presentations', async () => {
    await act(async () => {
      await page.viewport(600, 800)
    })
    const {rerender} = render(<Picker defaultOpen overlay={{variant: {narrow: 'bottom-sheet'}}} />)
    const dialog = screen.getByRole('dialog', {name: 'Choose a fruit'})
    expect(dialog).toHaveAttribute('data-variant', 'bottom-sheet')
    expect(dialog).toHaveStyle({position: 'fixed', bottom: '0px', width: '600px'})

    rerender(<Picker defaultOpen overlay={{variant: {narrow: 'anchored'}}} />)
    expect(dialog).toHaveAttribute('data-variant', 'anchored')
    expect(dialog).toHaveStyle({position: 'absolute'})
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('retains configured overlay positioning and responsive overrides in legacy mode', async () => {
    const overlayRef = React.createRef<HTMLDivElement>()
    const {rerender} = render(
      <Picker
        defaultOpen
        configuredOverlay={{
          className: 'legacy-overlay',
          overlayProps: {
            ref: overlayRef,
            top: '50vh',
            left: '50vw',
            style: {transform: 'translate(-50%, -50%)'},
          },
        }}
      />,
    )
    const dialog = screen.getByRole('dialog', {name: 'Choose a fruit'})
    expect(overlayRef.current).toBe(dialog)
    expect(dialog).toHaveClass('legacy-overlay')
    expect(dialog).not.toHaveAttribute('data-variant')
    expect(dialog).toHaveStyle({position: 'absolute'})
    expect(dialog.style.getPropertyValue('--top')).toBe('50vh')
    expect(dialog.style.getPropertyValue('--left')).toBe('50vw')
    expect(dialog.style.transform).toBe('translate(-50%, -50%)')
    expect(document.querySelector('[data-component="SelectPanel.Backdrop"]')).toBeNull()

    await act(async () => {
      await page.viewport(600, 800)
    })
    rerender(<Picker defaultOpen configuredOverlay={{variant: {narrow: 'fullscreen'}}} />)
    expect(dialog).toHaveAttribute('data-responsive', 'fullscreen')
  })
})

describe('SelectPanel.Overlay lifecycle', () => {
  it('treats the responsive close button as dismissal rather than cancellation', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const onCancel = vi.fn()
    await act(async () => {
      await page.viewport(600, 800)
    })
    render(<Picker defaultOpen onDismiss={onDismiss} onCancel={onCancel} overlay={{displayCloseButton: true}} />)
    await user.click(screen.getByRole('button', {name: 'Close'}))
    expect(onDismiss).toHaveBeenCalledWith('close')
    expect(onCancel).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('dismisses instead of cancelling and restores focus only after closing', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(<Picker onDismiss={onDismiss} onCancel={onCancel} onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole('button', {name: 'Open picker'})
    await user.click(trigger)
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledWith('escape')
    expect(onCancel).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('keeps focus and modality when a controlled owner rejects Escape or outside dismissal', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const onCancel = vi.fn()
    render(<Picker open onDismiss={onDismiss} onCancel={onCancel} />)
    const input = screen.getByRole('combobox')
    await waitFor(() => expect(input).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenLastCalledWith('escape')
    expect(input).toHaveFocus()

    fireEvent.mouseDown(document.body)
    expect(onDismiss).toHaveBeenLastCalledWith('click-outside')
    expect(onCancel).not.toHaveBeenCalled()
    expect(input).toHaveFocus()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('honors explicit onClose and overlay event overrides', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onDismiss = vi.fn()
    const onEscape = vi.fn()
    const onClickOutside = vi.fn()
    const {rerender} = render(<Picker open onDismiss={onDismiss} overlay={{onClose}} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledWith('escape')
    expect(onDismiss).not.toHaveBeenCalled()

    rerender(<Picker open onDismiss={onDismiss} overlay={{onClose, overlayProps: {onEscape, onClickOutside}}} />)
    await user.keyboard('{Escape}')
    fireEvent.mouseDown(document.body)
    expect(onEscape).toHaveBeenCalledTimes(1)
    expect(onClickOutside).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('forwards a configured outside-click handler without consuming its event', () => {
    const onClickOutside = vi.fn()
    const onClose = vi.fn()
    render(<Picker open configuredOverlay={{onClose, overlayProps: {onClickOutside}}} />)
    const event = new MouseEvent('mousedown', {bubbles: true, cancelable: true})
    fireEvent(document.body, event)
    expect(onClickOutside).toHaveBeenCalledWith(event)
    expect(onClose).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
  })

  it('preserves a supplied legacy renderAnchor, anchor ref, onOpen, and anchor ID', async () => {
    const user = userEvent.setup()
    const anchorRef = React.createRef<HTMLButtonElement>()
    const onOpen = vi.fn()
    const onClose = vi.fn()
    function LegacyPicker() {
      const [open, setOpen] = React.useState(false)
      const inputRef = React.useRef<HTMLInputElement>(null)
      return (
        <BaseStyles>
          <SelectPanelRoot open={open}>
            <ConfiguredSelectPanelOverlay
              open={open}
              anchorId="custom-anchor"
              anchorRef={anchorRef}
              focusTrapSettings={{initialFocusRef: inputRef}}
              renderAnchor={props => (
                <button {...props} type="button">
                  Legacy trigger
                </button>
              )}
              onOpen={(gesture, event) => {
                onOpen(gesture, event)
                setOpen(true)
              }}
              onClose={gesture => {
                onClose(gesture)
                setOpen(false)
              }}
            >
              <SelectPanelTitle>Legacy panel</SelectPanelTitle>
              <SelectPanelSearchInput ref={inputRef} aria-label="Legacy filter" />
            </ConfiguredSelectPanelOverlay>
          </SelectPanelRoot>
        </BaseStyles>
      )
    }
    render(<LegacyPicker />)
    const trigger = screen.getByRole('button', {name: 'Legacy trigger'})
    expect(anchorRef.current).toBe(trigger)
    expect(trigger).toHaveAttribute('id', 'custom-anchor')
    await user.click(trigger)
    expect(onOpen).toHaveBeenCalledWith('anchor-click', undefined)
    await waitFor(() => expect(screen.getByRole('combobox')).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledWith('escape')
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})

interface NestedPickerProps {
  showChild?: boolean
  controlledChild?: boolean
  onParentDismiss?: SelectPanelRootProps['onDismiss']
  onChildDismiss?: SelectPanelRootProps['onDismiss']
}

function NestedPicker({showChild = true, controlledChild, onParentDismiss, onChildDismiss}: NestedPickerProps) {
  const [childOpen, setChildOpen] = React.useState(false)
  return (
    <BaseStyles>
      <SelectPanelRoot onDismiss={onParentDismiss}>
        <SelectPanelTrigger>Open parent</SelectPanelTrigger>
        <SelectPanelOverlay>
          <SelectPanelTitle>Parent panel</SelectPanelTitle>
          <SelectPanelSearchInput aria-label="Parent filter" />
          {showChild ? (
            <SelectPanelRoot
              open={controlledChild ? childOpen : undefined}
              onOpenChange={nextOpen => {
                if (nextOpen) setChildOpen(true)
              }}
              onDismiss={onChildDismiss}
            >
              <SelectPanelTrigger>Open child</SelectPanelTrigger>
              <SelectPanelOverlay>
                <SelectPanelTitle>Child panel</SelectPanelTitle>
                <SelectPanelSearchInput aria-label="Child filter" />
              </SelectPanelOverlay>
            </SelectPanelRoot>
          ) : null}
        </SelectPanelOverlay>
      </SelectPanelRoot>
    </BaseStyles>
  )
}

describe('SelectPanel.Overlay nesting', () => {
  it('dismisses only the child for Escape and outside gestures', async () => {
    const user = userEvent.setup()
    const onParentDismiss = vi.fn()
    const onChildDismiss = vi.fn()
    render(<NestedPicker onParentDismiss={onParentDismiss} onChildDismiss={onChildDismiss} />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.click(screen.getByRole('button', {name: 'Open child'}))
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Child filter'})).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onChildDismiss).toHaveBeenLastCalledWith('escape')
    expect(onParentDismiss).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', {name: 'Child panel'})).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', {name: 'Parent panel'})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'Open child'}))
    fireEvent.mouseDown(document.body)
    expect(onChildDismiss).toHaveBeenLastCalledWith('click-outside')
    expect(onParentDismiss).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog', {name: 'Child panel'})).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', {name: 'Parent panel'})).toBeInTheDocument()
  })

  it('does not dismiss a parent or restore focus when a controlled child rejects dismissal', async () => {
    const user = userEvent.setup()
    const onParentDismiss = vi.fn()
    const onChildDismiss = vi.fn()
    render(<NestedPicker controlledChild onParentDismiss={onParentDismiss} onChildDismiss={onChildDismiss} />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.click(screen.getByRole('button', {name: 'Open child'}))
    const input = screen.getByRole('combobox', {name: 'Child filter'})
    await waitFor(() => expect(input).toHaveFocus())
    await user.keyboard('{Escape}')
    fireEvent.mouseDown(document.body)
    expect(onChildDismiss).toHaveBeenCalledWith('escape')
    expect(onChildDismiss).toHaveBeenCalledWith('click-outside')
    expect(onParentDismiss).not.toHaveBeenCalled()
    expect(input).toHaveFocus()
    expect(screen.getAllByRole('dialog')).toHaveLength(2)
  })

  it('falls back to the parent input if the child and its invoking anchor disappear', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<NestedPicker />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.click(screen.getByRole('button', {name: 'Open child'}))
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Child filter'})).toHaveFocus())
    rerender(<NestedPicker showChild={false} />)
    expect(screen.queryByRole('dialog', {name: 'Child panel'})).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Parent filter'})).toHaveFocus())
  })
})
