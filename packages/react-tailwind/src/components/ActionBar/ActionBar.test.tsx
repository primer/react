import {cleanup, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {clip, MockIntersectionObserver, stubIntersectionObserver} from '../../internal/intersectionObserver.test-utils'
import {ActionBar} from './ActionBar'

const TestIcon = () => <svg aria-hidden="true" data-testid="icon" />

beforeEach(() => {
  stubIntersectionObserver()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ActionBar', () => {
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
    clip(group)
    expect(group).toHaveAttribute('data-overflowing')
    expect(screen.getByRole('button', {name: 'Undo'})).toHaveAttribute('data-overflowing')
    expect(screen.getByRole('button', {name: 'Redo'})).toHaveAttribute('data-overflowing')

    const copy = screen.getByRole('button', {name: 'Copy'})
    await user.click(copy)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'More items'})).toHaveFocus()
    await user.keyboard('{Home}')
    expect(copy).toHaveFocus()

    await user.click(screen.getByRole('button', {name: 'More items'}))
    expect((await screen.findAllByRole('menuitem')).map(item => item.textContent)).toEqual(['Undo', 'Redo'])
  })

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
