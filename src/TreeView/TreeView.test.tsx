import {fireEvent, render} from '@testing-library/react'
import React from 'react'
import {TreeView} from './TreeView'

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

it('initializes aria-activedescendant to the first treeitem by default', () => {
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

it('moves aria-activedescendant with up and down arrow keys', () => {
  const {getByRole} = render(
    <TreeView aria-label="Test tree">
      <TreeView.Item>
        Item 1
        <TreeView.SubTree>
          <TreeView.Item>Item 1.1</TreeView.Item>
          <TreeView.Item>Item 1.2</TreeView.Item>
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
  const item2 = getByRole('treeitem', {name: 'Item 2'})
  const item3 = getByRole('treeitem', {name: 'Item 3'})

  // aria-activedescendant should be set to the first visible treeitem by default
  expect(root).toHaveAttribute('aria-activedescendant', item1.id)

  // Focus tree
  root.focus()

  // Press ↓
  fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

  // aria-activedescendant should now be set to the second visible treeitem
  expect(root).toHaveAttribute('aria-activedescendant', item2.id)

  // Press ↓
  fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowDown'})

  // aria-activedescendant should now be set to the third visible treeitem
  expect(root).toHaveAttribute('aria-activedescendant', item3.id)

  // Press ↑
  fireEvent.keyDown(document.activeElement || document.body, {key: 'ArrowUp'})

  // aria-activedescendant should now be set to the second visible treeitem
  expect(root).toHaveAttribute('aria-activedescendant', item2.id)
})

it('expands a collapsed item with right arrow key', () => {
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
