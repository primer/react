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

  it('counts characters, describes the limit, and enters the error state when exceeded', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="Bio" characterLimit={5} defaultValue="abc" />)

    const textarea = screen.getByRole('textbox', {name: 'Bio'})
    expect(
      screen.getByText('2 characters remaining', {selector: '[data-component="Textarea.CharacterCounter"]'}),
    ).toBeInTheDocument()
    expect(textarea).toHaveAccessibleDescription('You can enter up to 5 characters')
    expect(textarea).not.toHaveAttribute('aria-invalid')

    await user.type(textarea, 'def')
    expect(
      screen.getByText('1 character over', {selector: '[data-component="Textarea.CharacterCounter"]'}),
    ).toBeInTheDocument()
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAttribute('data-validation', 'error')
  })

  it('applies autoSize, block, height, and validation props', () => {
    render(<Textarea aria-label="Notes" autoSize block maxHeight={200} minHeight={100} validationStatus="success" />)

    const textarea = screen.getByRole('textbox', {name: 'Notes'})
    expect(textarea).toHaveAttribute('data-auto-size', 'true')
    expect(textarea).toHaveClass('[field-sizing:content]', 'w-full')
    expect(textarea).toHaveAttribute('data-validation', 'success')
    expect(textarea).toHaveStyle({maxHeight: '200px', minHeight: '100px'})
  })
})
