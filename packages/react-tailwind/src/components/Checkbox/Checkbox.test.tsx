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

  it('uses the dash indicator when indeterminate', () => {
    const {container} = render(<Checkbox indeterminate data-testid="checkbox" />)

    const indicator = container.querySelector('[data-indeterminate] > span')
    expect(indicator).toHaveClass('data-[indeterminate]:[&>.checkbox-check]:hidden')
    expect(indicator?.querySelector('.checkbox-check')).toBeInTheDocument()
    expect(indicator?.querySelector('.checkbox-dash')).toHaveClass('hidden')
  })
})
