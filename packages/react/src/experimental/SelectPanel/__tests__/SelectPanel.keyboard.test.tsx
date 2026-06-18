import {type ComponentType} from 'react'
import {render, screen, within} from '@testing-library/react'
import {userEvent} from 'vitest/browser'
import {describe, expect, it} from 'vitest'
import type {StoryObj} from '@storybook/react-vite'
import {TabbedBranchesAndTags, MultiSelectAcrossTabs} from '../SelectPanelParts.stories'

/**
 * Keyboard + focus-management integration tests for the layered SelectPanel
 * examples. These drive real keystrokes in Chromium (vitest browser mode) and
 * assert the accessibility contract the layered build claims: an
 * `aria-activedescendant` combobox (focus stays on the input), Enter-to-select,
 * Escape-to-close with focus restoration, a non-focusable tabpanel (no keyboard
 * dead-end), and focus returning to the input when a tab is switched.
 *
 * They exercise the shipped story components directly, so they verify the actual
 * examples rather than a reduced fixture.
 */

const renderStory = (story: StoryObj) => {
  const Story = story.render as ComponentType
  return render(<Story />)
}

const combobox = () => screen.getByRole('combobox')
const listbox = () => screen.getByRole('listbox')
const options = () => within(listbox()).getAllByRole('option')

describe('SelectPanel (layered) — keyboard navigation', () => {
  it('opens with focus on the search input (autoFocus)', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(combobox()).toHaveFocus()
  })

  it('ArrowDown/ArrowUp move aria-activedescendant across the active listbox while focus stays on the input', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))
    // Be deterministic about which element receives the keystrokes.
    await user.click(combobox())

    const all = options()
    expect(all.length).toBeGreaterThan(2)

    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', all[0].id)
    expect(all[0]).toHaveAttribute('data-active-descendant', '')
    // Focus never leaves the input — this is the activedescendant pattern, not roving focus.
    expect(combobox()).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', all[1].id)
    expect(all[1]).toHaveAttribute('data-active-descendant', '')
    expect(all[0]).not.toHaveAttribute('data-active-descendant')

    await user.keyboard('{ArrowUp}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', all[0].id)

    // ArrowUp from the first option wraps to the last.
    await user.keyboard('{ArrowUp}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', all[all.length - 1].id)
    expect(combobox()).toHaveFocus()
  })

  it('Enter selects the active option (single-select replaces the prior selection)', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))
    await user.click(combobox())

    // Move to the second option ("develop") — the first ("main") is selected by default.
    await user.keyboard('{ArrowDown}{ArrowDown}')
    const active = options()[1]
    const activeName = active.textContent
    expect(combobox()).toHaveAttribute('aria-activedescendant', active.id)

    await user.keyboard('{Enter}')

    expect(active).toHaveAttribute('aria-selected', 'true')
    // Single-select replaces: the previously-selected "main" is no longer selected.
    expect(options()[0]).toHaveAttribute('aria-selected', 'false')
    // The anchor reflects the new selection.
    expect(screen.getByRole('button', {name: new RegExp(`Switch ref: ${activeName}`)})).toBeInTheDocument()
    // The Parts example does not auto-close on select — the panel stays open.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('Escape closes the panel and restores focus to the anchor', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    const anchor = screen.getByRole('button', {name: /Switch ref/})
    await user.click(anchor)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: /Switch ref/})).toHaveFocus()
  })
})

describe('SelectPanel (layered) — tab switching + focus management', () => {
  it('switching tabs by keyboard activates the tab and returns focus to the input; the tabpanel is never a focus stop', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))

    // The tabpanel must never be a keyboard dead-end.
    expect(screen.getByRole('tabpanel')).not.toHaveAttribute('tabindex')

    // These Tabs use selection-follows-focus: focusing a tab activates it. The
    // example then returns focus to the shared input on change, so one ArrowRight
    // both switches to Tags and lands the user back on the input ready to filter.
    screen.getByRole('tab', {name: /Branches/}).focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', {name: /Tags/})).toHaveAttribute('aria-selected', 'true')
    expect(within(listbox()).getByText('v3.0.0')).toBeInTheDocument()
    expect(within(listbox()).queryByText('develop')).not.toBeInTheDocument()
    expect(combobox()).toHaveFocus()
    expect(screen.getByRole('tabpanel')).not.toHaveAttribute('tabindex')

    // Arrowing now navigates the Tags list, proving focus-return left the user in a usable place.
    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', options()[0].id)
  })

  it('one selection model persists across tabs when driven entirely by keyboard (multi-select)', async () => {
    const user = userEvent.setup()
    renderStory(MultiSelectAcrossTabs)

    await user.click(screen.getByRole('button', {name: /Refs selected/}))
    await user.click(combobox())

    // Select the first branch by keyboard.
    await user.keyboard('{ArrowDown}{Enter}')
    expect(options()[0]).toHaveAttribute('aria-selected', 'true')

    // Switch to Tags by keyboard — selection-follows-focus activates it and the
    // example returns focus to the input.
    screen.getByRole('tab', {name: /Branches/}).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: /Tags/})).toHaveAttribute('aria-selected', 'true')
    expect(combobox()).toHaveFocus()

    // Select the first tag by keyboard.
    await user.keyboard('{ArrowDown}{Enter}')
    expect(options()[0]).toHaveAttribute('aria-selected', 'true')

    // The combined count reflects both tabs.
    expect(screen.getByRole('button', {name: /Refs selected: 2/})).toBeInTheDocument()

    // Back on Branches, the earlier branch is still selected.
    screen.getByRole('tab', {name: /Tags/}).focus()
    await user.keyboard('{ArrowLeft}')
    expect(combobox()).toHaveFocus()
    expect(options()[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('arrowing through options works correctly after switching tabs (both directions)', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))
    await user.click(combobox())

    // Navigate a few options into the Branches list.
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', options()[2].id)

    // Switch to Tags.
    screen.getByRole('tab', {name: /Branches/}).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: /Tags/})).toHaveAttribute('aria-selected', 'true')
    expect(combobox()).toHaveFocus()

    const tagOptions = options()
    expect(tagOptions.length).toBe(8)

    // ArrowDown lands on the first option of the *new* tab, then continues within it.
    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', tagOptions[0].id)
    expect(listbox().contains(document.getElementById(tagOptions[0].id))).toBe(true)

    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', tagOptions[1].id)

    await user.keyboard('{ArrowUp}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', tagOptions[0].id)

    // ArrowUp from the first option wraps to the last option of the Tags list.
    await user.keyboard('{ArrowUp}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', tagOptions[tagOptions.length - 1].id)

    // Switch back to Branches and arrow again — navigation resumes in the Branches list.
    screen.getByRole('tab', {name: /Tags/}).focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', {name: /Branches/})).toHaveAttribute('aria-selected', 'true')
    expect(combobox()).toHaveFocus()

    const branchOptions = options()
    expect(branchOptions.length).toBe(10)

    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', branchOptions[0].id)
    expect(listbox().contains(document.getElementById(branchOptions[0].id))).toBe(true)
    expect(within(listbox()).getByText('main')).toBeInTheDocument()
  })

  it('aria-activedescendant is cleared on tab switch (cannot dangle on a removed option)', async () => {
    const user = userEvent.setup()
    renderStory(TabbedBranchesAndTags)

    await user.click(screen.getByRole('button', {name: /Switch ref/}))
    await user.click(combobox())

    // Make an option active in the Branches list.
    await user.keyboard('{ArrowDown}{ArrowDown}')
    const branchActiveId = combobox().getAttribute('aria-activedescendant')
    expect(branchActiveId).toBeTruthy()

    // Switch to Tags — the previously-active Branches option is now unmounted.
    screen.getByRole('tab', {name: /Branches/}).focus()
    await user.keyboard('{ArrowRight}')
    expect(combobox()).toHaveFocus()

    // The previously-active option is gone from the DOM...
    expect(document.getElementById(branchActiveId as string)).toBeNull()
    // ...and the combobox no longer references it — the active option is reset on
    // switch (via the foundation's clearActiveDescendant), so the reference can't dangle.
    expect(combobox()).not.toHaveAttribute('aria-activedescendant')

    // The next arrow then activates the first option of the new (Tags) list.
    await user.keyboard('{ArrowDown}')
    expect(combobox()).toHaveAttribute('aria-activedescendant', options()[0].id)
  })
})
