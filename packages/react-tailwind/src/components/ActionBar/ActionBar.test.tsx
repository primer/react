import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ActionBar} from './ActionBar'

afterEach(cleanup)

describe('ActionBar', () => {
  it('uses toolbar roving focus and Base UI menu semantics', async () => {
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
    await user.click(screen.getByRole('button', {name: 'More actions'}))
    await user.click(screen.getByRole('menuitem', {name: 'Delete'}))
    expect(onClick).toHaveBeenCalledOnce()
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
})
