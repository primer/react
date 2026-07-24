import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {ActionList} from './ActionList'

describe('ActionList', () => {
  it('uses listbox selection semantics and activates an item', async () => {
    const onSelect = vi.fn()
    render(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item selected onSelect={onSelect}>
          Main
        </ActionList.Item>
      </ActionList>,
    )
    const option = screen.getByRole('option', {name: 'Main'})
    expect(option).toHaveAttribute('aria-selected', 'true')
    await userEvent.click(option)
    expect(onSelect).toHaveBeenCalledOnce()
  })
})
