import {useState} from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SelectPanel} from '../ReadyMadeSelectPanel'

const items = [
  {id: 'main', text: 'main'},
  {id: 'develop', text: 'develop'},
  {id: 'feat', text: 'feature/tabs'},
]

function Example(props: {selectionVariant?: 'single' | 'multiple'}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  return (
    <SelectPanel
      open={open}
      onOpenChange={setOpen}
      title="Switch ref"
      anchor="Open"
      items={items}
      selectionVariant={props.selectionVariant}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    />
  )
}

describe('Ready-made SelectPanel', () => {
  it('composes Parts into a role=dialog popup with a listbox', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('filters items via the shared search input', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    fireEvent.change(screen.getByRole('combobox'), {target: {value: 'feat'}})
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByText('feature/tabs')).toBeInTheDocument()
  })

  it('single-select closes the panel after a choice', () => {
    render(<Example selectionVariant="single" />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    fireEvent.click(screen.getByText('develop'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    fireEvent.change(screen.getByRole('combobox'), {target: {value: 'zzz'}})
    expect(screen.getByText('No matches')).toBeInTheDocument()
  })
})
