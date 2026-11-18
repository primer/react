import React, {useState} from 'react'
import {act, cleanup, render, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {userEvent} from 'vitest/browser'
import {GearIcon, SlidersIcon} from '@primer/octicons-react'
import {BaseStyles} from '../../BaseStyles'
import {ThemeProvider} from '../../ThemeProvider'
import {resetDevWarningsForTest} from '../../internal/devWarning'
import {Button} from '../Button'
import {Dialog} from '../Dialog'
import {IconButton} from '../IconButton'
import {Tooltip} from '../Tooltip'
import {ActionMenu} from './ActionMenu'
import docs from './ActionMenu.docs.json'

const settle = (ms = 60) => new Promise(resolve => setTimeout(resolve, ms))

function getVisibleTooltips() {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('[data-component="Tooltip.Content"], [data-component="Tooltip.Popup"]'),
  )
  return nodes
    .map(el => {
      const style = window.getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      const dataOpen = el.hasAttribute('data-open')
      const dataClosed = el.hasAttribute('data-closed')
      const visible =
        dataOpen &&
        !dataClosed &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 &&
        rect.height > 0
      return {
        id: el.id || null,
        text: el.textContent.trim(),
        visible,
      }
    })
    .filter(t => t.visible)
}

function Stage({children}: {readonly children: React.ReactNode}) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <div>
          <button
            type="button"
            data-testid="focus-park"
            style={{position: 'fixed', top: 0, left: 0, width: 12, height: 12, padding: 0}}
          >
            park
          </button>
          <div data-testid="stage" style={{padding: '96px'}}>
            {children}
          </div>
        </div>
      </BaseStyles>
    </ThemeProvider>
  )
}

async function resetPointer() {
  const park = document.querySelector<HTMLElement>('[data-testid="focus-park"]')
  if (park) {
    await userEvent.hover(park, {force: true})
  }
}

describe('ActionMenu behavior guardrails parity (Experimental)', () => {
  beforeEach(() => {
    resetDevWarningsForTest()
    document.body.focus()
  })

  afterEach(() => {
    cleanup()
    resetDevWarningsForTest()
    vi.restoreAllMocks()
  })

  const behaviorTests: Record<string, unknown> = {
    'single-button-trigger': it('behavior [single-button-trigger]', async () => {
      const tooltipRefA = React.createRef<HTMLElement>()
      const buttonRef = React.createRef<HTMLButtonElement>()

      const {unmount: unmountButton} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger
                ref={tooltipRefA}
                render={<ActionMenu.Button ref={buttonRef}>Deploy</ActionMenu.Button>}
              />
              <Tooltip.Content>Deploy options</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Staging</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      const stageButtonsA = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-testid="stage"] button'))
      expect(stageButtonsA).toHaveLength(1)
      expect(buttonRef.current).toBe(stageButtonsA[0])
      expect(tooltipRefA.current).toBe(stageButtonsA[0])
      unmountButton()

      const tooltipRefB = React.createRef<HTMLElement>()
      const triggerRef = React.createRef<HTMLButtonElement>()
      const iconRef = React.createRef<HTMLElement>()

      const {unmount: unmountIcon} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger
                ref={tooltipRefB}
                render={
                  <ActionMenu.Trigger
                    ref={triggerRef}
                    render={<IconButton ref={iconRef} icon={SlidersIcon} aria-label="Reasoning effort" />}
                  />
                }
              />
              <Tooltip.Content>Adjust how long the model thinks</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Low</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      const stageButtonsB = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-testid="stage"] button'))
      expect(stageButtonsB).toHaveLength(1)
      expect(triggerRef.current).toBe(stageButtonsB[0])
      expect(iconRef.current).toBe(stageButtonsB[0])
      expect(tooltipRefB.current).toBe(stageButtonsB[0])
      unmountIcon()
    }),

    'menu-inherits-trigger-name': it('behavior [menu-inherits-trigger-name]', async () => {
      const {unmount: unmountText} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Button>More actions</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.Item>Edit</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const textBtn = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      expect(textBtn).toHaveAccessibleName('More actions')
      await userEvent.click(textBtn)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      expect(document.querySelector<HTMLElement>('[role="menu"][data-open]')).toHaveAccessibleName('More actions')
      unmountText()

      const {unmount: unmountIconButton} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Trigger render={<IconButton icon={GearIcon} aria-label="Repository settings" />} />
            <ActionMenu.Content>
              <ActionMenu.Item>Rename</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const iconBtn = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      expect(iconBtn).toHaveAccessibleName('Repository settings')
      await userEvent.click(iconBtn)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      expect(document.querySelector<HTMLElement>('[role="menu"][data-open]')).toHaveAccessibleName(
        'Repository settings',
      )
      unmountIconButton()

      const {unmount: unmountLabelTooltip} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="label">
              <Tooltip.Trigger
                render={
                  <ActionMenu.Trigger
                    render={
                      <button type="button" data-testid="raw-icon-trigger">
                        <GearIcon aria-hidden="true" />
                      </button>
                    }
                  />
                }
              />
              <Tooltip.Content>More options</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Settings</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const rawBtn = document.querySelector<HTMLButtonElement>('[data-testid="raw-icon-trigger"]')!
      expect(rawBtn).toHaveAccessibleName('More options')
      await userEvent.click(rawBtn)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      expect(document.querySelector<HTMLElement>('[role="menu"][data-open]')).toHaveAccessibleName('More options')
      expect(rawBtn).toHaveAccessibleName('More options')
      unmountLabelTooltip()
    }),

    'trigger-tooltip-steps-aside': it('behavior [trigger-tooltip-steps-aside]', async () => {
      const {unmount: unmountExternal} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger render={<ActionMenu.Button>Owner</ActionMenu.Button>} />
              <Tooltip.Content>Choose owner</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Assign me</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const triggerExt = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      await userEvent.hover(triggerExt)
      await expect.poll(() => getVisibleTooltips().length).toBeGreaterThan(0)

      await userEvent.click(triggerExt)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      await expect.poll(() => getVisibleTooltips().length).toBe(0)

      await resetPointer()
      await settle(40)
      await userEvent.hover(triggerExt)
      await settle(120)
      expect(Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      expect(getVisibleTooltips()).toHaveLength(0)

      await resetPointer()
      await settle(40)
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(false)
      await expect.poll(() => document.activeElement === triggerExt).toBe(true)
      await settle(80)
      expect(getVisibleTooltips()).toHaveLength(0)
      unmountExternal()

      const {unmount: unmountIcon} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Trigger
              render={
                <IconButton
                  icon={SlidersIcon}
                  aria-label="Reasoning effort"
                  description="Adjust how long the model thinks"
                />
              }
            />
            <ActionMenu.Content>
              <ActionMenu.Item>Low</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const triggerIcon = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      await userEvent.click(triggerIcon)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      await resetPointer()
      await settle(40)
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(false)
      await expect.poll(() => document.activeElement === triggerIcon).toBe(true)
      await settle(80)
      expect(getVisibleTooltips()).toHaveLength(0)
      unmountIcon()
    }),

    'inactive-controls-stay-focusable': it('behavior [inactive-controls-stay-focusable]', async () => {
      const {unmount: unmountTrigger} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger render={<ActionMenu.Button inactive>Deploy</ActionMenu.Button>} />
              <Tooltip.Content>Locked during release freeze</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Production</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const park = document.querySelector<HTMLButtonElement>('[data-testid="focus-park"]')!
      const inactiveTrigger = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      expect(inactiveTrigger.getAttribute('aria-disabled')).toBe('true')

      act(() => park.focus())
      await userEvent.keyboard('{Tab}')
      await expect.poll(() => document.activeElement === inactiveTrigger).toBe(true)
      await expect
        .poll(() => getVisibleTooltips().some(t => t.text.includes('Locked during release freeze')))
        .toBe(true)

      await userEvent.keyboard('{Enter}')
      await settle(60)
      expect(document.querySelector('[role="menu"][data-open]')).toBeNull()

      await userEvent.keyboard(' ')
      await settle(60)
      expect(document.querySelector('[role="menu"][data-open]')).toBeNull()

      await userEvent.click(inactiveTrigger, {force: true})
      await settle(60)
      expect(document.querySelector('[role="menu"][data-open]')).toBeNull()
      unmountTrigger()

      const onInactiveClick = vi.fn()
      const {unmount: unmountItem} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Button>Repo actions</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.Item>Rename</ActionMenu.Item>
              <ActionMenu.Item inactiveText="Requires owner permission" onClick={onInactiveClick}>
                Transfer
              </ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const activeTrigger = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      await userEvent.click(activeTrigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)

      const renameItem = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el =>
        el.textContent.includes('Rename'),
      )!
      const transferItem = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el =>
        el.textContent.includes('Transfer'),
      )!
      act(() => renameItem.focus())
      await userEvent.keyboard('{ArrowDown}')
      await expect.poll(() => document.activeElement === transferItem).toBe(true)
      expect(transferItem.getAttribute('aria-disabled')).toBe('true')
      expect(transferItem).toHaveAccessibleDescription('Requires owner permission')

      await userEvent.keyboard('{Enter}')
      await userEvent.click(transferItem, {force: true})
      await settle(60)
      expect(Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      expect(onInactiveClick).not.toHaveBeenCalled()
      unmountItem()
    }),

    'escape-closes-topmost-layer': it('behavior [escape-closes-topmost-layer]', async () => {
      function LayeredDialog() {
        const [open, setOpen] = useState(true)
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Settings</Dialog.Title>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body>
                <ActionMenu>
                  <ActionMenu.Button>Menu in dialog</ActionMenu.Button>
                  <ActionMenu.Content>
                    <ActionMenu.Submenu>
                      <ActionMenu.SubmenuTrigger>Submenu</ActionMenu.SubmenuTrigger>
                      <ActionMenu.Content>
                        <ActionMenu.Item>Nested option</ActionMenu.Item>
                      </ActionMenu.Content>
                    </ActionMenu.Submenu>
                    <ActionMenu.Item>Option 1</ActionMenu.Item>
                  </ActionMenu.Content>
                </ActionMenu>
                <IconButton icon={GearIcon} aria-label="Deletion policy info" />
                <Tooltip type="description">
                  <Tooltip.Trigger render={<Button>Learn more</Button>} />
                  <Tooltip.Content>Reads organization policy</Tooltip.Content>
                </Tooltip>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button>Cancel</Button>} />
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        )
      }

      render(
        <Stage>
          <LayeredDialog />
        </Stage>,
      )
      await resetPointer()
      await expect.poll(() => Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      const menuBtn = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(b =>
        b.textContent.includes('Menu in dialog'),
      )!
      await userEvent.click(menuBtn)
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(1)

      const subTrigger = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el =>
        el.textContent.includes('Submenu'),
      )!
      act(() => subTrigger.focus())
      await userEvent.keyboard('{ArrowRight}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(2)

      // 1st Escape: closes only the open submenu
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(1)
      expect(Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      // 2nd Escape: closes only the parent menu, keeping Dialog open
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(0)
      expect(Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      // Hovered IconButton tooltip while focus is elsewhere in Dialog: Escape closes only tooltip
      const cancelBtn = screen.getByRole('button', {name: 'Cancel'})
      const infoBtn = screen.getByRole('button', {name: 'Deletion policy info'})
      const learnBtn = screen.getByRole('button', {name: 'Learn more'})

      act(() => cancelBtn.focus())
      await userEvent.hover(infoBtn)
      await expect.poll(() => getVisibleTooltips().some(t => t.text.includes('Deletion policy info'))).toBe(true)
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => getVisibleTooltips().some(t => t.text.includes('Deletion policy info'))).toBe(false)
      expect(Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      await resetPointer()
      await settle(40)
      act(() => cancelBtn.focus())
      await userEvent.hover(learnBtn)
      await expect.poll(() => getVisibleTooltips().some(t => t.text.includes('Reads organization policy'))).toBe(true)
      await userEvent.keyboard('{Escape}')
      await expect.poll(() => getVisibleTooltips().some(t => t.text.includes('Reads organization policy'))).toBe(false)
      expect(Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)
    }),

    'multiselect-stays-open': it('behavior [multiselect-stays-open]', async () => {
      function SelectionHarness() {
        const [cols, setCols] = useState({a: false, b: false, quick: false})
        const [sort, setSort] = useState<'asc' | 'desc'>('asc')
        return (
          <ActionMenu>
            <ActionMenu.Button>View</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.CheckboxItem
                checked={cols.a}
                onCheckedChange={checked => setCols(prev => ({...prev, a: Boolean(checked)}))}
              >
                Column A
              </ActionMenu.CheckboxItem>
              <ActionMenu.CheckboxItem
                checked={cols.b}
                onCheckedChange={checked => setCols(prev => ({...prev, b: Boolean(checked)}))}
              >
                Column B
              </ActionMenu.CheckboxItem>
              <ActionMenu.CheckboxItem
                closeOnClick
                checked={cols.quick}
                onCheckedChange={checked => setCols(prev => ({...prev, quick: Boolean(checked)}))}
              >
                Apply and close
              </ActionMenu.CheckboxItem>
              <ActionMenu.Divider />
              <ActionMenu.RadioGroup value={sort} onValueChange={v => setSort(v as 'asc' | 'desc')}>
                <ActionMenu.RadioItem value="asc">Ascending</ActionMenu.RadioItem>
                <ActionMenu.RadioItem value="desc">Descending</ActionMenu.RadioItem>
              </ActionMenu.RadioGroup>
              <ActionMenu.Divider />
              <ActionMenu.Item onClick={() => setCols({a: false, b: false, quick: false})}>Reset</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        )
      }

      render(
        <Stage>
          <SelectionHarness />
        </Stage>,
      )
      await resetPointer()
      const trigger = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      await userEvent.click(trigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)

      const colA = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')).find(el =>
        el.textContent.includes('Column A'),
      )!
      const colB = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')).find(el =>
        el.textContent.includes('Column B'),
      )!
      await userEvent.click(colA)
      await expect.poll(() => colA.getAttribute('aria-checked')).toBe('true')
      expect(Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)

      await userEvent.click(colB)
      await expect.poll(() => colB.getAttribute('aria-checked')).toBe('true')
      expect(Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)

      // Overridden CheckboxItem with closeOnClick={true} closes the menu
      const quickItem = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')).find(el =>
        el.textContent.includes('Apply and close'),
      )!
      await userEvent.click(quickItem)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(false)

      // RadioItem closes the menu immediately
      await userEvent.click(trigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      const descRadio = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')).find(el =>
        el.textContent.includes('Descending'),
      )!
      await userEvent.click(descRadio)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(false)

      // Plain Item closes the menu immediately
      await userEvent.click(trigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(true)
      const resetItem = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el =>
        el.textContent.includes('Reset'),
      )!
      await userEvent.click(resetItem)
      await expect.poll(() => Boolean(document.querySelector('[role="menu"][data-open]'))).toBe(false)
    }),

    'submenu-level-navigation': it('behavior [submenu-level-navigation]', async () => {
      render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Button>Issue actions</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.Submenu>
                <ActionMenu.SubmenuTrigger>Move to status</ActionMenu.SubmenuTrigger>
                <ActionMenu.Content>
                  <ActionMenu.RadioGroup value="backlog">
                    <ActionMenu.RadioItem value="backlog">Backlog</ActionMenu.RadioItem>
                    <ActionMenu.RadioItem value="done">Done</ActionMenu.RadioItem>
                  </ActionMenu.RadioGroup>
                </ActionMenu.Content>
              </ActionMenu.Submenu>
              <ActionMenu.Item>Archive</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      await resetPointer()
      const trigger = document.querySelector<HTMLButtonElement>('[data-testid="stage"] button')!
      await userEvent.click(trigger)
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(1)

      const subTrigger = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(el =>
        el.textContent.includes('Move to status'),
      )!
      act(() => subTrigger.focus())
      await userEvent.keyboard('{ArrowRight}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(2)
      await expect
        .poll(() => {
          const menus = Array.from(document.querySelectorAll<HTMLElement>('[role="menu"][data-open]'))
          return menus.length === 2 && menus[1]!.contains(document.activeElement)
        })
        .toBe(true)

      await userEvent.keyboard('{ArrowLeft}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(1)
      expect(document.activeElement).toBe(subTrigger)

      await userEvent.hover(subTrigger)
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(2)

      await userEvent.keyboard('{Escape}')
      await expect.poll(() => document.querySelectorAll('[role="menu"][data-open]').length).toBe(1)
      expect(document.activeElement).toBe(subTrigger)
    }),

    'dialog-returns-focus-to-trigger': it('behavior [dialog-returns-focus-to-trigger]', async () => {
      function MenuToDialog({overrideReturnTarget}: {readonly overrideReturnTarget?: boolean}) {
        const [dialogOpen, setDialogOpen] = useState(false)
        const alternateRef = React.useRef<HTMLButtonElement>(null)
        return (
          <>
            <ActionMenu>
              <ActionMenu.Button>Repository actions</ActionMenu.Button>
              <ActionMenu.Content>
                <ActionMenu.Item onClick={() => setDialogOpen(true)}>Delete repository...</ActionMenu.Item>
              </ActionMenu.Content>
            </ActionMenu>
            <Button ref={alternateRef}>Fallback action</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Dialog.Content finalFocus={overrideReturnTarget ? alternateRef : undefined}>
                <Dialog.Header>
                  <Dialog.Title>Delete repository?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>Confirm deletion</Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button>Cancel</Button>} />
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </>
        )
      }

      const {rerender} = render(
        <Stage>
          <MenuToDialog />
        </Stage>,
      )
      await resetPointer()
      const stageButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-testid="stage"] button'))
      const menuTrigger = stageButtons[0]!
      const alternateButton = stageButtons[1]!

      await userEvent.click(menuTrigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menuitem"]'))).toBe(true)
      await userEvent.click(document.querySelector<HTMLElement>('[role="menuitem"]')!)
      await expect.poll(() => Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      await userEvent.keyboard('{Escape}')
      await expect.poll(() => Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(false)
      await expect.poll(() => document.activeElement === menuTrigger).toBe(true)

      // Verify Dialog.Content.finalFocus override
      rerender(
        <Stage>
          <MenuToDialog overrideReturnTarget />
        </Stage>,
      )
      await userEvent.click(menuTrigger)
      await expect.poll(() => Boolean(document.querySelector('[role="menuitem"]'))).toBe(true)
      await userEvent.click(document.querySelector<HTMLElement>('[role="menuitem"]')!)
      await expect.poll(() => Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(true)

      await userEvent.keyboard('{Escape}')
      await expect.poll(() => Boolean(document.querySelector('[role="dialog"][data-open]'))).toBe(false)
      await expect.poll(() => document.activeElement === alternateButton).toBe(true)
    }),
  }

  const allDocBehaviors = [...docs.builtInBehaviors, ...docs.defaultBehaviors]

  it('maintains exact 1:1 parity with every behavior ID in ActionMenu.docs.json', () => {
    expect(Object.keys(behaviorTests).sort()).toEqual(allDocBehaviors.map(b => b.id).sort())
  })

  const devWarningTests: Record<string, unknown> = {
    'no-nested-button-in-trigger': it('bestPractice dev-warning [no-nested-button-in-trigger]', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const {unmount: unmountInvalid} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Button>
              <IconButton icon={GearIcon} aria-label="Nested icon button" />
            </ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.Item>Edit</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(warnSpy.mock.calls.some(call => call.join(' ').includes('[ActionMenu/no-nested-button-in-trigger]'))).toBe(
        true,
      )
      unmountInvalid()

      warnSpy.mockClear()
      resetDevWarningsForTest()

      const {unmount: unmountValid} = render(
        <Stage>
          <ActionMenu>
            <ActionMenu.Trigger render={<IconButton icon={GearIcon} aria-label="Composed icon button" />} />
            <ActionMenu.Content>
              <ActionMenu.Item>Edit</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(warnSpy).not.toHaveBeenCalled()
      unmountValid()
    }),

    'no-item-selected-for-state': it('bestPractice dev-warning [no-item-selected-for-state]', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const {unmount: unmountInvalid} = render(
        <Stage>
          <ActionMenu defaultOpen>
            <ActionMenu.Button>Sort</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.Item selected>Newest</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(warnSpy.mock.calls.some(call => call.join(' ').includes('[ActionMenu/no-item-selected-for-state]'))).toBe(
        true,
      )
      unmountInvalid()

      warnSpy.mockClear()
      resetDevWarningsForTest()

      const {unmount: unmountValid} = render(
        <Stage>
          <ActionMenu defaultOpen>
            <ActionMenu.Button>Sort and filter</ActionMenu.Button>
            <ActionMenu.Content>
              <ActionMenu.RadioGroup value="newest">
                <ActionMenu.RadioItem value="newest">Newest</ActionMenu.RadioItem>
                <ActionMenu.RadioItem value="oldest">Oldest</ActionMenu.RadioItem>
              </ActionMenu.RadioGroup>
              <ActionMenu.Divider />
              <ActionMenu.CheckboxItem checked>Assigned to me</ActionMenu.CheckboxItem>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(warnSpy).not.toHaveBeenCalled()
      unmountValid()
    }),

    'no-tooltip-on-native-disabled': it('bestPractice dev-warning [no-tooltip-on-native-disabled]', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const {unmount: unmountInvalid} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger render={<ActionMenu.Button disabled>Deploy</ActionMenu.Button>} />
              <Tooltip.Content>Locked during release freeze</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Production</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(
        warnSpy.mock.calls.some(call => call.join(' ').includes('[ActionMenu/no-tooltip-on-native-disabled]')),
      ).toBe(true)
      unmountInvalid()

      warnSpy.mockClear()
      resetDevWarningsForTest()

      const {unmount: unmountValid} = render(
        <Stage>
          <ActionMenu>
            <Tooltip type="description">
              <Tooltip.Trigger render={<ActionMenu.Button inactive>Deploy</ActionMenu.Button>} />
              <Tooltip.Content>Locked during release freeze</Tooltip.Content>
            </Tooltip>
            <ActionMenu.Content>
              <ActionMenu.Item>Production</ActionMenu.Item>
            </ActionMenu.Content>
          </ActionMenu>
        </Stage>,
      )
      expect(warnSpy).not.toHaveBeenCalled()
      unmountValid()
    }),

    'no-content-inside-submenu-trigger':
      it('bestPractice dev-warning [no-content-inside-submenu-trigger]', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const {unmount: unmountInvalid} = render(
          <Stage>
            <ActionMenu defaultOpen>
              <ActionMenu.Button>Actions</ActionMenu.Button>
              <ActionMenu.Content>
                <ActionMenu.Submenu>
                  <ActionMenu.SubmenuTrigger>
                    Move to
                    <ActionMenu.Content>
                      <ActionMenu.Item>Done</ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu.SubmenuTrigger>
                </ActionMenu.Submenu>
              </ActionMenu.Content>
            </ActionMenu>
          </Stage>,
        )
        expect(
          warnSpy.mock.calls.some(call => call.join(' ').includes('[ActionMenu/no-content-inside-submenu-trigger]')),
        ).toBe(true)
        unmountInvalid()

        warnSpy.mockClear()
        resetDevWarningsForTest()

        const {unmount: unmountValid} = render(
          <Stage>
            <ActionMenu defaultOpen>
              <ActionMenu.Button>Actions</ActionMenu.Button>
              <ActionMenu.Content>
                <ActionMenu.Submenu>
                  <ActionMenu.SubmenuTrigger>Move to</ActionMenu.SubmenuTrigger>
                  <ActionMenu.Content>
                    <ActionMenu.Item>Done</ActionMenu.Item>
                  </ActionMenu.Content>
                </ActionMenu.Submenu>
              </ActionMenu.Content>
            </ActionMenu>
          </Stage>,
        )
        expect(warnSpy).not.toHaveBeenCalled()
        unmountValid()
      }),
  }

  const runtimeGuidelines = docs.usageGuidelines.filter(g => g.check === 'runtime')

  it('maintains exact 1:1 parity with every runtime usageGuideline ID in ActionMenu.docs.json', () => {
    expect(Object.keys(devWarningTests).sort()).toEqual(runtimeGuidelines.map(g => g.id).sort())
  })
})
