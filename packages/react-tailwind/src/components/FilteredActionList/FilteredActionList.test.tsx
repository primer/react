import React from 'react'
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {ActionList} from '../ActionList'
import {FilteredActionList, FilteredActionListLoadingTypes} from './'

afterEach(cleanup)

const fruit = [
  {id: 'apple', text: 'Apple'},
  {id: 'banana', text: 'Banana'},
]

describe('FilteredActionList', () => {
  it('exposes whether its inline combobox has an available list', () => {
    const {rerender} = render(<FilteredActionList items={fruit} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')

    rerender(<FilteredActionList items={fruit} loading loadingType={FilteredActionListLoadingTypes.bodySpinner} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('names the select-all checkbox with its visible label, which toggles every option', async () => {
    const user = userEvent.setup()
    const onSelectAllChange = vi.fn()
    render(<FilteredActionList items={fruit} onSelectAllChange={onSelectAllChange} selectionVariant="multiple" />)

    expect(screen.getByRole('checkbox', {name: 'Select all'})).not.toBeChecked()
    await user.click(screen.getByText('Select all'))

    expect(onSelectAllChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox', {name: 'Deselect all'})).toBeChecked()
    for (const option of screen.getAllByRole('option')) {
      expect(option).toHaveAttribute('aria-selected', 'true')
      expect(option.querySelector('[data-component="ActionList.Selection"] > span')).toHaveAttribute('data-checked')
    }
  })

  it('draws a radio for each option of a radio list', () => {
    render(<FilteredActionList defaultSelectedItemIds={['apple']} items={fruit} selectionVariant="radio" />)

    const visualOf = (name: string) =>
      screen.getByRole('option', {name}).querySelector('[data-component="ActionList.Selection"] > span')
    expect(visualOf('Apple')).toHaveClass('rounded-full')
    expect(visualOf('Apple')).toHaveAttribute('data-checked')
    expect(visualOf('Banana')).not.toHaveAttribute('data-checked')
  })

  it('keeps numeric and string IDs distinct in uncontrolled multiple selection', async () => {
    const user = userEvent.setup()
    render(
      <FilteredActionList
        defaultSelectedItemIds={[1]}
        items={[
          {id: 1, text: 'Numeric one'},
          {id: '1', text: 'String one'},
        ]}
        selectionVariant="multiple"
      />,
    )

    expect(screen.getByRole('option', {name: 'Numeric one'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', {name: 'String one'})).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('option', {name: 'String one'}))

    expect(screen.getByRole('option', {name: 'String one'})).toHaveAttribute('aria-selected', 'true')
  })

  it('preserves selected IDs omitted from a filtered multiple-selection collection', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <FilteredActionList
        items={[{id: 'visible', text: 'Visible'}]}
        onSelectedChange={onSelectedChange}
        selectedItemIds={['hidden']}
        selectionVariant="multiple"
      />,
    )

    await user.click(screen.getByRole('option', {name: 'Visible'}))

    expect(onSelectedChange).toHaveBeenCalledWith(
      ['hidden', 'visible'],
      expect.objectContaining({reason: 'item-press'}),
    )
  })

  it('filters in isolated uncontrolled and controlled renders with Base UI event details', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const uncontrolled = render(<FilteredActionList items={fruit} onFilterChange={onFilterChange} />)

    await user.type(within(uncontrolled.container).getByRole('combobox'), 'app')

    expect(within(uncontrolled.container).getByRole('option', {name: 'Apple'})).toBeVisible()
    expect(within(uncontrolled.container).queryByRole('option', {name: 'Banana'})).not.toBeInTheDocument()
    expect(onFilterChange).toHaveBeenLastCalledWith('app', expect.objectContaining({reason: 'input-change'}))

    uncontrolled.unmount()

    function ControlledFilter() {
      const [filter, setFilter] = React.useState('banana')
      return <FilteredActionList filterValue={filter} items={fruit} onFilterChange={value => setFilter(value)} />
    }

    const controlled = render(<ControlledFilter />)
    const controlledInput = within(controlled.container).getByRole('combobox')

    expect(within(controlled.container).getByRole('option', {name: 'Banana'})).toBeVisible()
    await user.clear(controlledInput)
    expect(within(controlled.container).getAllByRole('option')).toHaveLength(2)
  })

  it('uses Base UI active-descendant focus and selects with Enter while the input retains focus', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onAction = vi.fn()
    const onActiveDescendantChanged = vi.fn()
    render(
      <FilteredActionList
        items={[
          {id: 'apple', text: 'Apple', onAction},
          {id: 'banana', text: 'Banana'},
        ]}
        onActiveDescendantChanged={onActiveDescendantChanged}
        onSelectedChange={onSelectedChange}
      />,
    )

    const input = screen.getByRole('combobox')
    input.focus()
    await user.keyboard('{ArrowDown}')

    const activeDescendant = input.getAttribute('aria-activedescendant')
    expect(document.activeElement).toBe(input)
    expect(activeDescendant).toBe(screen.getByRole('option', {name: 'Apple'}).id)
    expect(onActiveDescendantChanged).toHaveBeenLastCalledWith(
      screen.getByRole('option', {name: 'Apple'}),
      undefined,
      true,
    )

    await user.keyboard('{Enter}')

    expect(document.activeElement).toBe(input)
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onSelectedChange).toHaveBeenCalledWith(['apple'], expect.objectContaining({reason: 'item-press'}))
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({id: 'apple'}), expect.any(Object))
  })

  it('does not highlight or select disabled options during keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <FilteredActionList
        items={[
          {id: 'first', text: 'First'},
          {disabled: true, id: 'disabled', text: 'Disabled'},
          {id: 'third', text: 'Third'},
        ]}
      />,
    )

    const input = screen.getByRole('combobox')
    input.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}')

    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Third'}).id)
    expect(screen.getByRole('option', {name: 'Disabled'})).toHaveAttribute('aria-disabled', 'true')
  })

  it('omits aria-controls while body content replaces the listbox and keeps empty status outside it', () => {
    const {rerender} = render(<FilteredActionList items={fruit} loading />)

    expect(screen.getByTestId('filtered-action-list-spinner')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(document.querySelector('[data-component="FilteredActionList.Empty"]')).not.toBeInTheDocument()

    rerender(<FilteredActionList items={fruit} message={<p>Nothing here</p>} />)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    rerender(<FilteredActionList emptyStateText="No fruit" items={[]} />)
    const listbox = screen.getByRole('listbox')
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('No fruit')
    expect(listbox).not.toContainElement(status)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-controls', listbox.id)
  })

  it('uses bodySpinner by default and supports input and body skeleton loading', () => {
    const {rerender} = render(<FilteredActionList items={[]} loading />)
    expect(screen.getByTestId('filtered-action-list-spinner')).toBeInTheDocument()

    rerender(<FilteredActionList items={[]} loading loadingType={FilteredActionListLoadingTypes.input} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-controls')

    rerender(<FilteredActionList items={[]} loading loadingType={FilteredActionListLoadingTypes.bodySkeleton} />)
    expect(screen.getByTestId('filtered-action-list-skeleton')).toBeInTheDocument()
  })

  it('announces body loading once, through its own status only when list announcements are disabled', () => {
    const {rerender} = render(
      <FilteredActionList items={[]} loading loadingType={FilteredActionListLoadingTypes.bodySkeleton} />,
    )
    expect(screen.getAllByText('Loading items')).toHaveLength(1)
    expect(screen.getByTestId('filtered-action-list-skeleton')).not.toHaveAttribute('role')

    rerender(
      <FilteredActionList
        announcementsEnabled={false}
        items={[]}
        loading
        loadingType={FilteredActionListLoadingTypes.bodySkeleton}
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading items')
    expect(screen.getAllByText('Loading items')).toHaveLength(1)
  })

  it('uses valid Base UI listbox virtualization with a subset of uniform options mounted', () => {
    const manyItems = Array.from({length: 100}, (_, index) => ({id: index, text: `Item ${index}`}))
    const {container} = render(<FilteredActionList items={manyItems} virtualized />)
    const listbox = screen.getByRole('listbox')

    expect(listbox.tagName).toBe('DIV')
    expect(within(listbox).getAllByRole('option').length).toBeLessThan(manyItems.length)
    expect(listbox.querySelector(':scope > div[role="presentation"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="FilteredActionList.Empty"]')).not.toBeInTheDocument()
    expect(container.querySelector('ul')).not.toBeInTheDocument()
    expect(within(listbox).getByRole('option', {name: 'Item 0'})).toHaveAttribute('aria-posinset', '1')
    expect(within(listbox).getByRole('option', {name: 'Item 0'})).toHaveAttribute('aria-setsize', '100')
  })

  it('virtualizes uniform block-description rows with their visuals and metadata intact', () => {
    const manyItems = Array.from({length: 100}, (_, index) => ({
      id: index,
      text: `Repository ${index}`,
      description: 'Available to add as context',
      descriptionVariant: 'block' as const,
      leadingVisual: () => <span>Icon</span>,
      trailingVisual: 'Public',
    }))
    render(<FilteredActionList items={manyItems} virtualized />)

    const listbox = screen.getByRole('listbox')
    expect(within(listbox).getAllByRole('option').length).toBeLessThan(manyItems.length)
    expect(within(listbox).getAllByText('Available to add as context')[0]).toBeVisible()
    expect(within(listbox).getAllByText('Public')[0]).toBeVisible()
    expect(
      (listbox.querySelector(':scope > div[role="presentation"]') as HTMLElement).style.getPropertyValue(
        '--filtered-action-list-virtual-row-height',
      ),
    ).toBe('52px')
  })

  it('keeps a virtualized list keyboard reachable beyond its initially mounted options', async () => {
    const user = userEvent.setup()
    const scrollRef = React.createRef<HTMLDivElement>()
    const manyItems = Array.from({length: 80}, (_, index) => ({id: index, text: `Item ${index}`}))
    render(<FilteredActionList items={manyItems} scrollContainerRef={scrollRef} virtualized />)

    const scrollContainer = scrollRef.current!
    Object.defineProperty(scrollContainer, 'clientHeight', {configurable: true, value: 64})
    Object.defineProperty(scrollContainer, 'scrollTop', {configurable: true, value: 0, writable: true})
    Object.assign(scrollContainer, {
      scrollTo: vi.fn(({top}: ScrollToOptions) => {
        scrollContainer.scrollTop = top ?? 0
        fireEvent.scroll(scrollContainer)
      }),
    })

    const input = screen.getByRole('combobox')
    input.focus()
    await user.keyboard('{ArrowDown}'.repeat(30))

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Item 29'}).id)
    })
  })

  it('falls back to normal Base UI rendering for grouped and custom rows', () => {
    const manyItems = Array.from({length: 30}, (_, index) => ({id: index, text: `Item ${index}`, groupId: 'all'}))
    const {rerender} = render(
      <FilteredActionList groupMetadata={[{groupId: 'all', header: {title: 'All'}}]} items={manyItems} virtualized />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(manyItems.length)

    rerender(
      <FilteredActionList
        items={manyItems.map(item => ({...item, groupId: undefined, renderItem: () => <span>Custom</span>}))}
        virtualized
      />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(manyItems.length)
  })

  it('honors item, group, then list render precedence without nesting ActionList items', async () => {
    const user = userEvent.setup()
    const listRenderer = vi.fn(() => <span>list renderer</span>)
    const groupRenderer = vi.fn(() => <span>group renderer</span>)
    const itemAction = vi.fn()
    const customSelect = vi.fn()
    const {container} = render(
      <FilteredActionList
        groupMetadata={[{groupId: 'one', header: {title: 'One'}, renderItem: groupRenderer}]}
        items={[
          {id: 'group', groupId: 'one', text: 'Group item'},
          {
            id: 'item',
            groupId: 'one',
            onAction: itemAction,
            renderItem: item => (
              <ActionList.Item selected={item.selected} onSelect={customSelect}>
                item renderer
              </ActionList.Item>
            ),
            text: 'Item',
          },
        ]}
        renderItem={listRenderer}
      />,
    )

    expect(screen.getByText('item renderer')).toBeInTheDocument()
    expect(screen.getByText('group renderer')).toBeInTheDocument()
    expect(groupRenderer).toHaveBeenCalledTimes(1)
    expect(listRenderer).not.toHaveBeenCalled()
    expect(container.querySelector('[data-component="ActionList.Item"]')).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', {name: 'item renderer'}))
    expect(customSelect).toHaveBeenCalledTimes(1)
    expect(itemAction).not.toHaveBeenCalled()
  })

  it('keeps the selection indicator, regions, and dividers of a rendered ActionList item', () => {
    render(
      <FilteredActionList
        defaultSelectedItemIds={['apple']}
        items={fruit.map(item => ({
          ...item,
          renderItem: ({selected, text}) => (
            <ActionList.Item
              leadingVisual={<ActionList.LeadingVisual>visual</ActionList.LeadingVisual>}
              selected={selected}
            >
              {text}
              <ActionList.Description>Fresh</ActionList.Description>
            </ActionList.Item>
          ),
        }))}
        selectionVariant="single"
        showItemDividers
      />,
    )

    const [apple, banana] = screen.getAllByRole('option')
    for (const option of [apple, banana]) {
      expect(option.querySelector('[data-component="ActionList.Selection"]')).toBeInTheDocument()
      expect(option.querySelector('[data-component="ActionList.LeadingVisual"]')).toHaveTextContent('visual')
      expect(option.querySelector('[data-component="ActionList.Description"]')).toHaveTextContent('Fresh')
    }
    expect(apple.querySelector('[data-component="ActionList.Item.Label"]')).toHaveTextContent(/^Apple$/)
    const divider = (option: HTMLElement) =>
      option.querySelector('[data-component="ActionList.Item--DividerContainer"]')?.className
    expect(divider(apple)).not.toContain('before:bg-[var(--borderColor-muted)]')
    expect(divider(banana)).toContain('before:bg-[var(--borderColor-muted)]')
  })

  it('uses Base UI group semantics with global option positions', () => {
    render(
      <FilteredActionList
        groupMetadata={[
          {groupId: 'one', header: {title: 'One'}},
          {groupId: 'two', header: {title: 'Two'}},
        ]}
        items={[
          {id: 'one', groupId: 'one', text: 'One item'},
          {id: 'two', groupId: 'two', text: 'Two item'},
        ]}
      />,
    )

    expect(screen.getByRole('group', {name: 'One'})).toBeInTheDocument()
    expect(screen.getByRole('group', {name: 'Two'})).toBeInTheDocument()
    expect(screen.getByRole('option', {name: 'One item'})).toHaveAttribute('aria-posinset', '1')
    expect(screen.getByRole('option', {name: 'Two item'})).toHaveAttribute('aria-posinset', '2')
    expect(screen.getByRole('option', {name: 'Two item'})).toHaveAttribute('aria-setsize', '2')
  })

  it('maps public behavior props and forwards root, input, scroll, list, and list DOM props', async () => {
    const user = userEvent.setup()
    const rootRef = React.createRef<HTMLElement>()
    const inputRef = React.createRef<HTMLInputElement>()
    const scrollRef = React.createRef<HTMLDivElement>()
    const onListContainerRefChanged = vi.fn()
    const onActiveDescendantChanged = vi.fn()
    const onFilterChange = vi.fn()
    const {container} = render(
      <FilteredActionList
        actionListProps={{'aria-label': 'Fruit options', title: 'listbox'}}
        data-testid="root"
        disableSelectOnHover
        focusOutBehavior="stop"
        focusPrependedElements
        fullScreenOnNarrow
        inputRef={inputRef}
        items={fruit}
        onActiveDescendantChanged={onActiveDescendantChanged}
        onFilterChange={onFilterChange}
        onListContainerRefChanged={onListContainerRefChanged}
        ref={rootRef}
        scrollBehavior="smooth"
        scrollContainerRef={scrollRef}
        setInitialFocus
        textInputProps={{id: 'fruit-filter', name: 'filter'}}
      />,
    )

    const input = container.querySelector<HTMLInputElement>('input[name="filter"]')!
    expect(input).toHaveAttribute('id', 'fruit-filter')
    const listbox = screen.getByRole('listbox')
    const apple = screen.getByRole('option', {name: 'Apple'})
    apple.scrollIntoView = vi.fn()

    expect(rootRef.current).toBe(screen.getByTestId('root'))
    expect(inputRef.current).toBe(input)
    expect(scrollRef.current).toHaveAttribute('data-component', 'FilteredActionList.Container')
    expect(onListContainerRefChanged).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    expect(listbox).toHaveAttribute('aria-label', 'Fruit options')
    expect(listbox).toHaveAttribute('title', 'listbox')
    expect(input.closest('[data-component="TextInput"]')).toHaveClass(
      'max-md:supports-[-webkit-touch-callout:none]:text-[var(--text-title-size-small)]',
    )
    expect(input).toHaveClass('[font-size:inherit]')

    input.focus()
    fireEvent.mouseMove(apple)
    expect(input).not.toHaveAttribute('aria-activedescendant')

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Banana'}).id)
    expect(apple.scrollIntoView).toHaveBeenCalledWith({behavior: 'smooth', block: 'nearest'})
    expect(onActiveDescendantChanged).toHaveBeenCalledWith(apple, undefined, true)

    await user.type(input, 'a')
    expect(onFilterChange).toHaveBeenLastCalledWith('a', expect.objectContaining({reason: 'input-change'}))
    expect(container.querySelector('[data-component="FilteredActionList"]')).toBe(rootRef.current)
  })
})
