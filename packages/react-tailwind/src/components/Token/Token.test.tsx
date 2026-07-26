import {fireEvent, render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {IssueLabelToken, Token} from './'
it('removes tokens with the remove button and keyboard', () => {
  const remove = vi.fn()
  render(<Token as="button" onRemove={remove} text="design" />)

  const token = screen.getByRole('button', {name: /design/})
  expect(token.querySelector('button')).not.toBeInTheDocument()
  expect(token.parentElement).toHaveAttribute('data-component', 'TokenBase')
  expect(token.parentElement).toHaveProperty('tagName', 'SPAN')
  fireEvent.keyDown(token, {key: 'Backspace'})
  expect(remove).toHaveBeenCalledTimes(1)
  const removeButton = token.parentElement?.querySelector<HTMLElement>('[data-component="Token.RemoveButton"]')
  if (!removeButton) throw new Error('Expected Token.RemoveButton')
  fireEvent.click(removeButton)
  expect(remove).toHaveBeenCalledTimes(2)
})
it('sets the custom issue-label color variables', () => {
  render(<IssueLabelToken data-testid="label" fillColor="#ffffff" text="bug" />)
  expect(screen.getByTestId('label').getAttribute('style')).toContain(
    '--issue-label-light-background: rgb(255 255 255)',
  )
})
