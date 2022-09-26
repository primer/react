import {fireEvent, render} from '@testing-library/react'
import React from 'react'
import {ThemeProvider} from '../ThemeProvider'
import {TreeView} from './TreeView'

// TODO: Move this function into a shared location
function renderWithTheme(
  ui: Parameters<typeof render>[0],
  options?: Parameters<typeof render>[1]
): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options)
}

describe('Markup', () => {
  it('uses tree role', () => {
    const {queryByRole} = renderWithTheme(
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
    const {queryAllByRole} = renderWithTheme(
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
    const {queryByRole} = renderWithTheme(
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

  it('initializes aria-activedescendant to the current item by default', () => {
    const {queryByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item>Item 1</TreeView.Item>
        <TreeView.Item current>Item 2</TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const root = queryByRole('tree')
    const currentItem = queryByRole('treeitem', {name: 'Item 2'})

    expect(root).toHaveAttribute('aria-activedescendant', currentItem?.id)
  })

  it('initializes aria-activedescendant to the first item if there is no current item', () => {
    const {queryByRole} = renderWithTheme(
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

  it('uses aria-current', () => {
    const {getByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item>Item 1</TreeView.Item>
        <TreeView.Item current>Item 2</TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const currentItem = getByRole('treeitem', {name: 'Item 2'})

    expect(currentItem).toHaveAttribute('aria-current', 'true')
  })

  it('expands the path to the current item (level 2) by default', () => {
    const {getByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item>
          Item 1
          <TreeView.SubTree>
            <TreeView.Item>Item 1.1</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item>
          Item 2
          <TreeView.SubTree>
            <TreeView.Item>Item 2.1</TreeView.Item>
            <TreeView.Item current>
              Item 2.2
              <TreeView.SubTree>
                <TreeView.Item>Item 2.2.1</TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const item1 = getByRole('treeitem', {name: 'Item 1'})
    const item2 = getByRole('treeitem', {name: 'Item 2'})
    const item22 = getByRole('treeitem', {name: 'Item 2.2'})
    const item221 = getByRole('treeitem', {name: 'Item 2.2.1'})

    // Item 1 should not be expanded because it is not the parent of the current item
    expect(item1).toHaveAttribute('aria-expanded', 'false')

    // Item 2 should be expanded because it is the parent of the current item
    expect(item2).toHaveAttribute('aria-expanded', 'true')

    // Item 2.2 should be expanded because it is the current item
    expect(item22).toHaveAttribute('aria-expanded', 'true')

    // Item 2.2 should have an aria-current value of true
    expect(item22).toHaveAttribute('aria-current', 'true')

    // Item 2.2.1 should be visible because it is a child of the current item
    expect(item221).toBeVisible()
  })

  it('expands the path to the current item (level 3) by default', () => {
    const {getByRole} = renderWithTheme(
      <TreeView aria-label="Test tree">
        <TreeView.Item>
          Item 1
          <TreeView.SubTree>
            <TreeView.Item>Item 1.1</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item>
          Item 2
          <TreeView.SubTree>
            <TreeView.Item>Item 2.1</TreeView.Item>
            <TreeView.Item>
              Item 2.2
              <TreeView.SubTree>
                <TreeView.Item current>Item 2.2.1</TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item>Item 3</TreeView.Item>
      </TreeView>
    )

    const item1 = getByRole('treeitem', {name: 'Item 1'})
    const item2 = getByRole('treeitem', {name: 'Item 2'})
    const item22 = getByRole('treeitem', {name: 'Item 2.2'})
    const item221 = getByRole('treeitem', {name: 'Item 2.2.1'})

    // Item 1 should not be expanded because it is not the parent of the current item
    expect(item1).toHaveAttribute('aria-expanded', 'false')

    // Item 2 should be expanded because it is the parent of the current item
    expect(item2).toHaveAttribute('aria-expanded', 'true')

    // Item 2.2 should be expanded because it is the current item
    expect(item22).toHaveAttribute('aria-expanded', 'true')

    // Item 2.2.1 should be the current item
    expect(item221).toHaveAttribute('aria-current', 'true')
  })

  it('expands the path to the current item when the current item is changed', () => {
    function TestTree() {
      const [current, setCurrent] = React.useState('item1')
      return (
        <div>
          <button onClick={() => setCurrent('item2')}>Jump to Item 2</button>
          <TreeView aria-label="Test tree">
            <TreeView.Item current={current === 'item1'}>Item 1</TreeView.Item>
            <TreeView.Item current={current === 'item2'}>
              Item 2
              <TreeView.SubTree>
                <TreeView.Item current={current === 'item2.1'}>Item 2.1</TreeView.Item>
              </TreeView.SubTree>
            </TreeView.Item>
            <TreeView.Item current={current === 'item3'}>Item 3</TreeView.Item>
          </TreeView>
        </div>
      )
    }

    const {getByRole, getByText} = renderWithTheme(<TestTree />)

    const item1 = getByRole('treeitem', {name: 'Item 1'})
    const item2 = getByRole('treeitem', {name: 'Item 2'})

    // Item 1 should have an aria-current value of true
    expect(item1).toHaveAttribute('aria-current', 'true')

    // Item 2 should not be expanded because it is not the current item or the parent of the current item
    expect(item2).toHaveAttribute('aria-expanded', 'false')

    // Click the button to change the current item to Item 2
    fireEvent.click(getByText('Jump to Item 2'))

    // Item 1 should not have an aria-current value
    expect(item1).not.toHaveAttribute('aria-current')

    // Item 2 should be expanded because it is the current item
    expect(item2).toHaveAttribute('aria-expanded', 'true')

    // Item 2.1 should be visible because it is a child of the current item
    expect(getByRole('treeitem', {name: 'Item 2.1'})).toBeVisible()
  })
})

describe('Keyboard interactions', () => {
  describe('ArrowDown', () => {
    it('moves aria-activedescendant to the next visible treeitem', () => {
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole, queryByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole} = renderWithTheme(
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
      const {getByRole, queryByRole} = renderWithTheme(
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

    it('navigates to href if provided', () => {
      const windowSpy = jest.spyOn(window, 'open')
      const onSelect = jest.fn()
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.LinkItem href="#" onSelect={onSelect}>
            Item
          </TreeView.LinkItem>
        </TreeView>
      )

      const root = getByRole('tree')

      // Focus tree
      root.focus()

      // Press Enter
      fireEvent.keyDown(document.activeElement || document.body, {key: 'Enter'})

      // window.open should have been called
      expect(windowSpy).toHaveBeenCalledWith('#', '_self')

      // onSelect should have been called
      expect(onSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('Typeahead', () => {
    it('moves aria-activedescendant to the next item that matches the typed character', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item>
            Apple
            <TreeView.SubTree>
              <TreeView.Item>Cantalope</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
          <TreeView.Item>Banana</TreeView.Item>
          <TreeView.Item>Cherry</TreeView.Item>
          <TreeView.Item>Cucumber</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const apple = getByRole('treeitem', {name: 'Apple'})
      const cherry = getByRole('treeitem', {name: 'Cherry'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to apple
      expect(root).toHaveAttribute('aria-activedescendant', apple.id)

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // aria-activedescendant should now be set to cherry
      expect(root).toHaveAttribute('aria-activedescendant', cherry.id)

      // Notice that the aria-activedescendant is not set to cantalope because
      // it is a child of apple and apple is collapsed.
    })

    it('does nothing if no items match the typed character', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item>Apple</TreeView.Item>
          <TreeView.Item>Banana</TreeView.Item>
          <TreeView.Item>Cherry</TreeView.Item>
          <TreeView.Item>Durian</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const apple = getByRole('treeitem', {name: 'Apple'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to apple
      expect(root).toHaveAttribute('aria-activedescendant', apple.id)

      // Press Z
      fireEvent.keyDown(document.activeElement || document.body, {key: 'z'})

      // aria-activedescendant should still be set to apple
      expect(root).toHaveAttribute('aria-activedescendant', apple.id)
    })

    it('supports multiple typed characters', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item>Apple</TreeView.Item>
          <TreeView.Item>Banana</TreeView.Item>
          <TreeView.Item>Cherry</TreeView.Item>
          <TreeView.Item>Cantalope 1</TreeView.Item>
          <TreeView.Item>Cantalope 2</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const apple = getByRole('treeitem', {name: 'Apple'})
      const cantalope = getByRole('treeitem', {name: 'Cantalope 1'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to apple
      expect(root).toHaveAttribute('aria-activedescendant', apple.id)

      // Press C + A + N
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'a'})
      fireEvent.keyDown(document.activeElement || document.body, {key: 'n'})

      // aria-activedescendant should now be set to cantalope
      expect(root).toHaveAttribute('aria-activedescendant', cantalope.id)
    })

    it('prioritizes items following the current aria-activedescendant', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item>Cucumber</TreeView.Item>
          <TreeView.Item current>Cherry</TreeView.Item>
          <TreeView.Item>Cantalope</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const cherry = getByRole('treeitem', {name: 'Cherry'})
      const cantalope = getByRole('treeitem', {name: 'Cantalope'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to cherry
      expect(root).toHaveAttribute('aria-activedescendant', cherry.id)

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // aria-activedescendant should now be set to cantalope
      expect(root).toHaveAttribute('aria-activedescendant', cantalope.id)
    })

    it('wraps around to the beginning if no items match after the current aria-activedescendant', () => {
      const {getByRole} = renderWithTheme(
        <TreeView aria-label="Test tree">
          <TreeView.Item>Cucumber</TreeView.Item>
          <TreeView.Item>Cherry</TreeView.Item>
          <TreeView.Item current>Cantalope</TreeView.Item>
          <TreeView.Item>Apple</TreeView.Item>
        </TreeView>
      )

      const root = getByRole('tree')
      const cantalope = getByRole('treeitem', {name: 'Cantalope'})
      const cucumber = getByRole('treeitem', {name: 'Cucumber'})

      // Focus tree
      root.focus()

      // aria-activedescendant should be set to cantalope
      expect(root).toHaveAttribute('aria-activedescendant', cantalope.id)

      // Press C
      fireEvent.keyDown(document.activeElement || document.body, {key: 'c'})

      // aria-activedescendant should now be set to cucumber
      expect(root).toHaveAttribute('aria-activedescendant', cucumber.id)
    })
  })
})

describe('Controlled state', () => {
  it('can be controlled', () => {
    function TestTree() {
      const [expanded, setExpanded] = React.useState(true)
      return (
        <TreeView aria-label="Test tree">
          <TreeView.Item expanded={expanded} onExpandedChange={setExpanded}>
            Parent
            <TreeView.SubTree>
              <TreeView.Item>Child</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )
    }

    const {getByRole} = renderWithTheme(<TestTree />)

    const root = getByRole('tree')
    const parent = getByRole('treeitem', {name: 'Parent'})
    const child = getByRole('treeitem', {name: 'Child'})

    // Parent should be expanded
    expect(parent).toHaveAttribute('aria-expanded', 'true')
    expect(child).toBeVisible()

    // aria-activedescendant should be set to parent
    expect(root).toHaveAttribute('aria-activedescendant', parent.id)

    // Focus tree
    root.focus()

    // Press ← to collapse the parent
    fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowLeft'})

    // Parent should be collapsed
    expect(parent).toHaveAttribute('aria-expanded', 'false')
    expect(child).not.toBeVisible()
  })
})
