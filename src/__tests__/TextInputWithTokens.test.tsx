import React from 'react'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup, fireEvent} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {TokenSizeKeys, tokenSizes} from '../Token/TokenBase'
import {IssueLabelToken} from '../Token'
import TextInputWithTokens, {TextInputWithTokensProps} from '../TextInputWithTokens'
expect.extend(toHaveNoViolations)

const mockTokens = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'two', id: 2},
  {text: 'three', id: 3},
  {text: 'four', id: 4},
  {text: 'five', id: 5},
  {text: 'six', id: 6},
  {text: 'seven', id: 7}
]

const LabelledTextInputWithTokens: React.FC<TextInputWithTokensProps> = ({onTokenRemove, tokens, ...rest}) => (
  <>
    {/* eslint-disable-next-line jsx-a11y/label-has-for */}
    <label htmlFor="tokenInput" id="tokenLabel">
      Tokens
    </label>
    <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} id="tokenInput" {...rest} />
  </>
)

describe('TextInputWithTokens', () => {
  it('renders without tokens', () => {
    const onRemoveMock = jest.fn()
    expect(render(<TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders as block layout', () => {
    const onRemoveMock = jest.fn()
    expect(render(<TextInputWithTokens block tokens={[]} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders with tokens', () => {
    const onRemoveMock = jest.fn()
    expect(render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders with tokens using a custom token component', () => {
    const onRemoveMock = jest.fn()
    expect(
      render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} tokenComponent={IssueLabelToken} />)
    ).toMatchSnapshot()
  })

  it('renders at a maximum height when specified', () => {
    const onRemoveMock = jest.fn()
    expect(
      render(<TextInputWithTokens maxHeight="20px" tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    ).toMatchSnapshot()
  })

  it('renders tokens on a single line when specified', () => {
    const onRemoveMock = jest.fn()
    expect(
      render(<TextInputWithTokens preventTokenWrapping tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    ).toMatchSnapshot()
  })

  it('renders tokens at the specified sizes', () => {
    const onRemoveMock = jest.fn()
    const tokenSizeKeys = Object.keys(tokenSizes)
    for (const tokenSizeKey of tokenSizeKeys) {
      expect(
        render(
          <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} size={tokenSizeKey as TokenSizeKeys} />
        )
      ).toMatchSnapshot()
    }
  })

  it('renders tokens without a remove button when specified', () => {
    const onRemoveMock = jest.fn()
    expect(
      render(<TextInputWithTokens hideTokenRemoveButtons tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    ).toMatchSnapshot()
  })

  it('focuses the previous token when keying ArrowLeft', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenIndex = mockTokens.length - 1
    const lastTokenNode = getByText(mockTokens[lastTokenIndex].text)

    expect(document.activeElement).not.toEqual(lastTokenNode)

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'ArrowLeft'})
    expect(document.activeElement?.id).toEqual(lastTokenNode.id)

    fireEvent.keyDown(lastTokenNode, {key: 'ArrowLeft'})
    expect(document.activeElement?.id).toEqual(getByText(mockTokens[lastTokenIndex - 1].text).id)
  })

  it('focuses the next token when keying ArrowRight', () => {
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getByText(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'ArrowRight'})

    expect(document.activeElement?.id).toEqual(getByText(mockTokens[5].text).id)
  })

  it('focuses the input when keying ArrowLeft on the first token', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const firstTokenNode = getByText(mockTokens[0].text)

    expect(document.activeElement).not.toEqual(firstTokenNode)

    fireEvent.focus(firstTokenNode)
    fireEvent.keyDown(firstTokenNode, {key: 'ArrowLeft'})
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('focuses the input when keying ArrowRight on the last token', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenNode = getByText(mockTokens[mockTokens.length - 1].text)

    expect(document.activeElement).not.toEqual(lastTokenNode)

    fireEvent.focus(lastTokenNode)
    fireEvent.keyDown(lastTokenNode, {key: 'ArrowRight'})
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('focuses the input when keying Escape when focused on a token', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenNode = getByText(mockTokens[mockTokens.length - 1].text)

    expect(document.activeElement?.id).not.toEqual(inputNode.id)

    fireEvent.focus(lastTokenNode)
    expect(document.activeElement?.id).toEqual(lastTokenNode.id)
    fireEvent.keyUp(lastTokenNode, {key: 'Escape'})

    expect(document.activeElement?.id).not.toEqual(lastTokenNode.id)
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('focuses the first token when keying ArrowRight in the input', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const firstTokenNode = getByText(mockTokens[0].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'ArrowRight'})

    expect(document.activeElement?.id).not.toEqual(inputNode.id)
    expect(document.activeElement?.id).toEqual(firstTokenNode.id)
  })

  it('calls onTokenRemove on the last token when keying Backspace in an empty input', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})
    expect(onRemoveMock).toHaveBeenCalledWith(mockTokens[lastTokenIndex].id)
  })

  it("sets the input text to the last token's text when keying Backspace in an empty input", () => {
    const onRemoveMock = jest.fn()
    const {getByDisplayValue, getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})

    expect(getByDisplayValue(mockTokens[lastTokenIndex].text).id).toEqual(inputNode.id)
  })

  it('does not call onTokenRemove on the last token when keying Backspace in an input that has a value', () => {
    const onRemoveMock = jest.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} defaultValue="test" />
    )
    const inputNode = getByLabelText('Tokens')

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})
    expect(onRemoveMock).not.toHaveBeenCalled()
  })

  it('calls onTokenRemove on the focused token when keying Backspace and moves focus to the next token', () => {
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getByText(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    expect(onRemoveMock).toHaveBeenCalledWith(mockTokens[4].id)
  })

  it('moves focus to the next token when removing the first token', () => {
    jest.useFakeTimers()
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(
      <TextInputWithTokens tokens={[...mockTokens].slice(0, 2)} onTokenRemove={onRemoveMock} />
    )
    const tokenNode = getByText(mockTokens[0].text)

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    jest.runAllTimers()
    setTimeout(() => {
      expect(document.activeElement?.textContent).toBe(mockTokens[1].text)
    }, 0)

    jest.useRealTimers()
  })

  it('moves focus to the input when the last token is removed', () => {
    jest.useFakeTimers()
    const onRemoveMock = jest.fn()
    const {getByText, getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={[mockTokens[0]]} onTokenRemove={onRemoveMock} />
    )
    const tokenNode = getByText(mockTokens[0].text)
    const inputNode = getByLabelText('Tokens')

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    jest.runAllTimers()
    setTimeout(() => {
      expect(document.activeElement?.id).toBe(inputNode.id)
    }, 0)
    jest.useRealTimers()
  })

  it('calls onKeyDown', () => {
    const onRemoveMock = jest.fn()
    const onKeyDownMock = jest.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} onKeyDown={onKeyDownMock} />
    )
    const inputNode = getByLabelText('Tokens')

    expect(onKeyDownMock).not.toHaveBeenCalled()
    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'a'})
    expect(onKeyDownMock).toHaveBeenCalled()
  })

  it('should have no axe violations', async () => {
    const onRemoveMock = jest.fn()
    const {container} = HTMLRender(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
