import React from 'react'
import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {SelectPanel} from './SelectPanel'

function Picker({
  focusStrategy = 'active-descendant',
  onSelectedChange = () => {},
}: {
  focusStrategy?: 'active-descendant' | 'roving'
  onSelectedChange?: (selected: (string | number)[]) => void
}) {
  return (
    <SelectPanel.Root focusStrategy={focusStrategy} onSelectedChange={onSelectedChange} selectionMode="multiple">
      <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
      <SelectPanel.Overlay>
        <SelectPanel.Content data-testid="content">
          <SelectPanel.Header>
            <SelectPanel.Title as="h3">Fruit</SelectPanel.Title>
            <SelectPanel.CloseButton />
          </SelectPanel.Header>
          <SelectPanel.Description>Choose your favorites.</SelectPanel.Description>
          <SelectPanel.SearchInput aria-label="Filter fruit" />
          <SelectPanel.List>
            <SelectPanel.Item value="apple">Apple</SelectPanel.Item>
            <SelectPanel.Item value="unavailable" disabled>
              Unavailable
            </SelectPanel.Item>
            <SelectPanel.Group label="Citrus">
              <SelectPanel.Item value="orange">Orange</SelectPanel.Item>
            </SelectPanel.Group>
          </SelectPanel.List>
          <SelectPanel.Footer data-testid="footer">Selection stays open</SelectPanel.Footer>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

describe('SelectPanel core composition', () => {
  it('wires title, description, trigger and native heading semantics', async () => {
    render(<Picker />)
    const trigger = page.getByRole('button', {name: 'Choose fruit', exact: true})
    await userEvent.click(trigger)
    const dialog = page.getByRole('dialog', {name: 'Fruit', exact: true})
    await expect.element(dialog).toBeVisible()
    const title = page.getByRole('heading', {name: 'Fruit', exact: true, level: 3}).element()
    expect(dialog.element().getAttribute('aria-labelledby')).toBe(title.id)
    const descriptionId = dialog.element().getAttribute('aria-describedby')
    expect(document.getElementById(descriptionId!)?.textContent).toBe('Choose your favorites.')
    expect(trigger.element().getAttribute('aria-controls')).toBe(dialog.element().id)
    expect(page.getByTestId('content').element()).toHaveAttribute('data-component', 'SelectPanel.Content')
    expect(page.getByTestId('footer').element()).toHaveAttribute('data-component', 'SelectPanel.Footer')
    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))
    await expect.element(trigger).toHaveFocus()
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it.each(['active-descendant', 'roving'] as const)('navigates and selects with %s focus', async focusStrategy => {
    const onSelectedChange = vi.fn()
    render(<Picker focusStrategy={focusStrategy} onSelectedChange={onSelectedChange} />)
    await userEvent.click(page.getByRole('button', {name: 'Choose fruit', exact: true}))
    const input = page.getByRole(focusStrategy === 'roving' ? 'textbox' : 'combobox', {
      name: 'Filter fruit',
      exact: true,
    })
    await expect.element(input).toHaveFocus()
    if (focusStrategy === 'roving') await userEvent.keyboard('{ArrowDown}')
    if (focusStrategy === 'active-descendant') await expect.element(input).toHaveFocus()
    else await expect.element(page.getByRole('option', {name: 'Apple', exact: true})).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenCalledWith(['apple'])
    await expect
      .element(page.getByRole('option', {name: 'Apple', exact: true}))
      .toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    const orange = page.getByRole('option', {name: 'Orange', exact: true})
    if (focusStrategy === 'roving') await expect.element(orange).toHaveFocus()
    else await expect.element(input).toHaveAttribute('aria-activedescendant', orange.element().id)
    await userEvent.keyboard('{Escape}')
    await expect.element(page.getByRole('button', {name: 'Choose fruit', exact: true})).toHaveFocus()
  })

  it('preserves an explicit name when no title or description rendered', async () => {
    render(
      <SelectPanel.Root>
        <SelectPanel.Trigger>Open named panel</SelectPanel.Trigger>
        <SelectPanel.Overlay overlayProps={{'aria-label': 'Named panel'}}>
          <SelectPanel.CloseButton />
          <SelectPanel.List aria-label="Options">
            <SelectPanel.Item value={1}>One</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    await userEvent.click(page.getByRole('button', {name: 'Open named panel', exact: true}))
    const dialog = page.getByRole('dialog', {name: 'Named panel', exact: true})
    await expect.element(dialog).toBeVisible()
    expect(dialog.element()).not.toHaveAttribute('aria-labelledby')
    expect(dialog.element()).not.toHaveAttribute('aria-describedby')
    expect(page.getByRole('listbox', {name: 'Options', exact: true}).element()).not.toHaveAttribute('role', 'region')
  })
})
