import type React from 'react'
import {createRef, useState} from 'react'
import {act, fireEvent, render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {InfoIcon} from '@primer/octicons-react'
import {ActionMenu, AnchoredOverlay, Tooltip} from './TriggerComposition'
import {ActionMenu as StableActionMenu} from '../../ActionMenu'
import {ActionList} from '../../ActionList'
import {Button, IconButton} from '../../Button'
import {FeatureFlags} from '../../FeatureFlags'
import {withExpectedConsoleError} from '../../utils/testing'
import {reactMajorVersion} from '../../utils/environment'

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
