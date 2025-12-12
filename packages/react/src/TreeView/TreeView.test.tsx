import {fireEvent, render, act, screen} from '@testing-library/react'
import {userEvent} from 'vitest/browser'
import {beforeEach, afterEach, describe, it, expect, vi} from 'vitest'
import React from 'react'
import type {SubTreeState} from './TreeView'
import {TreeView} from './TreeView'
import {GearIcon} from '@primer/octicons-react'
import {getLiveRegion} from '../live-region/__tests__/test-helpers'
import {implementsClassName} from '../utils/testing'
import classes from './TreeView.module.css'

// TODO: Move this function into a shared location
function renderWithTheme(
  ui: Parameters<typeof render>[0],
  options?: Parameters<typeof render>[1],
): ReturnType<typeof render> {
  return render(ui, options)
}

// Mock `scrollIntoView` because it's not implemented in JSDOM
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Markup', () => {
  implementsClassName(TreeView, classes.TreeViewRootUlStyles)
  implementsClassName(TreeView.Item, classes.TreeViewItem)

  it('uses tree role', () => {
    const {queryByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const root = queryByRole('tree')

    expect(root).toHaveAccessibleName('Test tree')
  })

  it('uses treeitem role', () => {
    const {queryAllByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const items = queryAllByRole('treeitem')

    expect(items).toHaveLength(3)
  })

  it('uses treeitem aria label', () => {
    const {queryAllByRole} = renderWithTheme(
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

    const items = queryAllByRole('treeitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveAccessibleName('Test tree item 1')
    expect(items[1]).toHaveAccessibleName('Tree item 2 description')
    expect(items[2]).toHaveAttribute('aria-labelledby')
    expect(items[2]).toHaveAccessibleName('Item 3')
  })

  it('hides subtrees by default', () => {
    const {queryByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="parent">
          Parent
          <TreeView.SubTree>
            <TreeView.Item id="child">Child</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    const parentItem = queryByRole('treeitem', {name: 'Parent'})
    const subtree = queryByRole('group')

    expect(parentItem).toHaveAttribute('aria-expanded', 'false')
    expect(subtree).toBeNull()
  })

  it('uses aria-current', () => {
    const {getByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2" current>
          Item 2
        </TreeView.Item>
        <TreeView.Item id="item-3">Item 3</TreeView.Item>
      </TreeView>,
    )

    const currentItem = getByRole('treeitem', {name: 'Item 2'})

    expect(currentItem).toHaveAttribute('aria-current', 'true')
  })

  it('should be described by leading visuals', () => {
    const {getByLabelText} = renderWithTheme(
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
    const item = getByLabelText(/Item 1/)
    expect(item).toHaveAccessibleDescription('leading')

    const noDescription = getByLabelText(/Item 2/)
    expect(noDescription).not.toHaveAccessibleDescription()
  })

  it('should be described by trailing visuals', () => {
    const {getByLabelText} = renderWithTheme(
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
    const item = getByLabelText(/Item 1/)
    expect(item).toHaveAccessibleDescription('trailing')

    const noDescription = getByLabelText(/Item 2/)
    expect(noDescription).not.toHaveAccessibleDescription()
  })

  it('should be described by leading and trailing visuals', () => {
    const {getByLabelText} = renderWithTheme(
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
    const item = getByLabelText(/Item 1/)
    expect(item).toHaveAccessibleDescription('leading trailing')

    const noDescription = getByLabelText(/Item 2/)
    // Note: it seems the computed description here is a string with a single
    // space due to the implementation of `aria-describedby`. We currently set
    // both trailing and visual and when the nodes are not found in
    // `aria-describedby="uuid-leading uuid-trailing"` then it computes to a
    // space
    expect(noDescription).toHaveAccessibleDescription(' ')
  })

  it('should not have aria-describedby when no leading or trailing visual', () => {
    const {getByLabelText} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item id="item-1">Item 1</TreeView.Item>
        <TreeView.Item id="item-2">Item 2</TreeView.Item>
      </TreeView>,
    )

    const noDescription = getByLabelText(/Item 1/)
    expect(noDescription).not.toHaveAccessibleDescription()
    expect(noDescription).not.toHaveAttribute('aria-describedby')
  })

  it('should include `aria-expanded` when a SubTree contains content', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByText} = renderWithTheme(
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

    let treeitem = getByLabelText(/Item 1/)
    expect(treeitem).toHaveAttribute('aria-expanded', 'false')

    await act(async () => {
      await user.click(getByText(/Item 1/))
    })
    expect(treeitem).toHaveAttribute('aria-expanded', 'true')

    treeitem = getByLabelText(/Item 2/)
    expect(treeitem).not.toHaveAttribute('aria-expanded')

    await act(async () => {
      await user.click(getByText(/Item 2/))
    })
    expect(treeitem).toHaveAttribute('aria-expanded', 'true')
  })

  it('should render with containIntrinsicSize', () => {
    const {getByText} = renderWithTheme(
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
    const childItem = getByText(/Child/)
    expect(childItem).toBeInTheDocument()
    const parentItem = getByText(/Parent/)
    expect(parentItem).toBeInTheDocument()
  })

  it('should move focus to current treeitem by default', async () => {
    const user = userEvent.setup()
    const {getByRole} = renderWithTheme(
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
    const button = getByRole('button', {name: /Focusable element/})
    await act(async () => {
      await user.click(button)
    })
    expect(button).toHaveFocus()

    // Move focus to tree
    await act(async () => {
      await user.tab()
    })

    // Focus should be on current treeitem
    const item2 = getByRole('treeitem', {name: /Item 2/})
    expect(item2).toHaveFocus()
  })

  it('should toggle when receiving focus from chevron click', async () => {
    const user = userEvent.setup()
    const {getByRole} = renderWithTheme(
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
    const button = getByRole('button', {name: /Focusable element/})
    await act(async () => {
      await user.click(button)
    })
    expect(button).toHaveFocus()

    // Move focus to tree
    const item1 = getByRole('treeitem', {name: /Item 1/})
    const toggle = item1.querySelector('.PRIVATE_TreeView-item-toggle') as HTMLElement
    await act(async () => {
      // Note: calling `.click()` directly here since the userEvent.click()
      // warns about it not being a known focusable element. This should be a
      // valid pattern based on our TreeView guidelines.
      toggle.click()
    })

    // Focus should be on current treeitem
    const subItem1 = getByRole('treeitem', {name: /SubItem 1/})
    expect(subItem1).toBeInTheDocument()
  })

  it("should move focus to first treeitem when focusing back in after clicking on a treeitem's secondary action", async () => {
    const user = userEvent.setup()
    const {getByRole, getByText} = renderWithTheme(
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
    const item2Button = getByText(/Link in Item 2/i)
    await act(async () => {
      await user.click(item2Button)
    })
    expect(item2Button).toHaveFocus()

    // Move focus to button outside of TreeView
    await act(async () => {
      await user.tab()
    })
    const outerButton = getByRole('button', {name: /Focusable element/})
    expect(outerButton).toHaveFocus()

    // Move focus into TreeView. Focus should be on first treeitem
    await act(async () => {
      await user.tab({shift: true})
    })
    const item1 = getByRole('treeitem', {name: /Item 1/})
    expect(item1).toHaveFocus()
  })
})

describe('Keyboard interactions', () => {
  describe('ArrowDown', () => {
    it('moves focus to the next visible treeitem', () => {
      const {getByRole} = renderWithTheme(
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

      const item1 = getByRole('treeitem', {name: 'Item 1'})
      const item11 = getByRole('treeitem', {name: 'Item 1.1'})
      const item2 = getByRole('treeitem', {name: 'Item 2'})
      const item3 = getByRole('treeitem', {name: 'Item 3'})

      act(() => {
        // Focus first item
        item1.focus()
      })

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // item 1.1 should be focused
      expect(item11).toHaveFocus()

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // item 2 should be focused
      expect(item2).toHaveFocus()

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // item 3 should have focus (skips item 2.1 and item 2.2 because they are hidden)
      expect(item3).toHaveFocus()

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // focus should not change (item 3 is the last visible treeitem)
      expect(item3).toHaveFocus()
    })
  })

  describe('ArrowUp', () => {
    it('moves focus to the previous visible treeitem', () => {
      const {getByRole} = renderWithTheme(
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

      const item1 = getByRole('treeitem', {name: 'Item 1'})
      const item11 = getByRole('treeitem', {name: 'Item 1.1'})
      const item2 = getByRole('treeitem', {name: 'Item 2'})
      const item3 = getByRole('treeitem', {name: 'Item 3'})

      act(() => {
        // Focus first item
        item1.focus()
      })

      // Press ↓ 4 times to move aria-activedescendant to item 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // item 3 should be focused
      expect(item3).toHaveFocus()

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // Item 2 should have focus (skips item 2.1 and item 2.2 because they are hidden)
      expect(item2).toHaveFocus()

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // Item 1.1 should be focused
      expect(item11).toHaveFocus()

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // Item 1 should be focused
      expect(item1).toHaveFocus()

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // Focus should not change (item 1 is the first visible treeitem)
      expect(item1).toHaveFocus()
    })
  })

  describe('ArrowLeft', () => {
    it('collapses an expanded item', () => {
      const {getByRole, queryByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      let subtree = queryByRole('group')

      // aria-expanded should be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(subtree).toBeVisible()

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-expanded should now be false
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Parent item should still be focused
      expect(parentItem).toHaveFocus()

      subtree = queryByRole('group')

      // Subtree should now be hidden
      expect(subtree).toBeNull()
    })

    it('does nothing on a root-level collapsed item', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-expanded should be false by default
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-expanded should still be false
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Focus should not change
      expect(parentItem).toHaveFocus()
    })

    it('does nothing on a root-level end item', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="item">Item</TreeView.Item>
        </TreeView>,
      )

      const item = getByRole('treeitem', {name: 'Item'})

      act(() => {
        // Focus first item
        item.focus()
      })

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // Focus should not change
      expect(item).toHaveFocus()
    })

    it('moves focus to parent of end item', () => {
      const {getByRole} = renderWithTheme(
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

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const child2 = getByRole('treeitem', {name: 'Child 2'})

      act(() => {
        // Focus fist item
        parentItem.focus()
      })

      // Press ↓ 2 times to move focus to child 2
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Child 2 should be focused
      expect(child2).toHaveFocus()

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // Parent item should be focused
      expect(parentItem).toHaveFocus()
    })

    it('moves focus to parent of collapsed item', () => {
      const {getByRole} = renderWithTheme(
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

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const nestedParentItem = getByRole('treeitem', {name: 'Nested parent'})

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press ↓ 2 times to move focus to nested parent
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Nested parent item should be focused
      expect(nestedParentItem).toHaveFocus()

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // Parent item should be focused
      expect(parentItem).toHaveFocus()
    })
  })

  describe('ArrowRight', () => {
    it('expands a collapsed item', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent">
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-expanded should be false by default
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // aria-expanded should now be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Parent item should still be focused
      expect(parentItem).toHaveFocus()

      const subtree = getByRole('group')

      // Subtree should now be visible
      expect(subtree).toBeVisible()
    })

    it('moves focus to first child of an expanded item', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-expanded should be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      const childItem = getByRole('treeitem', {name: 'Child'})

      // Child item should be focused
      expect(childItem).toHaveFocus()

      // aria-expanded should still be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')
    })

    it('does nothing on an end item', () => {
      const {getByRole} = renderWithTheme(
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

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const child1 = getByRole('treeitem', {name: 'Child 1'})

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press ↓ to move focus to child 1
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Child 1 should be focused
      expect(child1).toHaveFocus()

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // Focus should not change
      expect(child1).toHaveFocus()
    })
  })

  describe('Backspace', () => {
    it('should move focus to the parent item', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const child = getByRole('treeitem', {name: 'Child'})

      act(() => {
        child.focus()
      })

      // Press Backspace
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Backspace'})

      expect(parentItem).toHaveFocus()
    })

    it('should not collapse an expanded item', () => {
      const {getByRole, queryByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="parent" defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item id="child">Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>,
      )

      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const subtree = queryByRole('group')

      // aria-expanded should be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(subtree).toBeVisible()

      act(() => {
        // Focus first item
        parentItem.focus()
      })

      // Press Backspace
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Backspace'})

      // aria-expanded should stay set as true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Parent item should still be focused
      expect(parentItem).toHaveFocus()
    })
  })

  describe('Home', () => {
    it('moves focus to first visible item', () => {
      const {getByRole} = renderWithTheme(
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

      const parent1 = getByRole('treeitem', {name: 'Parent 1'})
      const parent3 = getByRole('treeitem', {name: 'Parent 2'})

      act(() => {
        // Focus first item
        parent1.focus()
      })

      // Press ↓ 2 times to move focus to parent 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Parent 3 should be focused
      expect(parent3).toHaveFocus()

      // Press Home
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Home'})

      // Parent 1 should be focused
      expect(parent1).toHaveFocus()
    })
  })

  describe('End', () => {
    it('moves focus to last visible item', () => {
      const {getByRole} = renderWithTheme(
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

      const parent1 = getByRole('treeitem', {name: 'Parent 1'})
      const parent3 = getByRole('treeitem', {name: 'Parent 3'})

      act(() => {
        // Focus first item
        parent1.focus()
      })

      // Press End
      fireEvent.keyDown(document.activeElement || document.body, {key: 'End'})

      // Parent 3 should be focused
      expect(parent3).toHaveFocus()

      // Press → to expand parent 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // Press End
      fireEvent.keyDown(document.activeElement || document.body, {key: 'End'})

      const child3 = getByRole('treeitem', {name: 'Child 3'})

      // Child 3 should be focused
      expect(child3).toHaveFocus()
    })
  })

  describe('Enter', () => {
    it('calls onSelect function if provided and checks if the item has been selected', () => {
      const onSelect = vi.fn()
      const {getByRole} = renderWithTheme(
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
      const itemChild = getByRole('treeitem', {name: 'Child2'})

      act(() => {
        // Focus first item
        itemChild.focus()
      })

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)

      onSelect.mockClear()

      // Press middle click
      fireEvent.click(document.activeElement?.firstChild || document.body, {button: 1})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', () => {
      const {getByRole, queryByRole} = renderWithTheme(
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

      const parent = getByRole('treeitem', {name: 'Parent'})

      act(() => {
        // Focus first item
        parent.focus()
      })

      // aria-expanded should be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // aria-expanded should now be true
      expect(parent).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(queryByRole('group')).toBeVisible()

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // aria-expanded should now be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Subtree should no longer be visible
      expect(queryByRole('group')).not.toBeInTheDocument()
    })
  })

  describe('Space', () => {
    it('calls onSelect function if provided and checks if the item has been selected', () => {
      const onSelect = vi.fn()
      const {getByRole} = renderWithTheme(
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
      const itemChild = getByRole('treeitem', {name: 'Child2'})

      act(() => {
        // Focus first item
        itemChild.focus()
      })

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: ' '})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)

      onSelect.mockClear()

      // Press middle click
      fireEvent.click(document.activeElement?.firstChild || document.body, {button: 1})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', () => {
      const {getByRole, queryByRole} = renderWithTheme(
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

      const parent = getByRole('treeitem', {name: 'Parent'})

      act(() => {
        // Focus first item
        parent.focus()
      })

      // aria-expanded should be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // aria-expanded should now be true
      expect(parent).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(queryByRole('group')).toBeVisible()

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // aria-expanded should now be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Subtree should no longer be visible
      expect(queryByRole('group')).not.toBeInTheDocument()
    })
  })

  describe('Typeahead', () => {
    it('moves focus to the next item that matches the typed character', () => {
      const {getByRole} = renderWithTheme(
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

      const apple = getByRole('treeitem', {name: 'Apple'})
      const cherry = getByRole('treeitem', {name: 'Cherry'})

      act(() => {
        // Focus first item
        apple.focus()
      })

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // Cherry should be focused
      expect(cherry).toHaveFocus()

      // Notice that the focus is not set to cantalope because
      // it is a child of apple and apple is collapsed.
    })

    it('does nothing if no items match the typed character', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="apple">Apple</TreeView.Item>
          <TreeView.Item id="banana">Banana</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="durian">Durian</TreeView.Item>
        </TreeView>,
      )

      const apple = getByRole('treeitem', {name: 'Apple'})

      act(() => {
        // Focus first item
        apple.focus()
      })

      // Apple should be focused
      expect(apple).toHaveFocus()

      // Press Z
      fireEvent.keyDown(document.activeElement || document.body, {key: 'z'})

      // Apple should still be focused
      expect(apple).toHaveFocus()
    })

    it('supports multiple typed characters', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="apple">Apple</TreeView.Item>
          <TreeView.Item id="banana">Banana</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="cantalope-1">Cantalope 1</TreeView.Item>
          <TreeView.Item id="cantalope-2">Cantalope 2</TreeView.Item>
        </TreeView>,
      )

      const apple = getByRole('treeitem', {name: 'Apple'})
      const cantalope = getByRole('treeitem', {name: 'Cantalope 1'})

      act(() => {
        // Focus first item
        apple.focus()
      })

      // Press C + A + N
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'a'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'n'})

      // Cantalope should be focused
      expect(cantalope).toHaveFocus()
    })

    it('prioritizes items following the current aria-activedescendant', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="cucumber">Cucumber</TreeView.Item>
          <TreeView.Item id="cherry" current>
            Cherry
          </TreeView.Item>
          <TreeView.Item id="cantalope">Cantalope</TreeView.Item>
        </TreeView>,
      )

      const cucumber = getByRole('treeitem', {name: 'Cucumber'})
      const cherry = getByRole('treeitem', {name: 'Cherry'})
      const cantalope = getByRole('treeitem', {name: 'Cantalope'})

      act(() => {
        // Focus first item
        cucumber.focus()
      })

      // Press ↓ to move focus to cherry
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Cherry should be focused
      expect(cherry).toHaveFocus()

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // Cantalope should be focused
      expect(cantalope).toHaveFocus()
    })

    it('wraps around to the beginning if no items match after the current aria-activedescendant', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item id="cucumber">Cucumber</TreeView.Item>
          <TreeView.Item id="cherry">Cherry</TreeView.Item>
          <TreeView.Item id="cantalope" current>
            Cantalope
          </TreeView.Item>
          <TreeView.Item id="apple">Apple</TreeView.Item>
        </TreeView>,
      )

      const cantalope = getByRole('treeitem', {name: 'Cantalope'})
      const cucumber = getByRole('treeitem', {name: 'Cucumber'})

      act(() => {
        // Focus first item
        cucumber.focus()
      })

      // Press ↓ 2 times to move focus to cantalope
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // Cantalope should be focused
      expect(cantalope).toHaveFocus()

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // Cucumber should be focused
      expect(cucumber).toHaveFocus()
    })
  })
})

describe('State', () => {
  it('persists expanded state of nested items', () => {
    const {getByRole} = renderWithTheme(
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

    const item1 = getByRole('treeitem', {name: 'Item 1'})
    const item2 = getByRole('treeitem', {name: 'Item 2'})

    // Item 2 should be collapsed by default
    expect(item2).toHaveAttribute('aria-expanded', 'false')

    act(() => {
      // Focus item 2
      item2.focus()
    })

    // Press Enter to expand item 2
    fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

    // Item 2 should be expanded
    expect(item2).toHaveAttribute('aria-expanded', 'true')

    // Press ↑ to move focus to item 1
    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

    // Press Enter to collapse item 1
    fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

    // Item 1 should be collapsed
    expect(item1).toHaveAttribute('aria-expanded', 'false')

    // Press Enter again to expand item 1
    fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

    // Item 1 should be expanded
    expect(item1).toHaveAttribute('aria-expanded', 'true')

    // Item 2 should still be expanded
    expect(getByRole('treeitem', {name: 'Item 2'})).toHaveAttribute('aria-expanded', 'true')
  })

  it('can be controlled', () => {
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

    const {getByRole} = renderWithTheme(<TestTree />)

    const parent = getByRole('treeitem', {name: 'Parent'})
    const child = getByRole('treeitem', {name: 'Child'})

    // Parent should be expanded
    expect(parent).toHaveAttribute('aria-expanded', 'true')
    expect(child).toBeVisible()

    act(() => {
      // Focus first item
      parent.focus()
    })

    // Press ← to collapse the parent
    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

    // Parent should be collapsed
    expect(parent).toHaveAttribute('aria-expanded', 'false')
    expect(child).not.toBeVisible()
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
    const user = userEvent.setup()
    const {getByRole} = renderWithTheme(<TestTree />)

    const doneButton = getByRole('button', {name: 'Load'})
    const liveRegion = getLiveRegion()

    // Live region should be empty
    expect(liveRegion.getMessage('polite')).toBe('')

    // Click load button to mimic async loading
    await act(async () => {
      await user.click(doneButton)
    })

    expect(liveRegion.getMessage('polite')).toBe('Parent content loading')

    // Click done button to mimic the completion of async loading
    await act(async () => {
      await user.click(doneButton)
    })

    act(() => {
      vi.runAllTimers()
    })

    // Live region should be updated
    expect(liveRegion.getMessage('polite')).toBe('Parent content loaded')
  })

  it('moves focus from loading item to first child', async () => {
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

    const {getByRole} = renderWithTheme(<TestTree />)

    const parentItem = getByRole('treeitem', {name: 'Parent'})
    const loadingItem = getByRole('treeitem', {name: 'Loading...'})

    act(() => {
      // Focus first item
      parentItem.focus()
    })

    // Press ↓ to move focus to loading item
    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

    // Loading item should be focused
    expect(loadingItem).toHaveFocus()

    act(() => {
      vi.runAllTimers()
    })

    // Wait for async loading to complete
    const firstChild = getByRole('treeitem', {name: 'Child 1'})

    act(() => {
      vi.runAllTimers()
    })

    // First child should be focused
    expect(firstChild).toHaveFocus()
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

    const {getByRole} = renderWithTheme(<TestTree />)
    const dialog = getByRole('alertdialog')
    const parentItem = getByRole('treeitem', {name: 'Parent'})

    // Parent item should not be focused
    expect(parentItem).not.toHaveFocus()

    // Dialog should be visible
    await vi.waitFor(() => {
      expect(dialog).toBeVisible()
    })

    // Press esc to close error dialog
    await act(async () => {
      await userEvent.keyboard('{Escape}')
    })

    // Dialog should not be visible
    expect(dialog).not.toBeVisible()

    // console.log(vi.getTimerCount())
    act(() => {
      vi.runAllTimers()
    })

    // Parent item should be focused
    expect(parentItem).toHaveFocus()
  })

  it('ignores arrow keys when error dialog is open', async () => {
    const {getByRole} = renderWithTheme(
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

    const parentItem = getByRole('treeitem', {name: 'Parent'})

    // Parent item should be expanded
    expect(parentItem).toHaveAttribute('aria-expanded', 'true')

    // Press ←
    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

    // Parent item should still be expanded
    expect(parentItem).toHaveAttribute('aria-expanded', 'true')

    // Press Backspace
    fireEvent.keyDown(document.activeElement || document.body, {key: 'Backspace'})

    // Parent item should still be expanded
    expect(parentItem).toHaveAttribute('aria-expanded', 'true')
  })

  it('should update `aria-expanded` if no content is loaded in', async () => {
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
    const {getByLabelText, getByText} = renderWithTheme(<Example />)
    const user = userEvent.setup()

    const treeitem = getByLabelText('Item 1')
    expect(treeitem).toHaveAttribute('aria-expanded', 'false')
    await act(async () => {
      await user.click(getByText('Item 1'))
    })

    expect(treeitem).toHaveAttribute('aria-expanded', 'true')

    act(() => {
      vi.runAllTimers()
    })

    expect(treeitem).toHaveAttribute('aria-expanded', 'true')
    expect(getByLabelText('No items found')).toBeInTheDocument()
  })

  it('should have `aria-expanded` when directory is empty', async () => {
    const {getByRole} = renderWithTheme(
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

    const parentItem = getByRole('treeitem', {name: 'Parent'})

    // Parent item should be expanded
    expect(parentItem).toHaveAttribute('aria-expanded', 'true')

    // Current child should not have `aria-expanded`
    expect(getByRole('treeitem', {name: 'child current'})).not.toHaveAttribute('aria-expanded')

    // Empty child should not have `aria-expanded` when closed
    expect(getByRole('treeitem', {name: 'empty child'})).not.toHaveAttribute('aria-expanded')

    fireEvent.click(getByRole('treeitem', {name: 'empty child'}))

    // Empty child should have `aria-expanded` when opened
    expect(getByRole('treeitem', {name: 'empty child'})).toHaveAttribute('aria-expanded')
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

  expect(screen.getByRole('button', {hidden: true})).toHaveAttribute('aria-labelledby')
})

it('should have keyboard shortcut command as part of accessible name when using `TrailingAction`', () => {
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

  expect(screen.getByRole('treeitem', {name: /for more actions\.$/})).toBeInTheDocument()
})

it('should have keyboard shortcut command as part of accessible name when using `TrailingAction` and `aria-label`', () => {
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

  expect(screen.getByRole('treeitem', {name: /for more actions\.$/})).toBeInTheDocument()
})

it('should activate the dialog for trailing action when keyboard shortcut is used', async () => {
  userEvent.setup()
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

  const treeItem = screen.getByRole('treeitem', {
    name: /for more actions\.$/,
  })
  treeItem.focus()
  expect(treeItem).toHaveFocus()

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  fireEvent.keyDown(treeItem, {key: 'u', metaKey: true, shiftKey: true})

  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
