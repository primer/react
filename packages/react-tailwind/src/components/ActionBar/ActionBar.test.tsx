import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {renderToString} from 'react-dom/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ActionBar} from './ActionBar'

afterEach(cleanup)

describe('ActionBar', () => {
  it('composes ActionMenu while preserving toolbar focus and stable part identifiers', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.Button>Paste</ActionBar.Button>
        <ActionBar.Menu aria-label="More actions" items={[{label: 'Delete', onClick}]} />
      </ActionBar>,
    )
    const copy = screen.getByRole('button', {name: 'Copy'})
    await user.click(copy)
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'Paste'})).toHaveFocus()
    const trigger = screen.getByRole('button', {name: 'More actions'})
    expect(trigger).toHaveAttribute('data-component', 'ActionBar.Menu')
    await user.click(trigger)
    const item = screen.getByRole('menuitem', {name: 'Delete'})
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
        <ActionBar.Menu aria-label="More actions" items={[{label: 'Delete', disabled: true, onClick}]} />
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', {name: 'More actions'}))
    const item = screen.getByRole('menuitem', {name: 'Delete'})
    expect(item).toHaveAttribute('data-disabled')
    await user.click(item)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('includes button, icon button, and menu trigger in toolbar Home and End navigation', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar aria-label="Actions">
        <ActionBar.Button>Copy</ActionBar.Button>
        <ActionBar.IconButton aria-label="Edit" icon={() => <svg aria-hidden="true" />} />
        <ActionBar.Menu aria-label="More actions" items={[]} />
      </ActionBar>,
    )

    await user.click(screen.getByRole('button', {name: 'Copy'}))
    await user.keyboard('{End}')
    expect(screen.getByRole('button', {name: 'More actions'})).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('button', {name: 'Copy'})).toHaveFocus()
  })

  it('renders an ActionMenu trigger on the server', () => {
    expect(
      renderToString(
        <ActionBar aria-label="Actions">
          <ActionBar.Menu aria-label="More actions" items={[{label: 'Delete'}]} />
        </ActionBar>,
      ),
    ).toContain('data-component="ActionBar.Menu"')
  })
})
