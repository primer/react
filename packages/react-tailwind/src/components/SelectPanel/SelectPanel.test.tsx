import React from 'react'
import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, describe, expect, it, vi} from 'vitest'
import type {SelectPanelActionDetails, SelectPanelAnchorProps, SelectPanelItem, SelectPanelProps} from './SelectPanel'
import {SelectPanel} from './SelectPanel'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Checkbox} from '../Checkbox'
import {Dialog} from '../Dialog'
import {FeatureFlags} from '../FeatureFlags'
import {FormControl} from '../FormControl'
import {Truncate} from '../Truncate'

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

function mockNarrowViewport(narrow: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: narrow && query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('SelectPanel', () => {
  it.each([false, true])('runs callback ref cleanups with virtualized=%s', virtualized => {
    const contentCleanup = vi.fn()
    const scrollCleanup = vi.fn()
    const itemCleanup = vi.fn()
    const contentRef = vi.fn((node: HTMLDivElement | null) => (node ? contentCleanup : undefined))
    const scrollRef = vi.fn((node: HTMLDivElement | null) => (node ? scrollCleanup : undefined))
    const itemRef = vi.fn((node: HTMLDivElement | null) => (node ? itemCleanup : undefined))
    const options = [{id: 'mona', ref: itemRef, text: 'Mona'}]
    const fixture = () => (
      <SelectPanel
        defaultOpen
        items={options}
        onSelectedChange={() => {}}
        ref={contentRef}
        scrollContainerRef={scrollRef}
        selected={undefined}
        title="Choose an item"
        virtualized={virtualized}
      />
    )
    const {rerender, unmount} = render(fixture())
    expect(contentRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    expect(scrollRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))

    rerender(fixture())
    unmount()

    expect(contentRef).not.toHaveBeenCalledWith(null)
    expect(scrollRef).not.toHaveBeenCalledWith(null)
    expect(itemRef).not.toHaveBeenCalledWith(null)
    expect(contentCleanup).toHaveBeenCalledTimes(contentRef.mock.calls.length)
    expect(scrollCleanup).toHaveBeenCalledTimes(scrollRef.mock.calls.length)
    expect(itemCleanup).toHaveBeenCalledTimes(itemRef.mock.calls.length)
  })

  it.each(['anchored', 'modal'] as const)('keeps the %s filter independent from its enclosing field', async variant => {
    const user = userEvent.setup()

    render(
      <FormControl name="outer-field" required>
        <FormControl.Label>Items</FormControl.Label>
        <FormControl.Caption>Choose at least one item</FormControl.Caption>
        <FormControl.Validation variant="error">An item is required</FormControl.Validation>
        <SelectPanel
          {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
          items={items}
          onSelectedChange={() => {}}
          selected={[]}
          selectionVariant="multiple"
          showSelectAll
          title="Choose items"
        />
      </FormControl>,
    )

    const trigger = screen.getByRole('button', {name: /Items|Choose items/})
    const label = screen.getByText('Items').closest('label')
    expect(label).toHaveAttribute('for', trigger.id)
    expect(trigger.id).not.toBe('')
    expect(trigger).toHaveAccessibleDescription('An item is required Choose at least one item Required')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')

    await user.click(trigger)

    const input = screen.getByRole('combobox', {name: 'Filter items'})
    expect(input).not.toBeRequired()
    expect(input).not.toHaveAttribute('aria-labelledby')
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(input).not.toHaveAttribute('name', 'outer-field')
    expect(input).not.toBeDisabled()
    const selectAll = screen.getByRole('checkbox', {name: 'Select all'})
    expect(selectAll).not.toBeRequired()
    expect(selectAll).not.toHaveAttribute('aria-describedby')
    expect(selectAll).not.toHaveAttribute('aria-invalid')
    expect(label).toHaveAttribute('for', trigger.id)
  })

  it.each(['anchored', 'modal'] as const)(
    'preserves explicit %s filter accessibility and form props inside a field',
    async variant => {
      const user = userEvent.setup()

      render(
        <>
          <span id="filter-help">Search by name</span>
          <FormControl required>
            <FormControl.Label>Items</FormControl.Label>
            <SelectPanel
              {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
              items={items}
              onSelectedChange={() => {}}
              selected={undefined}
              textInputProps={{
                'aria-describedby': 'filter-help',
                'aria-invalid': true,
                'aria-label': 'Search items',
                name: 'filter-query',
                required: true,
              }}
              title="Choose items"
            />
          </FormControl>
        </>,
      )

      await user.click(screen.getByRole('button', {name: /Items|Choose items/}))

      const input = screen.getByRole('combobox', {name: 'Search items'})
      expect(input).toHaveAttribute('aria-describedby', 'filter-help')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('name', 'filter-query')
      expect(input).toBeRequired()
    },
  )

  it.each(['anchored', 'modal'] as const)(
    'keeps custom %s popup controls independent from the enclosing field',
    async variant => {
      const user = userEvent.setup()

      render(
        <>
          <span id="custom-help">Custom help</span>
          <FormControl required>
            <FormControl.Label>Items</FormControl.Label>
            <FormControl.Caption>Choose at least one item</FormControl.Caption>
            <FormControl.Validation variant="error">An item is required</FormControl.Validation>
            <SelectPanel
              {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
              items={items}
              onSelectedChange={() => {}}
              secondaryAction={<Checkbox aria-describedby="custom-help" aria-label="Custom option" />}
              selected={undefined}
              title="Choose items"
            />
          </FormControl>
        </>,
      )

      await user.click(screen.getByRole('button', {name: /Items|Choose items/}))

      const customOption = screen.getByRole('checkbox', {name: 'Custom option'})
      expect(customOption).toHaveAccessibleDescription('Custom help')
      expect(customOption).not.toBeRequired()
      expect(customOption).not.toHaveAttribute('aria-invalid')
    },
  )

  it.each(['anchored', 'modal'] as const)(
    'merges a custom %s trigger description with the enclosing field',
    variant => {
      render(
        <>
          <span id="anchor-help">Additional trigger help</span>
          <FormControl>
            <FormControl.Label>Items</FormControl.Label>
            <FormControl.Caption>Choose an item</FormControl.Caption>
            <FormControl.Validation variant="error">Selection is invalid</FormControl.Validation>
            <SelectPanel
              {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
              items={items}
              onSelectedChange={() => {}}
              renderAnchor={({children}) => (
                <button aria-describedby="anchor-help" aria-invalid="false" type="button">
                  {children}
                </button>
              )}
              selected={undefined}
            />
          </FormControl>
        </>,
      )

      const trigger = screen.getByRole('button', {name: 'Items'})
      expect(trigger).toHaveAccessibleDescription('Selection is invalid Choose an item Additional trigger help')
      expect(trigger).toHaveAttribute('aria-invalid', 'true')
    },
  )

  it.each(['anchored', 'modal'] as const)(
    'supports a custom %s trigger described by content alongside the panel',
    async variant => {
      const user = userEvent.setup()
      render(
        <>
          <span id="reviewer-help">Reviewers are required</span>
          <SelectPanel
            {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
            items={items}
            onSelectedChange={() => {}}
            renderAnchor={() => (
              <button aria-describedby="reviewer-help" type="button">
                Reviewers
              </button>
            )}
            selected={undefined}
            title="Reviewers"
          />
        </>,
      )

      const trigger = screen.getByRole('button', {name: 'Reviewers'})
      expect(trigger).toHaveAccessibleDescription('Reviewers are required')
      await user.click(trigger)
      const input = screen.getByRole('combobox', {name: 'Filter items'})
      await waitFor(() => expect(input).toHaveFocus())
      await user.keyboard('{Escape}')
      await waitFor(() => expect(trigger).toHaveFocus())
      expect(trigger).toHaveAccessibleDescription('Reviewers are required')
    },
  )

  it('describes a required trigger even without a caption or validation message', () => {
    render(
      <FormControl required>
        <FormControl.Label>Items</FormControl.Label>
        <SelectPanel items={items} onSelectedChange={() => {}} selected={undefined} />
      </FormControl>,
    )

    const trigger = screen.getByRole('button', {name: /Items\s*\*/})
    expect(trigger).toHaveAccessibleDescription('Required')
    expect(trigger).not.toHaveAttribute('aria-required')
  })

  it('associates a non-button custom trigger with its enclosing label', async () => {
    const user = userEvent.setup()

    render(
      <FormControl>
        <FormControl.Label>Items</FormControl.Label>
        <SelectPanel
          anchorProps={{nativeButton: false}}
          items={items}
          onSelectedChange={() => {}}
          renderAnchor={({children}) => <div>{children}</div>}
          selected={undefined}
        />
      </FormControl>,
    )

    await user.click(screen.getByRole('button', {name: 'Items'}))
    expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus()
  })

  it('does not open a disabled non-button trigger', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <FormControl disabled>
        <FormControl.Label>Items</FormControl.Label>
        <SelectPanel
          anchorProps={{nativeButton: false}}
          items={items}
          onOpenChange={onOpenChange}
          onSelectedChange={() => {}}
          renderAnchor={({children}) => <div>{children}</div>}
          selected={undefined}
        />
      </FormControl>,
    )

    const trigger = screen.getByRole('button', {name: 'Items'})
    expect(trigger).toHaveAttribute('aria-disabled', 'true')
    await user.click(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('does not let a custom native trigger re-enable a disabled field', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <FormControl disabled>
        <FormControl.Label>Items</FormControl.Label>
        <SelectPanel
          items={items}
          onOpenChange={onOpenChange}
          onSelectedChange={() => {}}
          renderAnchor={({children}) => (
            <button disabled={false} type="button">
              {children}
            </button>
          )}
          selected={undefined}
        />
      </FormControl>,
    )

    const trigger = screen.getByRole('button', {name: 'Items'})
    expect(trigger).toBeDisabled()
    await user.click(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it.each(['anchored', 'modal'] as const)(
    'does not disable the %s filter when its enclosing field is disabled',
    variant => {
      render(
        <FormControl disabled required>
          <FormControl.Label>Items</FormControl.Label>
          <SelectPanel
            {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
            items={items}
            onSelectedChange={() => {}}
            open
            selected={undefined}
            title="Choose items"
          />
        </FormControl>,
      )

      const label = screen.getByText('Items').closest('label')
      const trigger = document.getElementById(label?.htmlFor ?? '')
      expect(trigger).toBeDisabled()
      expect(screen.getByRole('combobox', {name: 'Filter items'})).not.toBeDisabled()
    },
  )

  it('respects an explicit filter label reference inside a field', async () => {
    const user = userEvent.setup()

    render(
      <>
        <span id="filter-label">Search assignees</span>
        <FormControl required>
          <FormControl.Label>Items</FormControl.Label>
          <SelectPanel
            items={items}
            onSelectedChange={() => {}}
            selected={undefined}
            textInputProps={{'aria-labelledby': 'filter-label'}}
            title="Choose items"
          />
        </FormControl>
      </>,
    )

    await user.click(screen.getByRole('button', {name: /Items|Choose items/}))
    expect(screen.getByRole('combobox', {name: 'Search assignees'})).toHaveAttribute('aria-labelledby', 'filter-label')
  })

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

  it.todo('initially highlights the first enabled option and navigates to the second on ArrowDown', async () => {
    const user = userEvent.setup()
    const first = {id: 'first', text: 'First'}
    const second = {id: 'second', text: 'Second'}
    const onSelectedChange = vi.fn()
    render(
      <SelectPanel
        items={[{id: 'disabled', text: 'Unavailable', disabled: true}, first, second]}
        onSelectedChange={onSelectedChange}
        selected={undefined}
        title="Choose items"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Choose items'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'First'}).id),
    )
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Second'}).id)
    await user.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenCalledOnce()
    expect(onSelectedChange.mock.calls[0][0]).toBe(second)
  })

  it('leaves initial highlighting to keyboard interaction when setInitialFocus is true', async () => {
    const user = userEvent.setup()
    render(
      <SelectPanel
        items={items}
        onSelectedChange={() => {}}
        selected={undefined}
        setInitialFocus
        title="Choose items"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Choose items'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    expect(input).not.toHaveAttribute('aria-activedescendant')
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Mona'}).id)
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

  it('reports selection shapes that match the selection mode and returns custom items unchanged', async () => {
    const user = userEvent.setup()
    type LabelItem = SelectPanelItem & {id: number; color: string}
    const labels: LabelItem[] = [
      {id: 1, text: 'Bug', color: 'red'},
      {id: 2, text: 'Docs', color: 'blue'},
    ]
    const singleChange = vi.fn<(selected: LabelItem | undefined) => void>()
    const multipleChange = vi.fn<(selected: LabelItem[]) => void>()

    function SingleExample() {
      const [selected, setSelected] = React.useState<LabelItem | undefined>(undefined)
      return (
        <SelectPanel
          items={labels}
          onSelectedChange={next => {
            singleChange(next)
            setSelected(next)
          }}
          selected={selected}
          title="Single label"
        />
      )
    }

    const singleRender = render(<SingleExample />)
    await user.click(screen.getByRole('button', {name: 'Single label'}))
    await user.click(screen.getByRole('option', {name: 'Bug'}))
    expect(singleChange).toHaveBeenLastCalledWith(labels[0])
    await user.click(screen.getByRole('button', {name: 'Bug'}))
    await user.click(screen.getByRole('option', {name: 'Bug'}))
    expect(singleChange).toHaveBeenLastCalledWith(undefined)
    singleRender.unmount()

    function MultipleExample() {
      const [selected, setSelected] = React.useState<LabelItem[]>([])
      return (
        <SelectPanel
          items={labels}
          onSelectedChange={next => {
            multipleChange(next)
            setSelected(next)
          }}
          selected={selected}
          title="Labels"
        />
      )
    }

    render(<MultipleExample />)
    await user.click(screen.getByRole('button', {name: 'Labels'}))
    await user.click(screen.getByRole('option', {name: 'Docs'}))
    expect(multipleChange).toHaveBeenLastCalledWith([labels[1]])
    expect(multipleChange.mock.lastCall?.[0][0]).toBe(labels[1])
    await user.click(screen.getByRole('option', {name: 'Docs'}))
    expect(multipleChange).toHaveBeenLastCalledWith([])
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

  it.each(['anchored', 'modal'] as const)('supports a non-button custom anchor in %s mode', async variant => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <SelectPanel
        {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
        anchorProps={{nativeButton: false}}
        items={items}
        onOpenChange={onOpenChange}
        onSelectedChange={() => {}}
        renderAnchor={({children}) => <div>{children}</div>}
        selected={undefined}
        title="Assignees"
      />,
    )

    const anchor = screen.getByRole('button', {name: 'Assignees'})
    expect(anchor.tagName).toBe('DIV')
    act(() => anchor.focus())
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', {name: 'Assignees'})).toBeVisible()
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())
    expect(onOpenChange).toHaveBeenCalledTimes(1)

    await user.keyboard('{Escape}')
    await waitFor(() => expect(anchor).toHaveFocus())
    await user.keyboard(' ')
    expect(screen.getByRole('dialog', {name: 'Assignees'})).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledTimes(3)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(anchor).toHaveFocus())
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('can use an ActionMenu item as a non-button anchor', async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ActionMenu.Root modal={false}>
        <ActionMenu.Button>Open menu</ActionMenu.Button>
        <ActionMenu.Content>
          <SelectPanel
            anchorProps={{nativeButton: false, role: 'menuitem'}}
            items={items}
            onSelectedChange={() => {}}
            renderAnchor={({children}) => <ActionMenu.Item closeOnClick={false}>{children}</ActionMenu.Item>}
            selected={undefined}
            title="Assignees"
          />
        </ActionMenu.Content>
      </ActionMenu.Root>,
    )

    await user.click(screen.getByRole('button', {name: 'Open menu'}))
    const menuAnchor = (await screen.findByText('Assignees')).closest('[role]')
    expect(menuAnchor).toHaveAttribute('role', 'menuitem')
    const anchor = await screen.findByRole('menuitem', {name: 'Assignees'})
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(anchor).toHaveFocus())
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', {name: 'Assignees'})).toBeVisible()
    expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(anchor).toHaveFocus())
    expect(screen.getByRole('menu')).toBeVisible()

    await user.click(anchor)
    expect(screen.getByRole('dialog', {name: 'Assignees'})).toBeVisible()
    await user.click(screen.getByRole('option', {name: 'Mona'}))
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Assignees'})).not.toBeInTheDocument())
    await waitFor(() => expect(anchor).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.getByRole('button', {name: 'Open menu'})).toHaveFocus())
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
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

  it.each(['anchored', 'modal'] as const)('releases closed %s portal content after restoring focus', async variant => {
    const user = userEvent.setup()
    const onMount = vi.fn()
    const onUnmount = vi.fn()

    function Message() {
      React.useEffect(() => {
        onMount()
        return onUnmount
      }, [])
      return <span data-testid="portal-message">No items</span>
    }

    render(
      <SelectPanel
        {...(variant === 'modal' ? {variant, onCancel: () => {}} : {variant})}
        items={[]}
        message={<Message />}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Projects"
      />,
    )

    expect(screen.queryByTestId('portal-message')).not.toBeInTheDocument()
    const anchor = screen.getByRole('button', {name: 'Projects'})
    await user.click(anchor)
    const message = screen.getByTestId('portal-message')
    expect(onMount).toHaveBeenCalledTimes(1)

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(anchor).toHaveFocus()
      expect(message).not.toBeInTheDocument()
    })
    expect(onUnmount).toHaveBeenCalledTimes(1)

    await user.click(anchor)
    expect(screen.getByTestId('portal-message')).toBeVisible()
    expect(onMount).toHaveBeenCalledTimes(2)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByTestId('portal-message')).not.toBeInTheDocument())
  })

  it.each(['anchored', 'modal'] as const)(
    'retains a controlled %s popup across a rapid close and reopen',
    async variant => {
      const variantProps =
        variant === 'modal' ? ({variant: 'modal', onCancel: () => {}} as const) : ({variant: 'anchored'} as const)
      const panelProps = {
        ...variantProps,
        items,
        onSelectedChange: () => {},
        selected: undefined,
        title: 'Projects',
      } satisfies SelectPanelProps
      const {rerender} = render(<SelectPanel {...panelProps} open={false} />)

      expect(screen.queryByRole('dialog', {name: 'Projects'})).not.toBeInTheDocument()
      rerender(<SelectPanel {...panelProps} open />)
      await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())

      rerender(<SelectPanel {...panelProps} open={false} />)
      rerender(<SelectPanel {...panelProps} open />)
      await act(async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      })
      expect(screen.getByRole('dialog', {name: 'Projects'})).toBeVisible()
      await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())

      rerender(<SelectPanel {...panelProps} open={false} />)
      await waitFor(() => expect(screen.queryByText('Mona')).not.toBeInTheDocument())
    },
  )

  it('releases an external-anchor popup after an outside click', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    function Example() {
      const [open, setOpen] = React.useState(false)
      const anchorRef = React.useRef<HTMLButtonElement>(null)
      return (
        <>
          <button ref={anchorRef} type="button" onClick={() => setOpen(true)}>
            Open picker
          </button>
          <button type="button">Outside</button>
          <SelectPanel
            anchorRef={anchorRef}
            items={items}
            onOpenChange={(nextOpen, gesture) => {
              onOpenChange(nextOpen, gesture)
              setOpen(nextOpen)
            }}
            onSelectedChange={() => {}}
            open={open}
            renderAnchor={null}
            selected={undefined}
            title="Projects"
          />
        </>
      )
    }

    render(<Example />)
    await user.click(screen.getByRole('button', {name: 'Open picker'}))
    expect(await screen.findByRole('dialog', {name: 'Projects'})).toBeVisible()
    await user.click(screen.getByRole('button', {name: 'Outside'}))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    await waitFor(() => expect(screen.queryByText('Mona')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', {name: 'Open picker'}))
    expect(await screen.findByRole('dialog', {name: 'Projects'})).toBeVisible()
  })

  it('distinguishes a trigger click from an outside dismissal', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SelectPanel
        items={items}
        onOpenChange={onOpenChange}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Projects"
      />,
    )

    const trigger = screen.getByRole('button', {name: 'Projects'})
    await user.click(trigger)
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')
    await user.click(trigger)
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'anchor-click')
  })

  it('keeps anchored panel content in place when overlayProps.portal is false', async () => {
    const user = userEvent.setup()
    const portalTarget = document.createElement('div')
    const {container} = render(
      <div data-testid="panel-root">
        <SelectPanel
          items={items}
          onSelectedChange={() => {}}
          overlayProps={{container: portalTarget, portal: false}}
          selected={undefined}
          title="No portal"
        />
      </div>,
    )

    await user.click(screen.getByRole('button', {name: 'No portal'}))
    expect(container).toContainElement(screen.getByRole('dialog', {name: 'No portal'}))
    expect(portalTarget).toBeEmptyDOMElement()
  })

  it('uses a portal inside a focus-trapped dialog without moving the scroll position', async () => {
    const user = userEvent.setup()

    function Example() {
      const [portalTarget, setPortalTarget] = React.useState<HTMLDivElement | null>(null)
      return (
        <Dialog defaultOpen modal="trap-focus">
          <Dialog.Content>
            <Dialog.Title>Project settings</Dialog.Title>
            <div data-testid="portal-target" ref={setPortalTarget} />
            <div data-testid="scroll-container" style={{height: 100, overflow: 'auto'}}>
              <SelectPanel
                disableFullscreenOnNarrow
                items={items}
                onSelectedChange={() => {}}
                overlayProps={{container: portalTarget}}
                selected={undefined}
                title="Projects"
              />
            </div>
          </Dialog.Content>
        </Dialog>
      )
    }

    render(<Example />)
    const scrollContainer = screen.getByTestId('scroll-container')
    scrollContainer.scrollTop = 120
    const trigger = screen.getByRole('button', {name: 'Projects'})
    await user.click(trigger)

    const panel = await screen.findByRole('dialog', {name: 'Projects'})
    expect(screen.getByTestId('portal-target')).toContainElement(panel)
    expect(scrollContainer).not.toContainElement(panel)
    expect(scrollContainer.scrollTop).toBe(120)
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Projects'})).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
    expect(scrollContainer.scrollTop).toBe(120)
  })

  it.each(['anchored', 'modal'] as const)('waits for an explicit portal container in %s mode', async variant => {
    const variantProps =
      variant === 'modal' ? ({variant: 'modal', onCancel: () => {}} as const) : ({variant: 'anchored'} as const)
    const panelProps = {
      defaultOpen: true,
      disableFullscreenOnNarrow: true,
      items,
      onSelectedChange: () => {},
      selected: undefined,
      title: 'Choose a project',
      ...variantProps,
    } satisfies SelectPanelProps
    const {rerender} = render(
      <>
        <div data-testid="portal-target" />
        <SelectPanel {...panelProps} overlayProps={{container: null}} />
      </>,
    )
    expect(screen.queryByRole('dialog', {name: 'Choose a project'})).not.toBeInTheDocument()

    const portalTarget = screen.getByTestId('portal-target')
    rerender(
      <>
        <div data-testid="portal-target" />
        <SelectPanel {...panelProps} overlayProps={{container: portalTarget}} />
      </>,
    )
    expect(portalTarget).toContainElement(await screen.findByRole('dialog', {name: 'Choose a project'}))
  })

  it('supports a ref object as its portal container', async () => {
    const portalRef = React.createRef<HTMLDivElement>()
    render(
      <>
        <div data-testid="portal-target" ref={portalRef} />
        <SelectPanel
          defaultOpen
          disableFullscreenOnNarrow
          items={items}
          onSelectedChange={() => {}}
          overlayProps={{container: portalRef}}
          selected={undefined}
          title="Projects"
        />
      </>,
    )
    expect(screen.getByTestId('portal-target')).toContainElement(await screen.findByRole('dialog', {name: 'Projects'}))
  })

  it.each([
    {name: 'the default flag', flag: undefined, narrow: true, disabled: false, fullscreen: false},
    {name: 'the flag disabled', flag: false, narrow: true, disabled: false, fullscreen: false},
    {name: 'the flag enabled', flag: true, narrow: true, disabled: false, fullscreen: true},
    {name: 'the flag enabled with the opt-out', flag: true, narrow: true, disabled: true, fullscreen: false},
    {name: 'a wider viewport', flag: true, narrow: false, disabled: false, fullscreen: false},
  ])('uses the correct narrow presentation with $name', async ({flag, narrow, disabled, fullscreen}) => {
    mockNarrowViewport(narrow)
    const user = userEvent.setup()
    const panel = (
      <SelectPanel
        disableFullscreenOnNarrow={disabled}
        items={items}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Projects"
      />
    )
    render(
      flag === undefined ? (
        panel
      ) : (
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: flag}}>{panel}</FeatureFlags>
      ),
    )

    await user.click(screen.getByRole('button', {name: 'Projects'}))
    const dialog = await screen.findByRole('dialog', {name: 'Projects'})
    expect(dialog).toHaveAttribute('data-component', fullscreen ? 'Dialog.Popup' : 'Popover.Popup')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Projects'})).not.toBeInTheDocument())
  })

  it.each([
    {
      name: 'multiple with cancellation',
      multiple: true,
      cancel: true,
      narrow: true,
      flag: true,
      buttons: ['Cancel', 'Save'],
      close: true,
    },
    {
      name: 'multiple without cancellation',
      multiple: true,
      cancel: false,
      narrow: true,
      flag: true,
      buttons: ['Save and close'],
      close: false,
    },
    {
      name: 'single with cancellation',
      multiple: false,
      cancel: true,
      narrow: true,
      flag: true,
      buttons: [],
      close: true,
    },
    {
      name: 'single without cancellation',
      multiple: false,
      cancel: false,
      narrow: true,
      flag: true,
      buttons: [],
      close: true,
    },
    {
      name: 'multiple with the flag disabled',
      multiple: true,
      cancel: true,
      narrow: true,
      flag: false,
      buttons: [],
      close: false,
    },
    {
      name: 'multiple with the opt-out',
      multiple: true,
      cancel: true,
      narrow: true,
      flag: true,
      disabled: true,
      buttons: [],
      close: false,
    },
    {
      name: 'multiple on a wide viewport',
      multiple: true,
      cancel: true,
      narrow: false,
      flag: true,
      buttons: [],
      close: false,
    },
    {
      name: 'multiple with a secondary action',
      multiple: true,
      cancel: true,
      narrow: true,
      flag: true,
      secondary: true,
      buttons: ['Cancel', 'Save'],
      close: true,
    },
  ])(
    'renders the correct fullscreen controls for $name',
    async ({multiple, cancel, narrow, flag, disabled, secondary, buttons, close}) => {
      mockNarrowViewport(narrow)
      render(
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: flag}}>
          <SelectPanel
            defaultOpen
            disableFullscreenOnNarrow={disabled}
            items={items}
            onCancel={cancel ? () => {} : undefined}
            onSelectedChange={() => {}}
            secondaryAction={secondary ? <button type="button">Secondary action</button> : undefined}
            {...(multiple ? {selected: []} : {selected: undefined})}
            title="Projects"
          />
        </FeatureFlags>,
      )
      const dialog = await screen.findByRole('dialog', {name: 'Projects'})
      for (const name of ['Cancel', 'Save', 'Save and close']) {
        expect(Boolean(within(dialog).queryByRole('button', {name}))).toBe(buttons.some(button => button === name))
      }
      expect(Boolean(within(dialog).queryByRole('button', {name: 'Cancel and close'}))).toBe(close)
      expect(Boolean(within(dialog).queryByRole('button', {name: 'Secondary action'}))).toBe(Boolean(secondary))
    },
  )

  it.each([false, true])('keeps modal footer controls on a narrow viewport: %s', async narrow => {
    mockNarrowViewport(narrow)
    render(
      <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
        <SelectPanel
          defaultOpen
          items={items}
          onCancel={() => {}}
          onSelectedChange={() => {}}
          selected={undefined}
          title="Projects"
          variant="modal"
        />
      </FeatureFlags>,
    )
    const dialog = await screen.findByRole('dialog', {name: 'Projects'})
    expect(within(dialog).getByRole('button', {name: 'Cancel'})).toBeVisible()
    expect(within(dialog).getByRole('button', {name: 'Save'})).toBeVisible()
    expect(within(dialog).getByRole('button', {name: 'Cancel and close'})).toBeVisible()
  })

  it('saves and cancels fullscreen multiple selection without changing request or focus behavior', async () => {
    mockNarrowViewport(true)
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    const onSelectedChange = vi.fn()

    function Example() {
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
      const [open, setOpen] = React.useState(false)
      return (
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
          <SelectPanel
            items={items}
            onCancel={() => {
              onCancel()
              setSelected([items[0]])
            }}
            onOpenChange={(next, gesture) => {
              onOpenChange(next, gesture)
              setOpen(next)
            }}
            onSelectedChange={next => {
              onSelectedChange(next)
              setSelected(asItems(next))
            }}
            open={open}
            selected={selected}
            title="Projects"
          />
        </FeatureFlags>
      )
    }

    render(<Example />)
    const trigger = screen.getByRole('button', {name: 'Projects'})
    await user.click(trigger)
    await user.click(screen.getByRole('option', {name: 'Mona'}))
    expect(onSelectedChange).toHaveBeenLastCalledWith([items[0]])
    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    expect(onCancel).not.toHaveBeenCalled()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    await user.click(screen.getByRole('option', {name: 'Hubot'}))
    expect(onSelectedChange).toHaveBeenLastCalledWith([items[0], items[1]])
    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'cancel')
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveTextContent('Mona')
  })

  it('keeps a fullscreen panel open when its owner declines Save or Cancel', async () => {
    mockNarrowViewport(true)
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
        <SelectPanel
          items={items}
          onCancel={onCancel}
          onOpenChange={onOpenChange}
          onSelectedChange={() => {}}
          open
          selected={[items[0]]}
          title="Projects"
        />
      </FeatureFlags>,
    )
    const dialog = await screen.findByRole('dialog', {name: 'Projects'})
    await user.click(within(dialog).getByRole('button', {name: 'Save'}))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    expect(onCancel).not.toHaveBeenCalled()
    expect(dialog).toBeVisible()
    await user.click(within(dialog).getByRole('button', {name: 'Cancel'}))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'cancel')
    expect(onCancel).toHaveBeenCalledOnce()
    expect(dialog).toBeVisible()
  })

  it('closes an uncontrolled fullscreen multiple picker from the keyboard', async () => {
    mockNarrowViewport(true)
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
        <SelectPanel
          items={items}
          onOpenChange={onOpenChange}
          onSelectedChange={() => {}}
          selected={[]}
          title="Projects"
        />
      </FeatureFlags>,
    )
    const trigger = screen.getByRole('button', {name: 'Projects'})
    await user.click(trigger)
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())
    await user.tab()
    expect(screen.getByRole('button', {name: 'Save and close'})).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Projects'})).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
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
    await waitFor(() => expect(screen.getByRole('combobox', {name: 'Filter items'})).toHaveFocus())
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

  it('retains the modal draft when a controlled close request is declined', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onOpenChange = vi.fn()
    const onSelectedChange = vi.fn()
    const panel = (open: boolean) => (
      <SelectPanel
        items={items}
        onCancel={onCancel}
        onOpenChange={onOpenChange}
        onSelectedChange={onSelectedChange}
        open={open}
        selected={items[0]}
        title="Modal labels"
        variant="modal"
      />
    )
    const {rerender} = render(panel(true))

    await user.click(screen.getByRole('option', {name: 'Hubot'}))
    expect(screen.getByRole('option', {name: 'Hubot'})).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'cancel')
    expect(screen.getByRole('dialog', {name: 'Modal labels'})).toBeVisible()
    expect(screen.getByRole('option', {name: 'Hubot'})).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(onSelectedChange).toHaveBeenLastCalledWith(items[1])
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'selection')
    expect(screen.getByRole('option', {name: 'Hubot'})).toHaveAttribute('aria-selected', 'true')

    rerender(panel(false))
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Modal labels'})).not.toBeInTheDocument())
    rerender(panel(true))
    expect(await screen.findByRole('option', {name: 'Mona'})).toHaveAttribute('aria-selected', 'true')
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

  it('lets a configured message opt out of live announcements without hiding its content', async () => {
    const user = userEvent.setup()

    render(
      <SelectPanel
        items={[]}
        message={{body: 'Try another filter.', role: 'none', title: 'No matching issues'}}
        onSelectedChange={() => {}}
        selected={undefined}
        title="Issues"
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Issues'}))
    const title = screen.getByText('No matching issues')
    expect(title).toBeVisible()
    expect(title.closest('[data-component="SelectPanel.Message"]')).toHaveAttribute('role', 'none')
    expect(screen.getByText('Try another filter.')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('supports announcement roles on the SelectPanel.Message helper', () => {
    const {rerender} = render(<SelectPanel.Message title="No matches" />)
    expect(screen.getByRole('status')).toHaveTextContent('No matches')

    rerender(
      <SelectPanel.Message
        action={<button type="button">Create issue</button>}
        role="none"
        title="No matches"
        variant="error"
      />,
    )
    expect(screen.getByText('No matches')).toBeVisible()
    expect(screen.getByRole('button', {name: 'Create issue'})).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
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

  it('virtualizes searchable custom labels and leading visuals through navigation, selection, and filtering', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onDisabledAction = vi.fn()
    const EmojiVisual = () => <span aria-hidden="true">icon</span>
    const emojiItems: SelectPanelItem[] = Array.from({length: 200}, (_, index) => {
      const name = `emoji ${index}`
      return {
        'aria-label': name,
        children: (
          <Truncate as="span" maxWidth="100%" title={name}>
            {name}
          </Truncate>
        ),
        disabled: index === 198,
        id: name,
        key: name,
        leadingVisual: EmojiVisual,
        onAction: index === 198 ? onDisabledAction : undefined,
      }
    })

    function Panel() {
      const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
      return (
        <SelectPanel
          items={emojiItems}
          onSelectedChange={next => {
            onSelectedChange(next)
            setSelected(asItems(next))
          }}
          selected={selected}
          selectionVariant="multiple"
          title="Emoji"
          virtualized
        />
      )
    }

    render(<Panel />)
    await user.click(screen.getByRole('button', {name: 'Emoji'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    const list = document.querySelector<HTMLDivElement>('[data-component="SelectPanel.VirtualizedList"]')
    expect(list).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeLessThan(emojiItems.length)
    expect(screen.getByRole('option', {name: 'emoji 0'})).toHaveAttribute('aria-setsize', '200')

    await user.keyboard('{ArrowUp}')
    const last = await screen.findByRole('option', {name: 'emoji 199'})
    expect(last).toHaveAttribute('aria-posinset', '200')
    expect(input).toHaveAttribute('aria-activedescendant', last.id)
    await user.keyboard('{ArrowUp}')
    const disabled = await screen.findByRole('option', {name: 'emoji 198'})
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await user.keyboard('{Enter}')
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(onDisabledAction).not.toHaveBeenCalled()

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith([emojiItems[199]])
    expect(last).toHaveAttribute('aria-selected', 'true')

    await user.type(input, 'emoji 19')
    expect(screen.getByRole('option', {name: 'emoji 19'})).toHaveAttribute('aria-setsize', '11')
    await user.keyboard('{ArrowUp}')
    const filteredLast = await screen.findByRole('option', {name: 'emoji 199'})
    expect(filteredLast).toHaveAttribute('aria-setsize', '11')
    expect(filteredLast).toHaveAttribute('aria-posinset', '11')
    expect(filteredLast).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('option', {name: 'emoji 20'})).not.toBeInTheDocument()
  })

  it('requires searchable text for virtualized custom labels', async () => {
    const user = userEvent.setup()
    const OpaqueLabel = () => <span>Rendered label</span>
    const makeItems = (searchable: boolean): SelectPanelItem[] =>
      Array.from({length: 40}, (_, index) => ({
        'aria-label': `Option ${index}`,
        children: <OpaqueLabel />,
        filterValue: searchable ? `Option ${index}` : undefined,
        id: index,
      }))
    const panel = (searchable: boolean) => (
      <SelectPanel
        items={makeItems(searchable)}
        onSelectedChange={() => {}}
        selected={[]}
        selectionVariant="multiple"
        title="Labels"
        virtualized
      />
    )
    const {rerender} = render(panel(false))
    await user.click(screen.getByRole('button', {name: 'Labels'}))
    expect(document.querySelector('[data-component="SelectPanel.VirtualizedList"]')).toBeNull()
    expect(screen.getAllByRole('option')).toHaveLength(40)

    rerender(panel(true))
    expect(document.querySelector('[data-component="SelectPanel.VirtualizedList"]')).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBeLessThan(40)
    await user.type(screen.getByRole('combobox', {name: 'Filter items'}), 'Option 39')
    expect(screen.getByRole('option', {name: 'Option 39'})).toHaveAttribute('aria-setsize', '1')
  })

  it.each([false, true])('respects cancelled and modified paging keys with virtualized=%s', async virtualized => {
    const user = userEvent.setup()
    let cancelPaging = true
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLInputElement>) => {
      if (cancelPaging && event.key === 'PageDown') event.preventDefault()
    })
    render(
      <SelectPanel
        items={[{id: 'long', text: 'A long option'}]}
        onSelectedChange={() => {}}
        selected={[]}
        selectionVariant="multiple"
        textInputProps={{onKeyDown}}
        title="Labels"
        virtualized={virtualized}
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Labels'}))
    const input = screen.getByRole('combobox', {name: 'Filter items'})
    const option = screen.getByRole('option', {name: 'A long option'})
    const list = document.querySelector<HTMLDivElement>(
      virtualized ? '[data-component="SelectPanel.VirtualizedList"]' : '[data-component="SelectPanel.List"]',
    )!
    Object.defineProperties(list, {
      clientHeight: {configurable: true, value: 100},
      scrollHeight: {configurable: true, value: 300},
      scrollTop: {configurable: true, value: 0, writable: true},
    })
    vi.spyOn(list, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 320, 100))
    vi.spyOn(option, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, -list.scrollTop, 320, 300))
    await user.keyboard('{ArrowDown}')

    fireEvent.keyDown(input, {key: 'PageDown'})
    expect(list.scrollTop).toBe(0)
    expect(onKeyDown).toHaveBeenCalled()
    cancelPaging = false
    fireEvent.keyDown(input, {key: 'PageDown', shiftKey: true})
    fireEvent.keyDown(input, {key: 'PageDown', ctrlKey: true})
    fireEvent.keyDown(input, {key: 'PageDown', altKey: true})
    fireEvent.keyDown(input, {key: 'PageDown', metaKey: true})
    fireEvent.keyDown(input, {key: 'PageDown', isComposing: true})
    expect(list.scrollTop).toBe(0)

    fireEvent.keyDown(input, {key: 'PageDown'})
    expect(list.scrollTop).toBe(50)
    fireEvent.keyDown(input, {key: 'PageUp'})
    expect(list.scrollTop).toBe(0)
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', option.id)
  })

  it('reports the mounted active option when virtualized keyboard navigation wraps', async () => {
    const user = userEvent.setup()
    const onActiveDescendantChanged = vi.fn()
    const largeItems = Array.from({length: 100}, (_, index) => ({id: index, text: `Item ${index}`}))

    render(
      <SelectPanel
        items={largeItems}
        onActiveDescendantChanged={onActiveDescendantChanged}
        onSelectedChange={() => {}}
        selected={[]}
        selectionVariant="multiple"
        title="Virtual labels"
        virtualized
      />,
    )

    await user.click(screen.getByRole('button', {name: 'Virtual labels'}))
    await user.keyboard('{ArrowUp}')
    await waitFor(() => {
      const last = screen.getByRole('option', {name: 'Item 99'})
      expect(onActiveDescendantChanged).toHaveBeenLastCalledWith(last, undefined, true)
    })
    const last = screen.getByRole('option', {name: 'Item 99'})

    await user.keyboard('{ArrowDown}')
    await waitFor(() => {
      const first = screen.getByRole('option', {name: 'Item 0'})
      expect(onActiveDescendantChanged).toHaveBeenLastCalledWith(first, last, true)
    })
  })

  it('falls back to non-virtualized rendering for descriptions and custom rows', async () => {
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

  describe('selected-option ordering', () => {
    const optionLabels = () => screen.getAllByRole('option').map(option => option.textContent)

    it.each([
      {enabled: false, showSelectedOptionsFirst: true},
      {enabled: true, showSelectedOptionsFirst: false},
    ])('preserves the input order when ordering is disabled: %o', async ({enabled, showSelectedOptionsFirst}) => {
      const user = userEvent.setup()
      render(
        <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: enabled}}>
          <SelectPanel
            items={items}
            onSelectedChange={() => {}}
            selected={[items[1]]}
            selectionVariant="multiple"
            showSelectedOptionsFirst={showSelectedOptionsFirst}
            title="Reviewers"
          />
        </FeatureFlags>,
      )

      await user.click(screen.getByRole('button', {name: 'Hubot'}))
      expect(optionLabels()).toEqual(['Mona', 'Hubot', 'Robot'])
    })

    it('keeps the opening order while selecting and refreshes it when the filter clears or the panel reopens', async () => {
      const user = userEvent.setup()

      function Example() {
        const [selected, setSelected] = React.useState<SelectPanelItem[]>([items[1]])
        return (
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
            <SelectPanel
              items={items}
              onSelectedChange={next => setSelected(asItems(next))}
              renderAnchor={() => <button type="button">Reviewers</button>}
              selected={selected}
              selectionVariant="multiple"
              title="Reviewers"
            />
          </FeatureFlags>
        )
      }

      render(<Example />)
      const trigger = screen.getByRole('button', {name: 'Reviewers'})
      await user.click(trigger)
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])

      await user.click(screen.getByRole('option', {name: 'Robot'}))
      expect(screen.getByRole('option', {name: 'Robot'})).toHaveAttribute('aria-selected', 'true')
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])

      const input = screen.getByRole('combobox', {name: 'Filter items'})
      await user.type(input, 'o')
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      await user.clear(input)
      expect(optionLabels()).toEqual(['Hubot', 'Robot', 'Mona'])

      await user.click(screen.getByRole('option', {name: 'Hubot'}))
      expect(optionLabels()).toEqual(['Hubot', 'Robot', 'Mona'])
      await user.keyboard('{Escape}')
      await user.click(trigger)
      expect(optionLabels()).toEqual(['Robot', 'Mona', 'Hubot'])
    })

    it('snapshots the current selection when an initially empty list is populated without replacing the input', async () => {
      const committedOrders: string[][] = []
      const renderPanel = (panelItems: SelectPanelItem[], selected: SelectPanelItem[]) => (
        <React.Profiler
          id="ordering"
          onRender={() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'), option => option.textContent)
            if (options.length) committedOrders.push(options)
          }}
        >
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
            <SelectPanel
              items={panelItems}
              onSelectedChange={() => {}}
              open
              selected={selected}
              selectionVariant="multiple"
              title="Reviewers"
            />
          </FeatureFlags>
        </React.Profiler>
      )
      const {rerender} = render(renderPanel([], [items[0]]))
      const input = screen.getByRole('combobox', {name: 'Filter items'})
      await waitFor(() => expect(input).toHaveFocus())
      rerender(renderPanel([], [items[2]]))
      committedOrders.length = 0
      rerender(renderPanel(items, [items[2]]))

      expect(committedOrders.length).toBeGreaterThan(0)
      expect(committedOrders.every(order => order[0] === 'Robot')).toBe(true)
      expect(optionLabels()).toEqual(['Robot', 'Mona', 'Hubot'])
      expect(screen.getByRole('combobox', {name: 'Filter items'})).toBe(input)
      expect(input).toHaveFocus()
    })

    it('refreshes the snapshot when a controlled filter is cleared', () => {
      const renderPanel = (filterValue: string, selected: SelectPanelItem[]) => (
        <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
          <SelectPanel
            filterValue={filterValue}
            items={items}
            onSelectedChange={() => {}}
            open
            selected={selected}
            selectionVariant="multiple"
            title="Reviewers"
          />
        </FeatureFlags>
      )
      const {rerender} = render(renderPanel('', [items[1]]))
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      rerender(renderPanel('o', [items[2]]))
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      rerender(renderPanel('', [items[2]]))
      expect(optionLabels()).toEqual(['Robot', 'Mona', 'Hubot'])
    })

    it('uses stable typed ids and object identity when ordering selected items', async () => {
      const user = userEvent.setup()
      const referenceItem = {text: 'Reference'}
      const distinctItems = [{id: 1, text: 'Number'}, {id: '1', text: 'String'}, referenceItem]
      render(
        <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
          <SelectPanel
            items={distinctItems}
            onSelectedChange={() => {}}
            renderAnchor={() => <button type="button">Reviewers</button>}
            selected={[{id: '1', text: 'String'}, referenceItem]}
            selectionVariant="multiple"
            title="Reviewers"
          />
        </FeatureFlags>,
      )

      await user.click(screen.getByRole('button', {name: 'Reviewers'}))
      expect(optionLabels()).toEqual(['String', 'Reference', 'Number'])
    })

    it('keeps the saved selection order while changing a single-select modal draft', async () => {
      const user = userEvent.setup()

      function Example() {
        const [selected, setSelected] = React.useState<SelectPanelItem | undefined>(items[1])
        return (
          <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
            <SelectPanel
              items={items}
              onCancel={() => {}}
              onSelectedChange={next => setSelected(Array.isArray(next) ? next[0] : next)}
              renderAnchor={() => <button type="button">Reviewers</button>}
              selected={selected}
              title="Reviewers"
              variant="modal"
            />
          </FeatureFlags>
        )
      }

      render(<Example />)
      const trigger = screen.getByRole('button', {name: 'Reviewers'})
      await user.click(trigger)
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      await user.click(screen.getByRole('option', {name: 'Robot'}))
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      const input = screen.getByRole('combobox', {name: 'Filter items'})
      await user.type(input, 'o')
      await user.clear(input)
      expect(optionLabels()).toEqual(['Hubot', 'Mona', 'Robot'])
      await user.click(screen.getByRole('button', {name: /^Save$/}))
      await user.click(trigger)
      expect(optionLabels()).toEqual(['Robot', 'Mona', 'Hubot'])
    })
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

    render(
      <FeatureFlags flags={{primer_react_select_panel_order_selected_at_top: true}}>
        <Example />
      </FeatureFlags>,
    )
    await user.click(screen.getByRole('button', {name: 'Second'}))
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('Second')
    expect(screen.getByRole('option', {name: /Inactive/})).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByTestId('custom-second')).toBeVisible()
    expect(screen.getByRole('option', {name: 'Second'})).toHaveClass('primer:border-b')

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

  it('names options from label and trailing visual, not a meaningful leading avatar, with or without descriptions', () => {
    const avatar = <img alt="User campaign manager" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" />
    render(
      <SelectPanel
        items={[
          {id: 'hubot', text: 'hubot', leadingVisual: avatar},
          {id: 'octocat', text: 'octocat', leadingVisual: avatar, trailingVisual: 'Admin'},
          {id: 'mona', text: 'mona', leadingVisual: avatar, description: 'Mona Lisa Octocat'},
          {
            id: 'monalisa',
            text: 'monalisa',
            leadingVisual: avatar,
            description: 'Mona Lisa',
            descriptionVariant: 'block',
            trailingVisual: 'Owner',
          },
        ]}
        onSelectedChange={() => {}}
        open
        selected={[]}
        title="Campaign managers"
      />,
    )

    expect(screen.getByRole('option', {name: 'hubot'})).not.toHaveAccessibleDescription()
    expect(screen.getByRole('option', {name: 'octocat Admin'})).not.toHaveAccessibleDescription()
    expect(screen.getByRole('option', {name: 'mona'})).toHaveAccessibleDescription('Mona Lisa Octocat')
    expect(screen.getByRole('option', {name: 'monalisa Owner'})).toHaveAccessibleDescription('Mona Lisa')
    expect(screen.getAllByRole('img', {name: 'User campaign manager'})).toHaveLength(4)
  })

  it('exposes item descriptions separately from their accessible names', () => {
    render(
      <>
        <span id="additional-description">Additional context</span>
        <span id="external-name">External name</span>
        <SelectPanel
          items={[
            {id: 'default', text: 'Default item', description: 'Default description'},
            {
              id: 'named',
              text: 'Visible item',
              description: 'Item description',
              trailingVisual: 'Ignored by explicit name',
              'aria-label': 'Custom item name',
              'aria-describedby': 'additional-description',
            },
            {
              id: 'labelled',
              text: 'Visible label',
              description: 'Labelled description',
              trailingVisual: 'Ignored by explicit label',
              'aria-labelledby': 'external-name',
            },
            {
              id: 'rich',
              text: (
                <>
                  Rich <strong>item</strong>
                </>
              ),
              description: 'Rich description',
              leadingVisual: <span aria-hidden="true">Leading decoration</span>,
              trailingVisual: (
                <>
                  Public<span aria-hidden="true">Hidden decoration</span>
                </>
              ),
            },
            {id: 'inactive', text: 'Inactive item', inactiveText: 'Unavailable'},
            {id: 'visual', text: 'Visual item', leadingVisual: <span>Important</span>},
            {id: 'rendered', text: 'Rendered item'},
            {id: 'hidden-visual', text: 'Hidden visual item'},
            {id: 'raw', text: 'Raw item', inactiveText: 'Not available'},
            {
              id: 'raw-labelled',
              text: 'Raw labelled item',
              'aria-labelledby': 'raw-name',
              'aria-describedby': 'additional-description',
            },
          ]}
          onSelectedChange={() => {}}
          open
          renderItem={item => {
            if (item.id === 'rendered') {
              return (
                <ActionList.Item>
                  {item.text}
                  <ActionList.Description id="first-description">First detail</ActionList.Description>
                  <ActionList.Description variant="block">Second detail</ActionList.Description>
                  <ActionList.Description aria-hidden>Hidden detail</ActionList.Description>
                  <ActionList.TrailingVisual id="custom-trailing">Premium</ActionList.TrailingVisual>
                </ActionList.Item>
              )
            }
            if (item.id === 'hidden-visual') {
              return (
                <ActionList.Item>
                  {item.text}
                  <ActionList.Description>Visible detail</ActionList.Description>
                  <ActionList.TrailingVisual aria-hidden>Hidden visual</ActionList.TrailingVisual>
                </ActionList.Item>
              )
            }
            if (item.id === 'raw') return <span>Raw custom content</span>
            if (item.id === 'raw-labelled') return <span id="raw-name">Raw custom label</span>
            return null
          }}
          selected={undefined}
          title="Items"
        />
      </>,
    )

    expect(screen.getByRole('option', {name: 'Default item'})).toHaveAccessibleDescription('Default description')
    expect(screen.getByRole('option', {name: 'Custom item name'})).toHaveAccessibleDescription(
      'Additional context Item description',
    )
    expect(screen.getByRole('option', {name: 'External name'})).toHaveAccessibleDescription('Labelled description')
    expect(screen.getByRole('option', {name: 'Rich item Public'})).toHaveAccessibleDescription('Rich description')
    expect(screen.getByRole('option', {name: 'Inactive item'})).toHaveAccessibleDescription('Unavailable')
    expect(screen.getAllByText('Unavailable')).toHaveLength(1)
    expect(screen.getByRole('option', {name: 'Visual item'})).toBeInTheDocument()
    const rendered = screen.getByRole('option', {name: 'Rendered item Premium'})
    expect(rendered.querySelector('[data-component="ActionList.TrailingVisual"]')).toHaveAttribute(
      'id',
      'custom-trailing',
    )
    expect(rendered).toHaveAccessibleDescription('First detail Second detail')
    expect(screen.getByRole('option', {name: 'Hidden visual item'})).toHaveAccessibleDescription('Visible detail')
    expect(screen.getByRole('option', {name: 'Raw custom content'})).toHaveAccessibleDescription('Not available')
    expect(screen.getByRole('option', {name: 'Raw custom label'})).toHaveAccessibleDescription('Additional context')
  })

  it('activates the highlighted option after grouped items are prepended', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onAction = vi.fn(
      (_item: SelectPanelItem, event: React.SyntheticEvent<HTMLDivElement>, _details: SelectPanelActionDetails) =>
        event.preventDefault(),
    )
    const onInputKeyDown = vi.fn()
    const first = {id: 'first', text: 'Existing label', groupId: 'labels'}
    const second = {id: 'second', text: 'Other label', groupId: 'labels'}
    const disabled = {id: 'disabled', text: 'Unavailable label', disabled: true, groupId: 'actions'}
    const create = {id: 'create', text: 'Create label', groupId: 'actions', onAction}
    const props = {
      filterValue: 'new',
      focusPrependedElements: true,
      groupMetadata: [{groupId: 'actions'}, {groupId: 'labels'}],
      onSelectedChange,
      open: true,
      selected: [],
      textInputProps: {onKeyDown: onInputKeyDown},
      title: 'Labels',
    } satisfies Omit<SelectPanelProps, 'items'>
    const {rerender} = render(<SelectPanel {...props} items={[first, second]} />)

    const input = screen.getByRole('combobox', {name: 'Filter items'})
    const firstOption = screen.getByRole('option', {name: 'Existing label'})
    await waitFor(() => expect(input).toHaveFocus())
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', firstOption.id))
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', {name: 'Other label'}).id)

    rerender(<SelectPanel {...props} items={[disabled, create, first, second]} />)

    const createOption = screen.getByRole('option', {name: 'Create label'})
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', createOption.id))
    expect(createOption).toHaveAttribute('data-highlighted')
    expect(input).toHaveFocus()
    expect(input).toHaveValue('new')
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id)

    await user.keyboard('{Enter}')
    expect(onAction).toHaveBeenCalledOnce()
    expect(onAction.mock.calls[0][0]).toBe(create)
    expect(onAction.mock.calls[0][1]).toHaveProperty('type', 'click')
    expect(onAction.mock.calls[0][2].sourceEvent).toBeInstanceOf(KeyboardEvent)
    expect(onAction.mock.calls[0][2].sourceEvent).toHaveProperty('key', 'Enter')
    expect(onInputKeyDown).toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenCalledOnce()
    expect(onSelectedChange.mock.calls[0][0]).toEqual([first])
    expect(onSelectedChange.mock.calls[0][0][0]).toBe(first)
    expect(onAction.mock.invocationCallOrder[0]).toBeLessThan(onSelectedChange.mock.invocationCallOrder[0])
  })

  it('exposes a click as the source event when an option is clicked', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn(
      (_item: SelectPanelItem, event: React.SyntheticEvent<HTMLDivElement>, _details: SelectPanelActionDetails) =>
        event.preventDefault(),
    )
    render(
      <SelectPanel
        items={[{id: 'action', text: 'Action', onAction}]}
        onSelectedChange={() => {}}
        open
        selected={undefined}
        title="Actions"
      />,
    )

    await user.click(screen.getByRole('option', {name: 'Action'}))

    expect(onAction).toHaveBeenCalledOnce()
    expect(onAction.mock.calls[0][2].sourceEvent).toBeInstanceOf(MouseEvent)
    expect(onAction.mock.calls[0][2].sourceEvent).toHaveProperty('type', 'click')
  })

  it.todo('highlights the first enabled option when items are prepended without changing the filter')

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
    expect(wrapper).toHaveClass('primer:bg-default')
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
    const panelProps = {
      onOpenChange: () => {},
      onSelectedChange: () => {},
      open: true,
      selected: undefined,
      textInputProps: {'aria-expanded': undefined},
      title: 'T',
    }
    const {rerender} = render(<SelectPanel {...panelProps} items={items} />)

    const listId = screen.getByRole('combobox').getAttribute('aria-controls')
    expect(listId).toBeTruthy()
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById(listId!)).toBe(screen.getByRole('listbox'))

    rerender(
      <SelectPanel
        {...panelProps}
        items={[]}
        message={{body: 'Try another filter', title: 'No items', variant: 'empty'}}
      />,
    )
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')

    rerender(<SelectPanel {...panelProps} items={items} loading />)
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-controls')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })
})
