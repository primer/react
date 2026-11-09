import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {TreeView} from './TreeView'
import {getFirstChildItem, getParentItem} from './treeNavigation'

afterEach(cleanup)

describe('TreeView.LinkTree', () => {
  it('keeps links directly owned by a div tree and forwards refs to their semantic elements', () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const groupRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLElement>()
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<'a'> & {to: string}>(
      function RouterLink({to, children, ...props}, ref) {
        return (
          <a {...props} href={to} ref={ref}>
            {children}
          </a>
        )
      },
    )
    render(
      <TreeView.LinkTree aria-label="Files" ref={rootRef}>
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.LinkTree.SubTree ref={groupRef}>
            <TreeView.Item
              aria-label="File index.ts, modified"
              as={RouterLink}
              current
              id="index"
              ref={itemRef}
              to="/src/index.ts"
              trailingVisual="M"
            >
              index.ts
            </TreeView.Item>
          </TreeView.LinkTree.SubTree>
        </TreeView.Item>
      </TreeView.LinkTree>,
    )

    const tree = screen.getByRole('tree', {name: 'Files'})
    const parent = screen.getByRole('treeitem', {name: 'src'})
    const group = screen.getByRole('group', {name: 'src'})
    const link = screen.getByRole('treeitem', {name: 'File index.ts, modified'})
    expect(rootRef.current).toBe(tree)
    expect(groupRef.current).toBe(group)
    expect(itemRef.current).toBe(link)
    expect(tree.tagName).toBe('DIV')
    expect(parent.tagName).toBe('DIV')
    expect(group.tagName).toBe('DIV')
    expect(link.tagName).toBe('A')
    expect(link.parentElement).toBe(group)
    expect(link).toHaveAttribute('href', '/src/index.ts')
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(link).toHaveAttribute('tabindex', '0')
    expect(within(link).getByText('index.ts')).toHaveAttribute('data-component', 'TreeView.Item.Label')
    expect(link.querySelector('[data-component="TreeView.Row"]')).toBeInTheDocument()
    expect(tree.querySelector('li[role="none"], li[role="presentation"]')).not.toBeInTheDocument()
  })

  it('navigates and expands linked branches without putting their group inside the anchor', async () => {
    const user = userEvent.setup()
    render(
      <TreeView.LinkTree aria-label="Files">
        <TreeView.Item
          as="a"
          defaultExpanded
          href="#src"
          id="src"
          subtree={
            <TreeView.Item as="a" href="#index" id="index">
              index.ts
            </TreeView.Item>
          }
        >
          src
        </TreeView.Item>
        <TreeView.Item id="readme">README.md</TreeView.Item>
      </TreeView.LinkTree>,
    )

    const src = screen.getByRole('treeitem', {name: 'src'})
    const index = screen.getByRole('treeitem', {name: 'index.ts'})
    const group = screen.getByRole('group', {name: 'src'})
    expect(src.parentElement).toHaveAttribute('role', 'none')
    expect(src.parentElement?.tagName).toBe('DIV')
    expect(src).toHaveAttribute('aria-owns', group.id)
    expect(src.contains(group)).toBe(false)
    expect(getFirstChildItem(src)).toBe(index)
    expect(getParentItem(index)).toBe(src)

    act(() => src.focus())
    await user.keyboard('{ArrowRight}')
    expect(index).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveAttribute('aria-expanded', 'false')
    expect(src).not.toHaveAttribute('aria-owns')
    await user.keyboard(' ')
    expect(src).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('treeitem', {name: 'index.ts'})).toHaveFocus()
    await user.keyboard('{End}')
    expect(screen.getByRole('treeitem', {name: 'README.md'})).toHaveFocus()
  })

  it('activates links once per Enter or Space and preserves modified and auxiliary click events', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn((event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
      event.preventDefault()
    })
    const onContextMenu = vi.fn()
    render(
      <TreeView.LinkTree aria-label="Files">
        <TreeView.Item as="a" href="#file" id="file" onSelect={onSelect} onContextMenu={onContextMenu}>
          file
        </TreeView.Item>
      </TreeView.LinkTree>,
    )
    const link = screen.getByRole('treeitem', {name: 'file'})
    act(() => link.focus())
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onSelect).toHaveBeenCalledTimes(2)
    fireEvent.click(link, {ctrlKey: true})
    fireEvent(link, new MouseEvent('auxclick', {bubbles: true, cancelable: true, button: 1}))
    fireEvent.contextMenu(link)
    expect(onSelect).toHaveBeenCalledTimes(4)
    expect(onSelect.mock.calls[2][0]).toMatchObject({ctrlKey: true})
    expect(onSelect.mock.calls[3][0]).toMatchObject({button: 1})
    expect(onContextMenu).toHaveBeenCalledOnce()
  })

  it('hands focus from a loading placeholder to a loaded linked item', async () => {
    const renderTree = (loading: boolean) => (
      <TreeView.LinkTree aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.LinkTree.SubTree state={loading ? 'loading' : 'done'}>
            <TreeView.Item as="a" href="#index" id="index">
              index.ts
            </TreeView.Item>
          </TreeView.LinkTree.SubTree>
        </TreeView.Item>
      </TreeView.LinkTree>
    )
    const {rerender} = render(renderTree(true))
    const loading = screen.getByRole('treeitem', {name: 'Loading...'})
    act(() => loading.focus())
    rerender(renderTree(false))
    await waitFor(() => expect(screen.getByRole('treeitem', {name: 'index.ts'})).toHaveFocus())
  })

  it('renders and hydrates linked trees without changing their ownership', async () => {
    const app = (
      <TreeView.LinkTree aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.LinkTree.SubTree>
            <TreeView.Item as="a" href="#index" id="index">
              index.ts
            </TreeView.Item>
          </TreeView.LinkTree.SubTree>
        </TreeView.Item>
      </TreeView.LinkTree>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(app)
    document.body.append(container)
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      const link = screen.getByRole('treeitem', {name: 'index.ts'})
      expect(link.tagName).toBe('A')
      expect(link.parentElement).toHaveAttribute('role', 'group')
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('rejects incompatible list groups and interactive actions in a polymorphic item', () => {
    expect(() =>
      renderToString(
        <TreeView.LinkTree aria-label="Files">
          <TreeView.Item id="src" defaultExpanded>
            src
            <TreeView.SubTree>
              <TreeView.Item id="index">index.ts</TreeView.Item>
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView.LinkTree>,
      ),
    ).toThrow('Use TreeView.LinkTree.SubTree within TreeView.LinkTree.')
    expect(() =>
      renderToString(
        <TreeView.LinkTree aria-label="Files">
          <TreeView.Item as="a" href="#file" id="file" leadingAction={<button type="button">Move</button>}>
            file
          </TreeView.Item>
        </TreeView.LinkTree>,
      ),
    ).toThrow('A polymorphic TreeView.LinkTree item cannot contain interactive row actions.')
  })
})
