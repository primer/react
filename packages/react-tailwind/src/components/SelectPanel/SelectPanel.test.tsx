import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {SelectPanel} from './SelectPanel'

describe('SelectPanel', () => {
  it('filters options, selects with the keyboard, and updates its trigger label', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const items = [
      {id: 'mona', text: 'Mona'},
      {id: 'hubot', text: 'Hubot'},
    ]
    function Example() {
      const [selected, setSelected] = React.useState<(typeof items)[number]>()
      return (
        <SelectPanel
          title="Assignees"
          items={items}
          selected={selected}
          onSelectedChange={(value, details) => {
            onSelectedChange(value, details)
            setSelected(value as (typeof items)[number] | undefined)
          }}
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Assignees'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    await user.type(input, 'mon')
    expect(screen.getByRole('option', {name: 'Mona'})).toBeVisible()
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onSelectedChange).toHaveBeenCalledWith(
      {id: 'mona', text: 'Mona'},
      expect.objectContaining({reason: 'item-press'}),
    )
    expect(screen.getByRole('button', {name: 'Mona'})).toBeVisible()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('forwards Base UI open-change details and state-aware trigger class names', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SelectPanel.Root onOpenChange={onOpenChange}>
        <SelectPanel.Trigger className={({open}) => (open ? 'is-open' : 'is-closed')}>Open</SelectPanel.Trigger>
        <SelectPanel.Content>Content</SelectPanel.Content>
      </SelectPanel.Root>,
    )

    const trigger = screen.getByRole('button', {name: 'Open'})
    expect(trigger).toHaveClass('is-closed')
    await user.click(trigger)
    expect(trigger).toHaveClass('is-open')
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({reason: 'escape-key'}))
  })
})
