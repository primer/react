import {describe, expect, it, vi, beforeEach} from 'vitest'
import {render as HTMLRender, waitFor, act, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import BaseStyles from '../BaseStyles'
import {ActionMenu, ActionList, Button, IconButton, Dialog} from '..'
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

function Example(): JSX.Element {
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

  it('should open Menu on MenuButton click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should open Menu on MenuButton keypress', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    button.focus()
    await user.keyboard('{Enter}')

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should close Menu on selecting an action with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    await user.click(menuItems[0])

    expect(component.queryByRole('menu')).toBeNull()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    menuItems[0].focus()
    await user.keyboard('{Enter}')

    expect(component.queryByRole('menu')).toBeNull()
  })

  it('should not close Menu if event is prevented', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    await user.click(menuItems[3])

    // menu should still be open
    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should be able to select an Item with selectionVariant', async () => {
    const component = HTMLRender(<SingleSelect />)
    const button = component.getByRole('button', {name: /^options/i})

    const user = userEvent.setup()
    await user.click(button)

    // select first item by role, that would close the menu
    await user.click(component.getAllByRole('menuitemradio')[0])
    expect(component.queryByRole('menu')).not.toBeInTheDocument()

    // open menu again and check if the first option is checked
    await user.click(button)
    expect(component.getAllByRole('menuitemradio')[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('should assign the right roles with groups & mixed selectionVariant', async () => {
    const component = HTMLRender(<MixedSelection />)

    const button = component.getByRole('button', {
      name: 'Group by Stage',
    })

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByLabelText('Status')).toHaveAttribute('role', 'menuitemradio')
    expect(component.getByLabelText('Clear Group by')).toHaveAttribute('role', 'menuitem')
  })

  it('should be able to select an Item with aria-keyshortcuts after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.queryByRole('menu')).toBeInTheDocument()

    // linkItem button is the active element at this point
    await user.keyboard('{ArrowDown}{s}')

    expect(component.getAllByRole('menuitem')[4]).toEqual(document.activeElement)
    await user.keyboard('{ArrowUp}')
    expect(component.getAllByRole('menuitem')[3]).toEqual(document.activeElement)

    // assumes mnemonics aria-keyshortcuts are ignored
    await user.keyboard('{g}')
    expect(component.getAllByRole('menuitem')[3]).toEqual(document.activeElement)
  })

  it('should select last element when ArrowUp is pressed after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)

    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.queryByRole('menu')).toBeInTheDocument()

    // button should be the active element
    // assumes button is the active element at this point
    await user.keyboard('{ArrowUp}')

    expect(component.getAllByRole('menuitem').pop()).toEqual(document.activeElement)
  })

  it('should close the menu if Tab is pressed and move to next element', async () => {
    const component = HTMLRender(
      <>
        <Example />
        <input type="text" placeholder="next focusable element" />
      </>,
    )
    const anchor = component.getByRole('button')

    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first button
    expect(anchor).toEqual(document.activeElement) // trust, but verify

    await user.keyboard('{Enter}')
    expect(component.queryByRole('menu')).toBeInTheDocument()
    expect(component.getAllByRole('menuitem')[0]).toEqual(document.activeElement)

    // TODO: revisit why we need this waitFor
    await waitFor(async () => {
      await user.tab()
      expect(document.activeElement).toEqual(component.getByPlaceholderText('next focusable element'))
      expect(component.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('should wrap focus when ArrowDown is pressed on the last element', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await act(async () => {
      await user.click(button)
    })

    expect(component.queryByRole('menu')).toBeInTheDocument()
    const menuItems = component.getAllByRole('menuitem')

    // TODO: Fix the focus trap from taking over focus control
    // https://github.com/primer/react/issues/6434

    // expect(menuItems[0]).toEqual(document.activeElement)

    await user.keyboard('{ArrowDown}')
    expect(menuItems[1]).toEqual(document.activeElement)

    await act(async () => {
      // TODO: Removed one ArrowDown to account for the focus trap starting at the second element
      // await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{ArrowDown}')
    })
    expect(menuItems[menuItems.length - 1]).toEqual(document.activeElement) // last elememt

    await user.keyboard('{ArrowDown}')
    expect(menuItems[0]).toEqual(document.activeElement) // wrap to first
  })

  it('should open menu on menu button click and it is wrapped with tooltip', async () => {
    const component = HTMLRender(<ExampleWithTooltip />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should open menu on menu button click and it is wrapped with tooltip v2', async () => {
    const component = HTMLRender(
      ExampleWithTooltipV2(
        <TooltipV2 text="Additional context about the menu button" direction="s">
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        </TooltipV2>,
      ),
    )
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should display tooltip when menu button is focused', async () => {
    const component = HTMLRender(<ExampleWithTooltip />)
    const button = component.getByRole('button')
    button.focus()
    expect(component.getByRole('tooltip')).toBeInTheDocument()
  })

  it('should display tooltip v2 when menu button is focused', async () => {
    const component = HTMLRender(
      ExampleWithTooltipV2(
        <TooltipV2 text="Additional context about the menu button" direction="s">
          <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
        </TooltipV2>,
      ),
    )
    const button = component.getByRole('button')
    act(() => {
      button.focus()
    })

    expect(component.getByRole('tooltip', {hidden: true})).toBeInTheDocument()
  })

  it('should open menu on menu anchor click and it is wrapped with tooltip v2', async () => {
    const component = HTMLRender(
      ExampleWithTooltipV2(
        <ActionMenu.Anchor>
          <TooltipV2 text="Additional context about the menu button" direction="n">
            <Button>Toggle Menu</Button>
          </TooltipV2>
        </ActionMenu.Anchor>,
      ),
    )
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should display tooltip v2 and menu anchor is focused', async () => {
    const component = HTMLRender(
      ExampleWithTooltipV2(
        <ActionMenu.Anchor>
          <TooltipV2 text="Additional context about the menu button" direction="n">
            <Button>Toggle Menu</Button>
          </TooltipV2>
        </ActionMenu.Anchor>,
      ),
    )
    const button = component.getByRole('button')
    act(() => {
      button.focus()
    })

    expect(component.getByRole('tooltip', {hidden: true})).toBeInTheDocument()
  })

  it('should pass the "id" prop from ActionMenu.Button to the HTML button', async () => {
    const buttonId = 'toggle-menu-custom-id'
    const component = HTMLRender(
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
    const button = component.getByRole('button')

    expect(button.id).toBe(buttonId)
  })
  it('should pass the "id" prop from ActionMenu.Anchor to anchor child', async () => {
    const buttonId = 'toggle-menu-custom-id'
    const component = HTMLRender(
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
    const button = component.getByRole('button')

    expect(button.id).toBe(buttonId)
  })

  it('should use the tooltip id to name the menu when the anchor is icon button', async () => {
    const component = HTMLRender(
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

    const toggleButton = component.getByRole('button', {name: 'More actions'})
    await userEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-labelledby')
    expect(component.getByRole('menu')).toHaveAttribute('aria-labelledby', toggleButton.getAttribute('aria-labelledby'))
  })

  describe('submenus', () => {
    it('sets `aria-haspopup` and `aria-expanded` on submenu anchors', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(baseAnchor)

      const submenuAnchor = component.getByRole('menuitem', {name: 'Paste special'})
      expect(submenuAnchor).toHaveAttribute('aria-haspopup')
      await user.click(submenuAnchor)
      expect(submenuAnchor).toHaveAttribute('aria-expanded')

      const subSubmenuAnchor = component.getByRole('menuitem', {name: 'Paste from'})
      expect(subSubmenuAnchor).toHaveAttribute('aria-haspopup')
      await user.click(subSubmenuAnchor)
      expect(subSubmenuAnchor).toHaveAttribute('aria-expanded')
    })

    it('sets labels on submenus', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(baseAnchor)

      const submenuAnchor = component.getByRole('menuitem', {name: 'Paste special'})
      await user.click(submenuAnchor)

      const submenu = component.getByRole('menu', {name: 'Paste special'})
      await waitFor(() => {
        expect(submenu).toBeVisible()
      })

      const subSubmenuAnchor = within(submenu).getByRole('menuitem', {name: 'Paste from'})
      await user.click(subSubmenuAnchor)

      const subSubmenu = component.getByRole('menu', {name: 'Paste from'})

      await waitFor(() => {
        expect(subSubmenu).toBeVisible()
      })
    })

    it('does not open top-level menu on right arrow key press', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      baseAnchor.focus()

      await user.keyboard('{ArrowRight}')
      expect(component.queryByRole('menu')).not.toBeInTheDocument()
      expect(baseAnchor).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('opens submenus on enter or right arrow key press', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(baseAnchor)

      const submenuAnchor = component.getByRole('menuitem', {name: 'Paste special'})
      expect(submenuAnchor).toHaveAttribute('aria-haspopup', 'true')
      submenuAnchor.focus()
      await user.keyboard('{Enter}')
      expect(submenuAnchor).toHaveAttribute('aria-expanded', 'true')

      const subSubmenuAnchor = component.getByRole('menuitem', {name: 'Paste from'})
      subSubmenuAnchor.focus()
      await user.keyboard('{ArrowRight}')
      expect(subSubmenuAnchor).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes top menu on escape or left arrow key press', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(baseAnchor)

      const submenuAnchor = component.getByRole('menuitem', {name: 'Paste special'})
      await user.click(submenuAnchor)

      const subSubmenuAnchor = component.getByRole('menuitem', {name: 'Paste from'})
      await user.click(subSubmenuAnchor)

      expect(subSubmenuAnchor).toHaveAttribute('aria-expanded', 'true')

      await user.keyboard('{Escape}')
      expect(subSubmenuAnchor).not.toHaveAttribute('aria-expanded', 'true')
      expect(submenuAnchor).toHaveAttribute('aria-expanded', 'true')

      await user.keyboard('{ArrowLeft}')
      expect(submenuAnchor).not.toHaveAttribute('aria-expanded', 'true')

      expect(baseAnchor).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes all menus when an item is selected', async () => {
      const component = HTMLRender(<ExampleWithSubmenus />)
      const user = userEvent.setup()

      const baseAnchor = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(baseAnchor)

      const submenuAnchor = component.getByRole('menuitem', {name: 'Paste special'})
      await user.click(submenuAnchor)

      const subSubmenuAnchor = component.getByRole('menuitem', {name: 'Paste from'})
      await user.click(subSubmenuAnchor)

      const subSubmenuItem = component.getByRole('menuitem', {name: 'Current clipboard'})
      await user.click(subSubmenuItem)

      expect(baseAnchor).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('supports className prop on ActionMenu.Anchor', async () => {
      const component = HTMLRender(
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
                  Github
                </ActionList.LinkItem>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </BaseStyles>,
      )
      const anchor = component.getByRole('button', {name: 'Toggle Menu'})
      expect(anchor).toHaveClass('test-class')
    })

    it('supports className prop on ActionMenu.Button', async () => {
      const component = HTMLRender(
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
        </BaseStyles>,
      )
      const button = component.getByRole('button', {name: 'Toggle Menu'})
      expect(button).toHaveClass('test-class')
    })
  })

  describe('calls event handlers on trigger', () => {
    it('should call onClick and onKeyDown passed to ActionMenu.Button', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      const component = HTMLRender(
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

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      expect(component.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = component.getAllByRole('menuitem')
      await user.click(menuItems[0])
      expect(component.queryByRole('menu')).toBeNull()

      expect(button).toEqual(document.activeElement)
      await user.keyboard('{Enter}')
      expect(component.queryByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to IconButton inside ActionMenu.Anchor', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      const component = HTMLRender(
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

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      expect(component.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = component.getAllByRole('menuitem')
      await user.click(menuItems[0])
      expect(component.queryByRole('menu')).toBeNull()

      expect(button).toEqual(document.activeElement)
      await user.keyboard('{Enter}')
      expect(component.queryByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to ActionMenu.Button with Tooltip', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      const component = HTMLRender(
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

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      expect(component.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = component.getAllByRole('menuitem')
      await user.click(menuItems[0])
      expect(component.queryByRole('menu')).toBeNull()

      expect(button).toEqual(document.activeElement)
      await user.keyboard('{Enter}')
      expect(component.queryByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })

    it('should call onClick and onKeyDown passed to IconButton inside ActionMenu.Anchor with Tooltip', async () => {
      const mockOnClick = vi.fn()
      const mockOnKeyDown = vi.fn()

      const component = HTMLRender(
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

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      expect(component.getByRole('menu')).toBeInTheDocument()
      expect(mockOnClick).toHaveBeenCalledTimes(1)

      // select and close menu
      const menuItems = component.getAllByRole('menuitem')
      await user.click(menuItems[0])
      expect(component.queryByRole('menu')).toBeNull()

      expect(button).toEqual(document.activeElement)
      await user.keyboard('{Enter}')
      expect(component.queryByRole('menu')).toBeInTheDocument()
      expect(mockOnKeyDown).toHaveBeenCalledTimes(1)
    })
  })

  describe('feature flag: primer_react_action_menu_display_in_viewport_inside_dialog', () => {
    const mockGetAnchoredPosition = vi.mocked(getAnchoredPosition)

    beforeEach(() => {
      // Reset mock before each test
      mockGetAnchoredPosition.mockClear()
    })

    it('should enable displayInViewport when flag is enabled and ActionMenu is inside a dialog', async () => {
      // When the ActionMenu is wrapped in a Dialog, it's inside a dialog context.
      // With the flag enabled, displayInViewport should be automatically enabled.
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: true}}>
          <Dialog onClose={() => {}}>
            <ActionMenu>
              <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Dialog>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

      // Verify getAnchoredPosition was called with displayInViewport: true
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).toBe(true)
    })

    it('should not enable displayInViewport when flag is enabled but ActionMenu is NOT inside a dialog', async () => {
      // Without being wrapped in a Dialog, the ActionMenu is not in a dialog context.
      // Even with the flag enabled, displayInViewport should remain at its default (false/undefined).
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: true}}>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

      // Verify getAnchoredPosition was called without displayInViewport enabled
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).not.toBe(true)
    })

    it('should not enable displayInViewport when flag is disabled, even inside a dialog', async () => {
      // Even when inside a Dialog, with the flag disabled, displayInViewport
      // should remain at its default (false/undefined).
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: false}}>
          <Dialog onClose={() => {}}>
            <ActionMenu>
              <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Dialog>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

      // Verify getAnchoredPosition was called without displayInViewport enabled
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).not.toBe(true)
    })

    it('should not enable displayInViewport when flag is disabled and outside dialog', async () => {
      // Default scenario: flag disabled and not in a dialog context.
      // displayInViewport should remain at its default (false/undefined).
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: false}}>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

      // Verify getAnchoredPosition was called without displayInViewport enabled
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).not.toBe(true)
    })

    it('should respect explicit displayInViewport prop over feature flag logic', async () => {
      // Test that an explicit displayInViewport=false prop overrides the automatic
      // detection, even when the flag is enabled and the ActionMenu is inside a dialog.
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: true}}>
          <Dialog onClose={() => {}}>
            <ActionMenu>
              <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
              <ActionMenu.Overlay displayInViewport={false}>
                <ActionList>
                  <ActionList.Item>New file</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Dialog>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button', {name: 'Toggle Menu'})
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

      // Verify getAnchoredPosition was called with displayInViewport: false (explicit override)
      await waitFor(() => {
        expect(mockGetAnchoredPosition).toHaveBeenCalled()
      })

      const calls = mockGetAnchoredPosition.mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall[2]?.displayInViewport).toBe(false)
    })

    it('should respect explicit displayInViewport=true prop even when flag is disabled', async () => {
      // Test that an explicit displayInViewport=true prop works regardless of
      // the flag state or dialog context.
      const component = HTMLRender(
        <FeatureFlags flags={{primer_react_action_menu_display_in_viewport_inside_dialog: false}}>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay displayInViewport={true}>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </FeatureFlags>,
      )

      const user = userEvent.setup()
      const button = component.getByRole('button')
      await user.click(button)

      await waitFor(() => {
        expect(component.queryByRole('menu')).toBeInTheDocument()
      })

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
