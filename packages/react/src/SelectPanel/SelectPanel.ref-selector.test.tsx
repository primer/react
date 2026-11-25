import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../BaseStyles'
import {RefSelectorExample} from './SelectPanel.ref-selector.stories'

function renderExample() {
  render(
    <BaseStyles>
      <RefSelectorExample />
    </BaseStyles>,
  )
}

describe('SelectPanel RefSelector example', () => {
  it('filters branches and tags, recovers from no results, and maintains the active collection relationship', async () => {
    renderExample()
    await userEvent.click(page.getByRole('button', {name: 'main', exact: true}))
    const search = page.getByRole('combobox', {name: 'Find a branch or tag'})
    await expect.element(search).toHaveFocus()
    await expect
      .element(page.getByRole('option', {name: 'main default', exact: true}))
      .toHaveAttribute('aria-selected', 'true')

    await userEvent.fill(search, 'NO-MATCH')
    await expect.element(page.getByText('No branches found')).toBeVisible()
    await expect.element(page.getByRole('listbox')).not.toBeInTheDocument()
    await expect.element(search).not.toHaveAttribute('aria-controls')
    await userEvent.fill(search, '  IMPECCABLE  ')
    await expect.element(page.getByRole('option', {name: 'joshfarrant/impeccable', exact: true})).toBeVisible()
    expect(page.getByRole('option').all()).toHaveLength(1)

    await userEvent.clear(search)
    await userEvent.click(page.getByRole('tab', {name: /^Branches\b/}))
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(page.getByRole('tab', {name: /^Tags\b/})).toHaveAttribute('aria-selected', 'true')
    await expect.element(search).toHaveAttribute('placeholder', 'Search or create a new tag')
    expect(page.getByRole('listbox').all()).toHaveLength(1)
    await expect
      .element(search)
      .toHaveAttribute('aria-controls', page.getByRole('listbox', {name: 'Tags'}).element().id)
    await userEvent.fill(search, 'v36.7')
    expect(page.getByRole('option').all()).toHaveLength(2)
    await userEvent.fill(search, 'NO-MATCH')
    await expect.element(page.getByText('No tags found')).toBeVisible()
    await userEvent.clear(search)
    await expect.element(page.getByRole('option', {name: 'v36.14.0', exact: true})).toBeVisible()
  })

  it('selects with the keyboard, returns focus, and cannot deselect the current ref', async () => {
    renderExample()
    await userEvent.click(page.getByRole('button', {name: 'main', exact: true}))
    const search = page.getByRole('combobox', {name: 'Find a branch or tag'})
    await userEvent.fill(search, 'impeccable')
    const option = page.getByRole('option', {name: 'joshfarrant/impeccable', exact: true})
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(search).toHaveAttribute('aria-activedescendant', option.element().id)
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    const trigger = page.getByRole('button', {name: 'joshfarrant/impeccable', exact: true})
    await expect.element(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await expect.element(search).toHaveValue('')
    await expect.element(option).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(option)
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await expect.element(option).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps selection independent of the tab and updates the trigger and footer when a tag is chosen', async () => {
    renderExample()
    await userEvent.click(page.getByRole('button', {name: 'main', exact: true}))
    const footer = page.getByRole('list')
    const branchesLink = footer.getByRole('link', {name: 'View all branches'})
    await expect.element(branchesLink).toHaveAttribute('href', 'https://github.com/primer/react/branches')
    expect(page.getByRole('listbox').element()).not.toContainElement(branchesLink.element())
    await userEvent.click(page.getByRole('tab', {name: /^Tags\b/}))
    await expect
      .element(footer.getByRole('link', {name: 'View all tags'}))
      .toHaveAttribute('href', 'https://github.com/primer/react/tags')
    const tag = page.getByRole('option', {name: 'v36.14.0', exact: true})
    await expect.element(tag).toHaveAttribute('aria-selected', 'false')
    await userEvent.click(tag)
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    const trigger = page.getByRole('button', {name: 'v36.14.0', exact: true})
    await expect.element(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await expect.element(page.getByRole('tab', {name: /^Tags\b/})).toHaveAttribute('aria-selected', 'true')
    await expect.element(tag).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(page.getByRole('tab', {name: /^Branches\b/}))
    await expect
      .element(page.getByRole('option', {name: 'main default', exact: true}))
      .toHaveAttribute('aria-selected', 'false')
  })

  it('selects the first of multiple matching tags using collection navigation from search', async () => {
    renderExample()
    await userEvent.click(page.getByRole('button', {name: 'main', exact: true}))
    const search = page.getByRole('combobox', {name: 'Find a branch or tag'})
    await userEvent.click(page.getByRole('tab', {name: /^Tags\b/}))
    await userEvent.fill(search, 'v36.7')
    await expect.poll(() => page.getByRole('option').all().length).toBe(2)
    const first = page.getByRole('option', {name: 'v36.7.1', exact: true})
    await userEvent.keyboard('{PageUp}')
    await expect.element(search).toHaveAttribute('aria-activedescendant', first.element().id)
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(page.getByRole('button', {name: 'v36.7.1', exact: true})).toHaveFocus()
  })

  it.each(['close button', 'Escape'] as const)('dismisses using %s and restores focus', async method => {
    renderExample()
    const trigger = page.getByRole('button', {name: 'main', exact: true})
    await userEvent.click(trigger)
    await expect.element(page.getByRole('combobox')).toHaveFocus()
    if (method === 'close button') {
      await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))
    } else {
      await userEvent.keyboard('{Escape}')
    }
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
  })
})
