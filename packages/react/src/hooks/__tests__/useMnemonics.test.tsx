import {act, render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {describe, it, expect, vi} from 'vitest'
import React from 'react'
import {useMnemonics} from '../../hooks'

const Fixture = ({
  onSelect,
  hasInput = false,
  hasTextarea = false,
  refNotAttached = false,
}: {
  onSelect?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  hasInput?: boolean
  hasTextarea?: boolean
  refNotAttached?: boolean
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  useMnemonics(true, containerRef) // hard coding open=true for test

  return (
    <>
      <div ref={refNotAttached ? undefined : containerRef} data-testid="container">
        {hasInput && <input autoFocus type="text" placeholder="Filter options" />}
        {hasTextarea && <textarea autoFocus placeholder="Filter options" />}
        <button type="button" onKeyDown={onSelect}>
          button 1
        </button>
        <button type="button" onKeyDown={onSelect}>
          Button 2
        </button>
        <button type="button" onKeyDown={onSelect}>
          third button
        </button>
        <button type="button" disabled>
          fourth button is disabled
        </button>
        <button type="button" onKeyDown={onSelect}>
          button 5
        </button>
        <button type="button" onKeyDown={onSelect} aria-keyshortcuts="6 E">
          button 6
        </button>
        <span>not focusable</span>
      </div>
    </>
  )
}

describe('useTypeaheadFocus', () => {
  it('First element: when b is pressed, it should move focus the "b"utton 1', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).toHaveFocus()
  })

  it('Not first element: when t is pressed, it should move focus the "t"hird button', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('t')
    await expect.element(page.getByRole('button', {name: 'third button'})).toHaveFocus()
  })

  it('Case insensitive: when B is pressed, it should move focus the "b"utton 1', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('B')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).toHaveFocus()
  })

  it('Repeating letter: when b is pressed repeatedly, it should wrap through the buttons starting with "b", skipping the disabled button', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).toHaveFocus()

    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'Button 2', exact: true})).toHaveFocus()

    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'button 5', exact: true})).toHaveFocus()

    // should cycle back to start of the list
    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).toHaveFocus()
  })

  it('User defined aria-keyshortcuts: Should catch all shortcuts defined by user', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 1', exact: true}).element().focus())

    await userEvent.keyboard('6')
    await expect.element(page.getByRole('button', {name: 'button 6', exact: true})).toHaveFocus()

    // send focus elsewhere
    await userEvent.keyboard('t')
    await expect.element(page.getByRole('button', {name: 'third button'})).toHaveFocus()

    await userEvent.keyboard('e')
    await expect.element(page.getByRole('button', {name: 'button 6', exact: true})).toHaveFocus()
  })

  it('aria-keyshortcuts: it should add aria-keyshortcuts to focusable items', async () => {
    render(<Fixture />)

    await expect
      .element(page.getByRole('button', {name: 'button 1', exact: true}))
      .toHaveAttribute('aria-keyshortcuts', 'b')
    await expect
      .element(page.getByRole('button', {name: 'Button 2', exact: true}))
      .toHaveAttribute('aria-keyshortcuts', 'b')
    await expect.element(page.getByRole('button', {name: 'third button'})).toHaveAttribute('aria-keyshortcuts', 't')
    await expect
      .element(page.getByRole('button', {name: 'button 5', exact: true}))
      .toHaveAttribute('aria-keyshortcuts', 'b')

    // don't overwrite aria-keyshortcuts if it's already defined
    await expect
      .element(page.getByRole('button', {name: 'button 6', exact: true}))
      .toHaveAttribute('aria-keyshortcuts', '6 E')

    // not focusable items should not have aria-keyshortcuts
    await expect
      .element(page.getByRole('button', {name: 'fourth button is disabled'}))
      .not.toHaveAttribute('aria-keyshortcuts')
    await expect.element(page.getByText('not focusable')).not.toHaveAttribute('aria-keyshortcuts')
  })

  it('Space: when user presses Space, it should select the option', async () => {
    const mockFunction = vi.fn()
    render(<Fixture onSelect={mockFunction} />)

    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())
    await userEvent.keyboard('t')

    const thirdButton = page.getByRole('button', {name: 'third button'})
    await expect.element(thirdButton).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Enter: when user is presses Enter, it should select the option', async () => {
    const mockFunction = vi.fn()
    render(<Fixture onSelect={mockFunction} />)

    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())
    await userEvent.keyboard('t')

    const thirdButton = page.getByRole('button', {name: 'third button'})
    await expect.element(thirdButton).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Shortcuts: when a modifier is used, typeahead should not do anything', async () => {
    render(<Fixture />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('{Meta>}b{/Meta}')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).not.toHaveFocus()
  })

  it('TextInput: when an textinput has focus, typeahead should not do anything', async () => {
    render(<Fixture hasInput={true} />)

    const input = page.getByPlaceholder('Filter options')
    await expect.element(input).toHaveFocus()

    await userEvent.keyboard('b')
    await expect.element(input).toHaveFocus()
  })

  it('Text area: when a textarea has focus, typeahead should not do anything', async () => {
    render(<Fixture hasTextarea={true} />)

    const textArea = page.getByPlaceholder('Filter options')
    await expect.element(textArea).toHaveFocus()

    await userEvent.keyboard('b')
    await expect.element(textArea).toHaveFocus()
  })

  it('Missing ref: when a ref is not attached, typeahead should break the component', async () => {
    render(<Fixture refNotAttached={true} />)
    act(() => page.getByRole('button', {name: 'button 6', exact: true}).element().focus())

    await userEvent.keyboard('b')
    await expect.element(page.getByRole('button', {name: 'button 1', exact: true})).not.toHaveFocus()
  })
})
