import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Radio} from './Radio'
import {RadioGroup} from '../RadioGroup'

describe('Radio', () => {
  it('is keyboard selectable, form-associated, and forwards root props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    render(
      <form>
        <RadioGroup name="choice">
          <Radio ref={ref} value="one" data-testid="one" />
          <Radio value="two" />
        </RadioGroup>
      </form>,
    )
    const [one, two] = screen.getAllByRole('radio')
    one.focus()
    await user.keyboard('{ArrowRight}')
    expect(two).toBeChecked()
    expect(new FormData(two.closest('form')!).get('choice')).toBe('two')
    expect(ref.current).toBe(screen.getByTestId('one'))
  })
})
