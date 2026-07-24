import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Select} from './Select'

describe('Select', () => {
  it('supports keyboard selection, forms, and composable parts', async () => {
    const user = userEvent.setup()
    const inputRef = React.createRef<HTMLInputElement>()
    render(
      <form>
        <Select name="branch" inputRef={inputRef}>
          <Select.Trigger data-testid="trigger">
            <Select.Value placeholder="Choose a branch" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List>
                  <Select.Item value="main">main</Select.Item>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select>
      </form>,
    )
    await user.click(screen.getByTestId('trigger'))
    await user.keyboard('{ArrowDown}{Enter}')
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
    expect(new FormData(screen.getByTestId('trigger').closest('form')!).get('branch')).toBe('main')
  })

  it('forwards refs for the trigger, value, popup, and item', async () => {
    const user = userEvent.setup()
    const triggerRef = React.createRef<HTMLButtonElement>()
    const valueRef = React.createRef<HTMLSpanElement>()
    const popupRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLElement>()
    render(
      <Select>
        <Select.Trigger ref={triggerRef}>
          <Select.Value ref={valueRef} placeholder="Choose a branch" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup ref={popupRef}>
              <Select.List>
                <Select.Item ref={itemRef} value="main">
                  main
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select>,
    )

    expect(triggerRef.current).toHaveAttribute('role', 'combobox')
    expect(valueRef.current).toHaveTextContent('Choose a branch')
    await user.click(triggerRef.current!)
    expect(popupRef.current).toContainElement(itemRef.current)
    expect(itemRef.current).toHaveAttribute('role', 'option')
    expect(popupRef.current).toHaveClass('bg-default', 'shadow-floating-sm')
  })
})
