import React from 'react'
import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {RefPicker} from './RefPicker'
import {branches, tags} from './ref-picker-data'

const openPanel = async () => {
  const view = render(<RefPicker />)
  const user = userEvent.setup()
  await user.click(view.getByRole('button', {name: /switch branches\/tags/i}))
  return {view, user}
}

describe('RefPicker', () => {
  it('renders an anchor button with the placeholder', () => {
    const view = render(<RefPicker />)
    expect(view.getByRole('button', {name: /switch branches\/tags/i})).toBeInTheDocument()
    expect(view.queryByRole('dialog')).toBeNull()
  })

  it('opens a panel with two tabs that show per-tab counts', async () => {
    const {view} = await openPanel()

    expect(view.getByRole('dialog')).toBeInTheDocument()

    const branchesTab = view.getByRole('tab', {name: new RegExp(`Branches\\s*\\(${branches.length}\\)`)})
    const tagsTab = view.getByRole('tab', {name: new RegExp(`Tags\\s*\\(${tags.length}\\)`)})

    expect(branchesTab).toHaveAttribute('aria-selected', 'true')
    expect(tagsTab).toHaveAttribute('aria-selected', 'false')
  })

  it('filters the active tab with the shared search box and keeps the query when switching tabs', async () => {
    const {view, user} = await openPanel()

    const search = view.getByRole('textbox', {name: /filter branches and tags/i})
    await user.type(search, 'release')

    // Branches list reflects the query.
    const matchingBranches = branches.filter(b => b.name.includes('release'))
    expect(view.getByRole('option', {name: matchingBranches[0].name})).toBeInTheDocument()
    expect(
      view.getByRole('tab', {name: new RegExp(`Branches\\s*\\(${matchingBranches.length}\\)`)}),
    ).toBeInTheDocument()

    // Switching to Tags keeps the query and re-filters that tab's data (no "release" tags).
    await user.click(view.getByRole('tab', {name: /Tags/}))
    expect((search as HTMLInputElement).value).toBe('release')
    expect(view.getByRole('tab', {name: /Tags\s*\(0\)/})).toBeInTheDocument()
    expect(view.getByText(/No tags match "release"/i)).toBeInTheDocument()
  })

  it('selects an item, closes the panel and reflects the selection on the button', async () => {
    const {view, user} = await openPanel()

    await user.click(view.getByRole('option', {name: 'develop'}))

    expect(view.queryByRole('dialog')).toBeNull()
    expect(view.getByRole('button', {name: /develop/})).toBeInTheDocument()
  })
})
