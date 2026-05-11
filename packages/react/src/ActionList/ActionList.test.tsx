import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ActionList} from '.'
import {ActionListContainerContext} from './ActionListContainerContext'
import {implementsClassName} from '../utils/testing'
import classes from './ActionList.module.css'

describe('ActionList', () => {
  implementsClassName(ActionList, classes.ActionList)
  implementsClassName(ActionList.LeadingVisual, classes.LeadingVisual)
  implementsClassName(ActionList.TrailingVisual, classes.TrailingVisual)
  implementsClassName(ActionList.TrailingAction, classes.TrailingAction)
  implementsClassName(ActionList.Divider, classes.Divider)
  it('should warn when selected is provided without a selectionVariant on parent', async () => {
    // we expect console.warn to be called, so we spy on that in the test
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => vi.fn())

    HTMLRender(
      <ActionList showDividers role="listbox" aria-label="Select a project">
        <ActionList.Item role="option" selected={true}>
          Primer React
        </ActionList.Item>
      </ActionList>,
    )

    expect(spy).toHaveBeenCalledWith(
      'Warning:',
      'For Item to be selected, ActionList or ActionList.Group should have a selectionVariant defined.',
    )

    spy.mockRestore()
  })

  it('should be navigatable with arrow keys for certain roles', async () => {
    HTMLRender(
      <ActionList role="listbox" aria-label="Select a project">
        <ActionList.Item role="option">Option 1</ActionList.Item>
        <ActionList.Item role="option">Option 2</ActionList.Item>
        <ActionList.Item role="option" disabled>
          Option 3
        </ActionList.Item>
        <ActionList.Item role="option">Option 4</ActionList.Item>
        <ActionList.Item role="option" inactiveText="Unavailable due to an outage">
          Option 5
        </ActionList.Item>
      </ActionList>,
    )

    await userEvent.tab() // tab into the story, this should focus on the first button
    expect(document.activeElement).toHaveTextContent('Option 1')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 2')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 3')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 4')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveAccessibleName('Option 5')
    expect(document.activeElement).toHaveAccessibleDescription('Unavailable due to an outage')

    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toHaveTextContent('Option 4')
  })

  it('divider should support a custom `className`', () => {
    const Element = () => {
      return (
        <ActionList>
          <ActionList.Item>Item</ActionList.Item>
          <ActionList.Divider className="test-class-name" />
        </ActionList>
      )
    }
    expect(HTMLRender(<Element />).container.querySelector('li[aria-hidden="true"]')).toHaveClass('test-class-name')
  })

  it('list and its sub-components support classname', () => {
    const {container} = HTMLRender(
      <ActionList className="list">
        <ActionList.Heading as="h2" className="heading">
          Heading
        </ActionList.Heading>
        <ActionList.Item className="item">
          Item
          <ActionList.TrailingAction label="action" className="trailing_action">
            Trailing Action
          </ActionList.TrailingAction>
        </ActionList.Item>
        <ActionList.Divider className="divider" />
        <ActionList.LinkItem className="link" href="//github.com" title="anchor" aria-keyshortcuts="d">
          Link Item
        </ActionList.LinkItem>
        <ActionList.Group className="group">
          <ActionList.GroupHeading as="h2" className="group_heading">
            Group Heading
          </ActionList.GroupHeading>
          <ActionList.Item className="item">
            <ActionList.TrailingVisual className="trailing">Trailing Visual</ActionList.TrailingVisual>
            <ActionList.LeadingVisual className="leading">Leading Visual</ActionList.LeadingVisual>
            <ActionList.Description className="description">Description</ActionList.Description>
          </ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    expect(container.querySelector('.list')).toBeInTheDocument()
    expect(container.querySelector('.heading')).toBeInTheDocument()
    expect(container.querySelector('.item')).toBeInTheDocument()
    expect(container.querySelector('.trailing_action')).toBeInTheDocument()
    expect(container.querySelector('.divider')).toBeInTheDocument()
    expect(container.querySelector('.link')).toBeInTheDocument()
    expect(container.querySelector('.group')).toBeInTheDocument()
    expect(container.querySelector('.group_heading')).toBeInTheDocument()
    expect(container.querySelector('.trailing')).toBeInTheDocument()
    expect(container.querySelector('.leading')).toBeInTheDocument()
    expect(container.querySelector('.description')).toBeInTheDocument()
  })

  it('should not be navigatable with arrow keys if `disableFocusZone` is true', async () => {
    const {container} = HTMLRender(
      <ActionList role="listbox" aria-label="Select a project" disableFocusZone={true}>
        <ActionList.Item role="option">Option 1</ActionList.Item>
        <ActionList.Item role="option">Option 2</ActionList.Item>
        <ActionList.Item role="option" disabled>
          Option 3
        </ActionList.Item>
        <ActionList.Item role="option">Option 4</ActionList.Item>
        <ActionList.Item role="option" inactiveText="Unavailable due to an outage">
          Option 5
        </ActionList.Item>
      </ActionList>,
    )

    await userEvent.tab() // tab into the story, this should focus on the first button
    expect(document.activeElement).toHaveTextContent('Option 1')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 1')

    expect(container.querySelector('li[aria-disabled="true"]')?.nextElementSibling).toHaveTextContent('Option 4')
    expect(container.querySelector('li[aria-disabled="true"]')?.nextElementSibling).toHaveAttribute('tabindex', '0')
  })

  it('sets Description title for button-semantics items (tooltip path)', () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Option 1<ActionList.Description truncate>Simple string description</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 2
          <ActionList.Description truncate>
            <span>Complex</span> content
          </ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 3
          <ActionList.Description>
            <span>Non-truncated</span> content
          </ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const descriptions = container.querySelectorAll('[data-component="ActionList.Description"]')

    // For button-semantic items, the native title is suppressed in favor of
    // a keyboard-accessible Tooltip rendered by the parent Item.
    expect(descriptions[0]).toHaveAttribute('title', '')
    expect(descriptions[1]).toHaveAttribute('title', '')
    expect(descriptions[2]).not.toHaveAttribute('title')
  })

  it('sets Description title for list-semantics items (no truncation tooltip path)', () => {
    const {container} = HTMLRender(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item>
          Option 1<ActionList.Description truncate>Simple string description</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 2
          <ActionList.Description truncate>
            <span>Complex</span> content
          </ActionList.Description>
        </ActionList.Item>
        <ActionList.Item>
          Option 3
          <ActionList.Description>
            <span>Non-truncated</span> content
          </ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const descriptions = container.querySelectorAll('[data-component="ActionList.Description"]')

    expect(descriptions[0]).toHaveAttribute('title', 'Simple string description')
    expect(descriptions[1]).toHaveAttribute('title', 'Complex content')
    expect(descriptions[2]).not.toHaveAttribute('title')
  })

  it('references inline description via aria-describedby', () => {
    const {container} = HTMLRender(
      <ActionList role="listbox" selectionVariant="single" aria-label="List">
        <ActionList.Item role="option">
          Item label
          <ActionList.Description>Inline description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const item = container.querySelector('[role="option"]')!
    const descriptionEl = container.querySelector('[data-component="ActionList.Description"]')!
    const descriptionId = descriptionEl.getAttribute('id')!

    expect(item.getAttribute('aria-describedby')).toContain(descriptionId)
    expect(item.getAttribute('aria-labelledby')).not.toContain(descriptionId)
  })

  it('references block description via aria-describedby', () => {
    const {container} = HTMLRender(
      <ActionList role="listbox" selectionVariant="single" aria-label="List">
        <ActionList.Item role="option">
          Item label
          <ActionList.Description variant="block">Block description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const item = container.querySelector('[role="option"]')!
    const descriptionEl = container.querySelector('[data-component="ActionList.Description"]')!
    const descriptionId = descriptionEl.getAttribute('id')!

    expect(item.getAttribute('aria-describedby')).toContain(descriptionId)
    expect(item.getAttribute('aria-labelledby')).not.toContain(descriptionId)
  })

  it('should support size prop on LinkItem', () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.LinkItem href="//github.com" size="large">
          Large Link Item
        </ActionList.LinkItem>
        <ActionList.LinkItem href="//github.com" size="medium">
          Medium Link Item
        </ActionList.LinkItem>
        <ActionList.LinkItem href="//github.com">Default Link Item</ActionList.LinkItem>
      </ActionList>,
    )

    const linkElements = container.querySelectorAll('a')
    expect(linkElements[0]).toHaveAttribute('data-size', 'large')
    expect(linkElements[1]).toHaveAttribute('data-size', 'medium')
    expect(linkElements[2]).toHaveAttribute('data-size', 'medium') // default should be medium
  })
})

describe('ActionList data-component attributes', () => {
  it('renders ActionList with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )

    const actionList = container.querySelector('[data-component="ActionList"]')
    expect(actionList).toBeInTheDocument()
  })

  it('renders ActionList.Item with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )

    const item = container.querySelector('[data-component="ActionList.Item"]')
    expect(item).toBeInTheDocument()
  })

  it('renders ActionList.Item.Label with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )

    const label = container.querySelector('[data-component="ActionList.Item.Label"]')
    expect(label).toBeInTheDocument()
  })

  it('renders ActionList.Item--DividerContainer with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )

    const dividerContainer = container.querySelector('[data-component="ActionList.Item--DividerContainer"]')
    expect(dividerContainer).toBeInTheDocument()
  })

  it('renders ActionList.Group with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Group>
          <ActionList.GroupHeading as="h3">Group</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const group = container.querySelector('[data-component="ActionList.Group"]')
    expect(group).toBeInTheDocument()
  })

  it('renders ActionList.GroupHeading with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Group>
          <ActionList.GroupHeading as="h3">Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )

    const groupHeading = container.querySelector('[data-component="GroupHeadingWrap"]')
    expect(groupHeading).toBeInTheDocument()
  })

  it('renders ActionList.Divider with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>Item 1</ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item>Item 2</ActionList.Item>
      </ActionList>,
    )

    const divider = container.querySelector('[data-component="ActionList.Divider"]')
    expect(divider).toBeInTheDocument()
  })

  it('renders ActionList.Description with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>
          Item
          <ActionList.Description>Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )

    const description = container.querySelector('[data-component="ActionList.Description"]')
    expect(description).toBeInTheDocument()
  })

  it('renders ActionList.LeadingVisual with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>
          <ActionList.LeadingVisual>Icon</ActionList.LeadingVisual>
          Item
        </ActionList.Item>
      </ActionList>,
    )

    const leadingVisual = container.querySelector('[data-component="ActionList.LeadingVisual"]')
    expect(leadingVisual).toBeInTheDocument()
  })

  it('renders ActionList.TrailingVisual with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>
          Item
          <ActionList.TrailingVisual>Icon</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>,
    )

    const trailingVisual = container.querySelector('[data-component="ActionList.TrailingVisual"]')
    expect(trailingVisual).toBeInTheDocument()
  })

  it('renders ActionList.Selection with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList selectionVariant="single" aria-label="List">
        <ActionList.Item selected>Item</ActionList.Item>
      </ActionList>,
    )

    const selection = container.querySelector('[data-component="ActionList.Selection"]')
    expect(selection).toBeInTheDocument()
  })

  it('renders ActionList.Heading with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Heading as="h2">Heading</ActionList.Heading>
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )

    const heading = container.querySelector('[data-component="ActionList.Heading"]')
    expect(heading).toBeInTheDocument()
  })

  it('renders ActionList.TrailingAction with data-component attribute', () => {
    const {container} = HTMLRender(
      <ActionList aria-label="List">
        <ActionList.Item>
          Item
          <ActionList.TrailingAction label="Action" />
        </ActionList.Item>
      </ActionList>,
    )

    const trailingAction = container.querySelector('[data-component="ActionList.TrailingAction"]')
    expect(trailingAction).toBeInTheDocument()
  })
})

describe('ActionList with role="tree"', () => {
  it('applies role="tree" to the list', () => {
    const {container} = HTMLRender(
      <ActionList role="tree" aria-label="File tree">
        <ActionList.Item role="treeitem">Item 1</ActionList.Item>
        <ActionList.Item role="treeitem">Item 2</ActionList.Item>
      </ActionList>,
    )

    const tree = container.querySelector('[role="tree"]')
    expect(tree).toBeInTheDocument()
    expect(tree).toHaveAccessibleName('File tree')
  })

  it('applies role="treeitem" to items', () => {
    const {container} = HTMLRender(
      <ActionList role="tree" aria-label="File tree">
        <ActionList.Item role="treeitem">Item 1</ActionList.Item>
        <ActionList.Item role="treeitem">Item 2</ActionList.Item>
      </ActionList>,
    )

    const treeitems = container.querySelectorAll('[role="treeitem"]')
    expect(treeitems).toHaveLength(2)
  })

  it('renders items with list semantics (div container, not button)', () => {
    const {container} = HTMLRender(
      <ActionList role="tree" aria-label="File tree">
        <ActionList.Item role="treeitem">Item 1</ActionList.Item>
      </ActionList>,
    )

    const treeitem = container.querySelector('[role="treeitem"]')
    expect(treeitem).toBeInTheDocument()
    // Items with tree role should not render as buttons
    expect(treeitem?.tagName).not.toBe('BUTTON')
  })

  it('applies aria-selected for single selection with treeitem role', () => {
    const {container} = HTMLRender(
      <ActionListContainerContext.Provider value={{selectionAttribute: 'aria-selected'}}>
        <ActionList role="tree" selectionVariant="single" aria-label="File tree">
          <ActionList.Item role="treeitem" selected>
            Selected Item
          </ActionList.Item>
          <ActionList.Item role="treeitem" selected={false}>
            Unselected Item
          </ActionList.Item>
        </ActionList>
      </ActionListContainerContext.Provider>,
    )

    const treeitems = container.querySelectorAll('[role="treeitem"]')
    expect(treeitems[0]).toHaveAttribute('aria-selected', 'true')
    expect(treeitems[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('applies aria-selected for multiple selection with treeitem role', () => {
    const {container} = HTMLRender(
      <ActionListContainerContext.Provider value={{selectionAttribute: 'aria-selected'}}>
        <ActionList role="tree" selectionVariant="multiple" aria-label="File tree">
          <ActionList.Item role="treeitem" selected>
            Selected 1
          </ActionList.Item>
          <ActionList.Item role="treeitem" selected>
            Selected 2
          </ActionList.Item>
          <ActionList.Item role="treeitem" selected={false}>
            Unselected
          </ActionList.Item>
        </ActionList>
      </ActionListContainerContext.Provider>,
    )

    const treeitems = container.querySelectorAll('[role="treeitem"]')
    expect(treeitems[0]).toHaveAttribute('aria-selected', 'true')
    expect(treeitems[1]).toHaveAttribute('aria-selected', 'true')
    expect(treeitems[2]).toHaveAttribute('aria-selected', 'false')
  })

  it('renders selection visual for selected treeitems', () => {
    const {container} = HTMLRender(
      <ActionList role="tree" selectionVariant="single" aria-label="File tree">
        <ActionList.Item role="treeitem" selected>
          Selected Item
        </ActionList.Item>
        <ActionList.Item role="treeitem">Unselected Item</ActionList.Item>
      </ActionList>,
    )

    const selection = container.querySelector('[data-component="ActionList.Selection"]')
    expect(selection).toBeInTheDocument()
  })

  it('calls onSelect when a treeitem is clicked', async () => {
    const onSelect = vi.fn()
    HTMLRender(
      <ActionList role="tree" selectionVariant="single" aria-label="File tree">
        <ActionList.Item role="treeitem" onSelect={onSelect}>
          Item 1
        </ActionList.Item>
      </ActionList>,
    )

    const item = document.querySelector('[role="treeitem"]')!
    await userEvent.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('calls onSelect when Enter is pressed on a treeitem', async () => {
    const onSelect = vi.fn()
    HTMLRender(
      <ActionList role="tree" selectionVariant="single" aria-label="File tree">
        <ActionList.Item role="treeitem" onSelect={onSelect}>
          Item 1
        </ActionList.Item>
      </ActionList>,
    )

    const item = document.querySelector('[role="treeitem"]')!
    ;(item as HTMLElement).focus()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not call onSelect when item is disabled', async () => {
    const onSelect = vi.fn()
    HTMLRender(
      <ActionList role="tree" selectionVariant="single" aria-label="File tree">
        <ActionList.Item role="treeitem" disabled onSelect={onSelect}>
          Disabled Item
        </ActionList.Item>
      </ActionList>,
    )

    const item = document.querySelector('[role="treeitem"]')!
    await userEvent.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('supports leading and trailing visuals on treeitems', () => {
    const {container} = HTMLRender(
      <ActionList role="tree" aria-label="File tree">
        <ActionList.Item role="treeitem">
          <ActionList.LeadingVisual>Icon</ActionList.LeadingVisual>
          Item 1<ActionList.TrailingVisual>Badge</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>,
    )

    expect(container.querySelector('[data-component="ActionList.LeadingVisual"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="ActionList.TrailingVisual"]')).toBeInTheDocument()
  })
})
