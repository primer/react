import React from 'react'
import {cleanup, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it} from 'vitest'
import {
  CustomRowsAndFooter as CustomRowsAndFooterStory,
  GroupedPickerWithCreation as GroupedPickerWithCreationStory,
} from './SelectPanel.composition.stories'

const CustomRowsAndFooter = CustomRowsAndFooterStory.render
const GroupedPickerWithCreation = GroupedPickerWithCreationStory.render

afterEach(cleanup)

describe('SelectPanel compositions', () => {
  it('filters custom rows and restores trigger focus after keyboard selection', async () => {
    const user = userEvent.setup()
    render(<CustomRowsAndFooter />)
    const trigger = screen.getByRole('combobox', {name: 'Choose assignee'})
    await user.click(trigger)
    expect(await screen.findByRole('dialog', {name: 'Choose assignee'})).toBeVisible()
    const input = screen.getByRole('combobox', {name: 'Filter assignees'})
    await waitFor(() => expect(input).toHaveFocus())
    await user.type(input, 'Mona')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', {name: /Mona.*Design systems.*Assigned issues:\s*3/})).toBeVisible()
    await user.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('keeps footer actions out of the list and reachable by keyboard', async () => {
    const user = userEvent.setup()
    render(<CustomRowsAndFooter />)
    const trigger = screen.getByRole('combobox', {name: 'Choose assignee'})
    await user.click(trigger)
    const action = await screen.findByRole('button', {name: 'Manage people'})
    expect(within(screen.getByRole('listbox')).queryByRole('button')).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter assignees'})).toHaveFocus())
    await user.tab()
    expect(action).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByText('Managing people')).toHaveAttribute('role', 'status')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('creates a selected label without losing filtered selections or allowing duplicate labels', async () => {
    const user = userEvent.setup()
    render(<GroupedPickerWithCreation />)
    const trigger = screen.getByRole('combobox', {name: 'Labels and assignees'})
    await user.click(trigger)
    expect(await screen.findByRole('group', {name: 'Labels'})).toBeVisible()
    expect(screen.getByRole('group', {name: 'Assignees'})).toBeVisible()
    expect(screen.getByRole('option', {name: 'archived'})).toHaveAttribute('aria-disabled', 'true')
    await user.click(screen.getByRole('option', {name: 'Mona'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    await user.type(input, 'BUG')
    expect(screen.getByRole('button', {name: 'Create "BUG"'})).toBeDisabled()
    await user.clear(input)
    await user.type(input, 'triage')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(screen.getByText('No items found')).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Create "triage"'}))
    expect(input).toHaveValue('')
    expect(screen.getByRole('option', {name: 'triage'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', {name: 'Mona'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', {name: 'Create ""'})).toBeDisabled()
    await user.type(input, 'TRIAGE')
    expect(screen.getByRole('button', {name: 'Create "TRIAGE"'})).toBeDisabled()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
