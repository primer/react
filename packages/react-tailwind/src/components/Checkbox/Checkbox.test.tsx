import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Checkbox} from './Checkbox'

describe('Checkbox', () => {
  it('supports keyboard input, form submission, refs, and root props', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const onCheckedChange = vi.fn()
    render(
      <form>
        <Checkbox ref={ref} name="updates" value="yes" onCheckedChange={onCheckedChange} data-testid="checkbox" />
      </form>,
    )
    const checkbox = screen.getByRole('checkbox')
    checkbox.focus()
    await user.keyboard(' ')
    expect(checkbox).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalled()
    expect(ref.current).toBe(screen.getByTestId('checkbox'))
    expect(new FormData(checkbox.closest('form')!)).toEqual(expect.objectContaining({}))
    expect(new FormData(checkbox.closest('form')!).get('updates')).toBe('yes')
  })

  it('draws a check when checked and a dash when indeterminate', () => {
    const {container, rerender} = render(<Checkbox aria-label="Notifications" checked={false} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()

    rerender(<Checkbox aria-label="Notifications" checked />)
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 12 9')

    rerender(<Checkbox aria-label="Notifications" checked={false} indeterminate />)
    expect(screen.getByRole('checkbox', {name: 'Notifications'})).toHaveAttribute('aria-checked', 'mixed')
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 10 2')
  })

  it('allows an enclosing change handler to stop a checkbox change from bubbling further', async () => {
    const user = userEvent.setup()
    const outerChange = vi.fn()
    const checkboxChange = vi.fn()
    const interceptChange = vi.fn((event: React.ChangeEvent<HTMLDivElement>) => event.stopPropagation())

    render(
      <div onChange={outerChange}>
        <div onChange={interceptChange}>
          <Checkbox aria-label="Notifications" onCheckedChange={checkboxChange} />
        </div>
      </div>,
    )

    await user.click(screen.getByRole('checkbox', {name: 'Notifications'}))
    expect(checkboxChange).toHaveBeenCalledOnce()
    expect(interceptChange).toHaveBeenCalledOnce()
    expect(outerChange).not.toHaveBeenCalled()
    expect(screen.getByRole('checkbox', {name: 'Notifications'})).toBeChecked()
  })
})
