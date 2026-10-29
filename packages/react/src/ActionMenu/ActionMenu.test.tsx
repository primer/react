import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi, beforeEach} from 'vitest'
import {render as HTMLRender, waitFor, act} from '@testing-library/react'
import type React from 'react'
import {useRef, useState} from 'react'
import BaseStyles from '../BaseStyles'
import {ActionMenu} from '.'
import {ActionList} from '../ActionList'
import {Button, IconButton} from '../Button'
import {Dialog} from '../Dialog'
import Tooltip from '../Tooltip'
import {Tooltip as TooltipV2} from '../TooltipV2/Tooltip'
import {SingleSelect} from '../ActionMenu/ActionMenu.features.stories'
import {MixedSelection} from '../ActionMenu/ActionMenu.examples.stories'
import {SearchIcon, KebabHorizontalIcon} from '@primer/octicons-react'
import {getAnchoredPosition} from '@primer/behaviors'
import type {AnchorPosition} from '@primer/behaviors'

import type {JSX} from 'react'
import {implementsClassName} from '../utils/testing'
import {FeatureFlags} from '../FeatureFlags'

// Mock getAnchoredPosition for feature flag tests
vi.mock('@primer/behaviors', async () => {
  const actual = await vi.importActual('@primer/behaviors')
  return {
    ...actual,
    getAnchoredPosition: vi.fn(
      (
        _floatingElement: Element,
        _anchorElement: Element | DOMRect,
        _settings?: Partial<{displayInViewport?: boolean}>,
      ) =>
        ({
          top: 100,
          left: 100,
          anchorSide: 'outside-bottom',
          anchorAlign: 'start',
        }) as AnchorPosition,
    ),
  }
})

function Example({preventFocusOnClose}: {preventFocusOnClose?: boolean} = {}): JSX.Element {
  return (
    <BaseStyles>
      <ActionMenu>
        <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        <ActionMenu.Overlay preventFocusOnClose={preventFocusOnClose}>
          <ActionList>
            <ActionList.Item>New file</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item>Copy link</ActionList.Item>
            <ActionList.Item>Edit file</ActionList.Item>
            <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
              Delete file
            </ActionList.Item>
            <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
              Github
            </ActionList.LinkItem>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </BaseStyles>
  )
}

function ExampleWithTooltip(): JSX.Element {
  return (
    <BaseStyles>
      <Tooltip aria-label="Additional context about the menu button" direction="s">
        <ActionMenu>
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Tooltip>
    </BaseStyles>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ExampleWithTooltipV2(actionMenuTrigger: React.ReactElement<any>): JSX.Element {
  return (
    <BaseStyles>
      <ActionMenu>
        {actionMenuTrigger}
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>New file</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </BaseStyles>
  )
}

function ExampleWithReplaceableAnchor(): JSX.Element {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [anchorKey, setAnchorKey] = useState(0)

  return (
    <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
      <BaseStyles>
        <Button key={anchorKey} ref={anchorRef} onClick={() => setOpen(o => !o)}>
          Open menu
        </Button>
        <ActionMenu anchorRef={anchorRef} open={open} onOpenChange={setOpen}>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item
                onSelect={event => {
                  // Prevent the menu from closing so the overlay stays mounted
                  event.preventDefault()
                  setAnchorKey(k => k + 1)
                }}
              >
                Switch anchor
              </ActionList.Item>
              <ActionList.Item>Item one</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </BaseStyles>
    </FeatureFlags>
  )
}

function ExampleWithSubmenus(): JSX.Element {
  return (
    <BaseStyles>
      <ActionMenu>
        <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        <ActionMenu.Overlay>
          <ActionList>
            <ActionList.Item>New file</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item>Copy link</ActionList.Item>
            <ActionList.Item>Edit file</ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item>Paste</ActionList.Item>
            <ActionMenu>
              <ActionMenu.Anchor>
                <ActionList.Item>Paste special</ActionList.Item>
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>Paste plain text</ActionList.Item>
                  <ActionList.Item>Paste formulas</ActionList.Item>
                  <ActionList.Item>Paste with formatting</ActionList.Item>
                  <ActionMenu>
                    <ActionMenu.Anchor>
                      <ActionList.Item>Paste from</ActionList.Item>
                    </ActionMenu.Anchor>
                    <ActionMenu.Overlay>
                      <ActionList>
                        <ActionList.Item
                          onSelect={() => {
                            /*noop*/
                          }}
                        >
                          Current clipboard
                        </ActionList.Item>
                        <ActionList.Item>History</ActionList.Item>
                        <ActionList.Item>Another device</ActionList.Item>
                      </ActionList>
                    </ActionMenu.Overlay>
                  </ActionMenu>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </BaseStyles>
  )
}

describe('ActionMenu', () => {
  implementsClassName(ActionMenu.Button)

  it('renders data-component attributes for ActionMenu parts', async () => {
    const component = HTMLRender(<Example />)

    const trigger = page.getByRole('button', {name: 'Toggle Menu', exact: true})
    await expect.element(trigger).toHaveAttribute('data-component', 'ActionMenu.Button')

    await userEvent.click(trigger)

    expect(component.baseElement.querySelector('[data-component="ActionMenu.Overlay"]')).not.toBeNull()
    expect(component.baseElement.querySelector('[data-component="AnchoredOverlay"]')).toBeNull()
  })

  it('should open Menu on MenuButton click', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should open Menu on MenuButton keypress', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    act(() => {
      button.element().focus()
    })
    await userEvent.keyboard('{Enter}')

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should close Menu on selecting an action with click', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    const menuItems = page.getByRole('menuitem').all()
    await userEvent.click(menuItems[0])

    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    const menuItems = page.getByRole('menuitem').all()
    act(() => {
      menuItems[0].element().focus()
    })
    await userEvent.keyboard('{Enter}')

    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
  })

  describe('preventFocusOnClose', () => {
    it.each([
      {gesture: 'item-click', preventFocusOnClose: undefined},
      {gesture: 'item-click', preventFocusOnClose: false},
      {gesture: 'item-click', preventFocusOnClose: true},
      {gesture: 'Enter', preventFocusOnClose: true},
      {gesture: 'Space', preventFocusOnClose: true},
      {gesture: 'Escape', preventFocusOnClose: undefined},
      {gesture: 'Escape', preventFocusOnClose: false},
      {gesture: 'Escape', preventFocusOnClose: true},
      {gesture: 'outside-click', preventFocusOnClose: true},
    ])('handles $gesture with preventFocusOnClose=$preventFocusOnClose', async ({gesture, preventFocusOnClose}) => {
      HTMLRender(
        <>
          <Example preventFocusOnClose={preventFocusOnClose} />
          <Button>Outside</Button>
        </>,
      )
      const trigger = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      const triggerElement = trigger.element()
      await userEvent.click(trigger)
      const item = page.getByRole('menuitem', {name: 'New file', exact: true})
      act(() => {
        item.element().focus()
      })

      const focus = vi.spyOn(triggerElement, 'focus')
      if (gesture === 'item-click') {
        await userEvent.click(item)
      } else if (gesture === 'outside-click') {
        await userEvent.click(page.getByRole('button', {name: 'Outside', exact: true}))
      } else {
        await userEvent.keyboard(gesture === 'Space' ? ' ' : `{${gesture}}`)
      }

      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
      if (preventFocusOnClose) {
        expect(focus).not.toHaveBeenCalled()
        await expect.element(trigger).not.toHaveFocus()
      } else {
        expect(focus).toHaveBeenCalled()
        await expect.element(trigger).toHaveFocus()
      }
      if (gesture === 'outside-click') {
        await expect.element(page.getByRole('button', {name: 'Outside', exact: true})).toHaveFocus()
      }
    })

    it.each([undefined, false, true])(
      'handles anchor-click closure with preventFocusOnClose=%s',
      async preventFocusOnClose => {
        const returnFocusRef = {current: null as HTMLButtonElement | null}
        HTMLRender(
          <BaseStyles>
            <Button ref={returnFocusRef}>Return focus</Button>
            <ActionMenu>
              <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay preventFocusOnClose={preventFocusOnClose} returnFocusRef={returnFocusRef}>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>,
        )
        const trigger = page.getByRole('button', {name: 'Toggle Menu', exact: true})
        const returnFocusTarget = page.getByRole('button', {name: 'Return focus', exact: true})

        await userEvent.click(trigger)
        const focus = vi.spyOn(returnFocusTarget.element(), 'focus')
        await userEvent.click(trigger)

        await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
        if (preventFocusOnClose) {
          expect(focus).not.toHaveBeenCalled()
          await expect.element(returnFocusTarget).not.toHaveFocus()
        } else {
          expect(focus).toHaveBeenCalled()
          await expect.element(returnFocusTarget).toHaveFocus()
        }
      },
    )

    it('skips restoration to a custom returnFocusRef on controlled closure', async () => {
      const returnFocusRef = {current: document.createElement('button')}
      const example = (open: boolean) => (
        <BaseStyles>
          <ActionMenu open={open} onOpenChange={() => {}}>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay preventFocusOnClose returnFocusRef={returnFocusRef}>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </BaseStyles>
      )
      const component = HTMLRender(example(true))
      const focus = vi.spyOn(returnFocusRef.current, 'focus')

      await expect.element(page.getByRole('menuitem', {name: 'New file', exact: true})).toHaveFocus()
      component.rerender(example(false))

      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
      expect(focus).not.toHaveBeenCalled()
      await expect.element(page.getByRole('button', {name: 'Toggle Menu', exact: true})).not.toHaveFocus()
    })

    it('does not focus a captured anchor that an action replaces', async () => {
      function ReplaceableAnchor() {
        const [preview, setPreview] = useState(false)

        return (
          <BaseStyles>
            <ActionMenu>
              <ActionMenu.Anchor>
                <Button key={preview ? 'preview' : 'link'}>{preview ? 'Preview' : 'Link'}</Button>
              </ActionMenu.Anchor>
              <ActionMenu.Overlay preventFocusOnClose>
                <ActionList>
                  <ActionList.Item onSelect={() => setPreview(true)}>Convert to preview</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        )
      }
      HTMLRender(<ReplaceableAnchor />)
      const trigger = page.getByRole('button', {name: 'Link', exact: true})
      const triggerElement = trigger.element()
      await userEvent.click(trigger)
      const focus = vi.spyOn(triggerElement, 'focus')

      await userEvent.click(page.getByRole('menuitem', {name: 'Convert to preview', exact: true}))

      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
      expect(triggerElement).not.toBeInTheDocument()
      await expect.element(page.getByRole('button', {name: 'Preview', exact: true})).not.toHaveFocus()
      expect(focus).not.toHaveBeenCalled()
    })
  })

  it('should not close Menu if event is prevented', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    const menuItems = page.getByRole('menuitem').all()
    await userEvent.click(menuItems[3])

    // menu should still be open
    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should be able to select an Item with selectionVariant', async () => {
    HTMLRender(<SingleSelect />)
    const button = page.getByRole('button', {name: /^options/i})

    await userEvent.click(button)

    // select first item by role, that would close the menu
    await userEvent.click(page.getByRole('menuitemradio').all()[0])
    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

    // open menu again and check if the first option is checked
    await userEvent.click(button)
    await expect.element(page.getByRole('menuitemradio').all()[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('should assign the right roles with groups & mixed selectionVariant', async () => {
    HTMLRender(<MixedSelection />)

    const button = page.getByRole('button', {
      name: 'Group by Stage',
      exact: true,
    })

    await userEvent.click(button)

    await expect.element(page.getByLabelText('Status', {exact: true})).toHaveAttribute('role', 'menuitemradio')
    await expect.element(page.getByLabelText('Clear Group by', {exact: true})).toHaveAttribute('role', 'menuitem')
  })

  it('should be able to select an Item with aria-keyshortcuts after opening Menu with click', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()

    // linkItem button is the active element at this point
    await userEvent.keyboard('{ArrowDown}{s}')

    await expect.element(page.getByRole('menuitem').all()[4]).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect.element(page.getByRole('menuitem').all()[3]).toHaveFocus()

    // assumes mnemonics aria-keyshortcuts are ignored
    await userEvent.keyboard('{g}')
    await expect.element(page.getByRole('menuitem').all()[3]).toHaveFocus()
  })

  it('should select last element when ArrowUp is pressed after opening Menu with click', async () => {
    HTMLRender(<Example />)

    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()

    // button should be the active element
    // assumes button is the active element at this point
    await userEvent.keyboard('{ArrowUp}')

    await expect.element(page.getByRole('menuitem').last()).toHaveFocus()
  })

  it('should close the menu if Tab is pressed and move to next element', async () => {
    HTMLRender(
      <>
        <Example />
        <input type="text" placeholder="next focusable element" />
      </>,
    )
    const anchor = page.getByRole('button')

    await userEvent.tab() // tab into the story, this should focus on the first button
    await expect.element(anchor).toHaveFocus() // trust, but verify

    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByRole('menu')).toBeInTheDocument()
    await expect.element(page.getByRole('menuitem').all()[0]).toHaveFocus()

    await userEvent.tab()
    await expect.element(page.getByPlaceholder('next focusable element')).toHaveFocus()
    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
  })

  it('should wrap focus when ArrowDown is pressed on the last element', async () => {
    HTMLRender(<Example />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
    const menuItems = page.getByRole('menuitem').all()

    // TODO: Fix the focus trap from taking over focus control
    // https://github.com/primer/react/issues/6434

    // expect(menuItems[0]).toEqual(document.activeElement)

    await userEvent.keyboard('{ArrowDown}')
    await expect.element(menuItems[1]).toHaveFocus()

    // TODO: Removed one ArrowDown to account for the focus trap starting at the second element
    // await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(menuItems[menuItems.length - 1]).toHaveFocus() // last elememt

    await userEvent.keyboard('{ArrowDown}')
    await expect.element(menuItems[0]).toHaveFocus() // wrap to first
  })

  it('should open menu on menu button click and it is wrapped with tooltip', async () => {
    HTMLRender(<ExampleWithTooltip />)
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should open menu on menu button click and it is wrapped with tooltip v2', async () => {
    HTMLRender(
      ExampleWithTooltipV2(
        <TooltipV2 text="Additional context about the menu button" direction="s">
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        </TooltipV2>,
      ),
    )
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should display tooltip when menu button is focused', async () => {
    HTMLRender(<ExampleWithTooltip />)
    const button = page.getByRole('button')
    act(() => {
      button.element().focus()
    })
    await expect.element(page.getByRole('tooltip')).toBeInTheDocument()
  })

  it('should display tooltip v2 when menu button is focused', async () => {
    HTMLRender(
      ExampleWithTooltipV2(
        <TooltipV2 text="Additional context about the menu button" direction="s">
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        </TooltipV2>,
      ),
    )
    const button = page.getByRole('button')
    act(() => {
      button.element().focus()
    })

    await expect.element(page.getByRole('tooltip', {includeHidden: true})).toBeInTheDocument()
  })

  it('should open menu on menu anchor click and it is wrapped with tooltip v2', async () => {
    HTMLRender(
      ExampleWithTooltipV2(
        <ActionMenu.Anchor>
          <TooltipV2 text="Additional context about the menu button" direction="n">
            <Button>Toggle Menu</Button>
          </TooltipV2>
        </ActionMenu.Anchor>,
      ),
    )
    const button = page.getByRole('button')

    await userEvent.click(button)

    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('should display tooltip v2 and menu anchor is focused', async () => {
    HTMLRender(
      ExampleWithTooltipV2(
        <ActionMenu.Anchor>
          <TooltipV2 text="Additional context about the menu button" direction="n">
            <Button>Toggle Menu</Button>
          </TooltipV2>
        </ActionMenu.Anchor>,
      ),
    )
    const button = page.getByRole('button')
    act(() => {
      button.element().focus()
    })

    await expect.element(page.getByRole('tooltip', {includeHidden: true})).toBeInTheDocument()
  })

  it('should pass the "id" prop from ActionMenu.Button to the HTML button', async () => {
    const buttonId = 'toggle-menu-custom-id'
    HTMLRender(
      <BaseStyles>
        <ActionMenu>
          <ActionMenu.Button id={buttonId}>Toggle Menu</ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item>Copy link</ActionList.Item>
              <ActionList.Item>Edit file</ActionList.Item>
              <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                Delete file
              </ActionList.Item>
              <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                Github
              </ActionList.LinkItem>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </BaseStyles>,
    )
    const button = page.getByRole('button')

    expect(button.element().id).toBe(buttonId)
  })
  it('should pass the "id" prop from ActionMenu.Anchor to anchor child', async () => {
    const buttonId = 'toggle-menu-custom-id'
    HTMLRender(
      <BaseStyles>
        <ActionMenu>
          <ActionMenu.Anchor id={buttonId}>
            <IconButton icon={KebabHorizontalIcon} aria-label="Open menu" />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item>Copy link</ActionList.Item>
              <ActionList.Item>Edit file</ActionList.Item>
              <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                Delete file
              </ActionList.Item>
              <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                Github
              </ActionList.LinkItem>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </BaseStyles>,
    )
    const button = page.getByRole('button')

    expect(button.element().id).toBe(buttonId)
  })

  it('should use the tooltip id to name the menu when the anchor is icon button', async () => {
    HTMLRender(
      <BaseStyles>
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton icon={SearchIcon} aria-label="More actions" />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Copy link clicked')}>
                Copy link
                <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </BaseStyles>,
    )

    const toggleButton = page.getByRole('button', {name: 'More actions', exact: true})
    await userEvent.click(toggleButton)
    await expect.element(toggleButton).toHaveAttribute('aria-labelledby')
    await expect
      .element(page.getByRole('menu'))
      .toHaveAttribute('aria-labelledby', toggleButton.element().getAttribute('aria-labelledby'))
  })

  describe('submenus', () => {
    it('sets `aria-haspopup` and `aria-expanded` on submenu anchors', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(baseAnchor)

      const submenuAnchor = page.getByRole('menuitem', {name: 'Paste special', exact: true})
      await expect.element(submenuAnchor).toHaveAttribute('aria-haspopup')
      await userEvent.click(submenuAnchor)
      await expect.element(submenuAnchor).toHaveAttribute('aria-expanded')

      const subSubmenuAnchor = page.getByRole('menuitem', {name: 'Paste from', exact: true})
      await expect.element(subSubmenuAnchor).toHaveAttribute('aria-haspopup')
      await userEvent.click(subSubmenuAnchor)
      await expect.element(subSubmenuAnchor).toHaveAttribute('aria-expanded')
    })

    it('sets labels on submenus', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(baseAnchor)

      const submenuAnchor = page.getByRole('menuitem', {name: 'Paste special', exact: true})
      await userEvent.click(submenuAnchor)

      const submenu = page.getByRole('menu', {name: 'Paste special', exact: true})
      await expect.element(submenu).toBeVisible()

      const subSubmenuAnchor = submenu.getByRole('menuitem', {name: 'Paste from', exact: true})
      await userEvent.click(subSubmenuAnchor)

      const subSubmenu = page.getByRole('menu', {name: 'Paste from', exact: true})

      await expect.element(subSubmenu).toBeVisible()
    })

    it('does not open top-level menu on right arrow key press', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      act(() => {
        baseAnchor.element().focus()
      })

      await userEvent.keyboard('{ArrowRight}')
      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()
      await expect.element(baseAnchor).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('opens submenus on enter or right arrow key press', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(baseAnchor)

      const submenuAnchor = page.getByRole('menuitem', {name: 'Paste special', exact: true})
      await expect.element(submenuAnchor).toHaveAttribute('aria-haspopup', 'true')
      act(() => {
        submenuAnchor.element().focus()
      })
      await userEvent.keyboard('{Enter}')
      await expect.element(submenuAnchor).toHaveAttribute('aria-expanded', 'true')

      const subSubmenuAnchor = page.getByRole('menuitem', {name: 'Paste from', exact: true})
      act(() => {
        subSubmenuAnchor.element().focus()
      })
      await userEvent.keyboard('{ArrowRight}')
      await expect.element(subSubmenuAnchor).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes top menu on escape or left arrow key press', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(baseAnchor)

      const submenuAnchor = page.getByRole('menuitem', {name: 'Paste special', exact: true})
      await userEvent.click(submenuAnchor)

      const subSubmenuAnchor = page.getByRole('menuitem', {name: 'Paste from', exact: true})
      await userEvent.click(subSubmenuAnchor)

      await expect.element(subSubmenuAnchor).toHaveAttribute('aria-expanded', 'true')

      await userEvent.keyboard('{Escape}')
      await expect.element(subSubmenuAnchor).not.toHaveAttribute('aria-expanded', 'true')
      await expect.element(submenuAnchor).toHaveAttribute('aria-expanded', 'true')

      await userEvent.keyboard('{ArrowLeft}')
      await expect.element(submenuAnchor).not.toHaveAttribute('aria-expanded', 'true')

      await expect.element(baseAnchor).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes all menus when an item is selected', async () => {
      HTMLRender(<ExampleWithSubmenus />)

      const baseAnchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(baseAnchor)

      const submenuAnchor = page.getByRole('menuitem', {name: 'Paste special', exact: true})
      await userEvent.click(submenuAnchor)

      const subSubmenuAnchor = page.getByRole('menuitem', {name: 'Paste from', exact: true})
      await userEvent.click(subSubmenuAnchor)

      const subSubmenuItem = page.getByRole('menuitem', {name: 'Current clipboard', exact: true})
      await userEvent.click(subSubmenuItem)

      await expect.element(baseAnchor).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('supports className prop on ActionMenu.Anchor with css anchor positioning flag', async () => {
      HTMLRender(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <ActionMenu>
              <ActionMenu.Anchor className="test-class">
                <Button>Toggle Menu</Button>
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Edit file</ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                    Delete file
                  </ActionList.Item>
                  <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                    GitHub
                  </ActionList.LinkItem>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </FeatureFlags>,
      )
      const anchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await expect.element(anchor).toHaveClass('test-class')
    })

    it('supports className prop on ActionMenu.Button with css anchor positioning flag', async () => {
      HTMLRender(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
          <BaseStyles>
            <ActionMenu>
              <ActionMenu.Button className="test-class">Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Edit file</ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                    Delete file
                  </ActionList.Item>
                  <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                    GitHub
                  </ActionList.LinkItem>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </FeatureFlags>,
      )
      const button = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await expect.element(button).toHaveClass('test-class')
    })

    it('supports className prop on ActionMenu.Anchor', async () => {
      HTMLRender(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <BaseStyles>
            <ActionMenu>
              <ActionMenu.Anchor className="test-class">
                <Button>Toggle Menu</Button>
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Edit file</ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                    Delete file
                  </ActionList.Item>
                  <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                    GitHub
                  </ActionList.LinkItem>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </FeatureFlags>,
      )
      const anchor = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await expect.element(anchor).toHaveClass('test-class')
    })

    it('supports className prop on ActionMenu.Button', async () => {
      HTMLRender(
        <FeatureFlags flags={{primer_react_css_anchor_positioning: false}}>
          <BaseStyles>
            <ActionMenu>
              <ActionMenu.Button className="test-class">Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Edit file</ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                    Delete file
                  </ActionList.Item>
                  <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                    Github
                  </ActionList.LinkItem>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </FeatureFlags>,
      )
      const button = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await expect.element(button).toHaveClass('test-class')
    })

    it('keeps anchor-name and position-anchor linked when the anchor is replaced while the menu is open', async () => {
      const component = HTMLRender(<ExampleWithReplaceableAnchor />)

      const initialAnchor = page.getByRole('button', {name: 'Open menu', exact: true})
      const initialAnchorElement = initialAnchor.element()
      await userEvent.click(initialAnchor)

      const overlay = component.baseElement.querySelector('[data-component="ActionMenu.Overlay"]') as HTMLElement
      expect(overlay).not.toBeNull()

      const initialAnchorName = initialAnchor.element().style.getPropertyValue('anchor-name')
      const initialPositionAnchor = overlay.style.getPropertyValue('position-anchor')
      expect(initialAnchorName).not.toBe('')
      expect(initialPositionAnchor).not.toBe('')
      expect(initialPositionAnchor).toBe(initialAnchorName)

      // Click the item that remounts the anchor while keeping the menu open
      const switchItem = page.getByRole('menuitem', {name: 'Switch anchor', exact: true})
      await userEvent.click(switchItem)

      const newAnchor = page.getByRole('button', {name: 'Open menu', exact: true})
      expect(newAnchor.element()).not.toBe(initialAnchorElement)

      // The new anchor should have the same anchor-name re-applied, and the
      // overlay should still reference it via position-anchor.
      expect(newAnchor.element().style.getPropertyValue('anchor-name')).toBe(initialAnchorName)
      expect(overlay.style.getPropertyValue('position-anchor')).toBe(initialPositionAnchor)
    })
  })

  describe('calls event handlers on trigger', () => {
    it('should call onClick and onKeyDown passed to ActionMenu.Button', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      HTMLRender(
        <ActionMenu>
          <ActionMenu.Button onClick={mockOnClick} onKeyDown={mockOnKeyDown}>
            Open menu
          </ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = page.getByRole('menuitem').all()
      await userEvent.click(menuItems[0])
      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

      await expect.element(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to IconButton inside ActionMenu.Anchor', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      HTMLRender(
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton
              icon={KebabHorizontalIcon}
              aria-label="Open menu"
              onClick={mockOnClick}
              onKeyDown={mockOnKeyDown}
            />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = page.getByRole('menuitem').all()
      await userEvent.click(menuItems[0])
      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

      await expect.element(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to ActionMenu.Button with Tooltip', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      HTMLRender(
        <ActionMenu>
          <TooltipV2 text="Additional context about the menu button" direction="s">
            <ActionMenu.Button onClick={mockOnClick} onKeyDown={mockOnKeyDown}>
              Open menu
            </ActionMenu.Button>
          </TooltipV2>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = page.getByRole('menuitem').all()
      await userEvent.click(menuItems[0])
      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

      await expect.element(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to IconButton inside ActionMenu.Anchor with Tooltip', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      HTMLRender(
        <ActionMenu>
          <ActionMenu.Anchor>
            <TooltipV2 text="Additional context about the menu button" direction="s">
              <IconButton
                icon={KebabHorizontalIcon}
                aria-label="Open menu"
                onClick={mockOnClick}
                onKeyDown={mockOnKeyDown}
              />
            </TooltipV2>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
              <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      await userEvent.unhover(button)

      // select and close menu
      const menuItems = page.getByRole('menuitem').all()
      await userEvent.click(menuItems[0])
      await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

      await expect.element(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect.element(page.getByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('displayInViewport behavior', () => {
    const mockGetAnchoredPosition = vi.mocked(getAnchoredPosition)

    beforeEach(() => {
      // Reset mock before each test
      mockGetAnchoredPosition.mockClear()
    })

    it('should enable displayInViewport when ActionMenu is inside a dialog', async () => {
      // When the ActionMenu is wrapped in a Dialog, it's inside a dialog context.
      // displayInViewport should be automatically enabled.
      HTMLRender(
        <Dialog onClose={() => {}}>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Dialog>,
      )

      const button = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()

      // Verify getAnchoredPosition was called with displayInViewport: true
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).toBe(true)
    })

    it('should not enable displayInViewport when ActionMenu is NOT inside a dialog', async () => {
      // Without being wrapped in a Dialog, the ActionMenu is not in a dialog context.
      // displayInViewport should remain at its default (false/undefined).
      HTMLRender(
        <ActionMenu>
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()

      // Verify getAnchoredPosition was called without displayInViewport enabled
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).not.toBe(true)
    })

    it('should respect explicit displayInViewport prop over default logic', async () => {
      // Test that an explicit displayInViewport=false prop overrides the automatic
      // detection, even when the ActionMenu is inside a dialog.
      HTMLRender(
        <Dialog onClose={() => {}}>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay displayInViewport={false}>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </Dialog>,
      )

      const button = page.getByRole('button', {name: 'Toggle Menu', exact: true})
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()

      // Verify getAnchoredPosition was called with displayInViewport: false (explicit override)
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).toBe(false)
    })

    it('should respect explicit displayInViewport=true prop', async () => {
      // Test that an explicit displayInViewport=true prop works regardless of
      // the dialog context.
      HTMLRender(
        <ActionMenu>
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
          <ActionMenu.Overlay displayInViewport={true}>
            <ActionList>
              <ActionList.Item>New file</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>,
      )

      const button = page.getByRole('button')
      await userEvent.click(button)

      await expect.element(page.getByRole('menu')).toBeInTheDocument()

      // Verify getAnchoredPosition was called with displayInViewport: true (explicit override)
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).toBe(true)
    })
  })
})
