import {page, userEvent} from 'vitest/browser'
import {fireEvent, render, act} from '@testing-library/react'
import {afterEach, describe, it, expect, vi} from 'vitest'
import React from 'react'
import type {SubTreeState} from './TreeView'
import {TreeView} from './TreeView'
import {GearIcon} from '@primer/octicons-react'
import {getLiveRegion} from '../live-region/__tests__/test-helpers'
import {implementsClassName} from '../utils/testing'
import classes from './TreeView.module.css'

afterEach(() => {
  vi.useRealTimers()
})

describe('Markup', () => {
  implementsClassName(TreeView, classes.TreeViewRootUlStyles)
  implementsClassName(TreeView.Item, classes.TreeViewItem)

  it('uses tree role', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const root = page.getByRole('tree')

    await expect.element(root).toHaveAccessibleName('Test tree')
  })

  it('uses treeitem role', () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const items = page.getByRole('treeitem').elements()

    expect(items).toHaveLength(3)
  })

  it('uses treeitem aria label', async () => {
    render(
      <>
        <TreeView>
          <TreeView.Item id="item-1" aria-label="Test tree item 1">
            Item 1
          </TreeView.Item>
          <TreeView.Item id="item-2" aria-labelledby="test-description">
            Item 2
          </TreeView.Item>
          <TreeView.Item id="item-2">Item 3</TreeView.Item>
        </TreeView>
        <span id="test-description">Tree item 2 description</span>
      </>,
    )

    const items = page.getByRole('treeitem').elements()
    expect(items).toHaveLength(3)
    await expect.element(items[0]).toHaveAccessibleName('Test tree item 1')
    await expect.element(items[1]).toHaveAccessibleName('Tree item 2 description')
    await expect.element(items[2]).toHaveAttribute('aria-labelledby')
    await expect.element(items[2]).toHaveAccessibleName('Item 3')
  })

  it('hides subtrees by default', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="parent">
          Parent
          <TreeView.SubTree>
            <TreeView.Item id="child">Child</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    const parentItem = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })
    const subtree = page.getByRole('group')

    await expect.element(parentItem).toHaveAttribute('aria-expanded', 'false')
    await expect.element(subtree).not.toBeInTheDocument()
  })

  it('uses aria-current', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2" current>
          Item 2
        </TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const currentItem = page.getByRole('treeitem', {
      name: 'Item 2',
      exact: true,
    })

    await expect.element(currentItem).toHaveAttribute('aria-current', 'true')
  })

  it('should be described by leading visuals', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">
          <TreeView.LeadingVisual label="leading">
            <svg aria-hidden={true} />
          </TreeView.LeadingVisual>
          Item 1
        </TreeView.Item>
        <TreeView.Item id="item-2">
          <TreeView.LeadingVisual>
            <svg aria-hidden={true} />
          </TreeView.LeadingVisual>
          Item 2
        </TreeView.Item>
      </TreeView>,
    )
    const item = page.getByLabelText(/Item 1/)
    await expect.element(item).toHaveAccessibleDescription('leading')

    const noDescription = page.getByLabelText(/Item 2/)
    await expect.element(noDescription).not.toHaveAccessibleDescription()
  })

  it('should be described by trailing visuals', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">
          Item 1
          <TreeView.TrailingVisual label="trailing">
            <svg aria-hidden={true} />
          </TreeView.TrailingVisual>
        </TreeView.Item>
        <TreeView.Item id="item-2">
          Item 2
          <TreeView.TrailingVisual>
            <svg aria-hidden={true} />
          </TreeView.TrailingVisual>
        </TreeView.Item>
      </TreeView>,
    )
    const item = page.getByLabelText(/Item 1/)
    await expect.element(item).toHaveAccessibleDescription('trailing')

    const noDescription = page.getByLabelText(/Item 2/)
    await expect.element(noDescription).not.toHaveAccessibleDescription()
  })

  it('should be described by leading and trailing visuals', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">
          <TreeView.LeadingVisual label="leading">
            <svg aria-hidden={true} />
          </TreeView.LeadingVisual>
          Item 1
          <TreeView.TrailingVisual label="trailing">
            <svg aria-hidden={true} />
          </TreeView.TrailingVisual>
        </TreeView.Item>
        <TreeView.Item id="item-2">
          <TreeView.LeadingVisual>
            <svg aria-hidden={true} />
          </TreeView.LeadingVisual>
          Item 2
          <TreeView.TrailingVisual>
            <svg aria-hidden={true} />
          </TreeView.TrailingVisual>
        </TreeView.Item>
      </TreeView>,
    )
    const item = page.getByLabelText(/Item 1/)
    await expect.element(item).toHaveAccessibleDescription('leading trailing')

    const noDescription = page.getByLabelText(/Item 2/)
    // Note: it seems the computed description here is a string with a single
    // space due to the implementation of `aria-describedby`. We currently set
    // both trailing and visual and when the nodes are not found in
    // `aria-describedby="uuid-leading uuid-trailing"` then it computes to a
    // space
    await expect.element(noDescription).toHaveAccessibleDescription(' ')
  })

  it('should not have aria-describedby when no leading or trailing visual', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
      </TreeView>,
    )

    const noDescription = page.getByLabelText(/Item 1/)
    await expect.element(noDescription).not.toHaveAccessibleDescription()
    await expect.element(noDescription).not.toHaveAttribute('aria-describedby')
  })

  it('should include `aria-expanded` when a SubTree contains content', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">
          Item 1
          <TreeView.SubTree>
            <TreeView.Item id="item-1-a">Item 1.a</TreeView.Item>
            <TreeView.Item id="item-1-b">Item 1.b</TreeView.Item>
            <TreeView.Item id="item-1-c">Item 1.c</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="item-2">
          Item 2
          <TreeView.SubTree />
        </TreeView.Item>
      </TreeView>,
    )

    let treeitem = page.getByRole('treeitem', {name: 'Item 1', exact: true})
    await expect.element(treeitem).toHaveAttribute('aria-expanded', 'false')

    await act(async () => userEvent.click(treeitem))
    await expect.element(treeitem).toHaveAttribute('aria-expanded', 'true')

    treeitem = page.getByRole('treeitem', {name: 'Item 2', exact: true})
    await expect.element(treeitem).not.toHaveAttribute('aria-expanded')

    await act(async () => userEvent.click(treeitem))
    await expect.element(treeitem).toHaveAttribute('aria-expanded', 'true')
  })

  it('should render with containIntrinsicSize', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="parent" containIntrinsicSize="2rem" defaultExpanded>
          Parent
          <TreeView.SubTree>
            <TreeView.Item containIntrinsicSize="2rem" id="child">
              Child
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    // The test runner removes the contain-intrinsic-size and content-visibility
    // properties, so we can only test that the elements are still rendering.
    const childItem = page.getByText(/Child/)
    await expect.element(childItem).toBeInTheDocument()
    const parentItem = page.getByText(/Parent/)
    await expect.element(parentItem).toBeInTheDocument()
  })

  it('should move focus to current treeitem by default', async () => {
    render(
      <div>
        <button type="button">Focusable element</button>
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1">Item 1</TreeView.Item>
          <TreeView.Item id="item-2" current>
            Item 2
          </TreeView.Item>
          <TreeView.Item id="item-3">Item 3</TreeView.Item>
        </TreeView>
      </div>,
    )

    // Focus button
    const button = page.getByRole('button', {name: /Focusable element/})
    act(() => {
      button.element().focus()
    })
    expect(button.element()).toHaveFocus()

    // Move focus to tree
    const item1 = page.getByRole('treeitem', {name: /Item 1/})
    act(() => {
      item1.element().focus()
    })

    // Focus should be on current treeitem
    const item2 = page.getByRole('treeitem', {name: /Item 2/})
    expect(item2.element()).toHaveFocus()
  })

  it('should toggle when receiving focus from chevron click', async () => {
    render(
      <div>
        <button type="button">Focusable element</button>
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1">
            Item 1
            <TreeView.SubTree>
              <TreeView.Item id="subitem-1">SubItem 1</TreeView.Item>
              <TreeView.Item id="subitem-2">SubItem 2</TreeView.Item>
              <TreeView.Item id="subitem-3">SubItem 3</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="item-2" current>
            Item 2
          </TreeView.Item>
          <TreeView.Item id="item-3">Item 3</TreeView.Item>
        </TreeView>
      </div>,
    )

    // Focus button
    const button = page.getByRole('button', {name: /Focusable element/})
    act(() => {
      button.element().focus()
    })
    expect(button.element()).toHaveFocus()

    // Move focus to tree
    const item1 = page.getByRole('treeitem', {name: /Item 1/})
    const toggle = item1.element().querySelector('.PRIVATE_TreeView-item-toggle') as HTMLElement
    act(() => {
      // The pointer-only chevron retains its programmatic click exception to
      // avoid the known focus-zone warning from browser pointer focus.
      toggle.click()
    })

    // Focus should be on current treeitem
    const subItem1 = page.getByRole('treeitem', {name: /SubItem 1/})
    await expect.element(subItem1).toBeInTheDocument()
  })

  it("should move focus to first treeitem when focusing back in after clicking on a treeitem's secondary action", async () => {
    render(
      <div>
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1">Item 1</TreeView.Item>
          <TreeView.Item id="item-2">
            Item 2
            <button id="item-2-button" tabIndex={-1} aria-hidden type="button">
              Link in Item 2
            </button>
          </TreeView.Item>
          <TreeView.Item id="item-3">Item 3</TreeView.Item>
        </TreeView>
        <button type="button">Focusable element</button>
      </div>,
    )

    // Click on treeitem's secondary action
    const item2Button = page.getByText(/Link in Item 2/i)
    act(() => {
      item2Button.element().focus()
    })
    expect(item2Button.element()).toHaveFocus()

    // Move focus to button outside of TreeView
    const outerButton = page.getByRole('button', {name: /Focusable element/})
    act(() => {
      outerButton.element().focus()
    })
    expect(outerButton.element()).toHaveFocus()

    // Move focus into TreeView. Focus should be on first treeitem
    const item1 = page.getByRole('treeitem', {name: /Item 1/})
    act(() => {
      item1.element().focus()
    })
    expect(item1.element()).toHaveFocus()
  })

  it('keeps focus on a nested control when pressing ArrowDown', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">
          Item 2
          <button type="button" tabIndex={-1} aria-hidden>
            Nested action
          </button>
        </TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const item = page.getByRole('treeitem', {
      name: 'Item 2',
      exact: true,
    })
    const button = page.getByText('Nested action', {
      exact: true,
    })

    act(() => item.element().focus())
    act(() => button.element().focus())
    expect(button.element()).toHaveFocus()

    expect(fireEvent.keyDown(button.element(), {key: 'ArrowDown'})).toBe(false)
    expect(button.element()).toHaveFocus()
  })

  describe('as prop', () => {
    it('renders as an `li` by default', () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1">Item 1</TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      expect(item.element().tagName).toBe('LI')
    })

    it('renders as the element specified by `as`', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="a" href="#item-1" id="item-1">
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      expect(item.element().tagName).toBe('A')
      await expect.element(item).toHaveAttribute('href', '#item-1')
    })

    it('wraps the polymorphic element in an `li role="none"` to keep markup valid', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="a" href="#item-1" id="item-1">
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      const wrapper = item.element().parentElement
      expect(wrapper?.tagName).toBe('LI')
      await expect.element(wrapper).toHaveAttribute('role', 'none')
    })

    it('does not add an extra `li role="none"` wrapper when `as="li"`', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="li" id="item-1">
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      expect(item.element().tagName).toBe('LI')
      // The treeitem should be a direct child of the tree (`<ul>`), not wrapped
      // in an outer `<li role="none">`.
      await expect.element(item.element().parentElement).toHaveAttribute('role', 'tree')
    })

    it('supports polymorphic Item with custom component via `as`', async () => {
      const CustomLink = React.forwardRef<
        HTMLAnchorElement,
        React.AnchorHTMLAttributes<HTMLAnchorElement> & {custom: boolean}
      >(({children, custom, ...props}, ref) => (
        <a ref={ref} data-custom-link={custom} {...props}>
          {children}
        </a>
      ))
      CustomLink.displayName = 'CustomLink'

      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as={CustomLink} href="#docs" custom={true} id="item-docs">
            Docs
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Docs/})
      expect(item.element().tagName).toBe('A')
      await expect.element(item).toHaveAttribute('href', '#docs')
      await expect.element(item).toHaveAttribute('data-custom-link', 'true')
    })

    it('preserves treeitem role, tabIndex, and aria attributes when `as` is provided', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="a" href="#item-1" id="item-1" current>
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      await expect.element(item).toHaveAttribute('role', 'treeitem')
      await expect.element(item).toHaveAttribute('tabindex', '0')
      await expect.element(item).toHaveAttribute('aria-current', 'true')
      await expect.element(item).toHaveAttribute('aria-level', '1')
    })

    it('forwards ref to the element specified by `as`', () => {
      const ref = React.createRef<HTMLAnchorElement>()
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="a" href="#item-1" id="item-1" ref={ref}>
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      expect(ref.current).not.toBeNull()
      expect(ref.current?.tagName).toBe('A')
    })

    it('calls onSelect when the polymorphic element is clicked', async () => {
      const onSelect = vi.fn()
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item as="a" href="#item-1" id="item-1" onSelect={onSelect}>
            Item 1
          </TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {name: /Item 1/})
      await act(async () => userEvent.click(item))
      expect(onSelect).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Keyboard interactions', () => {
  describe('ArrowDown', () => {
    it('moves focus to the next visible treeitem', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1" defaultExpanded>
            Item 1
            <TreeView.SubTree>
              <TreeView.Item id="item-1-1">Item 1.1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="item-2">
            Item 2
            <TreeView.SubTree>
              <TreeView.Item id="item-2-1">Item 2.1</TreeView.Item>
              <TreeView.Item id="item-2-2">Item 2.2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="item-3">Item 3</TreeView.Item>
        </TreeView>,
      )

      const item1 = page.getByRole('treeitem', {
        name: 'Item 1',
        exact: true,
      })
      const item11 = page.getByRole('treeitem', {
        name: 'Item 1.1',
        exact: true,
      })
      const item2 = page.getByRole('treeitem', {
        name: 'Item 2',
        exact: true,
      })
      const item3 = page.getByRole('treeitem', {
        name: 'Item 3',
        exact: true,
      })

      act(() => {
        // Focus first item
        item1.element().focus()
      })

      // Press ↓
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // item 1.1 should be focused
      await expect.element(item11).toHaveFocus()

      // Press ↓
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // item 2 should be focused
      await expect.element(item2).toHaveFocus()

      // Press ↓
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // item 3 should have focus (skips item 2.1 and item 2.2 because they are hidden)
      await expect.element(item3).toHaveFocus()

      // Press ↓
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // focus should not change (item 3 is the last visible treeitem)
      await expect.element(item3).toHaveFocus()
    })
  })

  describe('ArrowUp', () => {
    it('moves focus to the previous visible treeitem', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item-1" defaultExpanded>
            Item 1
            <TreeView.SubTree>
              <TreeView.Item id="item-1-1">Item 1.1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="item-2">
            Item 2
            <TreeView.SubTree>
              <TreeView.Item id="item-2-1">Item 2.1</TreeView.Item>
              <TreeView.Item id="item-2-2">Item 2.2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="item-3">Item 3</TreeView.Item>
        </TreeView>,
      )

      const item1 = page.getByRole('treeitem', {
        name: 'Item 1',
        exact: true,
      })
      const item11 = page.getByRole('treeitem', {
        name: 'Item 1.1',
        exact: true,
      })
      const item2 = page.getByRole('treeitem', {
        name: 'Item 2',
        exact: true,
      })
      const item3 = page.getByRole('treeitem', {
        name: 'Item 3',
        exact: true,
      })

      act(() => {
        // Focus first item
        item1.element().focus()
      })

      // Press ↓ 4 times to move aria-activedescendant to item 3
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // item 3 should be focused
      await expect.element(item3).toHaveFocus()

      // Press ↑
      await act(async () => userEvent.keyboard('{ArrowUp}'))

      // Item 2 should have focus (skips item 2.1 and item 2.2 because they are hidden)
      await expect.element(item2).toHaveFocus()

      // Press ↑
      await act(async () => userEvent.keyboard('{ArrowUp}'))

      // Item 1.1 should be focused
      await expect.element(item11).toHaveFocus()

      // Press ↑
      await act(async () => userEvent.keyboard('{ArrowUp}'))

      // Item 1 should be focused
      await expect.element(item1).toHaveFocus()

      // Press ↑
      await act(async () => userEvent.keyboard('{ArrowUp}'))

      // Focus should not change (item 1 is the first visible treeitem)
      await expect.element(item1).toHaveFocus()
    })
  })

  describe('ArrowLeft', () => {
    it('collapses an expanded item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      let subtree = page.getByRole('group')

      // aria-expanded should be true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      await expect.element(subtree).toBeVisible()

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press ←
      await act(async () => userEvent.keyboard('{ArrowLeft}'))

      // aria-expanded should now be false
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Parent item should still be focused
      await expect.element(parentItem).toHaveFocus()

      subtree = page.getByRole('group')

      // Subtree should now be hidden
      await expect.element(subtree).not.toBeInTheDocument()
    })

    it('does nothing on a root-level collapsed item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })

      // aria-expanded should be false by default
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'false')

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press ←
      await act(async () => userEvent.keyboard('{ArrowLeft}'))

      // aria-expanded should still be false
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Focus should not change
      await expect.element(parentItem).toHaveFocus()
    })

    it('does nothing on a root-level end item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item">Item</TreeView.Item>
        </TreeView>,
      )

      const item = page.getByRole('treeitem', {
        name: 'Item',
        exact: true,
      })

      act(() => {
        // Focus first item
        item.element().focus()
      })

      // Press ←
      await act(async () => userEvent.keyboard('{ArrowLeft}'))

      // Focus should not change
      await expect.element(item).toHaveFocus()
    })

    it('moves focus to parent of end item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      const child2 = page.getByRole('treeitem', {
        name: 'Child 2',
        exact: true,
      })

      act(() => {
        // Focus fist item
        parentItem.element().focus()
      })

      // Press ↓ 2 times to move focus to child 2
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Child 2 should be focused
      await expect.element(child2).toHaveFocus()

      // Press ←
      await act(async () => userEvent.keyboard('{ArrowLeft}'))

      // Parent item should be focused
      await expect.element(parentItem).toHaveFocus()
    })

    it('moves focus to parent of collapsed item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
              <TreeView.Item id="nested-parent">
                Nested parent
                <TreeView.SubTree>
                  <TreeView.Item id="nested-child">Nested child</TreeView.Item>
                </TreeView.SubTree>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      const nestedParentItem = page.getByRole('treeitem', {
        name: 'Nested parent',
        exact: true,
      })

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press ↓ 2 times to move focus to nested parent
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Nested parent item should be focused
      await expect.element(nestedParentItem).toHaveFocus()

      // Press ←
      await act(async () => userEvent.keyboard('{ArrowLeft}'))

      // Parent item should be focused
      await expect.element(parentItem).toHaveFocus()
    })
  })

  describe('ArrowRight', () => {
    it('expands a collapsed item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })

      // aria-expanded should be false by default
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'false')

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press →
      await act(async () => userEvent.keyboard('{ArrowRight}'))

      // aria-expanded should now be true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Parent item should still be focused
      await expect.element(parentItem).toHaveFocus()

      const subtree = page.getByRole('group')

      // Subtree should now be visible
      await expect.element(subtree).toBeVisible()
    })

    it('moves focus to first child of an expanded item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })

      // aria-expanded should be true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

      act(() => {
        parentItem.element().focus()
      })
      await expect.element(parentItem).toHaveFocus()

      await act(async () => userEvent.keyboard('{ArrowRight}'))

      const childItem = page.getByRole('treeitem', {
        name: 'Child',
        exact: true,
      })

      // Child item should be focused
      await expect.element(childItem).toHaveFocus()

      // aria-expanded should still be true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')
    })

    it('does nothing on an end item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      const child1 = page.getByRole('treeitem', {
        name: 'Child 1',
        exact: true,
      })

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press ↓ to move focus to child 1
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Child 1 should be focused
      await expect.element(child1).toHaveFocus()

      // Press →
      await act(async () => userEvent.keyboard('{ArrowRight}'))

      // Focus should not change
      await expect.element(child1).toHaveFocus()
    })
  })

  describe('Backspace', () => {
    it('should move focus to the parent item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      const child = page.getByRole('treeitem', {
        name: 'Child',
        exact: true,
      })
      act(() => {
        child.element().focus()
      })

      // Press Backspace
      await act(async () => userEvent.keyboard('{Backspace}'))

      await expect.element(parentItem).toHaveFocus()
    })

    it('should not collapse an expanded item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })
      const subtree = page.getByRole('group')

      // aria-expanded should be true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      await expect.element(subtree).toBeVisible()

      act(() => {
        // Focus first item
        parentItem.element().focus()
      })

      // Press Backspace
      await act(async () => userEvent.keyboard('{Backspace}'))

      // aria-expanded should stay set as true
      await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Parent item should still be focused
      await expect.element(parentItem).toHaveFocus()
    })
  })

  describe('Home', () => {
    it('moves focus to first visible item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent-1">
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-2">
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-3">
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item id="child-3">Child 3</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parent1 = page.getByRole('treeitem', {
        name: 'Parent 1',
        exact: true,
      })
      const parent3 = page.getByRole('treeitem', {
        name: 'Parent 2',
        exact: true,
      })

      act(() => {
        // Focus first item
        parent1.element().focus()
      })

      // Press ↓ 2 times to move focus to parent 3
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Parent 3 should be focused
      await expect.element(parent3).toHaveFocus()

      // Press Home
      await act(async () => userEvent.keyboard('{Home}'))

      // Parent 1 should be focused
      await expect.element(parent1).toHaveFocus()
    })
  })

  describe('End', () => {
    it('moves focus to last visible item', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent-1">
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-2">
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-3">
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item id="child-3">Child 3</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parent1 = page.getByRole('treeitem', {
        name: 'Parent 1',
        exact: true,
      })
      const parent3 = page.getByRole('treeitem', {
        name: 'Parent 3',
        exact: true,
      })

      act(() => {
        // Focus first item
        parent1.element().focus()
      })

      // Press End
      await act(async () => userEvent.keyboard('{End}'))

      // Parent 3 should be focused
      await expect.element(parent3).toHaveFocus()

      // Press → to expand parent 3
      await act(async () => userEvent.keyboard('{ArrowRight}'))

      // Press End
      await act(async () => userEvent.keyboard('{End}'))

      const child3 = page.getByRole('treeitem', {
        name: 'Child 3',
        exact: true,
      })

      // Child 3 should be focused
      await expect.element(child3).toHaveFocus()
    })
  })

  describe('Enter', () => {
    it('calls onSelect function if provided and checks if the item has been selected', async () => {
      const onSelect = vi.fn()
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent-1" onSelect={onSelect}>
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item id="child-1" onSelect={onSelect}>
                Child 1
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-2" onSelect={onSelect} expanded>
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item id="child-2" onSelect={onSelect}>
                Child2
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-3" onSelect={onSelect}>
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item id="child-3" onSelect={onSelect}>
                Child 3
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )
      const itemChild = page.getByRole('treeitem', {
        name: 'Child2',
        exact: true,
      })

      act(() => {
        // Focus first item
        itemChild.element().focus()
      })

      // Press Enter
      await act(async () => userEvent.keyboard('{Enter}'))

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)

      onSelect.mockClear()

      // Press middle click
      fireEvent.click(document.activeElement?.firstChild || document.body, {button: 1})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parent = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })

      act(() => {
        // Focus first item
        parent.element().focus()
      })

      // aria-expanded should be false
      await expect.element(parent).toHaveAttribute('aria-expanded', 'false')

      // Press Enter
      await act(async () => userEvent.keyboard('{Enter}'))

      // aria-expanded should now be true
      await expect.element(parent).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      await expect.element(page.getByRole('group')).toBeVisible()

      // Press Enter
      await act(async () => userEvent.keyboard('{Enter}'))

      // aria-expanded should now be false
      await expect.element(parent).toHaveAttribute('aria-expanded', 'false')

      // Subtree should no longer be visible
      await expect.element(page.getByRole('group')).not.toBeInTheDocument()
    })
  })

  describe('Space', () => {
    it('calls onSelect function if provided and checks if the item has been selected', async () => {
      const onSelect = vi.fn()
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent-1" onSelect={onSelect}>
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item id="child-1" onSelect={onSelect}>
                Child 1
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-2" onSelect={onSelect} expanded>
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item id="child-2" onSelect={onSelect}>
                Child2
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="parent-3" onSelect={onSelect}>
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item id="child-3" onSelect={onSelect}>
                Child 3
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )
      const itemChild = page.getByRole('treeitem', {
        name: 'Child2',
        exact: true,
      })

      act(() => {
        // Focus first item
        itemChild.element().focus()
      })

      // Press Enter
      await act(async () => userEvent.keyboard(' '))

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)

      onSelect.mockClear()

      // Press middle click
      fireEvent.click(document.activeElement?.firstChild || document.body, {button: 1})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parent = page.getByRole('treeitem', {
        name: 'Parent',
        exact: true,
      })

      act(() => {
        // Focus first item
        parent.element().focus()
      })

      // aria-expanded should be false
      await expect.element(parent).toHaveAttribute('aria-expanded', 'false')

      // Press Enter
      await act(async () => userEvent.keyboard('{Enter}'))

      // aria-expanded should now be true
      await expect.element(parent).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      await expect.element(page.getByRole('group')).toBeVisible()

      // Press Enter
      await act(async () => userEvent.keyboard('{Enter}'))

      // aria-expanded should now be false
      await expect.element(parent).toHaveAttribute('aria-expanded', 'false')

      // Subtree should no longer be visible
      await expect.element(page.getByRole('group')).not.toBeInTheDocument()
    })
  })

  describe('Typeahead', () => {
    it('moves focus to the next item that matches the typed character', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="apple">
            Apple
            <TreeView.SubTree>
              <TreeView.Item id="cantalope">Cantalope</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item id="banana">Banana</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="cucumber">Cucumber</TreeView.Item>
        </TreeView>,
      )

      const apple = page.getByRole('treeitem', {
        name: 'Apple',
        exact: true,
      })
      const cherry = page.getByRole('treeitem', {
        name: 'Cherry',
        exact: true,
      })

      act(() => {
        // Focus first item
        apple.element().focus()
      })

      // Press C
      await act(async () => userEvent.keyboard('c'))

      // Cherry should be focused
      await expect.element(cherry).toHaveFocus()

      // Notice that the focus is not set to cantalope because
      // it is a child of apple and apple is collapsed.
    })

    it('does nothing if no items match the typed character', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="apple">Apple</TreeView.Item>
          <TreeView.Item id="banana">Banana</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="durian">Durian</TreeView.Item>
        </TreeView>,
      )

      const apple = page.getByRole('treeitem', {
        name: 'Apple',
        exact: true,
      })

      act(() => {
        // Focus first item
        apple.element().focus()
      })

      // Apple should be focused
      await expect.element(apple).toHaveFocus()

      // Press Z
      await act(async () => userEvent.keyboard('z'))

      // Apple should still be focused
      await expect.element(apple).toHaveFocus()
    })

    it('supports multiple typed characters', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="apple">Apple</TreeView.Item>
          <TreeView.Item id="banana">Banana</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="cantalope-1">Cantalope 1</TreeView.Item>
          <TreeView.Item id="cantalope-2">Cantalope 2</TreeView.Item>
        </TreeView>,
      )

      const apple = page.getByRole('treeitem', {
        name: 'Apple',
        exact: true,
      })
      const cantalope = page.getByRole('treeitem', {
        name: 'Cantalope 1',
        exact: true,
      })

      act(() => {
        // Focus first item
        apple.element().focus()
      })

      // Press C + A + N
      await act(async () => userEvent.keyboard('c'))
      await act(async () => userEvent.keyboard('a'))
      await act(async () => userEvent.keyboard('n'))

      // Cantalope should be focused
      await expect.element(cantalope).toHaveFocus()
    })

    it('prioritizes items following the current aria-activedescendant', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="cucumber">Cucumber</TreeView.Item>
          <TreeView.Item id="cherry" current>
            Cherry
          </TreeView.Item>
          <TreeView.Item id="cantalope">Cantalope</TreeView.Item>
        </TreeView>,
      )

      const cucumber = page.getByRole('treeitem', {
        name: 'Cucumber',
        exact: true,
      })
      const cherry = page.getByRole('treeitem', {
        name: 'Cherry',
        exact: true,
      })
      const cantalope = page.getByRole('treeitem', {
        name: 'Cantalope',
        exact: true,
      })

      act(() => {
        // Focus first item
        cucumber.element().focus()
      })

      // Press ↓ to move focus to cherry
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Cherry should be focused
      await expect.element(cherry).toHaveFocus()

      // Press C
      await act(async () => userEvent.keyboard('c'))

      // Cantalope should be focused
      await expect.element(cantalope).toHaveFocus()
    })

    it('wraps around to the beginning if no items match after the current aria-activedescendant', async () => {
      render(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="cucumber">Cucumber</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="cantalope" current>
            Cantalope
          </TreeView.Item>
          <TreeView.Item id="apple">Apple</TreeView.Item>
        </TreeView>,
      )

      const cantalope = page.getByRole('treeitem', {
        name: 'Cantalope',
        exact: true,
      })
      const cucumber = page.getByRole('treeitem', {
        name: 'Cucumber',
        exact: true,
      })

      act(() => {
        // Focus first item
        cucumber.element().focus()
      })

      // Press ↓ 2 times to move focus to cantalope
      await act(async () => userEvent.keyboard('{ArrowDown}'))
      await act(async () => userEvent.keyboard('{ArrowDown}'))

      // Cantalope should be focused
      await expect.element(cantalope).toHaveFocus()

      // Press C
      await act(async () => userEvent.keyboard('c'))

      // Cucumber should be focused
      await expect.element(cucumber).toHaveFocus()
    })
  })
})

describe('State', () => {
  it('persists expanded state of nested items', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1" defaultExpanded>
          Item 1
          <TreeView.SubTree>
            <TreeView.Item id="item-2">
              Item 2
              <TreeView.SubTree>
                <TreeView.Item id="item-3">Item 3</TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    const item1 = page.getByRole('treeitem', {
      name: 'Item 1',
      exact: true,
    })
    const item2 = page.getByRole('treeitem', {
      name: 'Item 2',
      exact: true,
    })

    // Item 2 should be collapsed by default
    await expect.element(item2).toHaveAttribute('aria-expanded', 'false')

    act(() => {
      // Focus item 2
      item2.element().focus()
    })

    // Press Enter to expand item 2
    await act(async () => userEvent.keyboard('{Enter}'))

    // Item 2 should be expanded
    await expect.element(item2).toHaveAttribute('aria-expanded', 'true')

    // Press ↑ to move focus to item 1
    await act(async () => userEvent.keyboard('{ArrowUp}'))

    // Press Enter to collapse item 1
    await act(async () => userEvent.keyboard('{Enter}'))

    // Item 1 should be collapsed
    await expect.element(item1).toHaveAttribute('aria-expanded', 'false')

    // Press Enter again to expand item 1
    await act(async () => userEvent.keyboard('{Enter}'))

    // Item 1 should be expanded
    await expect.element(item1).toHaveAttribute('aria-expanded', 'true')

    // Item 2 should still be expanded
    await expect
      .element(
        page.getByRole('treeitem', {
          name: 'Item 2',
          exact: true,
        }),
      )
      .toHaveAttribute('aria-expanded', 'true')
  })

  it('can be controlled', async () => {
    function TestTree() {
      const [expanded, setExpanded] = React.useState(true)
      return (
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" expanded={expanded} onExpandedChange={setExpanded}>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )
    }

    render(<TestTree />)

    const parent = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })
    const child = page.getByRole('treeitem', {
      name: 'Child',
      exact: true,
    })

    const childElement = child.element()

    // Parent should be expanded
    await expect.element(parent).toHaveAttribute('aria-expanded', 'true')
    await expect.element(child).toBeVisible()

    act(() => {
      // Focus first item
      parent.element().focus()
    })

    // Press ← to collapse the parent
    await act(async () => userEvent.keyboard('{ArrowLeft}'))

    // Parent should be collapsed
    await expect.element(parent).toHaveAttribute('aria-expanded', 'false')
    expect(childElement).not.toBeVisible()
  })
})

describe('Asynchronous loading', () => {
  afterEach(() => {
    const liveRegion = document.querySelector('live-region')
    if (liveRegion) {
      document.body.removeChild(liveRegion)
    }
  })

  it('updates aria live region when loading is done', async () => {
    function TestTree() {
      const [state, setState] = React.useState<SubTreeState>('initial')

      const setLoadingState = () => {
        setState(state === 'initial' ? 'loading' : 'done')
      }

      return (
        <div>
          {/* Mimic the completion of async loading by clicking the button */}
          <button type="button" onClick={setLoadingState}>
            Load
          </button>
          <TreeView aria-label="Test tree">
            <TreeView.Item id="parent" defaultExpanded>
              Parent
              <TreeView.SubTree state={state}>
                <TreeView.Item id="child-item">Child Item</TreeView.Item>
                <TreeView.Item id="child-subtree">
                  Child Subtree
                  <TreeView.SubTree state={'done'}>
                    <TreeView.Item id="child-subtree-1">Child 1</TreeView.Item>
                    <TreeView.Item id="child-subtree-2">Child 2</TreeView.Item>
                  </TreeView.SubTree>
                </TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView>
        </div>
      )
    }

    render(<TestTree />)

    const doneButton = page.getByRole('button', {
      name: 'Load',
      exact: true,
    })

    await act(async () => userEvent.click(doneButton))

    // Get live region after the first announcement creates it
    await expect.poll(() => getLiveRegion().getMessage('polite')).toBe('Parent content loading')
    const liveRegion = getLiveRegion()

    await act(async () => userEvent.click(doneButton))

    await expect.poll(() => liveRegion.getMessage('polite')).toBe('Parent content loaded')
  })

  it('moves focus from loading item to first child', async () => {
    vi.useFakeTimers()

    function TestTree() {
      const [state, setState] = React.useState<SubTreeState>('loading')

      React.useEffect(() => {
        const timer = setTimeout(() => setState('done'), 400)
        return () => clearTimeout(timer)
      }, [])

      return (
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree state={state}>
              <TreeView.Item id="child-1">Child 1</TreeView.Item>
              <TreeView.Item id="child-2">Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )
    }

    render(<TestTree />)

    const parentItem = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })
    const loadingItem = page.getByRole('treeitem', {
      name: 'Loading...',
      exact: true,
    })

    act(() => {
      // Focus first item
      parentItem.element().focus()
    })

    await act(async () => userEvent.keyboard('{ArrowDown}'))

    // Loading item should be focused
    await expect.element(loadingItem).toHaveFocus()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400)
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    // Wait for async loading to complete
    const firstChild = page.getByRole('treeitem', {
      name: 'Child 1',
      exact: true,
    })

    // First child should be focused
    expect(firstChild.element()).toHaveFocus()
  })

  it('moves focus to parent item after closing error dialog', async () => {
    vi.useFakeTimers()

    function TestTree() {
      const [error, setError] = React.useState('Test error')

      return (
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              {error ? (
                <TreeView.ErrorDialog
                  onRetry={() => {
                    setError('')
                  }}
                  onDismiss={() => setError('')}
                >
                  {error}
                </TreeView.ErrorDialog>
              ) : null}
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )
    }

    render(<TestTree />)
    const dialog = page.getByRole('alertdialog')
    const parentItem = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })

    // Parent item should not be focused
    await expect.element(parentItem).not.toHaveFocus()

    // Dialog should be visible
    await expect.element(dialog).toBeVisible()
    const dialogElement = dialog.element()

    await act(async () => userEvent.keyboard('{Escape}'))

    // Dialog should not be visible
    expect(dialogElement).not.toBeVisible()

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    // Parent item should be focused
    expect(parentItem.element()).toHaveFocus()
  })

  it('ignores arrow keys when error dialog is open', async () => {
    render(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="parent" defaultExpanded>
          Parent
          <TreeView.SubTree>
            <TreeView.ErrorDialog>Opps</TreeView.ErrorDialog>
            <TreeView.Item id="child">Child</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    const parentItem = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })

    // Parent item should be expanded
    await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

    const retryButton = page.getByRole('button', {
      name: 'Retry',
      exact: true,
    })
    await expect.element(retryButton).toHaveFocus()

    await act(async () => userEvent.keyboard('{ArrowLeft}'))

    // Parent item should still be expanded
    await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

    await act(async () => userEvent.keyboard('{Backspace}'))

    // Parent item should still be expanded
    await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')
  })

  it('should update `aria-expanded` if no content is loaded in', async () => {
    vi.useFakeTimers()

    function Example() {
      const [state, setState] = React.useState<SubTreeState>('loading')
      const timeoutId = React.useRef<ReturnType<typeof setTimeout> | null>(null)

      React.useEffect(() => {
        return () => {
          if (timeoutId.current) {
            clearTimeout(timeoutId.current)
            timeoutId.current = null
          }
        }
      }, [])

      return (
        <TreeView aria-label="Test tree">
          <TreeView.Item
            id="item-1"
            onExpandedChange={expanded => {
              if (expanded) {
                timeoutId.current = setTimeout(() => {
                  setState('done')
                }, 1000)
              }
            }}
          >
            Item 1
            <TreeView.SubTree state={state} />
          </TreeView.Item>
        </TreeView>
      )
    }

    render(<Example />)

    const treeitem = page.getByRole('treeitem', {
      name: 'Item 1',
      exact: true,
    })
    await expect.element(treeitem).toHaveAttribute('aria-expanded', 'false')
    await act(async () =>
      userEvent.click(
        page.getByText('Item 1', {
          exact: true,
        }),
      ),
    )

    await expect.element(treeitem).toHaveAttribute('aria-expanded', 'true')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(treeitem.element()).toHaveAttribute('aria-expanded', 'true')
    expect(page.getByLabelText('No items found', {exact: true}).element()).toBeInTheDocument()
  })

  it('should have `aria-expanded` when directory is empty', async () => {
    render(
      <TreeView aria-label="Files changed">
        <TreeView.Item id="src" defaultExpanded>
          <TreeView.LeadingVisual>
            <TreeView.DirectoryIcon />
          </TreeView.LeadingVisual>
          Parent
          <TreeView.SubTree>
            <TreeView.Item id="src/Avatar.tsx">child</TreeView.Item>
            <TreeView.Item id="src/Button.tsx" current>
              child current
            </TreeView.Item>
            <TreeView.Item id="src/Box.tsx">
              empty child
              <TreeView.SubTree />
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    const parentItem = page.getByRole('treeitem', {
      name: 'Parent',
      exact: true,
    })

    // Parent item should be expanded
    await expect.element(parentItem).toHaveAttribute('aria-expanded', 'true')

    // Current child should not have `aria-expanded`
    await expect
      .element(
        page.getByRole('treeitem', {
          name: 'child current',
          exact: true,
        }),
      )
      .not.toHaveAttribute('aria-expanded')

    // Empty child should not have `aria-expanded` when closed
    await expect
      .element(
        page.getByRole('treeitem', {
          name: 'empty child',
          exact: true,
        }),
      )
      .not.toHaveAttribute('aria-expanded')

    await act(async () =>
      userEvent.click(
        page.getByRole('treeitem', {
          name: 'empty child',
          exact: true,
        }),
      ),
    )

    // Empty child should have `aria-expanded` when opened
    await expect
      .element(
        page.getByRole('treeitem', {
          name: 'empty child',
          exact: true,
        }),
      )
      .toHaveAttribute('aria-expanded')
  })
})

it('should render `TrailingAction`', async () => {
  render(
    <TreeView aria-label="Files changed">
      <TreeView.Item
        id="src"
        defaultExpanded
        secondaryActions={[{icon: GearIcon, label: 'Item settings', onClick: () => {}}]}
      >
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        Parent
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">child</TreeView.Item>
          <TreeView.Item id="src/Button.tsx" current>
            child current
          </TreeView.Item>
          <TreeView.Item id="src/Box.tsx">
            empty child
            <TreeView.SubTree />
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>,
  )

  await expect.element(page.getByRole('button', {includeHidden: true})).toHaveAttribute('aria-labelledby')
})

it('should have keyboard shortcut command as part of accessible name when using `TrailingAction`', async () => {
  render(
    <TreeView aria-label="Files changed">
      <TreeView.Item
        id="src"
        defaultExpanded
        secondaryActions={[{icon: GearIcon, label: 'Item settings', onClick: () => {}}]}
      >
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        Parent
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">child</TreeView.Item>
          <TreeView.Item id="src/Button.tsx" current>
            child current
          </TreeView.Item>
          <TreeView.Item id="src/Box.tsx">
            empty child
            <TreeView.SubTree />
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>,
  )

  await expect.element(page.getByRole('treeitem', {name: /for more actions\.$/})).toBeInTheDocument()
})

it('should have keyboard shortcut command as part of accessible name when using `TrailingAction` and `aria-label`', async () => {
  render(
    <TreeView aria-label="Files changed">
      <TreeView.Item
        id="src"
        aria-label="Parent"
        defaultExpanded
        secondaryActions={[{icon: GearIcon, label: 'Item settings', onClick: () => {}}]}
      >
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        Parent
      </TreeView.Item>
    </TreeView>,
  )

  await expect.element(page.getByRole('treeitem', {name: /for more actions\.$/})).toBeInTheDocument()
})

it('should activate the dialog for trailing action when keyboard shortcut is used', async () => {
  render(
    <TreeView aria-label="Files changed">
      <TreeView.Item
        id="src"
        defaultExpanded
        secondaryActions={[
          {icon: GearIcon, label: 'Item settings', onClick: () => {}},
          {icon: GearIcon, label: 'Item settings', onClick: () => {}},
        ]}
      >
        <TreeView.LeadingVisual>
          <TreeView.DirectoryIcon />
        </TreeView.LeadingVisual>
        Parent
        <TreeView.SubTree>
          <TreeView.Item id="src/Avatar.tsx">child</TreeView.Item>
          <TreeView.Item id="src/Button.tsx" current>
            child current
          </TreeView.Item>
          <TreeView.Item id="src/Box.tsx">
            empty child
            <TreeView.SubTree />
          </TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>,
  )

  const treeItem = page.getByRole('treeitem', {
    name: /for more actions\.$/,
  })

  act(() => {
    treeItem.element().focus()
  })
  await expect.element(treeItem).toHaveFocus()

  await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()

  await act(async () => userEvent.keyboard('{Meta>}{Shift>}u{/Shift}{/Meta}'))

  await expect.element(page.getByRole('dialog')).toBeInTheDocument()
})
