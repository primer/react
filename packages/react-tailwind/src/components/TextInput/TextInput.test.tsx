import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {TextInput} from './TextInput'

describe('TextInput', () => {
  it('keeps native keyboard and form behavior while forwarding props and refs', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLInputElement>()
    render(
      <form>
        <TextInput ref={ref} name="title" data-testid="input" />
      </form>,
    )
    await user.type(screen.getByTestId('input'), 'Primer')
    expect(ref.current).toBe(screen.getByTestId('input'))
    expect(new FormData(screen.getByTestId('input').closest('form')!).get('title')).toBe('Primer')
  })
})
