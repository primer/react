import {render, fireEvent} from '@testing-library/react'
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
  it('First element: when b is pressed, it should move focus the "b"utton 1', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('Not first element: when t is pressed, it should move focus the "t"hird button', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 't', code: 't'})
    expect(getByText('third button')).toEqual(document.activeElement)
  })

  it('Case insensitive: when B is pressed, it should move focus the "b"utton 1', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'B', code: 'B'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('Repeating letter: when b is pressed repeatedly, it should wrap through the buttons starting with "b", skipping the disabled button', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('Button 2')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 5')).toEqual(document.activeElement)

    // should cycle back to start of the list
    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('User defined aria-keyshortcuts: Should catch all shortcuts defined by user', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: '6', code: '6'})
    expect(getByText('button 6')).toEqual(document.activeElement)

    // send focus elsewhere
    fireEvent.keyDown(container, {key: 't', code: 't'})
    expect(getByText('third button')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'e', code: 'e'})
    expect(getByText('button 6')).toEqual(document.activeElement)
  })

  it('aria-keyshortcuts: it should add aria-keyshortcuts to focusable items', () => {
    const {getByText} = render(<Fixture />)

    expect(getByText('button 1')).toHaveAttribute('aria-keyshortcuts', 'b')
    expect(getByText('Button 2')).toHaveAttribute('aria-keyshortcuts', 'b')
    expect(getByText('third button')).toHaveAttribute('aria-keyshortcuts', 't')
    expect(getByText('button 5')).toHaveAttribute('aria-keyshortcuts', 'b')

    // don't overwrite aria-keyshortcuts if it's already defined
    expect(getByText('button 6')).toHaveAttribute('aria-keyshortcuts', '6 E')

    // not focusable items should not have aria-keyshortcuts
    expect(getByText('fourth button is disabled')).not.toHaveAttribute('aria-keyshortcuts')
    expect(getByText('not focusable')).not.toHaveAttribute('aria-keyshortcuts')
  })

  it('Space: when user presses Space, it should select the option', () => {
    const mockFunction = vi.fn()
    const {getByTestId, getByText} = render(<Fixture onSelect={mockFunction} />)

    const container = getByTestId('container')
    fireEvent.keyDown(container, {key: 't', code: 't'})

    const thirdButton = getByText('third button')
    expect(thirdButton).toEqual(document.activeElement)
    fireEvent.keyDown(thirdButton, {key: ' ', code: 'Space'})
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Enter: when user is presses Enter, it should select the option', () => {
    vi.useFakeTimers()
    const mockFunction = vi.fn()
    const {getByTestId, getByText} = render(<Fixture onSelect={mockFunction} />)

    const container = getByTestId('container')
    fireEvent.keyDown(container, {key: 't', code: 't'})

    const thirdButton = getByText('third button')
    expect(thirdButton).toEqual(document.activeElement)

    fireEvent.keyDown(thirdButton, {key: 'Enter', code: 'Enter'})
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Shortcuts: when a modifier is used, typeahead should not do anything', () => {
    const {getByTestId, getByText} = render(<Fixture />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {metaKey: true, key: 'b', code: 'b'})
    expect(getByText('button 1')).not.toEqual(document.activeElement)
  })

  it('TextInput: when an textinput has focus, typeahead should not do anything', async () => {
    const {getByTestId, getByPlaceholderText} = render(<Fixture hasInput={true} />)
    const container = getByTestId('container')

    const input = getByPlaceholderText('Filter options')
    expect(input).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(input).toEqual(document.activeElement)
  })

  it('Text area: when a textarea has focus, typeahead should not do anything', async () => {
    const {getByTestId, getByPlaceholderText} = render(<Fixture hasTextarea={true} />)
    const container = getByTestId('container')

    const textArea = getByPlaceholderText('Filter options')
    expect(textArea).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(textArea).toEqual(document.activeElement)
  })

  it('Missing ref: when a ref is not attached, typeahead should break the component', async () => {
    const {getByTestId, getByText} = render(<Fixture refNotAttached={true} />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).not.toEqual(document.activeElement)
  })
})
