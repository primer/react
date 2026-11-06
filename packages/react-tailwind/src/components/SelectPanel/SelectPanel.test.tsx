import React from 'react'
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import type {SelectPanelAnchorProps, SelectPanelItem, SelectPanelProps} from './SelectPanel'
import {SelectPanel} from './SelectPanel'
import {ActionList} from '../ActionList'

const items: SelectPanelItem[] = [
  {id: 'mona', text: 'Mona'},
  {id: 'hubot', text: 'Hubot'},
  {id: 'robot', text: 'Robot'},
]

const externalAnchorProps = {
  anchorRef: React.createRef<HTMLButtonElement>(),
  items,
  onSelectedChange: () => {},
  renderAnchor: null,
  selected: undefined,
} satisfies SelectPanelProps

void externalAnchorProps

function acceptsSelectPanelProps(_props: SelectPanelProps) {}

// @ts-expect-error renderAnchor={null} requires an external anchor ref.
acceptsSelectPanelProps({
  items,
  onSelectedChange: () => {},
  renderAnchor: null,
  selected: undefined,
})

function asItems(selection: SelectPanelItem | SelectPanelItem[] | undefined) {
  return Array.isArray(selection) ? selection : selection ? [selection] : []
}

afterEach(cleanup)

describe('SelectPanel', () => {
  it('filters options, selects with the keyboard, and updates its trigger label', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()

    function Example() {
      const [selected, setSelected] = React.useState<SelectPanelItem | undefined>()
      const [open, setOpen] = React.useState(false)
      return (
        <SelectPanel
          items={items}
          onOpenChange={setOpen}
          onSelectedChange={(next, details) => {
            onSelectedChange(next, details)
            if (!Array.isArray(next)) setSelected(next)
          }}
          open={open}
          selected={selected}
          title="Assignees"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Assignees'}))
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'mon')
    expect(screen.getByRole('option', {name: 'Mona'})).toBeVisible()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(onSelectedChange).toHaveBeenCalledWith(items[0], expect.objectContaining({reason: 'item-press'}))
    expect(screen.getByRole('button', {name: 'Mona'})).toBeVisible()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('keeps default filter values synchronized with the input and local filtering', async () => {
    const user = userEvent.setup()

    render(
      <SelectPanel
        defaultFilterValue="hub"
        items={items}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Default filter"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Default filter'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    expect(input).toHaveValue('hub')
    expect(screen.getByRole('option', {name: 'Hubot'})).toBeVisible()
    expect(screen.queryByRole('option', {name: 'Mona'})).not.toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'robot')
    expect(input).toHaveValue('robot')
    expect(screen.getByRole('option', {name: 'Robot'})).toBeVisible()
  })

  it('renders consumer-supplied remote or fuzzy results without substring filtering them again', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const remoteItem = {id: 'remote', text: 'A fuzzy match from a remote source'}

    function Example() {
      const [filterValue, setFilterValue] = React.useState('')
      return (
        <SelectPanel
          filterValue={filterValue}
          items={[remoteItem]}
          onFilterChange={(nextFilterValue, details) => {
            onFilterChange(nextFilterValue, details)
            setFilterValue(nextFilterValue)
          }}
          onSelectedChange={() => {}}
          selected={undefined}
          title="Remote results"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Remote results'}))
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'mona')

    expect(onFilterChange).toHaveBeenLastCalledWith('mona', expect.anything())
    expect(screen.getByRole('option', {name: 'A fuzzy match from a remote source'})).toBeVisible()
  })

  it('does not locally filter an uncontrolled collection when a consumer handles filter changes', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    render(
      <SelectPanel
        items={[{id: 'fuzzy', text: 'Result supplied by a fuzzy matcher'}]}
        onFilterChange={onFilterChange}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Handled filter"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Handled filter'}))
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'mona')

    expect(onFilterChange).toHaveBeenLastCalledWith('mona', expect.anything())
    expect(screen.getByRole('option', {name: 'Result supplied by a fuzzy matcher'})).toBeVisible()
  })

  it('preserves filtered-out multi selections and clears an already-selected single item', async () => {
    const user = userEvent.setup()
    const selectionChanges = vi.fn()

    function MultiExample() {
      const [filterValue, setFilterValue] = React.useState('hubot')
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([items[0]])
      return (
        <SelectPanel
          filterValue={filterValue}
          items={items.filter(item => typeof item.text === 'string' && item.text.toLowerCase().includes(filterValue))}
          onFilterChange={setFilterValue}
          onSelectedChange={(next, details) => {
            const nextItems = asItems(next)
            selectionChanges(nextItems, details)
            setSelected(nextItems)
          }}
          selected={selected}
          selectionVariant="multiple"
          title="Labels"
        />
      )
    }

    const multiRender = render(<MultiExample />)
    await user.click(screen.getByRole('button', {name: 'Mona'}))
    expect(screen.getByRole('option', {name: 'Hubot'})).toHaveAttribute('aria-selected', 'false')
    await user.click(screen.getByRole('option', {name: 'Hubot'}))
    expect(selectionChanges).toHaveBeenLastCalledWith([items[0], items[1]], expect.anything())
    expect(screen.getByRole('option', {name: 'Hubot'})).toHaveAttribute('aria-selected', 'true')

    multiRender.unmount()

    function SingleExample() {
      const [selected, setSelected] = React.useState<SelectPanelItem | undefined>(items[0])
      const [open, setOpen] = React.useState(false)
      return (
        <SelectPanel
          items={items}
          onOpenChange={setOpen}
          onSelectedChange={next => {
            if (!Array.isArray(next)) setSelected(next)
          }}
          open={open}
          selected={selected}
          title="Single label"
        />
      )
    }

    render(<SingleExample />)
    await user.click(screen.getByRole('button', {name: 'Mona'}))
    await user.click(screen.getByRole('option', {name: 'Mona'}))
    expect(screen.getByRole('button', {name: 'Single label'})).toBeVisible()
  })

  it('keeps numeric and string IDs distinct and matches id-less items by object identity', async () => {
    const user = userEvent.setup()
    const numericItem: SelectPanelItem = {id: 1, text: 'Numeric one'}
    const stringItem: SelectPanelItem = {id: '1', text: 'String one'}
    const idlessItem: SelectPanelItem = {text: 'Object identity'}
    const onSelectedChange = vi.fn()

    function Example() {
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([numericItem, idlessItem])
      return (
        <SelectPanel
          items={[stringItem]}
          onSelectedChange={(next, details) => {
            const nextItems = asItems(next)
            onSelectedChange(nextItems, details)
            setSelected(nextItems)
          }}
          selected={selected}
          selectionVariant="multiple"
          title="Typed IDs"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: /Numeric one.*Object identity/}))
    await user.click(screen.getByRole('option', {name: 'String one'}))

    expect(onSelectedChange).toHaveBeenLastCalledWith([numericItem, idlessItem, stringItem], expect.anything())
    expect(screen.getByRole('option', {name: 'String one'})).toHaveAttribute('aria-selected', 'true')
  })

  it('supports external anchors and forwards content refs and DOM props', async () => {
    const user = userEvent.setup()
    const anchorRef = React.createRef<HTMLButtonElement>()
    const contentRef = React.createRef<HTMLDivElement>()

    function Example() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button ref={anchorRef} type="button" onClick={() => setOpen(value => !value)}>
            Open external panel
          </button>
          <SelectPanel
            anchorRef={anchorRef}
            items={items}
            onOpenChange={setOpen}
            onSelectedChange={() => {}}
            open={open}
            overlayProps={{'data-testid': 'panel-popup', id: 'panel-popup'}}
            renderAnchor={null}
            selected={[]}
            selectionVariant="multiple"
            title="External anchor"
            ref={contentRef}
          />
        </>
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Open external panel'}))
    expect(screen.getByRole('listbox', {name: 'External anchor'})).toBeVisible()
    expect(contentRef.current).toBe(screen.getByTestId('panel-popup'))
    expect(contentRef.current).toHaveAttribute('id', 'panel-popup')
  })

  it('supports an internal link anchor', async () => {
    const user = userEvent.setup()

    render(
      <SelectPanel
        items={items}
        onSelectedChange={() => {}}
        renderAnchor={props => (
          <a {...props} href="#assignees">
            {props.children}
          </a>
        )}
        selected={[]}
        selectionVariant="multiple"
        title="Assignees"
      />,
    )

    const anchor = screen.getByRole('button', {name: 'Assignees'})
    expect(anchor).toHaveProperty('tagName', 'A')
    expect(anchor).toHaveAttribute('href', '#assignees')

    await user.click(anchor)
    expect(screen.getByRole('listbox', {name: 'Assignees'})).toBeVisible()
  })

  it('passes renderAnchor the selected text labels as one comma-separated string', () => {
    const renderAnchor = vi.fn((props: SelectPanelAnchorProps) => <button {...props} type="button" />)

    render(
      <SelectPanel
        items={items}
        onSelectedChange={() => {}}
        renderAnchor={renderAnchor}
        selected={[items[0], items[2]]}
        selectionVariant="multiple"
        title="Assignees"
      />,
    )

    expect(renderAnchor).toHaveBeenLastCalledWith(expect.objectContaining({children: 'Mona, Robot'}))
    expect(screen.getByRole('button', {name: 'Mona, Robot'})).toBeVisible()
  })

  it('keeps anchored panel content in place when overlayProps.portal is false', async () => {
    const user = userEvent.setup()
    const {container} = render(
      <div data-testid="panel-root">
        <SelectPanel
          items={items}
          onSelectedChange={() => {}}
          overlayProps={{portal: false}}
          selected={undefined}
          title="No portal"
        />
      </div>,
    )

    await user.click(screen.getByRole('button', {name: 'No portal'}))
    expect(container).toContainElement(screen.getByRole('dialog', {name: 'No portal'}))
  })

  it('uses modal cancellation, deferred single selection, focus management, and scroll locking', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onSelectedChange = vi.fn()

    function Example() {
      const [open, setOpen] = React.useState(false)
      const [selected, setSelected] = React.useState<SelectPanelItem | undefined>(items[0])
      return (
        <SelectPanel
          items={items}
          onCancel={() => {
            onCancel()
            setSelected(items[0])
          }}
          onOpenChange={setOpen}
          onSelectedChange={next => {
            onSelectedChange(next)
            if (!Array.isArray(next)) setSelected(next)
          }}
          open={open}
          selected={selected}
          title="Modal labels"
          variant="modal"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Mona'}))
    expect(screen.getByRole('dialog', {name: 'Modal labels'})).toBeVisible()
    expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByRole('option', {name: 'Hubot'}))
    expect(onSelectedChange).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', {name: 'Mona'})).toHaveFocus()
    await waitFor(() => {
      expect(document.body.style.overflow).not.toBe('hidden')
    })

    await user.click(screen.getByRole('button', {name: 'Mona'}))
    await user.click(screen.getByRole('option', {name: 'Hubot'}))
    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(onSelectedChange).toHaveBeenLastCalledWith(items[1])
  })

  it('renders grouped options and applies select-all only to visible selectable items', async () => {
    const user = userEvent.setup()
    const hiddenItem = {id: 'hidden', text: 'Hidden selection'}
    const visibleItem = {id: 'visible', text: 'Visible selection', groupId: 'group'}

    function Example() {
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([hiddenItem])
      return (
        <SelectPanel
          groupMetadata={[{groupId: 'group', header: {title: 'Options', variant: 'filled'}}]}
          items={[visibleItem]}
          onSelectedChange={next => setSelected(asItems(next))}
          selected={selected}
          selectionVariant="multiple"
          showSelectAll
          title="Grouped options"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Hidden selection'}))
    expect(screen.getByRole('group', {name: 'Options'})).toBeVisible()
    await user.click(screen.getByRole('checkbox', {name: 'Select all'}))
    expect(screen.getByRole('option', {name: 'Visible selection'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', {name: /Hidden selection.*Visible selection/})).toBeVisible()
  })

  it('uses global grouped option positions and lets list-level renderGroup wrap every group', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const groupedItems = [
      {groupId: 'first', id: 'first-item', text: 'First item'},
      {groupId: 'second', id: 'second-item', text: 'Second item'},
    ]

    render(
      <SelectPanel
        groupMetadata={[
          {groupId: 'first', header: {title: 'First group'}},
          {groupId: 'second', header: {title: 'Second group'}},
        ]}
        items={groupedItems}
        onSelectedChange={onSelectedChange}
        renderGroup={(group, children) => <div data-testid={`group-${group.groupId}`}>{children}</div>}
        selected={undefined}
        title="Grouped keyboard"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Grouped keyboard'}))
    const firstOption = screen.getByRole('option', {name: 'First item'})
    const secondOption = screen.getByRole('option', {name: 'Second item'})
    expect(firstOption).toHaveAttribute('aria-posinset', '1')
    expect(firstOption).toHaveAttribute('aria-setsize', '2')
    expect(secondOption).toHaveAttribute('aria-posinset', '2')
    expect(secondOption).toHaveAttribute('aria-setsize', '2')
    expect(screen.getByTestId('group-first')).toContainElement(firstOption)
    expect(screen.getByTestId('group-second')).toContainElement(secondOption)

    await user.click(screen.getByRole('combobox', {name: 'Filter items'}))
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'item')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(groupedItems[1], expect.anything())
  })

  it('renders distinct message variants, actions, notices, secondary actions, and item slots', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onSecondaryAction = vi.fn()

    render(
      <SelectPanel
        items={[]}
        message={{
          action: (
            <button type="button" onClick={onRetry}>
              Retry
            </button>
          ),
          body: 'Try again after checking your connection.',
          title: 'Failed to load labels',
          variant: 'error',
        }}
        notice={{text: 'A warning notice', variant: 'warning'}}
        onSelectedChange={() => {}}
        secondaryAction={
          <SelectPanel.SecondaryActionButton onClick={onSecondaryAction}>
            Manage labels
          </SelectPanel.SecondaryActionButton>
        }
        selected={[]}
        selectionVariant="multiple"
        title="Messages"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Messages'}))
    expect(screen.getByRole('alert')).toHaveAttribute('data-variant', 'error')
    await user.click(screen.getByRole('button', {name: /Retry/}))
    await user.click(screen.getByRole('button', {name: 'Manage labels'}))
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onSecondaryAction).toHaveBeenCalledTimes(1)
    expect(screen.getByText('A warning notice')).toBeVisible()
    expect(screen.getByRole('status')).toHaveAttribute('data-component', 'SelectPanel.Notice')

    const slotRender = render(
      <SelectPanel
        items={[
          {
            description: 'Supporting text',
            descriptionVariant: 'block',
            id: 'slot',
            leadingVisual: <span>Leading</span>,
            text: 'Slot item',
            trailingVisual: <span>Trailing</span>,
          },
        ]}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Slots"
      />,
    )
    await user.click(slotRender.getByRole('button', {name: 'Slots'}))
    expect(
      screen.getByRole('option', {name: /Slot item/}).querySelector('[data-component="ActionList.LeadingVisual"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', {name: /Slot item/}).querySelector('[data-component="ActionList.Description"]'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('option', {name: /Slot item/}).querySelector('[data-component="ActionList.TrailingVisual"]'),
    ).toBeInTheDocument()
  })

  it('renders a configured message instead of stale list items', async () => {
    const user = userEvent.setup()

    render(
      <SelectPanel
        items={items}
        message={{body: 'Try again later.', title: 'Labels are unavailable', variant: 'warning'}}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Stale results"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Stale results'}))
    expect(screen.getByRole('status')).toHaveTextContent('Labels are unavailable')
    expect(screen.queryByRole('option', {name: 'Mona'})).not.toBeInTheDocument()
  })

  it('prefers actionListProps aria-label over the generated list label', async () => {
    const user = userEvent.setup()

    render(
      <SelectPanel
        actionListProps={{'aria-label': 'Available repositories'}}
        items={items}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Generated list label"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Generated list label'}))
    expect(screen.getByRole('listbox', {name: 'Available repositories'})).toBeVisible()
  })

  it('virtualizes large lists and calls onScrollEnd for render-more behavior', async () => {
    const user = userEvent.setup()
    const onScrollEnd = vi.fn()
    const largeItems = Array.from({length: 100}, (_, index) => ({id: index, text: `Item ${index}`}))

    render(
      <SelectPanel
        items={largeItems}
        onScrollEnd={onScrollEnd}
        onSelectedChange={() => {}}
        selected={[]}
        selectionVariant="multiple"
        title="Virtual labels"
        virtualized
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Virtual labels'}))
    const virtualizedList = document.querySelector('[data-component="SelectPanel.VirtualizedList"]') as HTMLDivElement
    expect(virtualizedList).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeLessThan(100)
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-setsize', '100')

    Object.defineProperties(virtualizedList, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 3600},
      scrollTop: {configurable: true, value: 3500, writable: true},
    })
    fireEvent.scroll(virtualizedList)
    expect(onScrollEnd).toHaveBeenCalledTimes(1)
  })

  it('falls back to non-virtualized rendering for variable-height and custom rows', async () => {
    const user = userEvent.setup()
    const variableItems = Array.from({length: 20}, (_, index) => ({
      description: `Additional context for item ${index}`,
      descriptionVariant: 'block' as const,
      id: index,
      text: `Item ${index}`,
    }))
    const variableRender = render(
      <SelectPanel
        items={variableItems}
        onSelectedChange={() => {}}
        selected={[]}
        selectionVariant="multiple"
        title="Variable rows"
        virtualized
      />,
    )

    await user.click(variableRender.getByRole('button', {name: 'Variable rows'}))
    expect(document.querySelector('[data-component="SelectPanel.VirtualizedList"]')).toBeNull()
    expect(variableRender.getAllByRole('option')).toHaveLength(variableItems.length)
    variableRender.unmount()

    render(
      <SelectPanel
        items={items}
        onSelectedChange={() => {}}
        renderItem={item => <div className="py-4">{item.text}</div>}
        selected={undefined}
        title="Custom rows"
        virtualized
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Custom rows'}))
    expect(document.querySelector('[data-component="SelectPanel.VirtualizedList"]')).toBeNull()
    expect(screen.getAllByRole('option')).toHaveLength(items.length)
  })

  it('supports selected-first ordering, item renderers, inactive items, dividers, and prepended focus updates', async () => {
    const user = userEvent.setup()
    const first = {id: 'first', text: 'First'}
    const second = {id: 'second', text: 'Second'}
    const inactive = {id: 'inactive', inactiveText: 'Unavailable', text: 'Inactive'}
    const onActiveDescendantChanged = vi.fn()

    function Example() {
      const [filterValue, setFilterValue] = React.useState('')
      const [panelItems, setPanelItems] = React.useState<SelectPanelItem[]>([first, second, inactive])
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([second])
      return (
        <SelectPanel
          filterValue={filterValue}
          focusPrependedElements
          items={panelItems}
          onActiveDescendantChanged={onActiveDescendantChanged}
          onFilterChange={nextFilterValue => {
            setFilterValue(nextFilterValue)
            if (nextFilterValue === 'prepend') setPanelItems([{id: 'prepended', text: 'Prepended'}, ...panelItems])
          }}
          onSelectedChange={next => setSelected(asItems(next))}
          renderItem={item => <span data-testid={`custom-${String(item.id)}`}>{item.text}</span>}
          selected={selected}
          selectionVariant="multiple"
          showItemDividers
          showSelectedOptionsFirst
          title="Rendered labels"
        />
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Second'}))
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Second')
    expect(screen.getByRole('option', {name: /Inactive/})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByTestId('custom-second')).toBeVisible()
    expect(screen.getByRole('option', {name: 'Second'})).toHaveClass('border-b')

    await user.clear(screen.getByRole('combobox', {name: 'Filter items'}))
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'prepend')
    expect(screen.getByRole('option', {name: 'Prepended'})).toBeVisible()
    await user.keyboard('{ArrowDown}')
    expect(onActiveDescendantChanged).toHaveBeenCalled()
  })

  it('keeps the selection indicator and regions of a rendered ActionList item', async () => {
    const user = userEvent.setup()
    render(
      <SelectPanel
        items={items}
        onSelectedChange={() => {}}
        renderItem={item => (
          <ActionList.Item leadingVisual={<ActionList.LeadingVisual>visual</ActionList.LeadingVisual>}>
            {item.text}
            <ActionList.Description>Teammate</ActionList.Description>
          </ActionList.Item>
        )}
        selected={[items[0]]}
        title="Rendered items"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Mona'}))
    const option = screen.getByRole('option', {name: /Mona/})
    expect(option.querySelector('[data-component="ActionList.Selection"]')).toBeInTheDocument()
    expect(option.querySelector('[data-component="ActionList.LeadingVisual"]')).toHaveTextContent('visual')
    expect(option.querySelector('[data-component="ActionList.Description"]')).toHaveTextContent('Teammate')
    expect(option.querySelector('[data-component="ActionList.Item.Label"]')).toHaveTextContent(/^Mona$/)
  })

  it('keeps scrolling locked until every open modal SelectPanel closes', () => {
    const modalProps = {
      items,
      onCancel: () => {},
      onSelectedChange: () => {},
      selected: undefined,
      title: 'Modal labels',
      variant: 'modal' as const,
    }
    const {rerender} = render(
      <>
        <SelectPanel {...modalProps} defaultOpen />
        <SelectPanel {...modalProps} defaultOpen />
      </>,
    )

    expect(document.body.style.overflow).toBe('hidden')
    rerender(<SelectPanel {...modalProps} defaultOpen />)
    expect(document.body.style.overflow).toBe('hidden')
    rerender(<></>)
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('honors item onAction cancellation before changing selection', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const preventableItem: SelectPanelItem = {
      id: 'prevent',
      onAction: (_item, event) => event.preventDefault(),
      text: 'Prevent selection',
    }

    render(
      <SelectPanel
        items={[preventableItem]}
        onSelectedChange={onSelectedChange}
        selected={[]}
        selectionVariant="multiple"
        title="Preventable labels"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Preventable labels'}))
    await user.click(screen.getByRole('option', {name: 'Prevent selection'}))
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('focuses a named filter input with the default input background when opened', async () => {
    const user = userEvent.setup()
    render(<SelectPanel items={items} onSelectedChange={() => {}} selected={undefined} title="Assignees" />)

    await user.click(screen.getByRole('button', {name: 'Assignees'}))
    const input = await screen.findByRole('combobox', {name: 'Filter items'})

    expect(input).toHaveFocus()
    const wrapper = input.closest('[data-component="TextInput"]')
    expect(wrapper).toHaveClass('bg-default')
    expect(wrapper).not.toHaveAttribute('data-contrast')
  })

  it('gives the filter input an id from textInputProps', () => {
    render(
      <SelectPanel
        items={items}
        onOpenChange={() => {}}
        onSelectedChange={() => {}}
        open
        selected={undefined}
        textInputProps={{id: 'assignee-filter'}}
        title="Assignees"
      />,
    )

    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('id', 'assignee-filter')
    expect(document.getElementById(input.getAttribute('aria-controls')!)).toBe(screen.getByRole('listbox'))
  })

  it('references the option list from the filter input only while the list is rendered', () => {
    const panelProps = {onOpenChange: () => {}, onSelectedChange: () => {}, open: true, selected: undefined, title: 'T'}
    const {rerender} = render(<SelectPanel {...panelProps} items={items} />)

    const listId = screen.getByRole('combobox').getAttribute('aria-controls')
    expect(listId).toBeTruthy()
    expect(document.getElementById(listId!)).toBe(screen.getByRole('listbox'))

    rerender(
      <SelectPanel
        {...panelProps}
        items={[]}
        message={{body: 'Try another filter', title: 'No items', variant: 'empty'}}
      />,
    )
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')

    rerender(<SelectPanel {...panelProps} items={items} loading />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')
  })
})
