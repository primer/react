import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Textarea} from './Textarea'

describe('Textarea', () => {
  it('supports multiline keyboard input, forms, refs, and rest props', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLTextAreaElement>()
    render(
      <form>
        <Textarea ref={ref} name="body" data-testid="textarea" />
      </form>,
    )
    await user.type(screen.getByTestId('textarea'), 'First{enter}Second')
    expect(ref.current).toBe(screen.getByTestId('textarea'))
    expect(new FormData(screen.getByTestId('textarea').closest('form')!).get('body')).toBe('First\nSecond')
  })
})
