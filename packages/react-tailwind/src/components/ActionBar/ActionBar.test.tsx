import {act, cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {clip, MockIntersectionObserver, stubIntersectionObserver} from '../../internal/intersectionObserver.test-utils'
import {SelectPanel, type SelectPanelItem} from '../SelectPanel'
import {ActionBar, type ActionBarIconButtonProps} from './ActionBar'

const TestIcon = () => <svg aria-hidden="true" data-testid="icon" />

// @ts-expect-error ActionBar needs an aria-label to name an action that moves to overflow.
const unlabeledOverflowAction: ActionBarIconButtonProps = {icon: TestIcon, 'aria-labelledby': 'external-label'}
void unlabeledOverflowAction

beforeEach(() => {
  stubIntersectionObserver()
})

afterEach(async () => {
  await act(async () => cleanup())
  vi.unstubAllGlobals()
})

describe('ActionBar', () => {
  it('keeps mounted part refs attached when their presentation changes', () => {
    const refs = Array.from({length: 5}, () => vi.fn<(element: HTMLElement | null) => void>())
    const [buttonRef, iconRef, groupRef, dividerRef, menuRef] = refs
    function Actions({label}: {label: string}) {
      return (
        <ActionBar aria-label="Actions">
          <ActionBar.Button ref={buttonRef}>{label}</ActionBar.Button>
          <ActionBar.IconButton ref={iconRef} aria-label={label} icon={TestIcon} />
          <ActionBar.Group ref={groupRef}>
            <ActionBar.Button>Grouped action</ActionBar.Button>
          </ActionBar.Group>
          <ActionBar.Divider ref={dividerRef} />
          <ActionBar.Menu ref={menuRef} aria-label={label} icon={TestIcon} items={[]} />
        </ActionBar>
      )
    }
    const {rerender} = render(<Actions label="Copy" />)
    for (const ref of refs) {
      expect(ref).toHaveBeenLastCalledWith(expect.any(HTMLElement))
      ref.mockClear()
    }

    rerender(<Actions label="Updated action" />)

    for (const ref of refs) expect(ref).not.toHaveBeenCalled()
  })

  it('composes a configured SelectPanel trigger without remounting toolbar actions', async () => {
    const user = userEvent.setup()
    function Filters() {
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
      return (
        <React.StrictMode>
          <ActionBar aria-label="Filters" style={{width: 30}}>
            <SelectPanel
              title="Filter by project"
              items={[{text: 'bug'}]}
              selected={selected}
              onSelectedChange={setSelected}
              renderAnchor={() => <ActionBar.Button>Projects</ActionBar.Button>}
            />
            <ActionBar.Button>Labels</ActionBar.Button>
          </ActionBar>
        </React.StrictMode>
      )
    }
    render(<Filters />)
    const projects = screen.getByRole('button', {name: 'Projects'})
    const labels = screen.getByRole('button', {name: 'Labels'})
    await user.click(projects)
    expect(await screen.findByRole('combobox', {name: 'Filter items'})).toHaveFocus()
    await user.click(await screen.findByRole('option', {name: 'bug'}))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(projects).toHaveFocus()
    expect(screen.getByRole('button', {name: 'Projects'})).toBe(projects)
    expect(screen.getByRole('button', {name: 'Labels'})).toBe(labels)
  })

  it('cleans up replaced callback refs without replacing the action element', () => {
    const firstCleanup = vi.fn()
    const secondCleanup = vi.fn()
    const firstRef = vi.fn(() => firstCleanup)
    const secondRef = vi.fn(() => secondCleanup)
    const action = (ref: React.Ref<HTMLButtonElement>) => (
      <ActionBar aria-label="Actions">
        <ActionBar.Button ref={ref}>Copy</ActionBar.Button>
      </ActionBar>
    )
    const {rerender, unmount} = render(action(firstRef))
    const copy = screen.getByRole('button', {name: 'Copy'})
    firstCleanup.mockClear()

    rerender(action(secondRef))

    expect(firstCleanup).toHaveBeenCalledOnce()
    expect(secondRef).toHaveBeenCalledExactlyOnceWith(copy)
    expect(screen.getByRole('button', {name: 'Copy'})).toBe(copy)
    unmount()
    expect(secondCleanup).toHaveBeenCalledOnce()
  })

  it.each(['button', 'icon button'] as const)(
    'uses the latest overflow %s handler and removes it when absent',
    async kind => {
      const user = userEvent.setup()
      const firstClick = vi.fn()
      const nextClick = vi.fn()
      function Actions({onClick}: {onClick?: React.MouseEventHandler<HTMLButtonElement>}) {
        return (
          <ActionBar aria-label="Actions">
            {kind === 'button' ? (
              <ActionBar.Button onClick={onClick}>Copy</ActionBar.Button>
            ) : (
              <ActionBar.IconButton aria-label="Copy" icon={TestIcon} onClick={onClick} />
            )}
          </ActionBar>
        )
      }
      const {rerender} = render(<Actions onClick={firstClick} />)
      const copy = screen.getByRole('button', {name: 'Copy'})
      clip(copy)
      await user.click(screen.getByRole('button', {name: 'More items'}))

      rerender(<Actions onClick={nextClick} />)
      await user.click(screen.getByRole('menuitem', {name: 'Copy'}))
      expect(nextClick).toHaveBeenCalledOnce()
      expect(firstClick).not.toHaveBeenCalled()
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())

      rerender(<Actions />)
      await user.click(screen.getByRole('button', {name: 'More items'}))
      await user.click(await screen.findByRole('menuitem', {name: 'Copy'}))
      expect(nextClick).toHaveBeenCalledOnce()
      expect(firstClick).not.toHaveBeenCalled()
    },
  )

  it('composes ActionMenu while preserving toolbar focus and stable part identifiers', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.Button>Paste</ActionBar.Button>
        <ActionBar.Menu aria-label="More actions" icon={TestIcon} items={[{label: 'Delete', onClick}]} />
      </ActionBar>,
    )
    const copy = screen.getByRole('button', {name: 'Copy'})
    await user.click(copy)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'Paste'})).toHaveFocus()
    const trigger = screen.getByRole('button', {name: 'More actions'})
    expect(trigger).toHaveAttribute('data-component', 'ActionBar.Menu.IconButton')
    await user.click(trigger)
    const item = await screen.findByRole('menuitem', {name: 'Delete'})
    expect(item).toHaveAttribute('data-component', 'ActionMenu.Item')
    expect(item.closest('[role="menu"]')).toHaveAttribute('data-component', 'ActionMenu.Content')
    await user.click(item)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('tracks the open state of a menu trigger with its own id', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Menu aria-label="More actions" icon={TestIcon} id="more-actions" items={[{label: 'Delete'}]} />
      </ActionBar>,
    )
    const trigger = screen.getByRole('button', {name: 'More actions'})
    expect(trigger).toHaveAttribute('id', 'more-actions')
    await user.click(trigger)
    const menu = await screen.findByRole('menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
  })

  it('does not activate disabled menu items', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Menu
          aria-label="More actions"
          icon={TestIcon}
          items={[{label: 'Delete', disabled: true, onClick}]}
        />
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', {name: 'More actions'}))
    const item = await screen.findByRole('menuitem', {name: 'Delete'})
    expect(item).toHaveAttribute('data-disabled')
    await user.click(item)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders menu dividers, visuals, variants, and submenus', async () => {
    const user = userEvent.setup()
    const onPaste = vi.fn()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Menu
          aria-label="Edit"
          icon={<TestIcon />}
          items={[
            {label: 'Copy', leadingVisual: TestIcon, trailingVisual: '⌘C'},
            {type: 'divider'},
            {label: 'Paste special', items: [{label: 'Paste plain text', onClick: onPaste}]},
            {label: 'Delete', variant: 'danger'},
          ]}
        />
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', {name: 'Edit'}))
    const menu = await screen.findByRole('menu')
    const copy = within(menu).getByRole('menuitem', {name: /Copy/})
    expect(within(copy).getByTestId('icon')).toBeInTheDocument()
    expect(copy).toHaveTextContent('⌘C')
    expect(within(menu).getByRole('separator')).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', {name: 'Delete'})).toHaveAttribute('data-variant', 'danger')

    within(menu).getByRole('menuitem', {name: 'Paste special'}).focus()
    await user.keyboard('{ArrowRight}')
    await user.click(await screen.findByRole('menuitem', {name: 'Paste plain text'}))
    expect(onPaste).toHaveBeenCalledOnce()
  })

  it('sizes its buttons from the bar unless a button sets its own size', () => {
    render(
      <ActionBar aria-label="Actions" size="small">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.Button size="large">Paste</ActionBar.Button>
        <ActionBar.IconButton aria-label="Edit" icon={TestIcon} />
        <ActionBar.IconButton aria-label="Delete" icon={TestIcon} size="large" />
        <ActionBar.Menu aria-label="Menu" icon={TestIcon} items={[]} />
        <ActionBar.Menu aria-label="Large menu" icon={TestIcon} items={[]} size="large" />
      </ActionBar>,
    )

    for (const name of ['Copy', 'Edit', 'Menu']) {
      expect(screen.getByRole('button', {name})).toHaveAttribute('data-size', 'small')
    }
    for (const name of ['Paste', 'Delete', 'Large menu']) {
      expect(screen.getByRole('button', {name})).toHaveAttribute('data-size', 'large')
    }
  })

  it('includes button, icon button, and menu trigger in toolbar Home and End navigation', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.IconButton aria-label="Edit" icon={TestIcon} />
        <ActionBar.Menu aria-label="More actions" icon={TestIcon} items={[]} />
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', {name: 'Copy'}))
    await user.keyboard('{End}')
    expect(screen.getByRole('button', {name: 'More actions'})).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', {name: 'Copy'})).toHaveFocus()
  })

  it('observes items against the toolbar and only shows the More items menu while something overflows', () => {
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
      </ActionBar>,
    )

    // Compare the root by identity: deep equality would walk the DOM and React fiber graph.
    expect(MockIntersectionObserver.current?.options?.root).toBe(screen.getByRole('toolbar'))
    expect(MockIntersectionObserver.current?.options?.threshold).toEqual([0, 0.95])
    expect(screen.queryByRole('button', {name: 'More items'})).not.toBeInTheDocument()

    const copy = screen.getByRole('button', {name: 'Copy'})
    clip(copy)
    expect(copy).toHaveAttribute('data-overflowing')
    expect(screen.getByRole('toolbar')).toHaveAttribute('data-has-overflow')
    expect(screen.getByRole('button', {name: 'More items'})).toBeInTheDocument()

    clip()
    expect(copy).not.toHaveAttribute('data-overflowing')
    expect(screen.queryByRole('button', {name: 'More items'})).not.toBeInTheDocument()
  })

  it('moves overflowing items into the More items menu in bar order', async () => {
    const user = userEvent.setup()
    const onBold = vi.fn()
    const onItalic = vi.fn()
    const onCode = vi.fn()
    render(
      <ActionBar aria-label="Formatting">
        <ActionBar.IconButton aria-label="Bold" icon={TestIcon} onClick={onBold} />
        <ActionBar.Divider />
        <ActionBar.IconButton aria-label="Italic" icon={TestIcon} onClick={onItalic} />
        <ActionBar.Button leadingVisual={TestIcon} onClick={onCode}>
          Code
        </ActionBar.Button>
        <ActionBar.Divider />
        <ActionBar.Menu aria-label="Insert" icon={TestIcon} items={[{label: 'Table'}]} />
      </ActionBar>,
    )

    const italic = screen.getByRole('button', {name: 'Italic'})
    const code = screen.getByRole('button', {name: 'Code'})
    const insert = screen.getByRole('button', {name: 'Insert'})
    const [, trailingDivider] = screen.getAllByRole('separator')
    clip(insert, trailingDivider!, code, italic)

    await user.click(screen.getByRole('button', {name: 'More items'}))
    const menu = await screen.findByRole('menu')
    expect(
      Array.from(menu.querySelectorAll('[role="menuitem"], [role="separator"]'), item =>
        item.getAttribute('role') === 'separator' ? 'separator' : item.textContent,
      ),
    ).toEqual(['Italic', 'Code', 'separator', 'Insert'])

    await user.click(within(menu).getByRole('menuitem', {name: 'Code'}))
    expect(onCode).toHaveBeenCalledOnce()
    expect(onBold).not.toHaveBeenCalled()
  })

  it('overflows a group as a whole and skips overflowing items in keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.Group>
          <ActionBar.Button>Undo</ActionBar.Button>
          <ActionBar.Button>Redo</ActionBar.Button>
        </ActionBar.Group>
      </ActionBar>,
    )

    const group = screen.getByRole('group')
    const undo = screen.getByRole('button', {name: 'Undo'})
    const redo = screen.getByRole('button', {name: 'Redo'})
    clip(group)
    expect(group).toHaveAttribute('data-overflowing')
    expect(group).toHaveAttribute('aria-hidden', 'true')
    expect(undo).toHaveAttribute('data-overflowing')
    expect(redo).toHaveAttribute('data-overflowing')
    expect(screen.queryByRole('button', {name: 'Undo'})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Redo'})).not.toBeInTheDocument()

    const copy = screen.getByRole('button', {name: 'Copy'})
    await user.click(copy)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'More items'})).toHaveFocus()
    await user.keyboard('{Home}')
    expect(copy).toHaveFocus()

    await user.click(screen.getByRole('button', {name: 'More items'}))
    expect((await screen.findAllByRole('menuitem')).map(item => item.textContent)).toEqual(['Undo', 'Redo'])
  })

  it('hides clipped originals while preserving accessible overflow items and restores them when they fit', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Author</ActionBar.Button>
        <ActionBar.Button disabled>Labels</ActionBar.Button>
        <ActionBar.IconButton aria-label="Assignee" icon={TestIcon} />
        <ActionBar.Button aria-disabled={false}>Projects</ActionBar.Button>
        <ActionBar.Menu aria-label="More actions" icon={TestIcon} items={[{label: 'Delete'}]} />
      </ActionBar>,
    )

    const originals = [
      screen.getByRole('button', {name: 'Author'}),
      screen.getByRole('button', {name: 'Labels'}),
      screen.getByRole('button', {name: 'Assignee'}),
      screen.getByRole('button', {name: 'Projects'}),
      screen.getByRole('button', {name: 'More actions'}),
    ]
    clip(...originals)
    for (const original of originals) {
      expect(original).toHaveAttribute('aria-hidden', 'true')
      expect(original).toBeDisabled()
      expect(original).not.toHaveAttribute('aria-disabled', 'false')
    }
    for (const name of ['Author', 'Labels', 'Assignee', 'Projects', 'More actions']) {
      expect(screen.queryByRole('button', {name})).not.toBeInTheDocument()
    }

    await user.click(screen.getByRole('button', {name: 'More items'}))
    const menu = await screen.findByRole('menu')
    for (const name of ['Author', 'Labels', 'Assignee', 'Projects', 'More actions']) {
      expect(within(menu).getByRole('menuitem', {name})).toBeInTheDocument()
    }
    expect(within(menu).getByRole('menuitem', {name: 'Labels'})).toHaveAttribute('aria-disabled', 'true')
    await user.keyboard('{Escape}')

    clip()
    for (const original of originals) expect(original).not.toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('button', {name: 'Projects'})).toBeEnabled()
    expect(screen.getByRole('button', {name: 'Labels'})).toHaveAttribute('aria-disabled', 'true')
  })

  it('preserves toolbar focus when the focused item overflows and fits again', async () => {
    render(
      <React.StrictMode>
        <ActionBar aria-label="Actions">
          <ActionBar.Button>Author</ActionBar.Button>
          <ActionBar.Button>Projects</ActionBar.Button>
        </ActionBar>
      </React.StrictMode>,
    )
    const projects = screen.getByRole('button', {name: 'Projects'})
    projects.focus()
    expect(projects).toHaveFocus()

    clip(projects)
    expect(screen.getByRole('button', {name: 'More items'})).toHaveFocus()

    clip()
    await waitFor(() => expect(projects).toHaveFocus())
  })

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])('restores a portaled submenu to its registered action (StrictMode: %s, deep: %s)', async (strict, deep) => {
    const user = userEvent.setup()
    const content = (
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Labels</ActionBar.Button>
        <ActionBar.Menu
          aria-label="Projects"
          icon={TestIcon}
          items={[{label: 'bug'}, {label: 'More projects', items: [{label: 'feature'}]}]}
        />
      </ActionBar>
    )
    render(strict ? <React.StrictMode>{content}</React.StrictMode> : content)
    const labels = screen.getByRole('button', {name: 'Labels'})
    const projects = screen.getByRole('button', {name: 'Projects'})
    clip(labels, projects)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    const overflowProjects = await screen.findByRole('menuitem', {name: 'Projects'})
    act(() => overflowProjects.focus())
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'bug'})).toHaveFocus())
    if (deep) {
      await user.keyboard('{ArrowDown}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'More projects'})).toHaveFocus())
      await user.keyboard('{ArrowRight}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'feature'})).toHaveFocus())
      await user.keyboard('{Escape}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'More projects'})).toHaveFocus())
      await user.keyboard('{ArrowRight}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'feature'})).toHaveFocus())
    }
    expect(screen.getByRole('menu', {name: 'More items'}).contains(document.activeElement)).toBe(false)

    clip()

    await waitFor(() => expect(projects).toHaveFocus())
    expect(screen.queryByRole('button', {name: 'More items'})).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Projects'})).toBe(projects)
  })

  it.each([false, true])('preserves outside focus when overflow disappears (after resize: %s)', async afterResize => {
    const user = userEvent.setup()
    render(
      <>
        <input aria-label="Outside target" />
        <ActionBar aria-label="Actions">
          <ActionBar.Menu aria-label="Projects" icon={TestIcon} items={[{label: 'bug'}]} />
        </ActionBar>
      </>,
    )
    const projects = screen.getByRole('button', {name: 'Projects'})
    const outside = screen.getByRole('textbox', {name: 'Outside target'})
    clip(projects)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    const overflowProjects = await screen.findByRole('menuitem', {name: 'Projects'})
    act(() => overflowProjects.focus())
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'bug'})).toHaveFocus())

    if (afterResize) clip()
    await act(async () => outside.focus())
    if (!afterResize) clip()

    await waitFor(() => expect(screen.queryByRole('button', {name: 'More items'})).not.toBeInTheDocument())
    expect(outside).toHaveFocus()
  })

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])('respects the submenu return target (available: %s, deep: %s)', async (available, deep) => {
    const user = userEvent.setup()
    const returnFocusRef = React.createRef<HTMLButtonElement>()
    const onInlineFocus = vi.fn()
    render(
      <>
        {available ? (
          <button ref={returnFocusRef} type="button">
            Custom return target
          </button>
        ) : null}
        <ActionBar aria-label="Actions">
          <ActionBar.Menu
            aria-label="Projects"
            icon={TestIcon}
            items={[{label: 'bug'}, {label: 'More projects', items: [{label: 'feature'}]}]}
            returnFocusRef={returnFocusRef}
            onFocus={onInlineFocus}
          />
        </ActionBar>
      </>,
    )
    const projects = screen.getByRole('button', {name: 'Projects'})
    clip(projects)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    const overflowProjects = await screen.findByRole('menuitem', {name: 'Projects'})
    act(() => overflowProjects.focus())
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'bug'})).toHaveFocus())
    if (deep) {
      await user.keyboard('{ArrowDown}{ArrowRight}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'feature'})).toHaveFocus())
    }
    onInlineFocus.mockClear()

    clip()

    await waitFor(() => expect(available ? returnFocusRef.current : projects).toHaveFocus())
    if (available) expect(onInlineFocus).not.toHaveBeenCalled()

    act(() => projects.focus())
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'bug'})).toHaveFocus())
    await user.keyboard('{Enter}')
    await waitFor(() => expect(available ? returnFocusRef.current : projects).toHaveFocus())

    clip(projects)
    await user.click(screen.getByRole('button', {name: 'More items'}))
    const reopenedProjects = await screen.findByRole('menuitem', {name: 'Projects'})
    act(() => reopenedProjects.focus())
    await user.keyboard('{ArrowRight}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'bug'})).toHaveFocus())
    if (deep) {
      await user.keyboard('{ArrowDown}{ArrowRight}')
      await waitFor(() => expect(screen.getByRole('menuitem', {name: 'feature'})).toHaveFocus())
    }
    onInlineFocus.mockClear()

    clip()

    await waitFor(() => expect(available ? returnFocusRef.current : projects).toHaveFocus())
    if (available) expect(onInlineFocus).not.toHaveBeenCalled()
  })

  it.each(['escape', 'selection', 'outside'])('preserves ordinary overflow dismissal (%s)', async dismissal => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <>
        <input aria-label="Outside target" />
        <ActionBar aria-label="Actions">
          <ActionBar.Button onClick={onClick}>Labels</ActionBar.Button>
        </ActionBar>
      </>,
    )
    clip(screen.getByRole('button', {name: 'Labels'}))
    const more = screen.getByRole('button', {name: 'More items'})
    act(() => more.focus())
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(screen.getByRole('menuitem', {name: 'Labels'})).toHaveFocus())
    const outside = screen.getByRole('textbox', {name: 'Outside target'})

    if (dismissal === 'outside') await user.click(outside)
    else await user.keyboard(dismissal === 'escape' ? '{Escape}' : '{Enter}')

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    await waitFor(() => expect(dismissal === 'outside' ? outside : more).toHaveFocus())
    expect(onClick).toHaveBeenCalledTimes(dismissal === 'selection' ? 1 : 0)
  })

  it('does not restore intentionally blurred submenu focus', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Menu aria-label="Projects" icon={TestIcon} items={[{label: 'bug'}]} />
      </ActionBar>,
    )
    clip(screen.getByRole('button', {name: 'Projects'}))
    await user.click(screen.getByRole('button', {name: 'More items'}))
    const overflowProjects = await screen.findByRole('menuitem', {name: 'Projects'})
    act(() => overflowProjects.focus())
    await user.keyboard('{ArrowRight}')
    const bug = await screen.findByRole('menuitem', {name: 'bug'})
    await waitFor(() => expect(bug).toHaveFocus())
    act(() => {
      // eslint-disable-next-line github/no-blur -- Simulate intentional focus loss; resize must not reclaim it.
      bug.blur()
    })
    expect(document.activeElement).toBe(document.body)

    clip()
    await act(() => Promise.resolve())

    expect(document.activeElement).toBe(document.body)
  })

  it.each([false, true])(
    'restores focus when an open menu overflows (custom return focus: %s)',
    async hasCustomReturnFocus => {
      const user = userEvent.setup()
      const returnFocusRef = React.createRef<HTMLButtonElement>()
      render(
        <>
          <button ref={returnFocusRef} type="button">
            Custom return target
          </button>
          <ActionBar aria-label="Actions">
            <ActionBar.Menu
              aria-label="Settings"
              icon={TestIcon}
              items={[{label: 'Configure'}]}
              returnFocusRef={hasCustomReturnFocus ? returnFocusRef : undefined}
            />
          </ActionBar>
        </>,
      )

      const trigger = screen.getByRole('button', {name: 'Settings'})
      await user.click(trigger)
      const configure = await screen.findByRole('menuitem', {name: 'Configure'})
      expect(configure).toBeVisible()
      act(() => configure.focus())
      clip(trigger)
      const more = screen.getByRole('button', {name: 'More items'})
      await user.keyboard('{Escape}')
      await waitFor(() => expect(hasCustomReturnFocus ? returnFocusRef.current : more).toHaveFocus())
    },
  )

  it('renders an ActionMenu trigger without the More items menu on the server', () => {
    const html = renderToString(
      <ActionBar aria-label="Actions">
        <ActionBar.Menu aria-label="More actions" icon={TestIcon} items={[{label: 'Delete'}]} />
      </ActionBar>,
    )
    expect(html).toContain('data-component="ActionBar.Menu.IconButton"')
    expect(html).not.toContain('More items')
  })
})
