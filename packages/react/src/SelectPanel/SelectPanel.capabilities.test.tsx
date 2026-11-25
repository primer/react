import React from 'react'
import {act, fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import BaseStyles from '../BaseStyles'
import {BookIcon} from '@primer/octicons-react'
import axe from 'axe-core'
import {ActionList} from '../ActionList'
import FormControl from '../FormControl'
import {SelectPanel, type SelectPanelRootProps, type SelectPanelValue} from '.'

const items = [
  {id: 'apple', text: 'Apple'},
  {id: 'banana', text: 'Banana'},
  {id: 'cherry', text: 'Cherry', disabled: true},
]

function Picker(props: SelectPanelRootProps) {
  return (
    <BaseStyles>
      <SelectPanel.Root focusStrategy="roving" {...props}>
        <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
        <SelectPanel.Overlay>
          <SelectPanel.Content>
            <SelectPanel.Header>
              <SelectPanel.Title>Fruit picker</SelectPanel.Title>
              <SelectPanel.Description>Choose your favorite fruit</SelectPanel.Description>
            </SelectPanel.Header>
            <SelectPanel.SearchInput aria-label="Filter fruit" />
            <SelectPanel.List aria-label="Fruit">
              {items.map(item => (
                <SelectPanel.Item key={item.id} value={item.id} disabled={item.disabled}>
                  {item.text}
                </SelectPanel.Item>
              ))}
            </SelectPanel.List>
            <SelectPanel.Footer>
              <SelectPanel.CloseButton />
            </SelectPanel.Footer>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    </BaseStyles>
  )
}

describe('SelectPanel richer composition', () => {
  it('connects the trigger, panel, description, input, and collection', async () => {
    const user = userEvent.setup()
    render(<Picker />)
    const trigger = screen.getByRole('button', {name: 'Choose fruit'})
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(trigger)
    const dialog = screen.getByRole('dialog', {name: 'Fruit picker'})
    const input = screen.getByRole('textbox', {name: 'Filter fruit'})
    const list = screen.getByRole('listbox', {name: 'Fruit'})
    expect(dialog).toHaveAccessibleDescription('Choose your favorite fruit')
    expect(trigger).toHaveAttribute('aria-controls', dialog.id)
    expect(input).toHaveAttribute('aria-controls', list.id)
    expect(input).not.toHaveAttribute('aria-expanded')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByRole('heading', {level: 1})).toHaveTextContent('Fruit picker')
    await waitFor(() => expect(input).toHaveFocus())

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('moves DOM focus into the list and wraps arrow navigation at its boundaries', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<Picker selectionMode="multiple" onSelectedChange={onSelectedChange} />)
    await user.click(screen.getByRole('button', {name: 'Choose fruit'}))
    const input = screen.getByRole('textbox')
    await waitFor(() => expect(input).toHaveFocus())
    const firstOption = screen.getByRole('option', {name: 'Apple'})
    expect(input).not.toHaveAttribute('aria-activedescendant')
    await user.keyboard('{ArrowDown}')
    expect(firstOption).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['apple'])
    expect(firstOption).toHaveAttribute('aria-selected', 'true')
    expect(firstOption).toHaveFocus()
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true')

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', {name: 'Banana'})).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(firstOption).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('option', {name: 'Banana'})).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(firstOption).toHaveFocus()
    expect(onSelectedChange).toHaveBeenCalledTimes(1)
    await user.tab({shift: true})
    expect(input).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveFocus()
  })

  it.each([1, 2])('wraps among %i available options without a search input', async count => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <SelectPanel.Root focusStrategy="roving" onSelectedChange={onSelectedChange}>
        <SelectPanel.List aria-label="Fruit">
          <SelectPanel.Item value="unavailable-first" disabled>
            Unavailable first item
          </SelectPanel.Item>
          <SelectPanel.Group label="Available fruit">
            {items.slice(0, count).map(item => (
              <SelectPanel.Item key={item.id} value={item.id}>
                {item.text}
              </SelectPanel.Item>
            ))}
          </SelectPanel.Group>
          <SelectPanel.Item value="hidden-last" hidden>
            Hidden last item
          </SelectPanel.Item>
          <SelectPanel.Item value="unavailable-last" disabled>
            Unavailable last item
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    const first = screen.getByRole('option', {name: 'Apple'})
    const last = screen.getByRole('option', {name: items[count - 1].text})
    act(() => last.focus())

    await user.keyboard('{ArrowDown}')
    expect(first).toHaveFocus()
    expect(screen.getByRole('listbox').querySelectorAll('[role="option"][tabindex="0"]')).toHaveLength(1)
    await user.keyboard('{ArrowUp}')
    expect(last).toHaveFocus()
    expect(screen.getByRole('listbox').querySelectorAll('[role="option"][tabindex="0"]')).toHaveLength(1)

    await user.keyboard('{Home}{Home}')
    expect(first).toHaveFocus()
    await user.keyboard('{End}{End}')
    expect(last).toHaveFocus()
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('does not close a single-selection panel unless close-on-select is enabled', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Picker defaultOpen onSubmit={onSubmit} />)
    await user.click(screen.getByRole('option', {name: 'Apple'}))
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('closes after single selection and restores trigger focus', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onOpenChange = vi.fn()
    render(<Picker closeOnSelect onSelectedChange={onSelectedChange} onOpenChange={onOpenChange} />)
    const trigger = screen.getByRole('button', {name: 'Choose fruit'})
    await user.click(trigger)
    await user.click(screen.getByRole('option', {name: 'Banana'}))
    expect(onSelectedChange).toHaveBeenLastCalledWith(['banana'])
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'selection')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('treats controlled selection changes as requests', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const {rerender} = render(
      <Picker defaultOpen selected={[]} onSelectedChange={onSelectedChange} selectionMode="multiple" />,
    )
    await user.click(screen.getByRole('option', {name: 'Apple'}))
    expect(onSelectedChange).toHaveBeenCalledWith(['apple'])
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'false')

    rerender(<Picker defaultOpen selected={['apple']} onSelectedChange={onSelectedChange} selectionMode="multiple" />)
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')
  })

  it('does not restore focus when a controlled owner rejects dismissal', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Picker open onOpenChange={onOpenChange} />)
    const input = screen.getByRole('textbox')
    await waitFor(() => expect(input).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false, 'escape')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(input).toHaveFocus()
  })

  it('does not select disabled items', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<Picker defaultOpen onSelectedChange={onSelectedChange} />)
    await user.click(screen.getByRole('option', {name: 'Cherry'}))
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps item ARIA state consistent with root selection and disabled behavior', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <SelectPanel.Root focusStrategy="roving" defaultSelected={['apple']} onSelectedChange={onSelectedChange}>
        <SelectPanel.List aria-label="Fruit">
          <SelectPanel.Item value="apple" aria-selected={false}>
            Apple
          </SelectPanel.Item>
          <SelectPanel.Item value="banana" disabled aria-disabled={false}>
            Banana
          </SelectPanel.Item>
          <SelectPanel.Item value="cherry" aria-disabled>
            Cherry
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveAttribute('aria-selected', 'true')
    for (const name of ['Banana', 'Cherry']) {
      const option = screen.getByRole('option', {name})
      expect(option).toHaveAttribute('aria-disabled', 'true')
      expect(option).toHaveAttribute('tabindex', '-1')
      await user.click(option)
    }
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('does not leave disabled options in the Tab order', async () => {
    const user = userEvent.setup()
    render(<Picker defaultOpen />)
    const input = screen.getByRole('textbox')
    await waitFor(() => expect(input).toHaveFocus())
    expect(screen.getByRole('option', {name: 'Cherry'})).toHaveAttribute('tabindex', '-1')
    await user.tab()
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', {name: 'Close'})).toHaveFocus()
    await user.tab({shift: true})
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus()
  })

  it('refreshes navigation when an existing option becomes enabled or disabled', async () => {
    const user = userEvent.setup()
    function DynamicOptions({disabled}: {disabled: boolean}) {
      return (
        <SelectPanel.Root focusStrategy="roving" selectionMode="multiple">
          <SelectPanel.SearchInput aria-label="Dynamic filter" />
          <SelectPanel.List aria-label="Dynamic options">
            <SelectPanel.Item value="apple" disabled={disabled}>
              Apple
            </SelectPanel.Item>
            <SelectPanel.Item value="banana">Banana</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Root>
      )
    }
    const {rerender} = render(<DynamicOptions disabled />)
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    const banana = screen.getByRole('option', {name: 'Banana'})
    expect(banana).toHaveFocus()

    rerender(<DynamicOptions disabled={false} />)
    const apple = screen.getByRole('option', {name: 'Apple'})
    await waitFor(() => expect(apple).toHaveAttribute('tabindex', '-1'))
    await user.keyboard('{ArrowUp}')
    expect(apple).toHaveFocus()

    rerender(<DynamicOptions disabled />)
    await waitFor(() => expect(banana).toHaveFocus())
    expect(apple).toHaveAttribute('tabindex', '-1')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    await user.tab({shift: true})
    expect(input).toHaveFocus()
    rerender(<DynamicOptions disabled={false} />)
    await waitFor(() => expect(apple).not.toHaveAttribute('aria-disabled', 'true'))
    await user.keyboard('{ArrowDown}')
    expect(apple).toHaveFocus()
    expect(banana).toHaveAttribute('tabindex', '-1')
  })

  it('repairs removed list focus without stealing focus from search or after an explicit blur', async () => {
    const user = userEvent.setup()
    function DynamicList({values}: {values: string[]}) {
      return (
        <SelectPanel.Root focusStrategy="roving">
          <SelectPanel.SearchInput aria-label="Filter" />
          <SelectPanel.List aria-label="Results">
            {values.map(value => (
              <SelectPanel.Item key={value} value={value}>
                {value}
              </SelectPanel.Item>
            ))}
          </SelectPanel.List>
        </SelectPanel.Root>
      )
    }
    const {rerender} = render(<DynamicList values={['Apple', 'Banana']} />)
    await user.click(screen.getByRole('option', {name: 'Banana'}))
    rerender(<DynamicList values={['Apple']} />)
    await waitFor(() => expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus())
    rerender(<DynamicList values={[]} />)
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())

    rerender(<DynamicList values={['Apple', 'Banana']} />)
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(screen.getByRole('option', {name: 'Banana'})).toHaveFocus()
    await user.click(screen.getByRole('textbox'))
    rerender(<DynamicList values={['Apple']} />)
    await waitFor(() => expect(screen.getByRole('option')).toHaveAttribute('tabindex', '0'))
    expect(screen.getByRole('textbox')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    // eslint-disable-next-line github/no-blur -- Tests losing focus before removal, rather than restoring focus from removal.
    act(() => screen.getByRole('option').blur())
    await waitFor(() => expect(document.body).toHaveFocus())
    rerender(<DynamicList values={[]} />)
    await waitFor(() => expect(document.body).toHaveFocus())
  })

  it('lets input and collection handlers cancel navigation', async () => {
    const user = userEvent.setup()
    const cancel = (event: React.KeyboardEvent) => event.preventDefault()
    render(
      <SelectPanel.Root focusStrategy="roving">
        <SelectPanel.SearchInput onKeyDown={cancel} />
        <SelectPanel.List aria-label="Results" onKeyDown={cancel}>
          <SelectPanel.Item value="apple">Apple</SelectPanel.Item>
          <SelectPanel.Item value="banana">Banana</SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('textbox')).toHaveFocus()
    await user.click(screen.getByRole('option', {name: 'Apple'}))
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus()
  })

  it('does not filter externally supplied results a second time', () => {
    render(<Picker defaultOpen filterValue="server-side query" />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('textbox')).toHaveValue('server-side query')
  })

  it('supports wrapped parts, custom labels, refs, and inline composition', async () => {
    const user = userEvent.setup()
    const inputRef = React.createRef<HTMLInputElement>()
    const listRef = React.createRef<HTMLUListElement>()
    const itemRef = React.createRef<HTMLLIElement>()
    const WrappedInput = () => <SelectPanel.SearchInput ref={inputRef} aria-label="Inline filter" />
    render(
      <SelectPanel.Root focusStrategy="roving" selectionMode="multiple">
        <WrappedInput />
        <SelectPanel.List id="custom-list" aria-label="Inline fruit" className="custom-list" ref={listRef}>
          <SelectPanel.Item value="apple" ref={itemRef} className="custom-item">
            Custom apple
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    expect(inputRef.current).toBe(screen.getByRole('textbox'))
    expect(inputRef.current).toHaveAttribute('aria-controls', 'custom-list')
    expect(listRef.current).toBe(screen.getByRole('listbox', {name: 'Inline fruit'}))
    expect(listRef.current).toHaveClass('custom-list')
    expect(itemRef.current).toBe(screen.getByRole('option', {name: 'Custom apple'}))
    expect(itemRef.current).toHaveClass('custom-item')
    await user.click(itemRef.current!)
    expect(itemRef.current).toHaveAttribute('aria-selected', 'true')
  })

  it('preserves row visual slots and accessible descriptions', () => {
    render(
      <SelectPanel.Root focusStrategy="roving">
        <SelectPanel.List aria-label="Books">
          <SelectPanel.Item value="book">
            {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item delegates these slots to ActionList.Item. */}
            <ActionList.LeadingVisual>
              <BookIcon />
            </ActionList.LeadingVisual>
            Book
            {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item delegates these slots to ActionList.Item. */}
            <ActionList.Description variant="block">Reference</ActionList.Description>
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    expect(screen.getByRole('option', {name: 'Book'})).toHaveAccessibleDescription('Reference')
    expect(screen.getByText('Reference')).toBeInTheDocument()
  })

  it('honors canceled item handlers for pointer and keyboard activation', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onSelect = vi.fn((event: React.MouseEvent | React.KeyboardEvent) => event.preventDefault())
    render(
      <SelectPanel.Root focusStrategy="roving" selectionMode="multiple" onSelectedChange={onSelectedChange}>
        <SelectPanel.SearchInput />
        <SelectPanel.List aria-label="Fruit">
          <SelectPanel.Item value="apple" onSelect={onSelect}>
            Apple
          </SelectPanel.Item>
        </SelectPanel.List>
      </SelectPanel.Root>,
    )
    await user.click(screen.getByRole('option'))
    await user.click(screen.getByRole('textbox'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledTimes(2)
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('merges a custom trigger ref and honors canceled trigger activation', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLButtonElement>()
    const onOpenChange = vi.fn()
    render(
      <SelectPanel.Root focusStrategy="roving" onOpenChange={onOpenChange}>
        <SelectPanel.Trigger
          ref={ref}
          onClick={event => event.preventDefault()}
          render={props => (
            <button {...props} type="button">
              Custom trigger
            </button>
          )}
        />
      </SelectPanel.Root>,
    )
    const trigger = screen.getByRole('button', {name: 'Custom trigger'})
    expect(ref.current).toBe(trigger)
    await user.click(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('links a trigger to a custom overlay id', async () => {
    const user = userEvent.setup()
    render(
      <SelectPanel.Root focusStrategy="roving">
        <SelectPanel.Trigger>Open custom panel</SelectPanel.Trigger>
        <SelectPanel.Overlay overlayProps={{id: 'custom-panel', 'aria-label': 'Custom panel'}}>
          <SelectPanel.CloseButton />
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    const trigger = screen.getByRole('button', {name: 'Open custom panel'})
    await user.click(trigger)
    expect(screen.getByRole('dialog', {name: 'Custom panel'})).toHaveAttribute('id', 'custom-panel')
    expect(trigger).toHaveAttribute('aria-controls', 'custom-panel')
  })

  it('uses FormControl labeling and descriptions without sharing the filter id or required state', async () => {
    const user = userEvent.setup()
    render(
      <FormControl id="fruit-field" required>
        <FormControl.Label>Fruit</FormControl.Label>
        <FormControl.Caption>Choose a favorite</FormControl.Caption>
        <SelectPanel.Root focusStrategy="roving">
          <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
          <SelectPanel.Overlay>
            <SelectPanel.Title as="h3">Pick fruit</SelectPanel.Title>
            <SelectPanel.SearchInput aria-label="Filter fruit" />
            <SelectPanel.List aria-label="Results">
              <SelectPanel.Item value="apple">Apple</SelectPanel.Item>
            </SelectPanel.List>
          </SelectPanel.Overlay>
        </SelectPanel.Root>
      </FormControl>,
    )
    const trigger = screen.getByLabelText(/^Fruit/)
    expect(trigger).toHaveAttribute('id', 'fruit-field')
    expect(trigger).toHaveAccessibleDescription('Choose a favorite')
    await user.click(trigger)
    const input = screen.getByRole('textbox', {name: 'Filter fruit'})
    expect(input).not.toHaveAttribute('id', trigger.id)
    expect(input).not.toHaveAttribute('required')
    expect(input).not.toHaveAccessibleDescription('Choose a favorite')
    expect(screen.getByRole('heading', {name: 'Pick fruit', level: 3})).toBeInTheDocument()
  })

  it('inherits FormControl disabled state and keeps inline heading levels configurable', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <FormControl disabled>
        <FormControl.Label>Fruit</FormControl.Label>
        <SelectPanel.Root focusStrategy="roving" onOpenChange={onOpenChange}>
          <SelectPanel.Trigger>Choose fruit</SelectPanel.Trigger>
          <SelectPanel.Title as="h3">Inline fruit</SelectPanel.Title>
        </SelectPanel.Root>
      </FormControl>,
    )
    const trigger = screen.getByLabelText(/^Fruit/)
    expect(trigger).toBeDisabled()
    await user.click(trigger)
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', {name: 'Inline fruit', level: 3})).toBeInTheDocument()
  })
})

function NestedPicker({
  showRow = true,
  onSelectedChange,
}: {
  showRow?: boolean
  onSelectedChange?: (values: SelectPanelValue[]) => void
}) {
  return (
    <BaseStyles>
      <SelectPanel.Root focusStrategy="roving" selectionMode="multiple" onSelectedChange={onSelectedChange}>
        <SelectPanel.Trigger>Open parent</SelectPanel.Trigger>
        <SelectPanel.Overlay>
          <SelectPanel.Content>
            <SelectPanel.Title>Parent picker</SelectPanel.Title>
            <SelectPanel.SearchInput aria-label="Parent filter" />
            <SelectPanel.List aria-label="Fruit actions">{showRow && <NestedItem />}</SelectPanel.List>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    </BaseStyles>
  )
}

function NestedItem() {
  const [open, setOpen] = React.useState(false)
  const itemRef = React.useRef<HTMLLIElement>(null)
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  return (
    <>
      <SelectPanel.Item
        ref={itemRef}
        value="apple"
        secondaryActions={[{label: 'Apple details', icon: BookIcon, onClick: () => setOpen(true)}]}
      >
        Apple
      </SelectPanel.Item>
      <SelectPanel.Root focusStrategy="roving" open={open} onOpenChange={setOpen}>
        <SelectPanel.Overlay anchorRef={itemRef} side="outside-right" focusTrapSettings={{initialFocusRef: titleRef}}>
          <SelectPanel.Content>
            <SelectPanel.Title ref={titleRef} tabIndex={-1}>
              Apple information
            </SelectPanel.Title>
            <p>Details are independent of selection.</p>
            <SelectPanel.CloseButton />
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    </>
  )
}

describe('SelectPanel nested layers', () => {
  it('opens nested details directly from the item shortcut and restores item focus', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<NestedPicker onSelectedChange={onSelectedChange} />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.keyboard('{ArrowDown}')
    const item = screen.getByRole('option', {name: 'Apple'})
    expect(item).toHaveFocus()
    await user.keyboard('{Control>}{Shift>}u{/Shift}{/Control}')
    const child = screen.getByRole('dialog', {name: 'Apple information'})
    await waitFor(() => expect(within(child).getByRole('heading', {name: 'Apple information'})).toHaveFocus())
    expect(onSelectedChange).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(item).toHaveFocus())
  })

  it('keeps selection and query intact and dismisses only the child on Escape', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<NestedPicker onSelectedChange={onSelectedChange} />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.type(screen.getByRole('textbox'), 'apple')
    const action = screen.getByTitle('Apple details')
    const item = screen.getByRole('option', {name: 'Apple'})
    await user.click(action)
    const child = screen.getByRole('dialog', {name: 'Apple information'})
    await waitFor(() => expect(within(child).getByRole('heading', {name: 'Apple information'})).toHaveFocus())
    expect(onSelectedChange).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', {name: 'Apple information'})).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', {name: 'Parent picker'})).toBeInTheDocument()
    expect(screen.getByRole('textbox', {name: 'Parent filter'})).toHaveValue('apple')
    await waitFor(() => expect(item).toHaveFocus())
  })

  describe('SelectPanel item secondary actions', () => {
    it('has no WCAG A/AA violations or focusable descendants in options with pointer actions', async () => {
      render(
        <BaseStyles>
          <SelectPanel.Root focusStrategy="roving">
            <SelectPanel.List aria-label="Repositories">
              <SelectPanel.Item
                value="primer"
                secondaryActions={[
                  {label: 'Details', icon: BookIcon, onClick: vi.fn()},
                  {label: 'Edit', icon: BookIcon, onClick: vi.fn()},
                ]}
              >
                Primer
              </SelectPanel.Item>
            </SelectPanel.List>
          </SelectPanel.Root>
        </BaseStyles>,
      )
      const option = screen.getByRole('option', {name: 'Primer'})
      expect(
        option.querySelectorAll('button, a[href], input, select, textarea, [tabindex], [contenteditable="true"]'),
      ).toHaveLength(0)
      const result = await axe.run(screen.getByRole('listbox'), {
        runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']},
      })
      expect(result.violations).toEqual([])
    })

    it('preserves trailing metadata and its visual-slot props alongside secondary actions', () => {
      render(
        <SelectPanel.Root focusStrategy="roving">
          <SelectPanel.List aria-label="Repositories">
            <SelectPanel.Item value="primer" secondaryActions={[{label: 'Details', icon: BookIcon, onClick: vi.fn()}]}>
              Primer
              {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item delegates these slots to ActionList.Item. */}
              <ActionList.TrailingVisual data-anatomy="Item.trailingVisual" className="metadata-slot">
                TypeScript
              </ActionList.TrailingVisual>
            </SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Root>,
      )
      const option = screen.getByRole('option', {name: 'Primer TypeScript'})
      const metadata = within(option).getByText('TypeScript')
      expect(metadata).toHaveAttribute('data-anatomy', 'Item.trailingVisual')
      expect(metadata).toHaveClass('metadata-slot')
      expect(metadata.querySelector('[data-component="SelectPanel.Item.SecondaryAction"]')).not.toBeNull()
      expect(option.querySelectorAll('button, [tabindex]')).toHaveLength(0)
    })

    it('preserves the native option height when adding pointer actions', () => {
      render(
        <BaseStyles>
          <SelectPanel.Root focusStrategy="roving">
            <SelectPanel.List aria-label="Fruit">
              <SelectPanel.Item
                value="apple"
                secondaryActions={[{label: 'Inspect Apple', icon: BookIcon, onClick: vi.fn()}]}
              >
                Apple
              </SelectPanel.Item>
              <SelectPanel.Item value="banana">Banana</SelectPanel.Item>
            </SelectPanel.List>
          </SelectPanel.Root>
        </BaseStyles>,
      )
      expect(screen.getByRole('option', {name: 'Apple'}).getBoundingClientRect().height).toBe(
        screen.getByRole('option', {name: 'Banana'}).getBoundingClientRect().height,
      )
    })

    function ActionPicker({
      actions = [{label: 'Inspect Apple', icon: BookIcon, onClick: vi.fn()}],
      onSelectedChange = vi.fn(),
      itemProps = {},
    }: {
      actions?: React.ComponentProps<typeof SelectPanel.Item>['secondaryActions']
      onSelectedChange?: (values: SelectPanelValue[]) => void
      itemProps?: Partial<React.ComponentProps<typeof SelectPanel.Item>>
    }) {
      return (
        <BaseStyles>
          <SelectPanel.Root
            focusStrategy="roving"
            selectionMode="multiple"
            closeOnSelect
            onSelectedChange={onSelectedChange}
          >
            <SelectPanel.Trigger>Open actions</SelectPanel.Trigger>
            <SelectPanel.Overlay>
              <SelectPanel.Title>Fruit actions</SelectPanel.Title>
              <SelectPanel.SearchInput aria-label="Filter actions" />
              <SelectPanel.List aria-label="Fruit">
                <SelectPanel.Item value="apple" secondaryActions={actions} {...itemProps}>
                  Apple
                  {/* eslint-disable-next-line primer-react/direct-slot-children -- SelectPanel.Item delegates these slots to ActionList.Item. */}
                  <ActionList.Description variant="block">A tasty fruit</ActionList.Description>
                </SelectPanel.Item>
                <SelectPanel.Item value="banana">Banana</SelectPanel.Item>
              </SelectPanel.List>
              <button type="button">After list</button>
            </SelectPanel.Overlay>
          </SelectPanel.Root>
        </BaseStyles>
      )
    }

    it.each(['metaKey', 'ctrlKey'])(
      'executes a sole action directly with %s and keeps selection intact',
      async modifier => {
        const user = userEvent.setup()
        const onAction = vi.fn()
        const onSelectedChange = vi.fn()
        render(
          <ActionPicker
            actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction}]}
            onSelectedChange={onSelectedChange}
          />,
        )
        await user.click(screen.getByRole('button', {name: 'Open actions'}))
        await user.keyboard('{ArrowDown}')
        const item = screen.getByRole('option', {name: 'Apple'})
        expect(item).toHaveAccessibleDescription(expect.stringContaining('A tasty fruit'))
        expect(item).toHaveAccessibleDescription(expect.stringContaining('Cmd/Ctrl+Shift+U'))
        expect(item).toHaveAttribute('aria-keyshortcuts', 'Meta+Shift+U Control+Shift+U')
        fireEvent.keyDown(item, {key: 'U', shiftKey: true, [modifier]: true})
        expect(onAction).toHaveBeenCalledOnce()
        expect(onSelectedChange).not.toHaveBeenCalled()
        expect(item).toHaveFocus()
        expect(screen.queryByRole('dialog', {name: 'Supplemental actions'})).not.toBeInTheDocument()
        expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
      },
    )

    it('keeps hidden pointer actions out of the tab order, name, and list navigation', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()
      const onSelectedChange = vi.fn()
      render(
        <ActionPicker
          actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction}]}
          onSelectedChange={onSelectedChange}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      await user.tab()
      const apple = screen.getByRole('option', {name: 'Apple'})
      const banana = screen.getByRole('option', {name: 'Banana'})
      const pointerAction = screen.getByTitle('Inspect Apple')
      expect(apple).toHaveFocus()
      expect(pointerAction).not.toHaveAttribute('tabindex')
      expect(pointerAction).toHaveAttribute('data-component', 'SelectPanel.Item.SecondaryAction')
      expect(pointerAction).toHaveAttribute('aria-hidden', 'true')
      expect(screen.queryByRole('button', {name: 'Inspect Apple'})).not.toBeInTheDocument()
      await user.keyboard('{ArrowRight}')
      expect(apple).toHaveFocus()
      await user.keyboard('{End}')
      expect(banana).toHaveFocus()
      expect(apple).toHaveAttribute('tabindex', '-1')
      expect(banana).toHaveAttribute('tabindex', '0')
      await user.tab()
      expect(screen.getByRole('button', {name: 'After list'})).toHaveFocus()
      await user.tab({shift: true})
      expect(banana).toHaveFocus()
      await user.click(pointerAction)
      expect(onAction).toHaveBeenCalledOnce()
      expect(apple).toHaveFocus()
      expect(onSelectedChange).not.toHaveBeenCalled()
      expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
    })

    it('opens supplemental actions for multiple actions and returns focus after activation', async () => {
      const user = userEvent.setup()
      const inspect = vi.fn()
      const edit = vi.fn()
      const onSelectedChange = vi.fn()
      render(
        <ActionPicker
          actions={[
            {label: 'Inspect Apple', icon: BookIcon, onClick: inspect},
            {label: 'Edit Apple', icon: BookIcon, onClick: edit},
          ]}
          onSelectedChange={onSelectedChange}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      await user.keyboard('{ArrowDown}{Control>}{Shift>}u{/Shift}{/Control}')
      const dialog = screen.getByRole('dialog', {name: 'Supplemental actions'})
      await waitFor(() => expect(within(dialog).getByRole('button', {name: 'Inspect Apple'})).toHaveFocus())
      const editButton = within(dialog).getByRole('button', {name: 'Edit Apple'})
      await user.click(editButton)
      expect(edit).toHaveBeenCalledOnce()
      expect(inspect).not.toHaveBeenCalled()
      expect(onSelectedChange).not.toHaveBeenCalled()
      expect(screen.queryByRole('dialog', {name: 'Supplemental actions'})).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
      await waitFor(() => expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus())
    })

    it('dismisses only supplemental actions on Escape and restores the item', async () => {
      const user = userEvent.setup()
      render(
        <ActionPicker
          actions={[
            {label: 'Inspect', icon: BookIcon, onClick: vi.fn()},
            {label: 'Edit', icon: BookIcon, onClick: vi.fn()},
          ]}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      await user.keyboard('{ArrowDown}{Meta>}{Shift>}u{/Shift}{/Meta}')
      const dialog = screen.getByRole('dialog', {name: 'Supplemental actions'})
      await waitFor(() => expect(within(dialog).getByRole('button', {name: 'Inspect'})).toHaveFocus())
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog', {name: 'Supplemental actions'})).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
      await waitFor(() => expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus())
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog', {name: 'Fruit actions'})).not.toBeInTheDocument()
    })

    it('focuses an enabled supplemental action and activates it by keyboard without selecting', async () => {
      const user = userEvent.setup()
      const disabledAction = vi.fn()
      const onAction = vi.fn()
      const onSelectedChange = vi.fn()
      render(
        <ActionPicker
          actions={[
            {label: 'Unavailable action', icon: BookIcon, onClick: disabledAction, disabled: true},
            {label: 'Inspect Apple', icon: BookIcon, onClick: onAction},
          ]}
          onSelectedChange={onSelectedChange}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      await user.keyboard('{ArrowDown}{Control>}{Shift>}u{/Shift}{/Control}')
      const dialog = screen.getByRole('dialog', {name: 'Supplemental actions'})
      expect(within(dialog).getByRole('button', {name: 'Unavailable action'})).toHaveAttribute('aria-disabled', 'true')
      await waitFor(() => expect(within(dialog).getByRole('button', {name: 'Inspect Apple'})).toHaveFocus())
      await user.keyboard('{Enter}')
      expect(onAction).toHaveBeenCalledOnce()
      expect(disabledAction).not.toHaveBeenCalled()
      expect(onSelectedChange).not.toHaveBeenCalled()
      expect(screen.queryByRole('dialog', {name: 'Supplemental actions'})).not.toBeInTheDocument()
      await waitFor(() => expect(screen.getByRole('option', {name: 'Apple'})).toHaveFocus())
    })

    it('dismisses only the supplemental dialog when clicking outside it', async () => {
      const user = userEvent.setup()
      render(
        <ActionPicker
          actions={[
            {label: 'Inspect', icon: BookIcon, onClick: vi.fn()},
            {label: 'Edit', icon: BookIcon, onClick: vi.fn()},
          ]}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      await user.keyboard('{ArrowDown}{Control>}{Shift>}u{/Shift}{/Control}')
      const dialog = screen.getByRole('dialog', {name: 'Supplemental actions'})
      await waitFor(() => expect(within(dialog).getByRole('button', {name: 'Inspect'})).toHaveFocus())
      await user.click(screen.getByRole('textbox', {name: 'Filter actions'}))
      expect(screen.queryByRole('dialog', {name: 'Supplemental actions'})).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
      await waitFor(() => expect(screen.getByRole('textbox', {name: 'Filter actions'})).toHaveFocus())
    })

    it('prevents keys on pointer-only buttons from selecting their item', async () => {
      const user = userEvent.setup()
      const onSelectedChange = vi.fn()
      render(<ActionPicker onSelectedChange={onSelectedChange} />)
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      const pointerAction = screen.getByTitle('Inspect Apple')
      fireEvent.keyDown(pointerAction, {key: 'Enter'})
      fireEvent.keyPress(pointerAction, {key: 'Enter', charCode: 13})
      expect(onSelectedChange).not.toHaveBeenCalled()
      expect(screen.getByRole('dialog', {name: 'Fruit actions'})).toBeInTheDocument()
    })

    it.each([{disabled: true}, {'aria-disabled': true}, {loading: true}, {inactiveText: 'Not available'}])(
      'does not activate secondary actions on unavailable items: %j',
      async itemProps => {
        const user = userEvent.setup()
        const onAction = vi.fn()
        render(
          <ActionPicker
            itemProps={itemProps}
            actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction}]}
          />,
        )
        await user.click(screen.getByRole('button', {name: 'Open actions'}))
        const item = screen.getAllByRole('option')[0]
        fireEvent.keyDown(item, {key: 'u', shiftKey: true, ctrlKey: true})
        const pointerAction = screen.queryByTitle('Inspect Apple')
        if (pointerAction) {
          expect(pointerAction).toHaveAttribute('data-disabled', 'true')
          fireEvent.click(pointerAction)
        }
        expect(onAction).not.toHaveBeenCalled()
        expect(item).not.toHaveAttribute('aria-keyshortcuts')
        if ('disabled' in itemProps || 'aria-disabled' in itemProps) {
          await user.keyboard('{ArrowDown}')
          expect(screen.getByRole('option', {name: 'Banana'})).toHaveFocus()
          expect(item).toHaveAttribute('tabindex', '-1')
        }
      },
    )

    it('respects disabled actions, consumer cancellation, modifiers, and repeat', async () => {
      const user = userEvent.setup()
      const onAction = vi.fn()
      const onKeyDown = vi.fn((event: React.KeyboardEvent) => event.preventDefault())
      const {rerender} = render(
        <ActionPicker
          itemProps={{onKeyDown}}
          actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction}]}
        />,
      )
      await user.click(screen.getByRole('button', {name: 'Open actions'}))
      const item = screen.getByRole('option', {name: 'Apple'})
      fireEvent.keyDown(item, {key: 'u', shiftKey: true, ctrlKey: true})
      expect(onKeyDown).toHaveBeenCalled()
      expect(onAction).not.toHaveBeenCalled()
      rerender(<ActionPicker actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction}]} />)
      fireEvent.keyDown(item, {key: 'u', shiftKey: true, ctrlKey: true, altKey: true})
      fireEvent.keyDown(item, {key: 'u', shiftKey: true, ctrlKey: true, repeat: true})
      fireEvent.keyDown(item, {key: 'u', ctrlKey: true})
      expect(onAction).not.toHaveBeenCalled()
      rerender(<ActionPicker actions={[{label: 'Inspect Apple', icon: BookIcon, onClick: onAction, disabled: true}]} />)
      fireEvent.keyDown(item, {key: 'u', shiftKey: true, ctrlKey: true})
      expect(screen.getByTitle('Inspect Apple')).toHaveAttribute('data-disabled', 'true')
      expect(onAction).not.toHaveBeenCalled()
    })
  })

  it('does not dismiss a parent when interacting inside its portaled child', async () => {
    const user = userEvent.setup()
    render(<NestedPicker />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.click(screen.getByTitle('Apple details'))
    await user.click(screen.getByText('Details are independent of selection.'))
    expect(screen.getByRole('dialog', {name: 'Parent picker'})).toBeInTheDocument()
    expect(screen.getByRole('dialog', {name: 'Apple information'})).toBeInTheDocument()
  })

  it('returns to the parent input if the invoking row is removed', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<NestedPicker />)
    await user.click(screen.getByRole('button', {name: 'Open parent'}))
    await user.click(screen.getByTitle('Apple details'))
    expect(screen.getByRole('dialog', {name: 'Apple information'})).toBeInTheDocument()
    rerender(<NestedPicker showRow={false} />)
    expect(screen.queryByRole('dialog', {name: 'Apple information'})).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('textbox', {name: 'Parent filter'})).toHaveFocus())
  })
})
