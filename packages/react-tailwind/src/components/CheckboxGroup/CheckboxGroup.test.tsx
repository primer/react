import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Checkbox} from '../Checkbox'
import {CheckboxGroup} from './CheckboxGroup'

describe('CheckboxGroup', () => {
  it('supports controlled values and forwards root props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLDivElement>()
    const onValueChange = vi.fn()
    render(
      <CheckboxGroup ref={ref} defaultValue={['one']} onValueChange={onValueChange} data-testid="group">
        <Checkbox name="one" value="one" />
        <Checkbox name="two" value="two" />
      </CheckboxGroup>,
    )
    await user.click(screen.getAllByRole('checkbox')[1])
    expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two'], expect.anything())
    expect(ref.current).toBe(screen.getByTestId('group'))
  })
})
