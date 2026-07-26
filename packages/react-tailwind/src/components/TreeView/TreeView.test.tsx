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

  it('supports compound subtree and visual composition with accessible visual labels', () => {
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          <TreeView.LeadingVisual>{({expanded}) => <span>{expanded ? 'open' : 'closed'}</span>}</TreeView.LeadingVisual>
          src
          <TreeView.SubTree>
            <TreeView.Item id="index">
              <TreeView.TrailingVisual label="modified">M</TreeView.TrailingVisual>
              index.ts
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    expect(screen.getByRole('treeitem', {name: /src/})).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('open')).toBeVisible()
    expect(screen.getByRole('treeitem', {name: /index\.ts/})).toHaveAttribute('aria-describedby')
    expect(screen.getByText('modified')).toHaveClass('sr-only')
  })

  it('applies flat and truncate settings to nested item layout', () => {
    render(
      <TreeView aria-label="Files" flat truncate={false}>
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.SubTree>
            <TreeView.Item id="long-name">A long file name that can wrap</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    expect(screen.getByRole('tree')).toHaveAttribute('data-flat')
    expect(screen.getByText('A long file name that can wrap')).toHaveClass('break-words')
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('forwards refs and DOM props to the semantic item element', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <TreeView aria-label="Files" data-testid="tree">
        <TreeView.Item id="src" ref={ref} data-testid="item">
          src
        </TreeView.Item>
      </TreeView>,
    )

    expect(screen.getByTestId('tree').tagName).toBe('UL')
    expect(ref.current).toBe(screen.getByTestId('item'))
    expect(ref.current).toHaveAttribute('role', 'treeitem')
  })

  it('treats a null controlled expansion value as collapsed', () => {
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" expanded={null}>
          src
          <TreeView.SubTree>
            <TreeView.Item id="index">index.ts</TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>,
    )

    expect(screen.getByRole('treeitem', {name: 'src'})).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })
})
