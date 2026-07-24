import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {TreeView} from './TreeView'

afterEach(cleanup)

describe('TreeView', () => {
  it('uses tree semantics and supports expansion and roving arrow-key focus', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}>
          src
        </TreeView.Item>
        <TreeView.Item id="readme">README.md</TreeView.Item>
      </TreeView>,
    )
    const src = screen.getByRole('treeitem', {name: /src/})
    await user.click(src)
    expect(src).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{ArrowDown}')
    expect(document.getElementById('index')).toHaveFocus()
  })

  it('keeps one roving tab stop and follows APG parent and child arrow behavior', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}>
          src
        </TreeView.Item>
        <TreeView.Item id="readme">README.md</TreeView.Item>
      </TreeView>,
    )

    const src = screen.getByRole('treeitem', {name: /src/})
    expect(screen.getAllByRole('treeitem').filter(item => item.tabIndex === 0)).toEqual([src])
    expect(src).not.toHaveAttribute('aria-selected')

    await user.click(src)
    await user.keyboard('{ArrowRight}')
    expect(document.getElementById('index')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveAttribute('aria-expanded', 'false')
  })
})
