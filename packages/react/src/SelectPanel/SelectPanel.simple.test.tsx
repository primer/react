import {describe, expect, it, vi, beforeEach} from 'vitest'
import {render, screen, waitFor} from '@testing-library/react'
import React from 'react'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'
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

function BasicSelectPanel(passthroughProps: Record<string, unknown>) {
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
        {...passthroughProps}
      />
    </ThemeProvider>
  )
}

globalThis.Element.prototype.scrollTo = vi.fn()

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
})