import {useState} from 'react'
import {render, fireEvent, screen, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {SelectPanel} from '../SelectPanel'

function Example() {
  const [open, setOpen] = useState(false)
  return (
    <SelectPanel.Root open={open} onOpenChange={setOpen}>
      <SelectPanel.Anchor>Open</SelectPanel.Anchor>
      <SelectPanel.Overlay>
        <SelectPanel.Title>Title</SelectPanel.Title>
        <SelectPanel.Input aria-label="Filter" />
        <SelectPanel.Panel tabId="my-tab">
          <SelectPanel.List aria-label="Results">
            <SelectPanel.Option id="opt-1">One</SelectPanel.Option>
          </SelectPanel.List>
        </SelectPanel.Panel>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

describe('SelectPanel foundation components', () => {
  it('only renders the overlay while open', () => {
    render(<Example />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('wires the dialog/combobox/listbox/tabpanel structure via context', () => {
    render(<Example />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('combobox')).toBeInTheDocument()
    expect(within(dialog).getByRole('listbox')).toBeInTheDocument()
    expect(within(dialog).getByRole('option')).toBeInTheDocument()
    const panel = within(dialog).getByRole('tabpanel')
    expect(panel).toHaveAttribute('aria-labelledby', 'my-tab')
  })

  it('throws when a sub-component is used outside Root', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<SelectPanel.Title>Orphan</SelectPanel.Title>)).toThrow(
      /must be used within <SelectPanel.Root>/,
    )
    spy.mockRestore()
  })
})
