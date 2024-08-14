import {render, screen} from '@testing-library/react'
import React from 'react'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'
import type {ItemInput, GroupedListProps} from '../deprecated/ActionList/List'
import {userEvent} from '@testing-library/user-event'
import ThemeProvider from '../ThemeProvider'

const items: SelectPanelProps['items'] = [
  {
    text: 'item one',
  },
  {
    text: 'item two',
  },
  {
    text: 'item three',
  },
]

function BasicSelectPanel() {
  const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
  const [filter, setFilter] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const onSelectedChange = (selected: SelectPanelProps['items']) => {
    setSelected(selected)
  }

  return (
    <ThemeProvider>
      <SelectPanel
        title="test title"
        subtitle="test subtitle"
        items={items}
        placeholder="Select items"
        placeholderText="Filter items"
        selected={selected}
        onSelectedChange={onSelectedChange}
        filterValue={filter}
        onFilterChange={value => {
          setFilter(value)
        }}
        open={open}
        onOpenChange={isOpen => {
          setOpen(isOpen)
        }}
      />
    </ThemeProvider>
  )
}

global.Element.prototype.scrollTo = jest.fn()

describe('SelectPanel', () => {
  it('should render an anchor to open the select panel using `placeholder`', () => {
    render(<BasicSelectPanel />)

    expect(screen.getByText('Select items')).toBeInTheDocument()

    const trigger = screen.getByRole('button', {
      name: 'Select items',
    })
    expect(trigger).toHaveAttribute('aria-haspopup', 'true')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('should open the select panel when activating the trigger', async () => {
    const user = userEvent.setup()

    render(<BasicSelectPanel />)

    await user.click(screen.getByText('Select items'))

    // Verify that the button has `aria-expanded="true"` after opening
    const trigger = screen.getByRole('button', {
      name: 'Select items',
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    // Verify that the input and listbox are visible
    expect(screen.getByLabelText('Filter items')).toBeVisible()
    expect(screen.getByRole('listbox')).toBeVisible()

    expect(screen.getByLabelText('Filter items')).toHaveFocus()
  })

  it('should close the select panel when pressing Escape', async () => {
    const user = userEvent.setup()

    render(<BasicSelectPanel />)

    await user.click(screen.getByText('Select items'))
    await user.keyboard('{Escape}')

    expect(screen.getByRole('button', {name: 'Select items'})).toHaveFocus()
    expect(screen.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('should close the select panel when clicking outside of the select panel', async () => {
    const user = userEvent.setup()

    render(
      <>
        <button type="button">outer button</button>
        <BasicSelectPanel />
      </>,
    )

    await user.click(screen.getByText('Select items'))
    await user.click(screen.getByText('outer button'))

    expect(screen.getByRole('button', {name: 'Select items'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('should open a dialog that is labelled by `title` and described by `subtitle`', async () => {
    const user = userEvent.setup()

    render(<BasicSelectPanel />)

    await user.click(screen.getByText('Select items'))

    expect(
      screen.getByRole('dialog', {
        name: 'test title',
        description: 'test subtitle',
      }),
    ).toBeInTheDocument()
  })

  it('should call `onOpenChange` when opening and closing the dialog', async () => {
    const onOpenChange = jest.fn()

    function SelectPanelOpenChange() {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      return (
        <ThemeProvider>
          <button type="button">Outside of select panel</button>
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            items={items}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={(...args) => {
              onOpenChange(...args)
              setOpen(args[0])
            }}
          />
        </ThemeProvider>
      )
    }

    const user = userEvent.setup()

    render(<SelectPanelOpenChange />)

    // Open by click
    await user.click(screen.getByText('Select items'))
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

    // Close by click on anchor
    await user.click(screen.getByText('Select items'))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'anchor-click')

    // Open by button activation
    await user.type(screen.getByText('Select items'), '{Space}')
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')

    // Close by Escape key
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')

    // Close by click outside
    await user.click(screen.getByText('Select items'))
    await user.click(screen.getByText('Outside of select panel'))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'click-outside')
  })

  describe('selection', () => {
    it('should select an active option when activated', async () => {
      const user = userEvent.setup()

      render(<BasicSelectPanel />)

      await user.click(screen.getByText('Select items'))

      await user.type(document.activeElement!, '{Enter}')
      expect(
        screen.getByRole('option', {
          name: 'item one',
        }),
      ).toHaveAttribute('aria-selected', 'true')

      await user.type(document.activeElement!, '{Enter}')
      expect(
        screen.getByRole('option', {
          name: 'item one',
        }),
      ).toHaveAttribute('aria-selected', 'false')

      await user.click(screen.getByText('item one'))
      expect(
        screen.getByRole('option', {
          name: 'item one',
        }),
      ).toHaveAttribute('aria-selected', 'true')

      await user.click(screen.getByRole('option', {name: 'item one'}))
      expect(
        screen.getByRole('option', {
          name: 'item one',
        }),
      ).toHaveAttribute('aria-selected', 'false')
    })

    it('should support navigating through items with ArrowUp and ArrowDown', async () => {
      const user = userEvent.setup()

      render(<BasicSelectPanel />)

      await user.click(screen.getByText('Select items'))

      // First item by default should be the active element
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item one'}).id,
      )

      await user.type(document.activeElement!, '{ArrowDown}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item two'}).id,
      )

      await user.type(document.activeElement!, '{ArrowDown}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item three'}).id,
      )

      // At end of list, should wrap to the beginning
      await user.type(document.activeElement!, '{ArrowDown}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item one'}).id,
      )

      // At beginning of list, ArrowUp should wrap to the end
      await user.type(document.activeElement!, '{ArrowUp}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item three'}).id,
      )

      await user.type(document.activeElement!, '{ArrowUp}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item two'}).id,
      )

      await user.type(document.activeElement!, '{ArrowUp}')
      expect(document.activeElement!).toHaveAttribute(
        'aria-activedescendant',
        screen.getByRole('option', {name: 'item one'}).id,
      )
    })
  })

  describe('filtering', () => {
    function FilterableSelectPanel() {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      return (
        <ThemeProvider>
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            items={items.filter(item => item.text?.includes(filter))}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
          />
        </ThemeProvider>
      )
    }

    it('should filter the list of items when the user types into the input', async () => {
      const user = userEvent.setup()

      render(<FilterableSelectPanel />)

      await user.click(screen.getByText('Select items'))

      expect(screen.getAllByRole('option')).toHaveLength(3)

      await user.type(document.activeElement!, 'two')
      expect(screen.getAllByRole('option')).toHaveLength(1)
    })

    it.todo('should announce the number of results')

    it.todo('should announce when no results are available')
  })

  describe('with footer', () => {
    function SelectPanelWithFooter() {
      const [selected, setSelected] = React.useState<SelectPanelProps['items']>([])
      const [filter, setFilter] = React.useState('')
      const [open, setOpen] = React.useState(false)

      const onSelectedChange = (selected: SelectPanelProps['items']) => {
        setSelected(selected)
      }

      return (
        <ThemeProvider>
          <SelectPanel
            title="test title"
            subtitle="test subtitle"
            footer={<div>test footer</div>}
            items={items}
            placeholder="Select items"
            placeholderText="Filter items"
            selected={selected}
            onSelectedChange={onSelectedChange}
            filterValue={filter}
            onFilterChange={value => {
              setFilter(value)
            }}
            open={open}
            onOpenChange={isOpen => {
              setOpen(isOpen)
            }}
          />
        </ThemeProvider>
      )
    }

    it('should render the provided `footer` at the bottom of the dialog', async () => {
      const user = userEvent.setup()

      render(<SelectPanelWithFooter />)

      await user.click(screen.getByText('Select items'))
      expect(screen.getByText('test footer')).toBeVisible()
    })
  })

  const listOfItems: Array<ItemInput> = [
    {
      id: '1',
      key: 1,
      text: 'Item 1',
      groupId: '1',
    },
    {
      id: '2',
      key: 2,
      text: 'Item 2',
      groupId: '1',
    },
    {
      id: '3',
      key: 3,
      text: 'Item 3',
      groupId: '2',
    },
    {
      id: '4',
      key: 4,
      text: 'Item 4',
      groupId: '3',
    },
  ]

  const groupMetadata: GroupedListProps['groupMetadata'] = [
    {groupId: '1', header: {title: 'Group title 1'}},
    {groupId: '2', header: {title: 'Group title 2'}},
    {groupId: '3', header: {title: 'Group title 3'}},
  ]

  function SelectPanelWithGroups() {
    const [selectedItems, setSelectedItems] = React.useState<SelectPanelProps['items']>([])
    const [open, setOpen] = React.useState(false)
    const [filter, setFilter] = React.useState('')

    const onSelectedChange = (selections: ItemInput[]) => {
      setSelectedItems(selections)
    }

    return (
      <ThemeProvider>
        <SelectPanel
          title="test title"
          subtitle="test subtitle"
          groupMetadata={groupMetadata}
          placeholderText="Filter items"
          placeholder="Select items"
          items={listOfItems}
          selected={selectedItems}
          onSelectedChange={onSelectedChange}
          open={open}
          onOpenChange={isOpen => {
            setOpen(isOpen)
          }}
          filterValue={filter}
          onFilterChange={value => {
            setFilter(value)
          }}
        />
      </ThemeProvider>
    )
  }

  describe('with groups', () => {
    it('should render groups with items', async () => {
      const user = userEvent.setup()

      render(<SelectPanelWithGroups />)

      await user.click(screen.getByText('Select items'))
      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeVisible()
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

      // listbox should has 3 gorups and each have heading
      const headings = screen.getAllByRole('heading')

      // The first heading is the h1 and it is the title of the dialog
      expect(headings[1]).toHaveTextContent('Group title 1')
      expect(headings[2]).toHaveTextContent('Group title 2')
      expect(headings[3]).toHaveTextContent('Group title 3')

      expect(screen.getAllByRole('option')).toHaveLength(4)
    })
    it('should select items within groups', async () => {
      const user = userEvent.setup()

      render(<SelectPanelWithGroups />)

      await user.click(screen.getByText('Select items'))

      // Select the first item
      await user.click(screen.getByRole('option', {name: 'Item 1'}))
      expect(
        screen.getByRole('option', {
          name: 'Item 1',
        }),
      ).toHaveAttribute('aria-selected', 'true')

      await user.click(screen.getByRole('option', {name: 'Item 3'}))
      expect(
        screen.getByRole('option', {
          name: 'Item 3',
        }),
      ).toHaveAttribute('aria-selected', 'true')

      await user.click(screen.getByRole('option', {name: 'Item 4'}))
      expect(
        screen.getByRole('option', {
          name: 'Item 4',
        }),
      ).toHaveAttribute('aria-selected', 'true')
    })
  })
})
