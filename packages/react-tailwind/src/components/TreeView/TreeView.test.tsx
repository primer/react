import {PencilIcon, TrashIcon} from '@primer/octicons-react'
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {PlatformOverrideProvider} from '../KeybindingHint/utils'
import {TreeView, type SubTreeState} from './TreeView'
import {getFirstChildItem, getParentItem, getTreeItems, isItemOf} from './treeNavigation'

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
    expect(screen.getByText('modified')).toHaveClass('primer:sr-only')
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
    expect(screen.getByText('A long file name that can wrap')).toHaveClass('primer:break-words')
    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(document.querySelector('[data-component="TreeView.Toggle"]')).not.toBeInTheDocument()
  })

  it('exposes the label container independently of the accessible name and truncation setting', () => {
    const items = (
      <>
        <TreeView.Item id="parent" defaultExpanded>
          Parent
          <TreeView.SubTree>
            <TreeView.Item id="file" aria-label="A long file name, modified">
              A long file name
            </TreeView.Item>
          </TreeView.SubTree>
        </TreeView.Item>
      </>
    )
    const {rerender} = render(<TreeView aria-label="Files">{items}</TreeView>)
    const parent = screen.getByRole('treeitem', {name: 'Parent'})
    const file = screen.getByRole('treeitem', {name: 'A long file name, modified'})
    const parentLabel = within(parent).getByText('Parent')
    const fileLabel = within(file).getByText('A long file name')

    expect(parentLabel).toHaveAttribute('data-component', 'TreeView.Item.Label')
    expect(fileLabel).toHaveAttribute('data-component', 'TreeView.Item.Label')
    expect(fileLabel).toHaveClass('primer:truncate')
    expect(file).not.toHaveAttribute('aria-labelledby')

    rerender(
      <TreeView aria-label="Files" truncate={false}>
        {items}
      </TreeView>,
    )
    expect(within(file).getByText('A long file name')).toHaveAttribute('data-component', 'TreeView.Item.Label')
    expect(within(file).getByText('A long file name')).toHaveClass('primer:break-words')
  })

  it('can hide guides without removing nested expansion or keyboard navigation', async () => {
    const user = userEvent.setup()
    const content = (
      <TreeView.Item id="src" defaultExpanded>
        src
        <TreeView.SubTree>
          <TreeView.Item id="index">index.ts</TreeView.Item>
        </TreeView.SubTree>
      </TreeView.Item>
    )
    const {rerender} = render(<TreeView aria-label="Files">{content}</TreeView>)
    const tree = screen.getByRole('tree', {name: 'Files'})
    expect(tree.querySelector('[data-component="TreeView.LevelGuides"]')).toBeInTheDocument()
    expect(tree.querySelector('[data-component="TreeView.LevelGuide"]')).toBeInTheDocument()
    expect(tree.querySelector('[data-component="TreeView.Row"]')).toBeInTheDocument()
    expect(tree.querySelector('[data-component="TreeView.ItemContent"]')).toBeInTheDocument()

    rerender(
      <TreeView aria-label="Files" showGuides={false}>
        {content}
      </TreeView>,
    )
    expect(tree.querySelector('[data-component="TreeView.LevelGuides"]')).not.toBeInTheDocument()
    expect(tree.querySelector('[data-component="TreeView.Toggle"]')).toBeInTheDocument()
    await user.tab()
    expect(screen.getByRole('treeitem', {name: /^src$/})).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('treeitem', {name: /^index\.ts$/})).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('treeitem', {name: /^src$/})).toHaveAttribute('aria-expanded', 'false')
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

    expect(screen.getByRole('treeitem', {name: 'src'})).not.toHaveAttribute('aria-expanded')
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })
})

function getItem(id: string) {
  const item = document.getElementById(id)
  if (!item) throw new Error(`No item with id ${id}`)
  return item
}

describe('TreeView keyboard', () => {
  it('moves with Home, End, Page Down and Page Up and ignores modified arrows', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="a">a</TreeView.Item>
        <TreeView.Item id="b">b</TreeView.Item>
        <TreeView.Item id="c">c</TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('a'))
    await user.keyboard('{End}')
    expect(getItem('c')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(getItem('a')).toHaveFocus()
    await user.keyboard('{PageDown}')
    expect(getItem('c')).toHaveFocus()
    await user.keyboard('{PageUp}')
    expect(getItem('a')).toHaveFocus()
    await user.keyboard('{Control>}{ArrowDown}{/Control}')
    expect(getItem('a')).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(getItem('a')).toHaveFocus()
  })

  it('leaves leaves alone on Arrow Right and moves to the parent on Backspace', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}>
          src
        </TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('index.ts'))
    await user.keyboard('{ArrowRight}')
    expect(getItem('index')).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(getItem('src')).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(getItem('src')).toHaveFocus()
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'true')
  })

  it('focuses the next item whose name starts with the typed characters', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Fruit">
        <TreeView.Item id="apple">apple</TreeView.Item>
        <TreeView.Item id="banana">banana</TreeView.Item>
        <TreeView.Item id="blueberry">blueberry</TreeView.Item>
        <TreeView.Item id="cherry">cherry</TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('apple'))
    await user.keyboard('b')
    expect(getItem('banana')).toHaveFocus()
    await user.keyboard('l')
    expect(getItem('blueberry')).toHaveFocus()
    await user.keyboard(' ')
    expect(getItem('blueberry')).toHaveFocus()
  })

  it('activates items with Enter and Space without doubling native link activation', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onLinkSelect = vi.fn((event: React.SyntheticEvent) => event.preventDefault())
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="a" onSelect={onSelect}>
          a
        </TreeView.Item>
        <TreeView.Item as="a" href="#readme" id="readme" onSelect={onLinkSelect}>
          README.md
        </TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('a'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onSelect).toHaveBeenCalledTimes(3)

    await user.keyboard('{ArrowDown}')
    expect(getItem('readme')).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onLinkSelect).toHaveBeenCalledTimes(1)
  })

  it('runs consumer handlers first so they can prevent the built-in behavior', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files" onKeyDown={event => event.key === 'ArrowDown' && event.preventDefault()}>
        <TreeView.Item
          id="src"
          subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}
          onClick={event => event.preventDefault()}
          onKeyDown={event => event.key === 'ArrowRight' && event.preventDefault()}
        >
          src
        </TreeView.Item>
        <TreeView.Item id="readme">README.md</TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('src'))
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{ArrowRight}')
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{ArrowDown}')
    expect(getItem('src')).toHaveFocus()
  })
})

describe('TreeView pointer', () => {
  it('toggles with the chevron and selects with the row when the item has onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" onSelect={onSelect} subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}>
          src
        </TreeView.Item>
      </TreeView>,
    )

    const toggle = document.querySelector('[data-component="TreeView.Toggle"]')
    if (!toggle) throw new Error('Expected a toggle')
    await user.click(toggle)
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'true')
    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByText('src'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByText('index.ts'))
    expect(onSelect).toHaveBeenCalledTimes(1)

    fireEvent(getItem('src'), new MouseEvent('auxclick', {bubbles: true, button: 1}))
    expect(onSelect).toHaveBeenCalledTimes(2)
  })
})

describe('TreeView tab stop', () => {
  it('returns to the current item when focus re-enters the tree', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Before</button>
        <TreeView aria-label="Files">
          <TreeView.Item id="a">a</TreeView.Item>
          <TreeView.Item id="b" current>
            b
          </TreeView.Item>
          <TreeView.Item id="c">c</TreeView.Item>
        </TreeView>
        <button type="button">After</button>
      </>,
    )

    expect(getItem('b')).toHaveAttribute('tabindex', '0')
    expect(getItem('b')).toHaveAttribute('aria-current', 'true')
    await user.tab()
    await user.tab()
    expect(getItem('b')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(getItem('c')).toHaveFocus()
    expect(getItem('c')).toHaveAttribute('tabindex', '0')
    expect(getItem('b')).toHaveAttribute('tabindex', '-1')
    await user.tab()
    expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    await user.tab({shift: true})
    expect(getItem('b')).toHaveFocus()
  })

  it('returns to the last focused item when there is no current item', async () => {
    const user = userEvent.setup()
    render(
      <>
        <TreeView aria-label="Files">
          <TreeView.Item id="a">a</TreeView.Item>
          <TreeView.Item id="b">b</TreeView.Item>
        </TreeView>
        <button type="button">After</button>
      </>,
    )

    expect(getItem('a')).toHaveAttribute('tabindex', '0')
    await user.tab()
    await user.keyboard('{ArrowDown}')
    await user.tab()
    await user.tab({shift: true})
    expect(getItem('b')).toHaveFocus()
  })

  it('moves the tab stop to a remaining item when the active item is removed', async () => {
    const user = userEvent.setup()
    const {rerender} = render(
      <>
        <TreeView aria-label="Files">
          <TreeView.Item id="a">a</TreeView.Item>
          <TreeView.Item id="b">b</TreeView.Item>
        </TreeView>
        <button type="button">After</button>
      </>,
    )

    await user.click(screen.getByText('b'))
    await user.tab()
    expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    rerender(
      <>
        <TreeView aria-label="Files">
          <TreeView.Item id="a">a</TreeView.Item>
        </TreeView>
        <button type="button">After</button>
      </>,
    )
    await act(async () => {})
    expect(getItem('a')).toHaveAttribute('tabindex', '0')
  })

  it('links a polymorphic item to its sibling group and navigates through it', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item
          as="a"
          href="#src"
          id="src"
          defaultExpanded
          subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}
        >
          src
        </TreeView.Item>
      </TreeView>,
    )

    const src = getItem('src')
    const group = screen.getByRole('group', {name: 'src'})
    expect(src.tagName).toBe('A')
    expect(src.parentElement).toHaveAttribute('role', 'none')
    expect(src).toHaveAttribute('aria-owns', group.id)
    expect(getFirstChildItem(src)).toBe(getItem('index'))
    expect(getParentItem(getItem('index'))).toBe(src)

    src.focus()
    await user.keyboard('{ArrowRight}')
    expect(getItem('index')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(src).toHaveAttribute('aria-expanded', 'false')
    expect(src).not.toHaveAttribute('aria-owns')
  })

  it('leaves the items of nested trees out of navigation', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Outer">
        <TreeView.Item id="outer">
          outer
          <TreeView aria-label="Inner">
            <TreeView.Item id="inner">inner</TreeView.Item>
          </TreeView>
        </TreeView.Item>
        <TreeView.Item id="next">next</TreeView.Item>
      </TreeView>,
    )

    const outerTree = screen.getByRole('tree', {name: 'Outer'})
    expect(getTreeItems(outerTree).map(item => item.id)).toEqual(['outer', 'next'])
    expect(isItemOf(outerTree, getItem('inner'))).toBe(false)

    getItem('outer').focus()
    await user.keyboard('{ArrowDown}')
    expect(getItem('next')).toHaveFocus()
  })
})

describe('TreeView subtrees', () => {
  it('shows an empty message for an expanded subtree without items', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="empty" subtree={[]}>
          empty
        </TreeView.Item>
      </TreeView>,
    )

    expect(getItem('empty')).not.toHaveAttribute('aria-expanded')
    await user.click(screen.getByText('empty'))
    expect(getItem('empty')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('treeitem', {name: 'No items found'})).toBeInTheDocument()
  })

  it('labels each group with its parent item, without the actions shortcut hint', () => {
    render(
      <TreeView aria-label="Files">
        <TreeView.Item
          id="src"
          defaultExpanded
          secondaryActions={[{label: 'Edit', icon: PencilIcon, onClick: () => {}}]}
          subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}
        >
          src
        </TreeView.Item>
        <TreeView.Item
          aria-label="Documentation"
          id="docs"
          defaultExpanded
          subtree={<TreeView.Item id="guide">guide.md</TreeView.Item>}
        >
          docs
        </TreeView.Item>
      </TreeView>,
    )

    expect(screen.getByRole('group', {name: 'src'})).toBeInTheDocument()
    expect(screen.getByRole('group', {name: 'Documentation'})).toBeInTheDocument()
    expect(getItem('src')).toHaveAccessibleName(/^src - Press \(.+\) for more actions\.$/)
  })

  it('restores the expansion of nested items after their parent collapses', async () => {
    const user = userEvent.setup()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item
          id="src"
          subtree={
            <TreeView.Item id="lib" subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}>
              lib
            </TreeView.Item>
          }
        >
          src
        </TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('src'))
    await user.click(screen.getByText('lib'))
    expect(screen.getByText('index.ts')).toBeInTheDocument()
    await user.click(screen.getByText('src'))
    expect(screen.queryByText('lib')).not.toBeInTheDocument()
    await user.click(screen.getByText('src'))
    expect(getItem('lib')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('index.ts')).toBeInTheDocument()
  })

  it('reports controlled expansion changes without changing state on its own', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const onLeafExpandedChange = vi.fn()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item
          id="src"
          expanded={false}
          subtree={<TreeView.Item id="index">index.ts</TreeView.Item>}
          onExpandedChange={onExpandedChange}
        >
          src
        </TreeView.Item>
        <TreeView.Item id="leaf" onExpandedChange={onLeafExpandedChange}>
          leaf
        </TreeView.Item>
      </TreeView>,
    )

    await user.click(screen.getByText('src'))
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'false')
    await user.click(screen.getByText('leaf'))
    await user.keyboard('{ArrowRight}')
    expect(onLeafExpandedChange).not.toHaveBeenCalled()
  })

  it('announces loading and moves focus from the placeholder to the first loaded item', async () => {
    const user = userEvent.setup()
    function AsyncTree({items, state}: {items: string[]; state: SubTreeState}) {
      return (
        <TreeView aria-label="Files">
          <TreeView.Item id="src" defaultExpanded>
            src
            <TreeView.SubTree state={state}>
              {items.map(name => (
                <TreeView.Item key={name} id={name}>
                  {name}
                </TreeView.Item>
              ))}
            </TreeView.SubTree>
          </TreeView.Item>
        </TreeView>
      )
    }
    const {rerender} = render(<AsyncTree items={[]} state="initial" />)

    rerender(<AsyncTree items={[]} state="loading" />)
    await act(async () => {})
    expect(screen.getByRole('status')).toHaveTextContent('src content loading')
    await user.click(screen.getByText('Loading...'))

    rerender(<AsyncTree items={['index.ts', 'main.ts']} state="done" />)
    await act(async () => {})
    expect(screen.getByRole('status')).toHaveTextContent('src content loaded')
    await waitFor(() => expect(getItem('index.ts')).toHaveFocus())
  })

  it('shows skeleton rows while loading a known number of items', () => {
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.SubTree count={3} state="loading" />
        </TreeView.Item>
      </TreeView>,
    )

    const placeholder = within(screen.getByRole('group', {name: 'src'})).getByRole('treeitem')
    expect(placeholder).toHaveAccessibleName('Loading 3 items')
    expect(placeholder).toHaveAttribute('data-loading')
  })

  it('announces an empty result when loading finishes without items', async () => {
    const {rerender} = render(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.SubTree state="loading" />
        </TreeView.Item>
      </TreeView>,
    )

    rerender(
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.SubTree state="done" />
        </TreeView.Item>
      </TreeView>,
    )
    await act(async () => {})
    expect(screen.getByRole('status')).toHaveTextContent('src is empty')
    expect(screen.getByRole('treeitem', {name: 'No items found'})).toBeInTheDocument()
  })
})

describe('TreeView actions', () => {
  it('runs a single secondary action with the platform shortcut', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onSelect = vi.fn()
    render(
      <PlatformOverrideProvider value="apple">
        <TreeView aria-label="Files">
          <TreeView.Item
            id="readme"
            secondaryActions={[{label: 'Edit', icon: PencilIcon, onClick: onEdit}]}
            onSelect={onSelect}
          >
            README.md
          </TreeView.Item>
        </TreeView>
      </PlatformOverrideProvider>,
    )

    const actions = document.querySelector('[data-component="TreeView.TrailingAction"]')
    expect(actions).toHaveAttribute('aria-hidden', 'true')
    const button = actions?.querySelector('button')
    if (!button) throw new Error('Expected an action button')
    expect(button).toHaveAttribute('tabindex', '-1')

    await user.click(button)
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()

    getItem('readme').focus()
    await user.keyboard('{Shift>}{Meta>}u{/Meta}{/Shift}')
    expect(onEdit).toHaveBeenCalledTimes(2)
  })

  it('opens a dialog to choose between several secondary actions', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <PlatformOverrideProvider value="other">
        <TreeView aria-label="Files">
          <TreeView.Item
            id="readme"
            secondaryActions={[
              {label: 'Edit', icon: PencilIcon, onClick: onEdit},
              {label: 'Delete', icon: TrashIcon, onClick: onDelete, count: 2},
            ]}
          >
            README.md
          </TreeView.Item>
        </TreeView>
      </PlatformOverrideProvider>,
    )

    getItem('readme').focus()
    await user.keyboard('{Shift>}{Control>}u{/Control}{/Shift}')
    const dialog = await screen.findByRole('dialog', {name: 'Supplemental actions'})
    await user.click(within(dialog).getByText('Delete'))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onEdit).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(getItem('readme')).toHaveFocus())
  })

  it('removes leading action controls from the tab order and from activation', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <TreeView aria-label="Files">
        <TreeView.Item id="a" leadingAction={<button type="button">Drag</button>} onSelect={onSelect}>
          a
        </TreeView.Item>
      </TreeView>,
    )

    const button = screen.getByText('Drag')
    expect(getItem('a')).toHaveAttribute('data-has-leading-action')
    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button.closest('[data-component="TreeView.LeadingAction"]')).toHaveAttribute('aria-hidden', 'true')
    await user.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})

describe('TreeView.ErrorDialog', () => {
  function ErrorTree({onDismiss, onRetry}: {onDismiss?: () => void; onRetry?: () => void}) {
    return (
      <TreeView aria-label="Files">
        <TreeView.Item id="src" defaultExpanded>
          src
          <TreeView.SubTree state="error">
            <TreeView.ErrorDialog onDismiss={onDismiss} onRetry={onRetry}>
              The folder could not be loaded.
            </TreeView.ErrorDialog>
          </TreeView.SubTree>
        </TreeView.Item>
      </TreeView>
    )
  }

  it('retries and returns focus to the item', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorTree onRetry={onRetry} />)

    const dialog = screen.getByRole('alertdialog', {name: 'Error'})
    expect(dialog).toHaveAccessibleDescription('The folder could not be loaded.')
    await user.click(within(dialog).getByRole('button', {name: 'Retry'}))
    expect(onRetry).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(getItem('src')).toHaveFocus())
  })

  it('collapses the item when dismissed and returns focus to it', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<ErrorTree onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', {name: 'Dismiss'}))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(getItem('src')).toHaveAttribute('aria-expanded', 'false')
    await waitFor(() => expect(getItem('src')).toHaveFocus())
  })
})
