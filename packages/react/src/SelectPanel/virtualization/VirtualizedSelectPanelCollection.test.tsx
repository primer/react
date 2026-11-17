import React from 'react'
import {act, render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {SelectPanel, type SelectPanelRootProps} from '..'
import {VirtualizedSelectPanelCollection, type VirtualSelectPanelItem} from './VirtualizedSelectPanelCollection'

const items = Array.from({length: 10_000}, (_, index) => ({
  value: index,
  label: `Item ${String(index + 1).padStart(5, '0')}`,
  disabled: [0, 1, 96, 9999].includes(index),
}))

function Picker({options = items, ...props}: SelectPanelRootProps & {options?: readonly VirtualSelectPanelItem[]}) {
  const [query, setQuery] = React.useState('')
  const filtered = React.useMemo(
    () => options.filter(item => item.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )
  return (
    <BaseStyles>
      <SelectPanel.Root
        focusStrategy="roving"
        selectionMode="multiple"
        {...props}
        filterValue={query}
        onFilterChange={setQuery}
      >
        <SelectPanel.Trigger>Open virtual picker</SelectPanel.Trigger>
        <SelectPanel.Overlay>
          <SelectPanel.Content>
            <SelectPanel.Header>
              <SelectPanel.Title>Virtual picker</SelectPanel.Title>
              <SelectPanel.CloseButton />
            </SelectPanel.Header>
            <VirtualizedSelectPanelCollection items={filtered} />
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    </BaseStyles>
  )
}

const trigger = () => page.getByRole('button', {name: 'Open virtual picker', exact: true})
const input = () => page.getByRole('textbox', {name: 'Filter virtualized items', exact: true})
const option = (number: number) =>
  page.getByRole('option', {name: `Item ${String(number).padStart(5, '0')}`, exact: true})
const list = () => page.getByRole('listbox', {name: 'Virtualized items', exact: true})

async function open() {
  await userEvent.click(trigger())
  await expect.element(input()).toHaveFocus()
}

afterEach(async () => {
  vi.unstubAllGlobals()
  await page.viewport(1000, 800)
})

describe('internal virtualized SelectPanel collection', () => {
  it.each([false, true])('navigates and selects offscreen items with command support=%s', async invokers => {
    if (!invokers) vi.stubGlobal('CommandEvent', undefined)
    const onSelectedChange = vi.fn()
    render(<Picker onSelectedChange={onSelectedChange} />)
    expect(trigger().element().hasAttribute('command')).toBe(invokers)
    await open()
    expect(page.getByRole('dialog').element()).toBeInstanceOf(HTMLDialogElement)
    expect(page.getByRole('dialog').element().matches(':modal')).toBe(true)
    expect(list().element().querySelectorAll('[role="option"]').length).toBeLessThan(40)
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(3)).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect.element(option(9999)).toHaveFocus()
    await expect.element(option(9999)).toHaveAttribute('aria-posinset', '9999')
    await expect.element(option(9999)).toHaveAttribute('aria-setsize', '10000')
    await userEvent.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith([9998])
    await expect.element(option(9999)).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(3)).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect.element(option(9999)).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect.element(trigger()).toHaveFocus()
    await open()
    await userEvent.keyboard('{ArrowUp}')
    await expect.element(option(9999)).toHaveFocus()
    await expect.element(option(9999)).toHaveAttribute('aria-selected', 'true')
  })

  it('crosses virtual windows, skips disabled rows and supports page navigation', async () => {
    render(<Picker />)
    await open()
    await userEvent.keyboard('{ArrowDown}{PageDown}')
    await expect.element(option(13)).toHaveFocus()
    await userEvent.keyboard('{PageUp}')
    await expect.element(option(3)).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}'.repeat(93))
    await expect.element(option(96)).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(98)).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect.element(option(96)).toHaveFocus()
    await userEvent.keyboard('{Home}')
    await expect.element(option(3)).toHaveFocus()
    expect(list().element().querySelectorAll('[tabindex="0"]').length).toBe(1)
  })

  it('pins the focused row while manually scrolling without growing the DOM', async () => {
    render(<Picker />)
    await open()
    await userEvent.keyboard('{ArrowDown}')
    const focused = option(3).element()
    const viewport = list().element().parentElement
    if (!viewport) throw new Error('Expected the virtual scroll viewport')
    act(() => {
      viewport.scrollTop = 100_000
      viewport.dispatchEvent(new Event('scroll'))
    })
    await expect.poll(() => list().element().querySelector('[aria-posinset="3126"]')).not.toBeNull()
    expect(focused).toBeInTheDocument()
    expect(focused).toHaveFocus()
    expect(list().element().querySelectorAll('[role="option"]').length).toBeLessThan(40)
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(4)).toHaveFocus()
    await expect.poll(() => viewport.scrollTop).toBeLessThan(128)
  })

  it('retains query focus, resets scrolling, preserves selection and updates positional ARIA after filtering', async () => {
    render(<Picker defaultSelected={[9998]} />)
    await open()
    await userEvent.keyboard('{ArrowDown}{End}')
    await userEvent.type(input(), '00050')
    await expect.element(input()).toHaveFocus()
    await expect.element(option(50)).toHaveAttribute('aria-setsize', '1')
    await expect.element(option(50)).toHaveAttribute('aria-posinset', '1')
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(50)).toHaveFocus()
    await userEvent.clear(input())
    await expect.element(input()).toHaveFocus()
    await userEvent.tab()
    await expect.element(option(3)).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect.element(option(9999)).toHaveAttribute('aria-selected', 'true')
    await userEvent.type(input(), 'does-not-exist')
    await expect.element(input()).toHaveFocus()
    expect(list().element().querySelectorAll('[role="option"]').length).toBe(0)
    await userEvent.keyboard('{ArrowDown}{ArrowUp}')
    expect(input().element()).toHaveFocus()
  })

  it('repairs removed or disabled focused items without stealing focus after an explicit blur', async () => {
    const {rerender} = render(<Picker />)
    await open()
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(3)).toHaveFocus()
    rerender(<Picker options={items.filter(item => item.value !== 2)} />)
    await expect.element(option(4)).toHaveFocus()
    rerender(
      <Picker
        options={items.map(item => ({...item, disabled: item.value === 2 || item.value === 3 || item.disabled}))}
      />,
    )
    await expect.element(option(5)).toHaveFocus()
    rerender(<Picker options={[]} />)
    await expect.element(input()).toHaveFocus()
    rerender(<Picker />)
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(option(3)).toHaveFocus()
    act(() => {
      // eslint-disable-next-line github/no-blur -- Verify explicit blur is not mistaken for focus lost through removal.
      option(3).element().blur()
    })
    rerender(<Picker options={[]} />)
    expect(input().element()).not.toHaveFocus()
  })

  it('keeps focus in the input for an all-disabled collection and supports single-selection close', async () => {
    const {rerender} = render(<Picker options={items.slice(0, 2)} />)
    await open()
    await userEvent.keyboard('{ArrowDown}{ArrowUp}')
    expect(input().element()).toHaveFocus()
    rerender(<Picker options={items} selectionMode="single" closeOnSelect />)
    await userEvent.keyboard('{ArrowDown}{End}{Enter}')
    await expect.element(trigger()).toHaveAttribute('aria-expanded', 'false')
    await expect.element(trigger()).toHaveFocus()
  })

  it('distinguishes numeric and string identities through selection and filtering', async () => {
    const onSelectedChange = vi.fn()
    render(
      <Picker
        options={[
          {value: 1, label: 'Number one'},
          {value: '1', label: 'String one'},
        ]}
        onSelectedChange={onSelectedChange}
      />,
    )
    await open()
    await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith([1, '1'])
    await userEvent.type(input(), 'String')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith([1])
    await userEvent.clear(input())
    await expect
      .element(page.getByRole('option', {name: 'Number one', exact: true}))
      .toHaveAttribute('aria-selected', 'true')
    await expect
      .element(page.getByRole('option', {name: 'String one', exact: true}))
      .toHaveAttribute('aria-selected', 'false')
  })
})
