import React from 'react'
import {render, fireEvent, cleanup} from '@testing-library/react'
import {useTypeaheadFocus} from '../../hooks'
import {TYPEAHEAD_TIMEOUT} from '../../hooks/useTypeaheadFocus'

const Component = ({
  onSelect = () => null,
  hasInput = false,
  refNotAttached = false
}: {
  onSelect?: (event: React.KeyboardEvent<HTMLButtonElement>) => void
  hasInput?: boolean
  refNotAttached?: boolean
}) => {
  const containerRef = React.createRef<HTMLDivElement>()
  useTypeaheadFocus(true, containerRef) // hard coding open=true for test

  return (
    <>
      <div ref={refNotAttached ? undefined : containerRef} data-testid="container">
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        {hasInput && <input autoFocus type="text" placeholder="Filter options" />}
        <button onKeyDown={onSelect}>button 1</button>
        <button onKeyDown={onSelect}>Button 2</button>
        <button disabled>button 3 is disabled</button>
        <button onKeyDown={onSelect}>button 4</button>
        <button onKeyDown={onSelect}>third button</button>
        <span>not focusable</span>
      </div>
    </>
  )
}

describe('useTypeaheadFocus', () => {
  afterEach(cleanup)

  it('First element: when b is pressed, it should move focus the "b"utton 1', () => {
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('Not first element: when t is pressed, it should move focus the "t"hird button', () => {
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 't', code: 't'})
    expect(getByText('third button')).toEqual(document.activeElement)
  })

  it('Case insensitive: when B is pressed, it should move focus the "b"utton 1', () => {
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'B', code: 'B'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('Repeating letter: when b is pressed repeatedly, it should wrap through the buttons starting with "b", skipping the disabled button', () => {
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('Button 2')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 4')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)
  })

  it('Timeout: when presses b, waits and presses t, it should move focus the "t"hird button', async () => {
    jest.useFakeTimers()
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    // if we press t now, the query would be "bt",
    // and focus will stay wherever it is
    fireEvent.keyDown(container, {key: 't', code: 't'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    // but, if we simulate typeahead timeout, then type t
    // it should jump to the third button
    jest.advanceTimersByTime(TYPEAHEAD_TIMEOUT)
    fireEvent.keyDown(container, {key: 't', code: 't'})
    expect(getByText('third button')).toEqual(document.activeElement)
  })

  it('Space: when user is typing and presses Space, it should not select the option', () => {
    const mockFunction = jest.fn()
    const {getByTestId, getByText} = render(<Component onSelect={mockFunction} />)

    const container = getByTestId('container')
    fireEvent.keyDown(container, {key: 't', code: 't'})

    const thirdButton = getByText('third button')
    expect(thirdButton).toEqual(document.activeElement)
    fireEvent.keyDown(thirdButton, {key: ' ', code: 'Space'})
    expect(mockFunction).not.toHaveBeenCalled()
  })

  it('Space after timeout: when user is presses Space after waiting, it should select the option', () => {
    jest.useFakeTimers()
    const mockFunction = jest.fn()
    const {getByTestId, getByText} = render(<Component onSelect={mockFunction} />)

    const container = getByTestId('container')
    fireEvent.keyDown(container, {key: 't', code: 't'})

    const thirdButton = getByText('third button')
    expect(thirdButton).toEqual(document.activeElement)

    jest.advanceTimersByTime(TYPEAHEAD_TIMEOUT)
    fireEvent.keyDown(thirdButton, {key: ' ', code: 'Space'})
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Enter: when user is presses Enter, it should instantly select the option', () => {
    jest.useFakeTimers()
    const mockFunction = jest.fn()
    const {getByTestId, getByText} = render(<Component onSelect={mockFunction} />)

    const container = getByTestId('container')
    fireEvent.keyDown(container, {key: 't', code: 't'})

    const thirdButton = getByText('third button')
    expect(thirdButton).toEqual(document.activeElement)

    fireEvent.keyDown(thirdButton, {key: 'Enter', code: 'Enter'})
    expect(mockFunction).toHaveBeenCalled()
  })

  it('Long string: when user starts typing a longer string "button 4", focus should jump to closest match', async () => {
    jest.useFakeTimers()
    const mockFunction = jest.fn()
    const {getByTestId, getByText} = render(<Component onSelect={mockFunction} />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'u', code: 'u'})
    expect(getByText('button 1')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 't', code: 't'})
    fireEvent.keyDown(container, {key: 't', code: 't'})
    fireEvent.keyDown(container, {key: 'o', code: 'o'})
    fireEvent.keyDown(container, {key: 'n', code: 'n'})

    // pressing Space should be treated as part of query
    // and shouldn't select the option
    fireEvent.keyDown(container, {key: ' ', code: 'Space'})
    expect(mockFunction).not.toHaveBeenCalled()
    expect(getByText('button 1')).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: '4', code: '4'})
    // the query is now "button 4" and should move focus
    expect(getByText('button 4')).toEqual(document.activeElement)
  })

  it('Shortcuts: when a modifier is used, typeahead should not do anything', () => {
    const {getByTestId, getByText} = render(<Component />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {metaKey: true, key: 'b', code: 'b'})
    expect(getByText('button 1')).not.toEqual(document.activeElement)
  })

  it('TextInput: when an textinput has focus, typeahead should not do anything', async () => {
    const {getByTestId, getByPlaceholderText} = render(<Component hasInput={true} />)
    const container = getByTestId('container')

    const input = getByPlaceholderText('Filter options')
    expect(input).toEqual(document.activeElement)

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(input).toEqual(document.activeElement)
  })

  it('Missing ref: when a ref is not attached, typeahead should break the component', async () => {
    const {getByTestId, getByText} = render(<Component refNotAttached={true} />)
    const container = getByTestId('container')

    fireEvent.keyDown(container, {key: 'b', code: 'b'})
    expect(getByText('button 1')).not.toEqual(document.activeElement)
  })
})
