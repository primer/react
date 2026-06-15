import {fireEvent, render, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {useMenu} from './useMenu'

function Fixture({
  onAction,
  onClose,
}: {
  onAction?: NonNullable<Parameters<typeof useMenu>[0]>['onAction']
  onClose?: NonNullable<Parameters<typeof useMenu>[0]>['onClose']
}) {
  const {getMenuItemProps, getMenuProps, getMenuTriggerProps, getPopoverProps} = useMenu({
    defaultActiveValue: 'copy',
    menuId: 'message-actions-menu',
    onAction,
    onClose,
    triggerId: 'message-actions-trigger',
  })

  return (
    <>
      <button {...getMenuTriggerProps()} type="button">
        Show menu
      </button>
      <div
        {...getPopoverProps()}
        data-testid="popover"
        id="message-actions-popover"
        ref={element => element?.setAttribute('popover', '')}
      >
        <div {...getMenuProps()} aria-label="Message actions">
          <div {...getMenuItemProps({value: 'copy'})}>Copy link</div>
          <div {...getMenuItemProps({value: 'quote'})}>Quote reply</div>
          <div {...getMenuItemProps({disabled: true, value: 'delete'})}>Delete</div>
        </div>
      </div>
    </>
  )
}

describe('useMenu', () => {
  it('provides menu and menuitem roles', () => {
    const {getByRole, getAllByRole} = render(<Fixture />)

    expect(getByRole('menu', {hidden: true})).toHaveAccessibleName('Message actions')
    expect(getByRole('menu', {hidden: true})).toHaveAttribute('id', 'message-actions-menu')
    expect(getByRole('button', {name: 'Show menu'})).toHaveAttribute('aria-controls', 'message-actions-menu')
    expect(getByRole('button', {name: 'Show menu'})).toHaveAttribute('aria-expanded', 'false')
    expect(getByRole('button', {name: 'Show menu'})).toHaveAttribute('aria-haspopup', 'menu')
    expect(getByRole('button', {name: 'Show menu'})).toHaveAttribute('id', 'message-actions-trigger')
    expect(getAllByRole('menuitem', {hidden: true})).toHaveLength(3)
    expect(getByRole('menuitem', {hidden: true, name: 'Copy link'})).toHaveAttribute('tabIndex', '0')
    expect(getByRole('menuitem', {hidden: true, name: 'Quote reply'})).toHaveAttribute('tabIndex', '-1')
    expect(getByRole('menuitem', {hidden: true, name: 'Delete'})).toHaveAttribute('aria-disabled', 'true')
  })

  it('moves focus with arrow keys, home, end, and printable characters', async () => {
    const {getByRole, getByTestId} = render(<Fixture />)
    const popover = getByTestId('popover')
    const menu = getByRole('menu', {hidden: true})
    const copy = getByRole('menuitem', {hidden: true, name: 'Copy link'})
    const quote = getByRole('menuitem', {hidden: true, name: 'Quote reply'})
    const deleteItem = getByRole('menuitem', {hidden: true, name: 'Delete'})

    popover.showPopover()
    await waitFor(() => {
      expect(popover.matches(':popover-open')).toBe(true)
    })
    copy.focus()

    fireEvent.keyDown(menu, {key: 'ArrowDown'})
    expect(quote).toEqual(document.activeElement)

    fireEvent.keyDown(menu, {key: 'End'})
    expect(deleteItem).toEqual(document.activeElement)

    fireEvent.keyDown(menu, {key: 'Home'})
    expect(copy).toEqual(document.activeElement)

    fireEvent.keyDown(menu, {key: 'q'})
    expect(quote).toEqual(document.activeElement)

    fireEvent.keyDown(menu, {key: 'ArrowUp'})
    expect(copy).toEqual(document.activeElement)
  })

  it('activates enabled menu items with click, enter, and space', () => {
    const onAction = vi.fn()
    const {getByRole} = render(<Fixture onAction={onAction} />)
    const copy = getByRole('menuitem', {hidden: true, name: 'Copy link'})
    const quote = getByRole('menuitem', {hidden: true, name: 'Quote reply'})

    fireEvent.click(copy)
    fireEvent.keyDown(quote, {key: 'Enter'})
    fireEvent.keyDown(quote, {key: ' '})

    expect(onAction).toHaveBeenCalledTimes(3)
    expect(onAction.mock.calls.map(([details]) => details.value)).toEqual(['copy', 'quote', 'quote'])
  })

  it('does not activate disabled menu items', () => {
    const onAction = vi.fn()
    const {getByRole} = render(<Fixture onAction={onAction} />)
    const deleteItem = getByRole('menuitem', {hidden: true, name: 'Delete'})

    fireEvent.click(deleteItem)
    fireEvent.keyDown(deleteItem, {key: 'Enter'})

    expect(onAction).not.toHaveBeenCalled()
  })

  it('calls onClose for escape and tab', () => {
    const onClose = vi.fn()
    const {getByRole} = render(<Fixture onClose={onClose} />)
    const menu = getByRole('menu', {hidden: true})

    fireEvent.keyDown(menu, {key: 'Escape'})
    fireEvent.keyDown(menu, {key: 'Tab'})

    expect(onClose.mock.calls.map(([details]) => details.reason)).toEqual(['escape', 'tab'])
  })

  it('opens the popover and focuses the first item with ArrowDown from the trigger', async () => {
    const {getByRole, getByTestId} = render(<Fixture />)
    const button = getByRole('button', {name: 'Show menu'})
    const popover = getByTestId('popover')
    button.setAttribute('commandfor', 'message-actions-popover')

    expect(button).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(button, {key: 'ArrowDown'})

    await waitFor(() => {
      expect(popover.matches(':popover-open')).toBe(true)
      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(getByRole('menuitem', {hidden: true, name: 'Copy link'})).toEqual(document.activeElement)
    })
  })
})
