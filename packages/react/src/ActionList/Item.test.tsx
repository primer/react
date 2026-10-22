import {page, userEvent} from 'vitest/browser'
import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender, fireEvent, act} from '@testing-library/react'
import React, {type JSX} from 'react'
import {ActionList} from '.'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {BookIcon} from '@primer/octicons-react'
import {implementsClassName} from '../utils/testing'
import classes from './ActionList.module.css'

function SimpleActionList(): JSX.Element {
  return (
    <ActionList>
      <ActionList.Item>New file</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Edit file</ActionList.Item>
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
      <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="d">
        Link Item
      </ActionList.LinkItem>
      <ActionList.Item inactiveText="Unavailable due to an outage">Inactive item</ActionList.Item>
      <ActionList.Item inactiveText="Unavailable due to an outage" loading>
        Loading and inactive item
      </ActionList.Item>
    </ActionList>
  )
}

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Primer React', scope: 'github/primer'},
  {name: 'Disabled Project', scope: 'github/primer', disabled: true},
  {name: 'Inactive Project', scope: 'github/primer', inactiveText: 'Unavailable due to an outage'},
  {name: 'Loading Project', scope: 'github/primer', loading: true},
  {
    name: 'Inactive and Loading Project',
    scope: 'github/primer',
    loading: true,
    inactiveText: 'Unavailable due to an outage, but loading still passed',
  },
]

function SingleSelectListStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <ActionList selectionVariant="single" showDividers role="listbox" aria-label="Select a project">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          disabled={project.disabled}
          inactiveText={project.inactiveText}
          loading={project.loading}
        >
          {project.name}
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

describe('ActionList.Item', () => {
  implementsClassName(ActionList.Item, classes.ActionListItem)
  implementsClassName(ActionList.LinkItem)
  it('should have aria-keyshortcuts applied to the correct element', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    const linkOptions = container.querySelectorAll('a')
    expect(linkOptions[0]).toHaveAttribute('aria-keyshortcuts', 'd')
    expect(linkOptions[0].parentElement).not.toHaveAttribute('aria-keyshortcuts', 'd')
  })
  it('should fire onSelect on click and keypress', async () => {
    HTMLRender(<SingleSelectListStory />)
    const options = page.getByRole('option').all()
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[1]).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(options[1])
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'false')
    await expect.element(options[1]).toHaveAttribute('aria-selected', 'true')
    act(() => {
      options[0].element().focus()
    })
    await userEvent.keyboard('{Enter}')
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[1]).toHaveAttribute('aria-selected', 'false')
    act(() => {
      options[1].element().focus()
    })
    await userEvent.keyboard(' ')
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'false')
    await expect.element(options[1]).toHaveAttribute('aria-selected', 'true')
  })
  it('should skip onSelect on disabled items', async () => {
    HTMLRender(<SingleSelectListStory />)
    const options = page.getByRole('option').all()
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[2]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[2].element())
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[2]).toHaveAttribute('aria-selected', 'false')
    act(() => {
      options[2].element().focus()
    })
    await userEvent.keyboard('{Enter}')
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[2]).toHaveAttribute('aria-selected', 'false')
  })
  it('should skip onSelect on inactive items', async () => {
    HTMLRender(<SingleSelectListStory />)
    const options = page.getByRole('option').all()
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[3]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[3].element())
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[3]).toHaveAttribute('aria-selected', 'false')
    act(() => {
      options[3].element().focus()
    })
    await userEvent.keyboard('{Enter}')
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[3]).toHaveAttribute('aria-selected', 'false')
  })
  it('should skip onSelect on loading items', async () => {
    HTMLRender(<SingleSelectListStory />)
    const options = page.getByRole('option').all()
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[4]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[4].element())
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[4]).toHaveAttribute('aria-selected', 'false')
    act(() => {
      options[3].element().focus()
    })
    await userEvent.keyboard('{Enter}')
    await expect.element(options[0]).toHaveAttribute('aria-selected', 'true')
    await expect.element(options[4]).toHaveAttribute('aria-selected', 'false')
  })
  it('should not crash when clicking an item without an onSelect', async () => {
    HTMLRender(
      <ActionList role="listbox">
        <ActionList.Item role="option">Primer React</ActionList.Item>
      </ActionList>,
    )
    const option = page.getByRole('option')
    await expect.element(option).toBeInTheDocument()
    await userEvent.click(option)
    await userEvent.keyboard('{Enter}')
    await expect.element(option).toBeInTheDocument()
  })
  it('should focus the button around the alert icon when tabbing to an inactive item', async () => {
    HTMLRender(<SimpleActionList />)
    const inactiveIndicatorButton = page.getByRole('button', {name: 'Inactive item', exact: true})
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab() // focuses 6th element, which is inactive
    await expect.element(inactiveIndicatorButton).toHaveFocus()
    await expect.element(inactiveIndicatorButton).toHaveAccessibleDescription('Unavailable due to an outage')
  })
  it('should focus the option or menu item when moving focus to an inactive item **in a listbox**', async () => {
    HTMLRender(<SingleSelectListStory />)
    const inactiveOption = page.getByRole('option', {name: projects[3].name})
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(inactiveOption).toHaveFocus()
    await expect.element(inactiveOption).toHaveAccessibleDescription(projects[3].inactiveText as string)
  })
  it('should behave as inactive if both inactiveText and loading props are passed', async () => {
    HTMLRender(<SimpleActionList />)
    const inactiveIndicatorButton = page.getByRole('button', {name: 'Loading and inactive item', exact: true})
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab() // focuses 7th element, which is inactive AND has a loading prop
    await expect.element(inactiveIndicatorButton).toHaveFocus()
    await expect.element(inactiveIndicatorButton).toHaveAccessibleDescription('Unavailable due to an outage')
  })

  it('should behave as inactive if both inactiveText and loading props are passed **in a listbox**', async () => {
    HTMLRender(<SingleSelectListStory />)
    const inactiveOption = page.getByRole('option', {name: projects[5].name})
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(inactiveOption).toHaveFocus()
    await expect.element(inactiveOption).toHaveAccessibleDescription(projects[5].inactiveText as string)
  })
  it('should call onClick for a link item', async () => {
    const onClick = vi.fn()
    HTMLRender(
      <ActionList role="listbox">
        <ActionList.LinkItem role="link" onClick={onClick}>
          Primer React
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = page.getByRole('link')
    await userEvent.click(link)
    expect(onClick).toHaveBeenCalled()
  })
  it('should render ActionList.Item as button', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item disabled={true}>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
      </ActionList>,
    )
    const button = container.querySelector('button')
    await expect.element(button).toHaveTextContent('Item 1')
    // Ensure passed prop "disabled" is applied to the button
    await expect.element(button).toHaveAttribute('aria-disabled', 'true')
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should render ActionList.Item as li when item has proper aria role', async () => {
    const {container} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Item role="option">Item 1</ActionList.Item>
        <ActionList.Item role="option">Item 2</ActionList.Item>
      </ActionList>,
    )
    const listitem = container.querySelector('li')
    const button = container.querySelector('button')
    expect(listitem).toHaveTextContent('Item 1')
    expect(listitem).toHaveAttribute('tabindex', '0')
    expect(button).toBeNull()
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should render the trailing action as a button (default)', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction data-testid="trailing-action" icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    const action = container.querySelector('button[data-testid="trailing-action"]')
    expect(action).toHaveAccessibleName('Action')
  })
  it('should render the trailing action as a link', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction as="a" href="#" icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    const action = container.querySelector('a[href="#"][aria-labelledby]')
    expect(action).toHaveAccessibleName('Action')
  })
  it('should do action when trailing action is clicked', async () => {
    const onClick = vi.fn()
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction icon={BookIcon} label="Action" onClick={onClick} />
        </ActionList.Item>
      </ActionList>,
    )
    const trailingAction = page.getByRole('button', {name: 'Action', exact: true})
    await userEvent.click(trailingAction)
    expect(onClick).toHaveBeenCalled()
  })
  it('should focus the trailing action', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    await userEvent.tab()
    await expect.element(page.getByRole('button', {name: 'Item 1', exact: true})).toHaveFocus()
    await userEvent.tab()
    await expect.element(page.getByRole('button', {name: 'Action', exact: true})).toHaveFocus()
  })
  it('should only trigger a key event once', async () => {
    const mockOnSelect = vi.fn()
    HTMLRender(
      <ActionList>
        <ActionList.Item onSelect={mockOnSelect}>Item 1</ActionList.Item>
      </ActionList>,
    )
    const item = page.getByRole('button')
    act(() => {
      item.element().focus()
    })
    await expect.element(item).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(mockOnSelect).toHaveBeenCalledTimes(1)
  })
  it('should not render buttons when role is specified', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item role="option">Item 1</ActionList.Item>
        <ActionList.Item role="menuitem">Item 2</ActionList.Item>
        <ActionList.Item role="menuitemcheckbox">Item 3</ActionList.Item>
        <ActionList.Item role="menuitemradio">Item 4</ActionList.Item>
        <ActionList.Item>Item 5</ActionList.Item>
      </ActionList>,
    )
    const option = page.getByRole('option')
    expect(option.element().tagName).toBe('LI')
    expect(option.element().textContent).toBe('Item 1')
    const menuItem = page.getByRole('menuitem')
    expect(menuItem.element().tagName).toBe('LI')
    const menuItemCheckbox = page.getByRole('menuitemcheckbox')
    expect(menuItemCheckbox.element().tagName).toBe('LI')
    const menuItemRadio = page.getByRole('menuitemradio')
    expect(menuItemRadio.element().tagName).toBe('LI')
    const button = page.getByRole('button')
    expect(button.element().parentElement?.tagName).toBe('LI')
    expect(button.element().textContent).toBe('Item 5')
  })

  it('should add `role="option"` if `role="listbox"` and `selectionVariant` is present', async () => {
    HTMLRender(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
        <ActionList.Item>Item 3</ActionList.Item>
        <ActionList.Item>Item 4</ActionList.Item>
      </ActionList>,
    )
    const options = page.getByRole('option').all()
    await expect.element(options[0]).toBeInTheDocument()
    expect(options).toHaveLength(4)
  })

  it('should add `aria-describedby` to items with a description', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item, <ActionList.Description variant="block">Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    const item = page.getByRole('button')
    await expect.element(item).toHaveAttribute('aria-describedby')
    await expect.element(item).toHaveTextContent('Item, Description')
    await expect.element(item).toHaveAccessibleDescription('Description')
  })

  it('should add `aria-describedby` to items with a description when `role=listbox` is applied', async () => {
    HTMLRender(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item>
          Item, <ActionList.Description variant="block">Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    const item = page.getByRole('option')
    await expect.element(item).toHaveAttribute('aria-describedby')
    await expect.element(item).toHaveTextContent('Item, Description')
    await expect.element(item).toHaveAccessibleDescription('Description')
  })

  it('should add role="tab" when ActionList has role="tablist"', async () => {
    HTMLRender(
      <ActionList role="tablist">
        <ActionList.Item>Tab 1</ActionList.Item>
        <ActionList.Item>Tab 2</ActionList.Item>
        <ActionList.Item>Tab 3</ActionList.Item>
      </ActionList>,
    )
    const tabs = page.getByRole('tab').all()
    await expect.element(tabs[0]).toBeInTheDocument()
    expect(tabs).toHaveLength(3)
  })

  it('should allow role="tab" on the li element', async () => {
    HTMLRender(
      <ActionList role="tablist">
        <ActionList.Item role="tab">Tab 1</ActionList.Item>
        <ActionList.Item role="tab">Tab 2</ActionList.Item>
        <ActionList.Item role="tab">Tab 3</ActionList.Item>
      </ActionList>,
    )
    const tabs = page.getByRole('tab').all()
    await expect.element(tabs[0]).toBeInTheDocument()
    expect(tabs[0].element().nodeType).toBe(Node.ELEMENT_NODE)
    expect(tabs).toHaveLength(3)
  })

  it('should forward a list-semantic item ref only to the outer list item', () => {
    const ref = vi.fn<(node: HTMLLIElement | null) => void>()
    HTMLRender(
      <ActionList role="listbox" aria-label="Projects">
        <ActionList.Item ref={ref} role="option">
          Primer React
        </ActionList.Item>
      </ActionList>,
    )
    const option = page.getByRole('option')

    expect(ref.mock.calls.filter(([node]) => node !== null)).toEqual([[option.element()]])
    expect(option.element().tagName).toBe('LI')
  })

  it('should preserve consumer ref when tooltip wraps trigger', async () => {
    function TestComponent() {
      const anchorRef = React.useRef<HTMLLIElement>(null)
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <ActionList aria-label="Actions">
            <ActionList.Item
              ref={anchorRef}
              onSelect={() => {
                setOpen(!open)
              }}
            >
              Convert to issue
              <ActionList.Description truncate>
                This description gets truncated because it is inline with truncation
              </ActionList.Description>
            </ActionList.Item>
          </ActionList>
          <AnchoredOverlay open={open} renderAnchor={null} anchorRef={anchorRef} onClose={() => setOpen(false)}>
            <ActionList role="menu" aria-label="Convert to issue menu">
              <ActionList.Item role="menuitem">Choose repository</ActionList.Item>
              <ActionList.Item role="menuitem">Create issue</ActionList.Item>
            </ActionList>
          </AnchoredOverlay>
        </>
      )
    }

    HTMLRender(<TestComponent />)

    // Overlay should not be visible initially
    await expect.element(page.getByRole('menu')).not.toBeInTheDocument()

    // Click the item to open the anchored overlay
    await userEvent.click(page.getByText('Convert to issue', {exact: true}))

    // The overlay should open — this fails if Tooltip overwrites the consumer ref
    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  describe('data attributes derived from slots', () => {
    it('sets data-has-trailing-action when a TrailingAction slot is present', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>
            Item
            <ActionList.TrailingAction icon={BookIcon} label="Action" />
          </ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).toHaveAttribute(
        'data-has-trailing-action',
        'true',
      )
    })

    it('does not set data-has-trailing-action when no TrailingAction slot is present', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-has-trailing-action',
      )
    })

    it('sets data-trailing-action-loading when the TrailingAction is loading', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>
            Item
            <ActionList.TrailingAction label="Action" loading />
          </ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).toHaveAttribute(
        'data-trailing-action-loading',
        'true',
      )
    })

    it('does not set data-trailing-action-loading when the TrailingAction is not loading', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>
            Item
            <ActionList.TrailingAction icon={BookIcon} label="Action" />
          </ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-trailing-action-loading',
      )
    })

    // The TrailingAction element is only rendered when the item is not inactive,
    // not loading, and not inside a menu-style container. The data attributes
    // must mirror that gate or the styling will apply when no action is in the DOM.
    it('does not set data-has-trailing-action when the item is inactive', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item inactiveText="Unavailable">
            Item
            <ActionList.TrailingAction icon={BookIcon} label="Action" />
          </ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-has-trailing-action',
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-trailing-action-loading',
      )
    })

    it('does not set data-has-trailing-action when the item is loading', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item loading>
            Item
            <ActionList.TrailingAction label="Action" loading />
          </ActionList.Item>
        </ActionList>,
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-has-trailing-action',
      )
      expect(container.querySelector('[data-component="ActionList.Item"]')).not.toHaveAttribute(
        'data-trailing-action-loading',
      )
    })

    // The menuContext gate (ActionMenu/SelectPanel/FilteredActionList) is also
    // applied in code but cannot be exercised in dev tests because passing
    // TrailingAction in a menu-style container fires a dev-only invariant
    // (see Item.tsx). The gating still matters for production builds where
    // the invariant is a no-op.
  })

  describe('inactive indicator wrap data-position', () => {
    it('renders the inactive wrap with data-position="trailing" when the item has no leading visual', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item inactiveText="Unavailable">Item</ActionList.Item>
        </ActionList>,
      )
      const wrap = container.querySelector(`.${classes.InactiveButtonWrap}`)
      expect(wrap).toHaveAttribute('data-position', 'trailing')
    })

    it('renders the inactive wrap with data-position="leading" when the item has a leading visual', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item inactiveText="Unavailable">
            <ActionList.LeadingVisual>
              <BookIcon />
            </ActionList.LeadingVisual>
            Item
          </ActionList.Item>
        </ActionList>,
      )
      const wrap = container.querySelector(`.${classes.InactiveButtonWrap}`)
      expect(wrap).toHaveAttribute('data-position', 'leading')
    })
  })

  describe('TrailingAction data-has-label', () => {
    it('sets data-has-label on the text Button variant (no icon prop)', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>
            Item
            <ActionList.TrailingAction label="Action" />
          </ActionList.Item>
        </ActionList>,
      )
      const action = container.querySelector(`.${classes.TrailingActionButton}`)
      expect(action).toHaveAttribute('data-has-label', 'true')
    })

    it('does not set data-has-label on the IconButton variant (icon prop set)', () => {
      const {container} = HTMLRender(
        <ActionList>
          <ActionList.Item>
            Item
            <ActionList.TrailingAction icon={BookIcon} label="Action" />
          </ActionList.Item>
        </ActionList>,
      )
      const action = container.querySelector(`.${classes.TrailingActionButton}`)
      expect(action).not.toHaveAttribute('data-has-label')
    })
  })
})
