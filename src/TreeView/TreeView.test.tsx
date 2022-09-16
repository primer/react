import {render} from '@testing-library/react'
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
