import {fireEvent, render, screen} from '@testing-library/react'
import {expect, it, vi} from 'vitest'
import {IssueLabelToken, Token} from './'
it('removes tokens with the remove button and keyboard', () => {
  const remove = vi.fn()
  render(<Token as="button" onRemove={remove} text="design" />)
  fireEvent.click(screen.getByRole('button', {name: 'Remove design'}))
  fireEvent.keyDown(screen.getByRole('button', {name: 'design'}), {key: 'Backspace'})
  expect(remove).toHaveBeenCalledTimes(2)
})
it('sets the custom issue-label color variables', () => {
  render(<IssueLabelToken data-testid="label" fillColor="#ffffff" text="bug" />)
  expect(screen.getByTestId('label').getAttribute('style')).toContain('--issue-label-color: #ffffff')
})
