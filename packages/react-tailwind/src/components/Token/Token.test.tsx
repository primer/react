import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {FormEvent} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {IssueLabelToken, Token, TokenBase} from './'
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

describe.each([
  ['Token', Token],
  ['IssueLabelToken', IssueLabelToken],
  ['TokenBase', TokenBase],
] as const)('%s button form behavior', (_name, Component) => {
  it.each([false, true])('defaults to button and supports submit and reset (removable: %s)', async removable => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
    const onRemove = removable ? () => {} : undefined
    const form = (type?: 'button' | 'reset' | 'submit') => (
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input defaultValue="original" />
        </label>
        <Component as="button" onRemove={onRemove} text="Design" type={type}>
          {Component === TokenBase ? 'Design' : undefined}
        </Component>
      </form>
    )
    const {rerender} = render(form())
    const button = screen.getByRole('button', {name: /Design/})
    expect(button).toHaveAttribute('type', 'button')
    await user.click(button)
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(form('submit'))
    expect(button).toHaveAttribute('type', 'submit')
    await user.click(button)
    expect(onSubmit).toHaveBeenCalledOnce()

    rerender(form('reset'))
    const input = screen.getByRole('textbox', {name: 'Name'})
    await user.clear(input)
    await user.type(input, 'changed')
    expect(button).toHaveAttribute('type', 'reset')
    await user.click(button)
    expect(input).toHaveValue('original')
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
