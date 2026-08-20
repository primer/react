import {useRef, useState, type Ref} from 'react'
import {render, fireEvent, screen, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useSelectPanel, type UseSelectPanelOptions} from '..'

function TestPanel(props: Partial<UseSelectPanelOptions> & {options?: {id: string; label: string}[]}) {
  const {
    options = [
      {id: 'opt-1', label: 'One'},
      {id: 'opt-2', label: 'Two'},
    ],
    ...rest
  } = props
  const [open, setOpen] = useState(rest.open ?? false)
  const [selected, setSelected] = useState<string | null>(null)
  const anchorRef = useRef<HTMLButtonElement | null>(null)

  const foundation = useSelectPanel({
    open,
    onOpenChange: (next, gesture) => {
      rest.onOpenChange?.(next, gesture)
      setOpen(next)
    },
    returnFocusRef: anchorRef,
    ...rest,
  })

  const {ref: anchorRefCb, ...anchorProps} = foundation.getAnchorProps()
  const {ref: overlayRefCb, ...overlayProps} = foundation.getOverlayProps()
  const titleProps = foundation.getTitleProps()
  const inputProps = foundation.getInputProps()
  const listProps = foundation.getListProps()

  return (
    <div>
      <button
        type="button"
        {...anchorProps}
        ref={node => {
          anchorRefCb(node)
          anchorRef.current = node
        }}
      >
        Open
      </button>
      {foundation.isOpen ? (
        <div {...overlayProps} ref={overlayRefCb as Ref<HTMLDivElement>}>
          <h2 {...titleProps}>Title</h2>
          <input {...inputProps} aria-label="Search" />
          <ul {...listProps}>
            {options.map(o => {
              const optionProps = foundation.getOptionProps({id: o.id, selected: selected === o.id})
              return (
                <li {...optionProps} key={o.id} onClick={() => setSelected(o.id)}>
                  {o.label}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

describe('useSelectPanel', () => {
  it('anchor wires aria-haspopup, aria-expanded and aria-controls', () => {
    render(<TestPanel />)
    const anchor = screen.getByRole('button', {name: 'Open'})
    expect(anchor).toHaveAttribute('aria-haspopup', 'dialog')
    expect(anchor).toHaveAttribute('aria-expanded', 'false')
    expect(anchor).toHaveAttribute('aria-controls')
  })

  it('opens on anchor click and renders a role="dialog" popup (not a listbox)', () => {
    render(<TestPanel />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // The popup is a dialog; the listbox is scoped inside it.
    expect(dialog).not.toHaveAttribute('role', 'listbox')
    expect(within(dialog).getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Open'})).toHaveAttribute('aria-expanded', 'true')
  })

  it('wires the dialog aria-labelledby to the title', () => {
    render(<TestPanel open />)
    const dialog = screen.getByRole('dialog')
    const title = screen.getByText('Title')
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('input is a combobox controlling the listbox', () => {
    render(<TestPanel open />)
    const input = screen.getByRole('combobox')
    const list = screen.getByRole('listbox')
    expect(input).toHaveAttribute('aria-controls', list.id)
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
  })

  it('ArrowDown sets aria-activedescendant to the first option', () => {
    render(<TestPanel open />)
    const input = screen.getByRole('combobox')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    fireEvent.keyDown(input, {key: 'ArrowDown'})
    expect(input).toHaveAttribute('aria-activedescendant', 'opt-1')
    fireEvent.keyDown(input, {key: 'ArrowDown'})
    expect(input).toHaveAttribute('aria-activedescendant', 'opt-2')
  })

  it('ArrowUp from the top wraps to the last option', () => {
    render(<TestPanel open />)
    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, {key: 'ArrowUp'})
    expect(input).toHaveAttribute('aria-activedescendant', 'opt-2')
  })

  it('Enter activates (clicks) the active option', () => {
    render(<TestPanel open />)
    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, {key: 'ArrowDown'})
    fireEvent.keyDown(input, {key: 'Enter'})
    expect(screen.getByText('One').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')
  })

  it('option exposes aria-selected', () => {
    render(<TestPanel open />)
    fireEvent.click(screen.getByText('Two'))
    expect(screen.getByText('Two').closest('[role="option"]')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('One').closest('[role="option"]')).toHaveAttribute('aria-selected', 'false')
  })

  it('Escape requests close', () => {
    const onOpenChange = vi.fn()
    render(<TestPanel open onOpenChange={onOpenChange} />)
    fireEvent.keyDown(document, {key: 'Escape'})
    expect(onOpenChange).toHaveBeenCalledWith(false, 'escape')
  })

  it('outside click requests close', () => {
    const onOpenChange = vi.fn()
    render(<TestPanel open onOpenChange={onOpenChange} />)
    fireEvent.mouseDown(document.body)
    expect(onOpenChange).toHaveBeenCalledWith(false, 'outside-click')
  })

  it('returns focus to the trigger when the panel closes', () => {
    render(<TestPanel />)
    const anchor = screen.getByRole('button', {name: 'Open'})
    anchor.focus()
    fireEvent.click(anchor)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.keyDown(document, {key: 'Escape'})
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(anchor).toHaveFocus()
  })

  it('resets aria-activedescendant when the panel closes and reopens', () => {
    render(<TestPanel />)
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    const input = screen.getByRole('combobox')
    fireEvent.keyDown(input, {key: 'ArrowDown'})
    expect(input).toHaveAttribute('aria-activedescendant', 'opt-1')

    fireEvent.keyDown(document, {key: 'Escape'})
    fireEvent.click(screen.getByRole('button', {name: 'Open'}))
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant')
  })

  it('warns in dev mode when no accessible name is provided', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    function NoName() {
      const foundation = useSelectPanel({open: true, onOpenChange: () => {}})
      const {ref: overlayRefCb, ...overlayProps} = foundation.getOverlayProps()
      return (
        <div {...overlayProps} ref={overlayRefCb as Ref<HTMLDivElement>}>
          content
        </div>
      )
    }

    render(<NoName />)
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No accessible name provided'))
    warnSpy.mockRestore()
  })
})
