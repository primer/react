import {act, fireEvent, render} from '@testing-library/react'
import {InfoIcon} from '@primer/octicons-react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import type {ComponentProps} from 'react'
import axe from 'axe-core'
import BaseStyles from '../BaseStyles'
import {SelectPanel, type SelectPanelRootProps} from '.'
import {CustomLayout, ExplicitApplyCancel, ResponsiveImmediateSelection} from './SelectPanel.composition.stories'

const fruit = [
  {value: 'apple', label: 'Apple'},
  {value: 'banana', label: 'Banana', disabled: true},
  {value: 'cherry', label: 'Cherry'},
]

function FocusPicker({
  options = fruit,
  search = true,
  inputProps,
  listProps,
  ...props
}: SelectPanelRootProps & {
  options?: {value: string; label: string; disabled?: boolean; hidden?: boolean}[]
  search?: boolean
  inputProps?: ComponentProps<typeof SelectPanel.SearchInput>
  listProps?: ComponentProps<typeof SelectPanel.List>
}) {
  return (
    <BaseStyles>
      <SelectPanel.Root selectionMode="multiple" {...props}>
        {search && <SelectPanel.SearchInput aria-label="Filter fruit" {...inputProps} />}
        <SelectPanel.List aria-label="Fruit" {...listProps}>
          {options.map(option => (
            <SelectPanel.Item key={option.value} value={option.value} disabled={option.disabled} hidden={option.hidden}>
              {option.label}
            </SelectPanel.Item>
          ))}
        </SelectPanel.List>
      </SelectPanel.Root>
      <button type="button">After picker</button>
    </BaseStyles>
  )
}

const input = () => page.getByRole('combobox', {name: 'Filter fruit', exact: true})
const option = (name: string) => page.getByRole('option', {name, exact: true})

describe('SelectPanel focus strategies', () => {
  it('defaults to a combobox that activates the first result with Enter without moving DOM focus', async () => {
    const onSelectedChange = vi.fn()
    render(<FocusPicker onSelectedChange={onSelectedChange} />)
    await userEvent.click(input())
    expect(input().element()).toHaveAttribute('aria-controls', page.getByRole('listbox').element().id)
    expect(input().element()).toHaveAttribute('aria-expanded', 'true')
    expect(input().element()).toHaveAttribute('aria-autocomplete', 'list')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    for (const name of ['Apple', 'Banana', 'Cherry']) expect(option(name).element()).toHaveAttribute('tabindex', '-1')
    await userEvent.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(['apple'])
    expect(input().element()).toHaveFocus()
    expect(option('Apple').element()).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input().element(), {key: 'Enter', repeat: true})
    expect(onSelectedChange).toHaveBeenCalledTimes(1)
    await userEvent.keyboard(' ')
    expect(input().element()).toHaveValue(' ')
    expect(onSelectedChange).toHaveBeenCalledTimes(1)
  })

  it('wraps active results, skips disabled options, and preserves text-editing keys', async () => {
    render(<FocusPicker />)
    await userEvent.click(input())
    await userEvent.keyboard('{ArrowDown}')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    expect(option('Cherry').element()).toHaveAttribute('data-is-active-descendant', 'activated-directly')
    await userEvent.keyboard('{Home}{End}')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    await userEvent.keyboard('{ArrowDown}')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    await userEvent.keyboard('{ArrowUp}{Enter}')
    expect(input().element()).toHaveFocus()
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'true')
    expect(option('Banana').element()).toHaveAttribute('aria-selected', 'false')
    await userEvent.tab()
    expect(page.getByRole('button', {name: 'After picker'}).element()).toHaveFocus()
    expect(input().element()).not.toHaveAttribute('aria-activedescendant')
    expect(option('Cherry').element()).not.toHaveAttribute('data-is-active-descendant')
  })

  it('repairs filtered, disabled, hidden, and empty results without stealing search focus', async () => {
    const {rerender} = render(<FocusPicker />)
    await userEvent.click(input())
    await userEvent.keyboard('{ArrowDown}')
    rerender(<FocusPicker options={[fruit[0]]} />)
    await expect.element(input()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    expect(input().element()).toHaveFocus()
    rerender(<FocusPicker options={[{...fruit[0], disabled: true}, fruit[2]]} />)
    await expect.element(input()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    rerender(
      <FocusPicker
        options={[
          {...fruit[0], disabled: false},
          {...fruit[2], hidden: true},
        ]}
      />,
    )
    await expect.element(input()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    rerender(<FocusPicker options={[]} />)
    await expect.element(input()).not.toHaveAttribute('aria-activedescendant')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(input().element()).toHaveFocus()
    rerender(<FocusPicker options={[fruit[2]]} />)
    await expect.element(input()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    await userEvent.keyboard('{Enter}')
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'true')
  })

  it('honors canceled search navigation and does not activate during IME composition', async () => {
    const onSelectedChange = vi.fn()
    const onKeyDown = vi.fn(event => event.preventDefault())
    const {rerender} = render(<FocusPicker onSelectedChange={onSelectedChange} inputProps={{onKeyDown}} />)
    await userEvent.click(input())
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    expect(onSelectedChange).not.toHaveBeenCalled()
    rerender(<FocusPicker onSelectedChange={onSelectedChange} />)
    fireEvent.keyDown(input().element(), {key: 'ArrowDown', isComposing: true})
    fireEvent.keyDown(input().element(), {key: 'Enter', isComposing: true})
    fireEvent.keyDown(input().element(), {key: 'ArrowDown', altKey: true})
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('honors canceled item activation forwarded from the input', async () => {
    const onSelectedChange = vi.fn()
    const onSelect = vi.fn(event => event.preventDefault())
    render(
      <SelectPanel.Root onSelectedChange={onSelectedChange}>
        <SelectPanel.SearchInput aria-label="Filter fruit" />
        <SelectPanel.List aria-label="Fruit">
          <SelectPanel.Item value="apple" onSelect={onSelect}>
            Apple
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    await userEvent.click(input())
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(input().element()).toHaveFocus()
  })

  it('keeps focus in search for pointer selection and updates the active result', async () => {
    render(<FocusPicker />)
    await userEvent.click(input())
    await userEvent.click(option('Cherry'))
    expect(input().element()).toHaveFocus()
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{Enter}')
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'false')
  })

  it('supports explicit roving focus and falls back to roving without a search input', async () => {
    const {rerender} = render(<FocusPicker focusStrategy="roving" />)
    const textbox = page.getByRole('textbox', {name: 'Filter fruit', exact: true})
    await userEvent.click(textbox)
    await userEvent.keyboard('{ArrowDown}')
    expect(option('Apple').element()).toHaveFocus()
    expect(textbox.element()).not.toHaveAttribute('aria-activedescendant')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(option('Cherry').element()).toHaveFocus()
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'true')
    rerender(<FocusPicker search={false} />)
    await expect.element(option('Cherry')).toHaveAttribute('tabindex', '0')
    act(() => option('Apple').element().focus())
    await userEvent.keyboard('{ArrowUp}')
    expect(option('Cherry').element()).toHaveFocus()
  })

  it('uses a roving tab stop by default for a searchless list', async () => {
    render(<FocusPicker search={false} />)
    expect(option('Apple').element()).toHaveAttribute('tabindex', '0')
    act(() => option('Apple').element().focus())
    await userEvent.keyboard('{ArrowUp}{Enter}')
    expect(option('Cherry').element()).toHaveFocus()
    expect(option('Cherry').element()).toHaveAttribute('aria-selected', 'true')
    expect(option('Banana').element()).toHaveAttribute('tabindex', '-1')
  })

  it('keeps the collection keyboard-accessible when search is disabled and restores virtual focus when enabled', async () => {
    const {rerender} = render(<FocusPicker inputProps={{disabled: true}} />)
    await expect.element(option('Apple')).toHaveAttribute('tabindex', '0')
    await userEvent.click(option('Apple'))
    expect(option('Apple').element()).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(option('Cherry').element()).toHaveFocus()
    rerender(<FocusPicker inputProps={{disabled: false}} />)
    await userEvent.click(input())
    await expect.element(option('Cherry')).toHaveAttribute('tabindex', '-1')
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Cherry').element().id)
    rerender(<FocusPicker inputProps={{disabled: true}} />)
    await expect.element(option('Cherry')).toHaveAttribute('tabindex', '0')
    expect(input().element()).not.toHaveAttribute('aria-activedescendant')
  })

  it('cleans up active-descendant relationships when switching strategy', async () => {
    const {rerender} = render(<FocusPicker />)
    await userEvent.click(input())
    await userEvent.keyboard('{ArrowDown}')
    rerender(<FocusPicker focusStrategy="roving" />)
    const textbox = page.getByRole('textbox', {name: 'Filter fruit', exact: true})
    expect(textbox.element()).not.toHaveAttribute('aria-activedescendant')
    expect(option('Cherry').element()).not.toHaveAttribute('data-is-active-descendant')
    expect(textbox.element()).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(option('Apple').element()).toHaveFocus()
  })

  it('opens supplemental actions from the active result and restores input focus', async () => {
    const onAction = vi.fn()
    render(
      <BaseStyles>
        <SelectPanel.Root>
          <SelectPanel.SearchInput aria-label="Filter fruit" />
          <SelectPanel.List aria-label="Fruit">
            <SelectPanel.Item
              value="apple"
              secondaryActions={[
                {label: 'Details', icon: InfoIcon, onClick: onAction},
                {label: 'History', icon: InfoIcon, onClick: onAction},
              ]}
            >
              Apple
            </SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Root>
      </BaseStyles>,
    )
    await userEvent.click(input())
    await userEvent.keyboard('{Control>}{Shift>}u{/Shift}{/Control}')
    await expect.element(page.getByRole('dialog', {name: 'Supplemental actions'})).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect.element(input()).toHaveFocus()
    expect(input().element()).toHaveAttribute('aria-activedescendant', option('Apple').element().id)
    expect(onAction).not.toHaveBeenCalled()
  })

  it('has no detectable accessibility violations with an active result', async () => {
    const {container} = render(<FocusPicker />)
    await userEvent.click(input())
    const result = await axe.run(container, {rules: {'color-contrast': {enabled: false}}})
    expect(result.violations).toEqual([])
  })
})

describe('SelectPanel story save policies', () => {
  it('supports type-and-Enter quick selection with closeOnSelect in the single-selection story', async () => {
    render(
      <BaseStyles>
        <ResponsiveImmediateSelection />
      </BaseStyles>,
    )
    const trigger = page.getByRole('button', {name: 'Primary label', exact: true})
    await userEvent.click(trigger)
    const search = page.getByRole('combobox', {name: 'Filter primary labels', exact: true})
    await userEvent.fill(search, 'Accessibility')
    await expect
      .element(search)
      .toHaveAttribute(
        'aria-activedescendant',
        page.getByRole('option', {name: 'Accessibility', exact: true}).element().id,
      )
    await userEvent.keyboard('{Enter}')
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
    expect(trigger.element()).toHaveTextContent('Accessibility')
  })

  it.each(['escape', 'outside', 'done'] as const)('applies the primary story selection on %s', async gesture => {
    await page.viewport(1200, 900)
    render(
      <BaseStyles>
        <CustomLayout />
      </BaseStyles>,
    )
    await userEvent.click(page.getByRole('button', {name: 'Labels (1)', exact: true}))
    const search = page.getByRole('combobox')
    await userEvent.fill(search, 'Enhancement')
    await userEvent.keyboard('{Enter}')
    expect(search.element()).toHaveFocus()
    expect(page.getByText('Saved labels: Bug', {exact: true}).element()).toBeVisible()
    if (gesture === 'escape') await userEvent.keyboard('{Escape}')
    else if (gesture === 'outside') {
      const dialog = page.getByRole('dialog')
      await userEvent.click(dialog, {
        position: {x: dialog.element().getBoundingClientRect().width + 8, y: 8},
        force: true,
      })
    } else await userEvent.click(page.getByRole('button', {name: 'Done', exact: true}))
    await expect.element(page.getByText('Saved labels: Bug, Enhancement', {exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('button', {name: 'Labels (2)', exact: true}))
    expect(page.getByRole('option', {name: /Enhancement/}).element()).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps explicit Save/Cancel opt-in and discards that story draft on dismissal', async () => {
    render(
      <BaseStyles>
        <ExplicitApplyCancel />
      </BaseStyles>,
    )
    await userEvent.click(page.getByRole('button', {name: 'Labels (1)', exact: true}))
    await userEvent.fill(page.getByRole('combobox'), 'Enhancement')
    await userEvent.keyboard('{Enter}{Escape}')
    await expect.element(page.getByText('Saved labels: Bug', {exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('button', {name: 'Labels (1)', exact: true}))
    expect(page.getByRole('option', {name: /Enhancement/}).element()).toHaveAttribute('aria-selected', 'false')
    await userEvent.fill(page.getByRole('combobox'), 'Enhancement')
    await userEvent.keyboard('{Enter}')
    await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))
    await expect.element(page.getByText('Saved labels: Bug, Enhancement', {exact: true})).toBeVisible()
  })
})
