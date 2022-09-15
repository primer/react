import {fireEvent, render} from '@testing-library/react'
import React from 'react'
import {TreeView} from './TreeView'

describe('Markup', () => {
  it('uses tree role', () => {
    const {queryByRole} = render(
      <TreeView aria-label="Test tree">
        <TreeView.Item>Item 1</TreeView.Item>
        <TreeView.Item>Item 2</TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const root = queryByRole('tree')

    expect(root).toHaveAccessibleName('Test tree')
  })

  it('uses treeitem role', () => {
    const {queryAllByRole} = render(
      <TreeView aria-label="Test tree">
        <TreeView.Item>Item 1</TreeView.Item>
        <TreeView.Item>Item 2</TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const items = queryAllByRole('treeitem')

    expect(items).toHaveLength(3)
  })

  it('hides subtrees by default', () => {
    const {queryByRole} = render(
      <TreeView aria-label="Test tree">
        <TreeView.Item>
          Parent
          <TreeView.SubTree>
            <TreeView.Item>Child</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
    )

    const parentItem = queryByRole('treeitem', {name: 'Parent'})
    const subtree = queryByRole('group')

    expect(parentItem).toHaveAttribute('aria-expanded', 'false')
    expect(subtree).toBeNull()
  })

  it('initializes aria-activedescendant to the first item by default', () => {
    const {queryByRole} = render(
      <TreeView aria-label="Test tree">
        <TreeView.Item>Item 1</TreeView.Item>
        <TreeView.Item>Item 2</TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const root = queryByRole('tree')
    const firstItem = queryByRole('treeitem', {name: 'Item 1'})

    expect(root).toHaveAttribute('aria-activedescendant', firstItem?.id)
  })
})

describe('Keyboard interactions', () => {
  describe('ArrowDown', () => {
    it('moves aria-activedescendant to the next visible treeitem', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Item 1
            <TreeView.SubTree>
              <TreeView.Item>Item 1.1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Item 2
            <TreeView.SubTree>
              <TreeView.Item>Item 2.1</TreeView.Item>
              <TreeView.Item>Item 2.2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>Item 3</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const item1 = getByRole('treeitem', {name: 'Item 1'})
      const item11 = getByRole('treeitem', {name: 'Item 1.1'})
      const item2 = getByRole('treeitem', {name: 'Item 2'})
      const item3 = getByRole('treeitem', {name: 'Item 3'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', item1.id)

      // Focus tree
      root.focus()

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to item 1.1
      expect(root).toHaveAttribute('aria-activedescendant', item11.id)

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to item 2
      expect(root).toHaveAttribute('aria-activedescendant', item2.id)

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to item 3 (skips item 2.1 and item 2.2 because they are hidden)
      expect(root).toHaveAttribute('aria-activedescendant', item3.id)

      // Press ↓
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should not change (item 3 is the last visible treeitem)
      expect(root).toHaveAttribute('aria-activedescendant', item3.id)
    })
  })

  describe('ArrowUp', () => {
    it('moves aria-activedescendant to the previous visible treeitem', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Item 1
            <TreeView.SubTree>
              <TreeView.Item>Item 1.1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Item 2
            <TreeView.SubTree>
              <TreeView.Item>Item 2.1</TreeView.Item>
              <TreeView.Item>Item 2.2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>Item 3</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const item1 = getByRole('treeitem', {name: 'Item 1'})
      const item11 = getByRole('treeitem', {name: 'Item 1.1'})
      const item2 = getByRole('treeitem', {name: 'Item 2'})
      const item3 = getByRole('treeitem', {name: 'Item 3'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', item1.id)

      // Focus tree
      root.focus()

      // Press ↓ 4 times to move aria-activedescendant to item 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to item 3
      expect(root).toHaveAttribute('aria-activedescendant', item3.id)

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // aria-activedescendant should now be set to item 2 (skips item 2.1 and item 2.2 because they are hidden)
      expect(root).toHaveAttribute('aria-activedescendant', item2.id)

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // aria-activedescendant should now be set to item 1.1
      expect(root).toHaveAttribute('aria-activedescendant', item11.id)

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // aria-activedescendant should now be set to item 1
      expect(root).toHaveAttribute('aria-activedescendant', item1.id)

      // Press ↑
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

      // aria-activedescendant should not change (item 1 is the first visible treeitem)
      expect(root).toHaveAttribute('aria-activedescendant', item1.id)
    })
  })

  describe('ArrowLeft', () => {
    it('collapses an expanded item', () => {
      const {getByRole, queryByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})
      let subtree = queryByRole('group')

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      // aria-expanded should be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(subtree).toBeVisible()

      // Focus tree
      root.focus()

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-expanded should now be false
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // aria-activedescendant should still be set to the parent treeitem
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      subtree = queryByRole('group')

      // Subtree should now be hidden
      expect(subtree).toBeNull()
    })

    it('does nothing on a root-level collapsed item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      // aria-expanded should be false by default
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Focus tree
      root.focus()

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-expanded should still be false
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // aria-activedescendant should still be set to the parent treeitem
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)
    })

    it('does nothing on a root-level end item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>Item</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const item = getByRole('treeitem', {name: 'Item'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', item.id)

      // Focus tree
      root.focus()

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-activedescendant should still be set to the item
      expect(root).toHaveAttribute('aria-activedescendant', item.id)
    })

    it('moves aria-activedescendant to parent of end item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const child2 = getByRole('treeitem', {name: 'Child 2'})

      // Focus tree
      root.focus()

      // Press ↓ 2 times to move aria-activedescendant to child 2
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to child 2
      expect(root).toHaveAttribute('aria-activedescendant', child2.id)

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-activedescendant should now be set to parent
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)
    })

    it('moves aria-activedescendant to parent of collapsed item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
              <TreeView.Item>
                Nested parent
                <TreeView.SubTree>
                  <TreeView.Item>Nested child</TreeView.Item>
                </TreeView.SubTree>
              </TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})
      const nestedParentItem = getByRole('treeitem', {name: 'Nested parent'})

      // Focus tree
      root.focus()

      // Press ↓ 2 times to move aria-activedescendant to nested parent
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to nested parent
      expect(root).toHaveAttribute('aria-activedescendant', nestedParentItem.id)

      // Press ←
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

      // aria-activedescendant should now be set to parent
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)
    })
  })

  describe('ArrowRight', () => {
    it('expands a collapsed item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      // aria-expanded should be false by default
      expect(parentItem).toHaveAttribute('aria-expanded', 'false')

      // Focus tree
      root.focus()

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // aria-expanded should now be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // aria-activedescendant should still be set to the parent treeitem
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      const subtree = getByRole('group')

      // Subtree should now be visible
      expect(subtree).toBeVisible()
    })

    it('moves aria-activedescendant to first child of an expanded item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parentItem = getByRole('treeitem', {name: 'Parent'})

      // aria-activedescendant should be set to the first visible treeitem by default
      expect(root).toHaveAttribute('aria-activedescendant', parentItem.id)

      // aria-expanded should be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')

      // Focus tree
      root.focus()

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      const childItem = getByRole('treeitem', {name: 'Child'})

      // aria-activedescendant should now be set to the first child treeitem
      expect(root).toHaveAttribute('aria-activedescendant', childItem.id)

      // aria-expanded should still be true
      expect(parentItem).toHaveAttribute('aria-expanded', 'true')
    })

    it('does nothing on an end item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item defaultExpanded>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const child1 = getByRole('treeitem', {name: 'Child 1'})

      // Focus tree
      root.focus()

      // Press ↓ to move aria-activedescendant to child 1
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to child 1
      expect(root).toHaveAttribute('aria-activedescendant', child1.id)

      // Press →
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // aria-activedescendant should still be set to child 1
      expect(root).toHaveAttribute('aria-activedescendant', child1.id)
    })
  })

  describe('Home', () => {
    it('moves aria-activedescendant to first visible item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item>Child 3</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parent1 = getByRole('treeitem', {name: 'Parent 1'})
      const parent3 = getByRole('treeitem', {name: 'Parent 2'})

      // Focus tree
      root.focus()

      // Press ↓ 2 times to move aria-activedescendant to parent 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

      // aria-activedescendant should now be set to parent 3
      expect(root).toHaveAttribute('aria-activedescendant', parent3.id)

      // Press Home
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Home'})

      // aria-activedescendant should now be set to parent 1
      expect(root).toHaveAttribute('aria-activedescendant', parent1.id)
    })
  })

  describe('End', () => {
    it('moves aria-activedescendant to last visible item', () => {
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent 1
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Parent 2
            <TreeView.SubTree>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>
            Parent 3
            <TreeView.SubTree>
              <TreeView.Item>Child 3</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parent1 = getByRole('treeitem', {name: 'Parent 1'})
      const parent3 = getByRole('treeitem', {name: 'Parent 3'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to parent 1
      expect(root).toHaveAttribute('aria-activedescendant', parent1.id)

      // Press End
      fireEvent.keyDown(document.activeElement || document.body, {key: 'End'})

      // aria-activedescendant should now be set to parent 3
      expect(root).toHaveAttribute('aria-activedescendant', parent3.id)

      // Press → to expand parent 3
      fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowRight'})

      // Press End
      fireEvent.keyDown(document.activeElement || document.body, {key: 'End'})

      const child3 = getByRole('treeitem', {name: 'Child 3'})

      // aria-activedescendant should now be set to child 3
      expect(root).toHaveAttribute('aria-activedescendant', child3.id)
    })
  })

  describe('Enter', () => {
    it('calls onSelect function if provided', () => {
      const onSelect = jest.fn()
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item onSelect={onSelect}>Item</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')

      // Focus tree
      root.focus()

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', () => {
      const {getByRole, queryByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parent = getByRole('treeitem', {name: 'Parent'})

      // Focus tree
      root.focus()

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
    it('calls onSelect function if provided', () => {
      const onSelect = jest.fn()
      const {getByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item onSelect={onSelect}>Item</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')

      // Focus tree
      root.focus()

      // Press Space
      fireEvent.keyDown(document.activeElement || document.body, {key: ' '})

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })

    it('toggles expanded state if no onSelect function is provided', () => {
      const {getByRole, queryByRole} = render(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child 1</TreeView.Item>
              <TreeView.Item>Child 2</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const parent = getByRole('treeitem', {name: 'Parent'})

      // Focus tree
      root.focus()

      // aria-expanded should be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Press Space
      fireEvent.keyDown(document.activeElement || document.body, {key: ' '})

      // aria-expanded should now be true
      expect(parent).toHaveAttribute('aria-expanded', 'true')

      // Subtree should be visible
      expect(queryByRole('group')).toBeVisible()

      // Press Space
      fireEvent.keyDown(document.activeElement || document.body, {key: ' '})

      // aria-expanded should now be false
      expect(parent).toHaveAttribute('aria-expanded', 'false')

      // Subtree should no longer be visible
      expect(queryByRole('group')).not.toBeInTheDocument()
    })
  })
})
