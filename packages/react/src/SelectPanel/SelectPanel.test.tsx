import {render, screen} from '@testing-library/react'
import React from 'react'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'
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

  // labelledby for dialog
  // describedby for dialog
  // type to filter
  // arrow key to navigate
  // enter to select
})
