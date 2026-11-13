import type React from 'react'
import {createRef, useState} from 'react'
import {act, fireEvent, render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {InfoIcon} from '@primer/octicons-react'
import {ActionMenu, AnchoredOverlay, Tooltip} from './TriggerComposition'
import {ActionMenu as StableActionMenu} from '../../ActionMenu'
import {ActionList} from '../../ActionList'
import {Button, IconButton} from '../../Button'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName, withExpectedConsoleError} from '../../utils/testing'
import {reactMajorVersion} from '../../utils/environment'

describe('experimental Tooltip routing and visibility', () => {
  afterEach(() => vi.useRealTimers())

  describe.each(['children', 'renderAnchor'] as const)('trigger className in %s mode', mode => {
    implementsClassName(({className}: {className?: string}) => {
      const trigger = <Button className="tooltip-trigger">Action</Button>
      return (
        <Tooltip
          text="Additional context"
          className={className}
          popupProps={{className: 'tooltip-popup'}}
          {...(mode === 'renderAnchor' ? {renderAnchor: trigger} : {children: trigger})}
        />
      )
    }, 'tooltip-trigger')
  })

  it.each(['children', 'renderAnchor'] as const)('separates trigger and popup attributes in %s mode', mode => {
    const onPopupEnter = vi.fn()
    const buttonRef = createRef<HTMLButtonElement>()
    const trigger = (
      <button ref={buttonRef} type="button">
        Action
      </button>
    )
    const {getByText} = render(
      <Tooltip
        text="Additional context"
        id="action-trigger"
        className="trigger-class"
        style={{color: 'blue'}}
        aria-hidden={false}
        popupProps={{
          id: 'action-tooltip',
          className: 'popup-class',
          style: {color: 'red'},
          popover: 'manual',
          onMouseEnter: onPopupEnter,
        }}
        {...(mode === 'renderAnchor' ? {renderAnchor: trigger} : {children: trigger})}
      />,
    )
    const button = page.getByRole('button', {name: 'Action', exact: true}).element()
    const popup = getByText('Additional context')
    expect(buttonRef.current).toBe(button)
    expect(button).toHaveAttribute('id', 'action-trigger')
    expect(button).toHaveClass('trigger-class')
    expect(button).not.toHaveClass('popup-class')
    expect(button).toHaveStyle({color: 'rgb(0, 0, 255)'})
    expect(button).not.toHaveAttribute('popover')
    expect(button).toHaveAccessibleDescription('Additional context')
    expect(button).toHaveAttribute('aria-describedby', 'action-tooltip')
    expect(popup).toHaveClass('popup-class')
    expect(popup).not.toHaveClass('trigger-class')
    expect(popup).toHaveStyle({color: 'rgb(255, 0, 0)'})
    expect(popup).toHaveAttribute('popover', 'manual')
    expect(popup).toHaveAttribute('aria-hidden', 'true')
    fireEvent.mouseEnter(popup)
    expect(onPopupEnter).toHaveBeenCalledOnce()
    expect(popup.matches(':popover-open')).toBe(true)
  })

  it('honors controlled visibility and treats interactions as requests', () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const props = {
      text: 'Additional context',
      onOpenChange,
      delay: 'medium' as const,
      renderAnchor: <button type="button">Action</button>,
    }
    const {getByText, rerender} = render(<Tooltip {...props} open={false} />)
    const button = page.getByRole('button', {name: 'Action', exact: true}).element()
    const popup = getByText('Additional context')
    fireEvent.mouseOver(button)
    act(() => vi.advanceTimersByTime(399))
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(popup.matches(':popover-open')).toBe(false)
    act(() => vi.advanceTimersByTime(1))
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({reason: 'trigger-hover'}))
    expect(popup.matches(':popover-open')).toBe(false)

    rerender(<Tooltip {...props} open />)
    expect(popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledOnce()
    fireEvent.focusOut(button)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'trigger-focus'}))
    expect(popup.matches(':popover-open')).toBe(true)
    fireEvent.keyDown(document, {key: 'Escape'})
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'escape-key'}))
    expect(popup.matches(':popover-open')).toBe(true)
    fireEvent.pointerDown(document.body)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'outside-press'}))
    expect(popup.matches(':popover-open')).toBe(true)
    rerender(<Tooltip {...props} open={false} />)
    expect(popup.matches(':popover-open')).toBe(false)
    expect(onOpenChange).toHaveBeenCalledTimes(4)
  })

  it('keeps an explicit popup ID on the bubble without duplicating keybinding labels', () => {
    const {container} = render(
      <Tooltip
        text="Run"
        type="label"
        keybindingHint="Control+K"
        popupProps={{id: 'run-tooltip'}}
        renderAnchor={<button type="button" />}
      />,
    )
    const button = page.getByRole('button', {name: 'Run (control k)', exact: true}).element()
    const popup = container.querySelector('[data-component="Tooltip"]')
    expect(popup).toHaveAttribute('id', 'run-tooltip')
    expect(button.getAttribute('aria-labelledby')).not.toBe('run-tooltip')
    const label = document.getElementById(button.getAttribute('aria-labelledby') ?? '')
    expect(label).toHaveTextContent('Run')
    expect(popup).toContainElement(label)
  })

  it('opens on keyboard focus only when the owner accepts the request', async () => {
    const onOpenChange = vi.fn()
    const {getByText} = render(
      <Tooltip open={false} onOpenChange={onOpenChange} text="Details" renderAnchor={<Button>Action</Button>} />,
    )
    await userEvent.tab()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({reason: 'trigger-focus'}))
    expect(getByText('Details').matches(':popover-open')).toBe(false)
  })

  it('keeps the popup open when moving between the trigger and popup', () => {
    const onOpenChange = vi.fn()
    const {getByText} = render(
      <Tooltip defaultOpen onOpenChange={onOpenChange} text="Details" renderAnchor={<Button>Action</Button>} />,
    )
    const button = page.getByRole('button', {name: 'Action', exact: true}).element()
    const popup = getByText('Details')
    fireEvent.mouseOut(button, {relatedTarget: popup})
    expect(popup.matches(':popover-open')).toBe(true)
    fireEvent.mouseOut(popup, {relatedTarget: button})
    expect(popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()
    fireEvent.mouseOut(button, {relatedTarget: document.body})
    expect(popup.matches(':popover-open')).toBe(false)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'trigger-hover'}))
  })

  it('supports an uncontrolled initial value, ignores later default changes, and closes with Escape', async () => {
    const onOpenChange = vi.fn()
    const {getByText, rerender} = render(
      <Tooltip defaultOpen onOpenChange={onOpenChange} text="Details" renderAnchor={<Button>Action</Button>} />,
    )
    const popup = getByText('Details')
    expect(popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()
    rerender(
      <Tooltip defaultOpen={false} onOpenChange={onOpenChange} text="Details" renderAnchor={<Button>Action</Button>} />,
    )
    expect(popup.matches(':popover-open')).toBe(true)
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'escape-key'}))
    expect(popup.matches(':popover-open')).toBe(false)
  })

  it('synchronizes native light dismissal and can reopen on a fresh hover', async () => {
    const onOpenChange = vi.fn()
    const {getByText} = render(
      <Tooltip defaultOpen onOpenChange={onOpenChange} text="Details" renderAnchor={<Button>Action</Button>} />,
    )
    const popup = getByText('Details')
    act(() => popup.hidePopover())
    await expect.poll(() => onOpenChange.mock.calls.length).toBe(1)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'none'}))
    await userEvent.hover(page.getByRole('button', {name: 'Action', exact: true}))
    await expect.poll(() => popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({reason: 'trigger-hover'}))
  })

  it.each(['label', 'description'] as const)('suppression overrides open while retaining the %s', type => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const props = {
      text: 'Details',
      type,
      open: true,
      onOpenChange,
      renderAnchor: <button type="button">{type === 'description' ? 'Action' : null}</button>,
    }
    const {getByText, rerender} = render(<Tooltip {...props} />)
    const popup = getByText('Details')
    const button = page.getByRole('button', {name: type === 'label' ? 'Details' : 'Action', exact: true}).element()
    expect(popup.matches(':popover-open')).toBe(true)
    rerender(<Tooltip {...props} disabled />)
    expect(popup.matches(':popover-open')).toBe(false)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'disabled'}))
    onOpenChange.mockClear()
    fireEvent.mouseOver(button)
    act(() => vi.advanceTimersByTime(1200))
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(button).toBeEnabled()
    if (type === 'label') {
      expect(button).toHaveAccessibleName('Details')
    } else {
      expect(button).toHaveAccessibleDescription('Details')
    }
    rerender(<Tooltip {...props} disabled={false} />)
    expect(popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it.each(['children', 'renderAnchor'] as const)(
    'keeps suppression separate from trigger disabled in %s mode',
    async mode => {
      const ref = createRef<HTMLButtonElement>()
      const onClick = vi.fn()
      const onOpenChange = vi.fn()
      const trigger = (
        <Button ref={ref} onClick={onClick}>
          Action
        </Button>
      )
      const props = {
        text: 'Details',
        defaultOpen: true,
        onOpenChange,
        ...(mode === 'renderAnchor' ? {renderAnchor: trigger} : {children: trigger}),
      }
      const {getByText, rerender} = render(<Tooltip {...props} />)
      const popup = getByText('Details')
      const button = page.getByRole('button', {name: 'Action', exact: true})
      for (const suppression of [
        {disabled: true, _privateDisableTooltip: false},
        {disabled: false, _privateDisableTooltip: true},
        {disabled: true, _privateDisableTooltip: true},
      ]) {
        rerender(<Tooltip {...props} {...suppression} />)
        expect(popup.matches(':popover-open')).toBe(false)
        expect(button.element()).toBe(ref.current)
        expect(button.element()).toBeEnabled()
        expect(button.element()).toHaveAccessibleDescription('Details')
        await userEvent.click(button)
      }
      expect(onClick).toHaveBeenCalledTimes(3)
      expect(onOpenChange.mock.calls.some(([open]) => open)).toBe(false)

      vi.useFakeTimers()
      rerender(<Tooltip text="Details" disabled={false} renderAnchor={<Button disabled>Action</Button>} />)
      expect(button.element()).toBeDisabled()
      fireEvent.mouseOver(button.element())
      act(() => vi.advanceTimersByTime(50))
      expect(popup.matches(':popover-open')).toBe(false)
    },
  )

  it('cancels a pending open on suppression and requires a fresh interaction when re-enabled', () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const props = {text: 'Details', onOpenChange, renderAnchor: <Button>Action</Button>, delay: 'medium' as const}
    const {getByText, rerender} = render(<Tooltip {...props} />)
    const popup = getByText('Details')
    const button = page.getByRole('button', {name: 'Action', exact: true}).element()
    fireEvent.mouseOver(button)
    act(() => vi.advanceTimersByTime(399))
    rerender(<Tooltip {...props} disabled />)
    act(() => vi.advanceTimersByTime(1))
    expect(onOpenChange).not.toHaveBeenCalled()
    rerender(<Tooltip {...props} />)
    act(() => vi.advanceTimersByTime(1200))
    expect(popup.matches(':popover-open')).toBe(false)
    fireEvent.mouseOver(button)
    act(() => vi.advanceTimersByTime(400))
    expect(popup.matches(':popover-open')).toBe(true)
    expect(onOpenChange).toHaveBeenCalledOnce()
  })

  it('cancels delayed requests on pointer leave and unmount', () => {
    vi.useFakeTimers()
    const onOpenChange = vi.fn()
    const {unmount} = render(
      <Tooltip text="Details" onOpenChange={onOpenChange} renderAnchor={<Button>Action</Button>} />,
    )
    const button = page.getByRole('button', {name: 'Action', exact: true}).element()
    fireEvent.mouseOver(button)
    fireEvent.mouseLeave(button)
    act(() => vi.advanceTimersByTime(50))
    expect(onOpenChange).not.toHaveBeenCalled()
    fireEvent.mouseOver(button)
    unmount()
    act(() => vi.advanceTimersByTime(50))
    expect(onOpenChange).not.toHaveBeenCalled()
  })
})

describe('experimental element renderAnchor', () => {
  it.runIf(reactMajorVersion >= 19)('preserves React 19 cleanup functions through every composed ref', () => {
    const cleanupTooltip = vi.fn()
    const cleanupButton = vi.fn()
    const tooltipRef = vi.fn((node: HTMLElement | null) => (node ? cleanupTooltip : undefined))
    const buttonRef = vi.fn((node: HTMLButtonElement | null) => (node ? cleanupButton : undefined))
    const {unmount} = render(
      <ActionMenu
        renderAnchor={
          <Tooltip ref={tooltipRef} text="Choose owner" renderAnchor={<Button ref={buttonRef}>Owner</Button>} />
        }
      >
        <ActionMenu.Overlay>Contents</ActionMenu.Overlay>
      </ActionMenu>,
    )
    expect(tooltipRef).toHaveBeenLastCalledWith(page.getByRole('button', {name: 'Owner', exact: true}).element())
    unmount()
    expect(cleanupTooltip).toHaveBeenCalledOnce()
    expect(cleanupButton).toHaveBeenCalledOnce()
    expect(tooltipRef).not.toHaveBeenCalledWith(null)
    expect(buttonRef).not.toHaveBeenCalledWith(null)
  })

  it.each([false, true])('composes one menu button, all refs, and element props (merged-ref flag: %s)', async flag => {
    const anchorRef = createRef<HTMLElement>()
    const tooltipRef = vi.fn()
    const buttonRef = createRef<HTMLButtonElement>()
    const calls: string[] = []
    const parentClick = vi.fn()
    function Example() {
      const [open, setOpen] = useState(false)
      return (
        <div role="presentation" onClick={parentClick} onKeyDown={() => {}}>
          <ActionMenu
            anchorRef={anchorRef}
            open={open}
            onOpenChange={value => {
              calls.push('menu')
              setOpen(value)
            }}
            renderAnchor={
              <Tooltip
                ref={tooltipRef}
                text="Choose owner"
                className="outer"
                style={{color: 'red', padding: 4}}
                renderAnchor={
                  <Button
                    ref={buttonRef}
                    id="owner-trigger"
                    className="inner"
                    style={{color: 'blue'}}
                    onClick={event => {
                      calls.push('element')
                      event.stopPropagation()
                    }}
                  >
                    Owner
                  </Button>
                }
              />
            }
          >
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>Assign me</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </div>
      )
    }
    const {unmount} = render(
      <FeatureFlags flags={{primer_react_merged_forwarded_refs: flag}}>
        <Example />
      </FeatureFlags>,
    )
    const button = page.getByRole('button', {name: 'Owner', exact: true})
    const element = button.element()
    expect(document.querySelectorAll('button')).toHaveLength(1)
    expect(anchorRef.current).toBe(element)
    expect(buttonRef.current).toBe(element)
    expect(tooltipRef).toHaveBeenLastCalledWith(element)
    expect(element).toHaveAttribute('id', 'owner-trigger')
    expect(element).toHaveClass('inner', 'outer')
    expect(element.className.indexOf('inner')).toBeLessThan(element.className.indexOf('outer'))
    expect(element).toHaveStyle({color: 'rgb(0, 0, 255)', padding: '4px'})
    expect(element).toHaveAccessibleDescription('Choose owner')

    await userEvent.click(button)
    expect(calls).toEqual(['element', 'menu'])
    expect(parentClick).not.toHaveBeenCalled()
    await expect.element(button).toHaveAttribute('aria-expanded', 'true')
    await expect.element(page.getByRole('menu', {name: 'Owner', exact: true})).toBeVisible()
    await expect.element(page.getByRole('menuitem', {name: 'Assign me', exact: true})).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect.element(button).toHaveAttribute('aria-expanded', 'false')
    await expect.element(button).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(page.getByRole('menuitem', {name: 'Assign me', exact: true})).toHaveFocus()

    unmount()
    expect(anchorRef.current).toBeNull()
    expect(buttonRef.current).toBeNull()
    expect(tooltipRef).toHaveBeenLastCalledWith(null)
  })

  it('lets the element prevent both pointer and keyboard menu activation without chaining handlers', async () => {
    const onOpenChange = vi.fn()
    render(
      <ActionMenu
        onOpenChange={onOpenChange}
        renderAnchor={
          <Tooltip
            text="Choose owner"
            renderAnchor={
              <Button onClick={event => event.preventDefault()} onKeyDown={event => event.preventDefault()}>
                Owner
              </Button>
            }
          />
        }
      >
        <ActionMenu.Overlay>Menu contents</ActionMenu.Overlay>
      </ActionMenu>,
    )
    const button = page.getByRole('button', {name: 'Owner', exact: true})
    await userEvent.click(button)
    await userEvent.keyboard('{ArrowDown}')
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(button.element()).toHaveAttribute('aria-expanded', 'false')
  })

  it('merges and deduplicates inherited label and description ID lists', () => {
    const {getByText} = render(
      <>
        <span id="label">Owner</span>
        <span id="shared">Shared</span>
        <span id="outer-description">Outer</span>
        <span id="inner-description">Inner</span>
        <ActionMenu
          renderAnchor={
            <Tooltip
              aria-labelledby="label"
              aria-describedby="outer-description shared"
              text="Choose owner"
              renderAnchor={
                <Button aria-labelledby="label" aria-describedby="inner-description shared">
                  Fallback name
                </Button>
              }
            />
          }
        >
          <ActionMenu.Overlay>Menu contents</ActionMenu.Overlay>
        </ActionMenu>
      </>,
    )
    const button = page.getByRole('button', {name: 'Owner', exact: true}).element()
    const tooltip = getByText('Choose owner')
    expect(button).toHaveAttribute('aria-labelledby', 'label')
    const ids = button.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids).toEqual(['inner-description', 'shared', 'outer-description', tooltip.id])
    expect(button).toHaveAccessibleDescription('Inner Shared Outer Choose owner')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('preserves descriptions when the tooltip supplies the accessible name', () => {
    const {getByText} = render(
      <>
        <span id="description">Existing description</span>
        <Tooltip
          text="Information"
          type="label"
          renderAnchor={<button type="button" aria-describedby="description" />}
        />
      </>,
    )
    const button = page.getByRole('button', {name: 'Information', exact: true}).element()
    expect(button).toHaveAttribute('aria-labelledby', getByText('Information').id)
    expect(button).toHaveAccessibleDescription('Existing description')
  })

  it.each([false, true])('does not activate a disabled trigger (native: %s)', native => {
    const onOpenChange = vi.fn()
    render(
      <ActionMenu
        onOpenChange={onOpenChange}
        renderAnchor={
          <Tooltip
            text="Unavailable"
            renderAnchor={
              <button type="button" disabled={native} aria-disabled={native ? undefined : true}>
                Owner
              </button>
            }
          />
        }
      >
        <ActionMenu.Overlay>Menu contents</ActionMenu.Overlay>
      </ActionMenu>,
    )
    const button = page.getByRole('button', {name: 'Owner', exact: true}).element()
    fireEvent.click(button)
    fireEvent.keyDown(button, {key: 'Enter'})
    fireEvent.keyDown(button, {key: 'ArrowDown'})
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const tab = new KeyboardEvent('keydown', {key: 'Tab', bubbles: true, cancelable: true})
    expect(button.dispatchEvent(tab)).toBe(true)
  })

  it('composes a direct overlay with an icon button, description, and focus return', async () => {
    const anchorRef = createRef<HTMLElement>()
    const buttonRef = createRef<HTMLButtonElement>()
    function Example() {
      const [open, setOpen] = useState(false)
      return (
        <AnchoredOverlay
          anchorRef={anchorRef}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderAnchor={
            <Tooltip
              text="Message details"
              type="description"
              renderAnchor={<IconButton ref={buttonRef} icon={InfoIcon} aria-label="View message info" />}
            />
          }
        >
          <Button onClick={() => setOpen(false)}>Close details</Button>
        </AnchoredOverlay>
      )
    }
    const {unmount} = render(<Example />)
    const button = page.getByRole('button', {name: 'View message info', exact: true})
    expect(document.querySelectorAll('button')).toHaveLength(1)
    expect(button.element()).toHaveAccessibleDescription('Message details')
    expect(anchorRef.current).toBe(button.element())
    expect(buttonRef.current).toBe(button.element())
    act(() => button.element().focus())
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(page.getByRole('button', {name: 'Close details', exact: true})).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect.element(button).toHaveAttribute('aria-expanded', 'false')
    await expect.element(button).toHaveFocus()
    unmount()
    expect(anchorRef.current).toBeNull()
    expect(buttonRef.current).toBeNull()
  })

  it('preserves the original overlay callback object ref and single argument', () => {
    const anchorRef = createRef<HTMLElement>()
    const renderAnchor = vi.fn((props: React.HTMLAttributes<HTMLElement>) => (
      <button {...props} type="button">
        Owner
      </button>
    ))
    render(
      <AnchoredOverlay open={false} anchorRef={anchorRef} renderAnchor={renderAnchor}>
        Contents
      </AnchoredOverlay>,
    )
    expect(renderAnchor.mock.calls[0]).toHaveLength(1)
    expect(renderAnchor.mock.calls[0][0]).toHaveProperty('ref', anchorRef)
    expect(anchorRef.current).toBe(page.getByRole('button', {name: 'Owner', exact: true}).element())
  })

  it('preserves configured anchors and legacy Tooltip slot recognition', async () => {
    render(
      <StableActionMenu>
        <Tooltip text="Choose owner">
          <StableActionMenu.Button>Owner</StableActionMenu.Button>
        </Tooltip>
        <StableActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>Assign me</ActionList.Item>
          </ActionList>
        </StableActionMenu.Overlay>
      </StableActionMenu>,
    )
    await userEvent.click(page.getByRole('button', {name: 'Owner', exact: true}))
    await expect.element(page.getByRole('menuitem', {name: 'Assign me', exact: true})).toHaveFocus()
  })

  it.each([false, true])('rejects a configured anchor together with renderAnchor (tooltip: %s)', withTooltip => {
    withExpectedConsoleError(() => {
      expect(() =>
        render(
          <ActionMenu renderAnchor={<Button>Owner</Button>}>
            {withTooltip ? (
              <Tooltip text="Another anchor">
                <ActionMenu.Button>Another anchor</ActionMenu.Button>
              </Tooltip>
            ) : (
              <ActionMenu.Anchor>
                <Button>Another anchor</Button>
              </ActionMenu.Anchor>
            )}
            <ActionMenu.Overlay>Contents</ActionMenu.Overlay>
          </ActionMenu>,
        ),
      ).toThrow('Pass either `renderAnchor` or `ActionMenu.Button`/`ActionMenu.Anchor`, not both.')
    })
  })
})
