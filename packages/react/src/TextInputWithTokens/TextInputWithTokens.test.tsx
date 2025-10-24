import React from 'react'
import {render as HTMLRender, fireEvent, act, render} from '@testing-library/react'
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import type {TokenSizeKeys} from '../Token/TokenBase'
import {tokenSizes} from '../Token/TokenBase'
import {IssueLabelToken} from '../Token'
import type {TextInputWithTokensProps} from '../TextInputWithTokens'
import TextInputWithTokens from '../TextInputWithTokens'
import {MarkGithubIcon} from '@primer/octicons-react'

const mockTokens = [
  {text: 'zero', id: 0},
  {text: 'one', id: 1},
  {text: 'two', id: 2},
  {text: 'three', id: 3},
  {text: 'four', id: 4},
  {text: 'five', id: 5},
  {text: 'six', id: 6},
  {text: 'seven', id: 7},
]

const LabelledTextInputWithTokens: React.FC<React.PropsWithChildren<TextInputWithTokensProps>> = ({
  onTokenRemove,
  tokens,
  ...rest
}) => (
  <>
    <label htmlFor="tokenInput" id="tokenLabel">
      Tokens
    </label>
    <TextInputWithTokens {...rest} tokens={tokens} onTokenRemove={onTokenRemove} id="tokenInput" />
  </>
)

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('TextInputWithTokens', () => {
  it('should support `className` on the outermost element', () => {
    const onRemoveMock = vi.fn()
    const Element = () => <TextInputWithTokens className={'test-class-name'} tokens={[]} onTokenRemove={onRemoveMock} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders without tokens', () => {
    const onRemoveMock = vi.fn()
    expect(render(<TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders as block layout', () => {
    const onRemoveMock = vi.fn()
    expect(render(<TextInputWithTokens block tokens={[]} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders with tokens', () => {
    const onRemoveMock = vi.fn()
    expect(render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders with tokens using a custom token component', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} tokenComponent={IssueLabelToken} />),
    ).toMatchSnapshot()
  })

  it('renders at a maximum height when specified', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(<TextInputWithTokens maxHeight="20px" tokens={mockTokens} onTokenRemove={onRemoveMock} />),
    ).toMatchSnapshot()
  })

  it('renders tokens on a single line when specified', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(<TextInputWithTokens preventTokenWrapping tokens={mockTokens} onTokenRemove={onRemoveMock} />),
    ).toMatchSnapshot()
  })

  it('renders tokens at the specified sizes', () => {
    const onRemoveMock = vi.fn()
    const tokenSizeKeys = Object.keys(tokenSizes)
    for (const tokenSizeKey of tokenSizeKeys) {
      expect(
        render(
          <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} size={tokenSizeKey as TokenSizeKeys} />,
        ),
      ).toMatchSnapshot()
    }
  })

  it('renders tokens without a remove button when specified', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(<TextInputWithTokens hideTokenRemoveButtons tokens={mockTokens} onTokenRemove={onRemoveMock} />),
    ).toMatchSnapshot()
  })

  it('renders a truncated set of tokens', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />),
    ).toMatchSnapshot()
  })

  it('renders a leadingVisual and trailingVisual', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(
        <TextInputWithTokens
          leadingVisual={MarkGithubIcon}
          trailingVisual={MarkGithubIcon}
          tokens={mockTokens}
          onTokenRemove={onRemoveMock}
        />,
      ),
    ).toMatchSnapshot()
  })

  it('renders with a loading indicator', () => {
    const onRemoveMock = vi.fn()
    expect(
      render(
        <>
          <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} loading />

          <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} loading loaderPosition="leading" />

          <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} loading loaderPosition="trailing" />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            leadingVisual={MarkGithubIcon}
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            leadingVisual={MarkGithubIcon}
            loaderPosition="leading"
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            leadingVisual={MarkGithubIcon}
            loaderPosition="trailing"
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            trailingVisual={MarkGithubIcon}
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            trailingVisual={MarkGithubIcon}
            loaderPosition="leading"
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            trailingVisual={MarkGithubIcon}
            loaderPosition="trailing"
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            size="small"
            leadingVisual={MarkGithubIcon}
            trailingVisual={MarkGithubIcon}
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            leadingVisual={MarkGithubIcon}
            trailingVisual={MarkGithubIcon}
            loaderPosition="leading"
          />

          <TextInputWithTokens
            tokens={mockTokens}
            onTokenRemove={onRemoveMock}
            loading
            size="large"
            leadingVisual={MarkGithubIcon}
            trailingVisual={MarkGithubIcon}
            loaderPosition="trailing"
          />
        </>,
      ),
    ).toMatchSnapshot()
  })

  it('focuses the previous token when keying ArrowLeft', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
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
    const onRemoveMock = vi.fn()
    const {getByText} = HTMLRender(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getByText(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'ArrowRight'})

    expect(document.activeElement?.id).toEqual(getByText(mockTokens[5].text).id)
  })

  it('focuses the input when keying ArrowLeft on the first token', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
    )
    const inputNode = getByLabelText('Tokens')
    const firstTokenNode = getByText(mockTokens[0].text)

    expect(document.activeElement).not.toEqual(firstTokenNode)

    fireEvent.focus(firstTokenNode)
    fireEvent.keyDown(firstTokenNode, {key: 'ArrowLeft'})
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('focuses the input when keying ArrowRight on the last token', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenNode = getByText(mockTokens[mockTokens.length - 1].text)

    expect(document.activeElement).not.toEqual(lastTokenNode)

    fireEvent.focus(lastTokenNode)
    fireEvent.keyDown(lastTokenNode, {key: 'ArrowRight'})
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('focuses the input when keying Escape when focused on a token', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
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

  it('does not focus the input when clicking a token', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />,
    )
    const inputNode = getByLabelText('Tokens')
    const tokenNode = getByText(mockTokens[0].text)

    expect(document.activeElement).not.toEqual(inputNode.id)
    fireEvent.click(tokenNode)
    expect(document.activeElement?.id).not.toEqual(inputNode.id)
  })

  it('focuses the input when clicking somewhere in the component besides the tokens', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />,
    )
    const inputNode = getByLabelText('Tokens')
    const truncatedTokenCount = getByText('+6')

    expect(document.activeElement).not.toEqual(inputNode.id)
    fireEvent.click(truncatedTokenCount)
    expect(document.activeElement?.id).toEqual(inputNode.id)
  })

  it('shows all tokens when the input is focused and hides them when it is blurred (when visibleTokenCount is set)', () => {
    const onRemoveMock = vi.fn()
    const visibleTokenCount = 2
    const {getByLabelText, getByText} = HTMLRender(
      <>
        <LabelledTextInputWithTokens
          tokens={mockTokens}
          onTokenRemove={onRemoveMock}
          visibleTokenCount={visibleTokenCount}
        />
        <button type="button" id="focusableOutsideComponent">
          Focus me
        </button>
      </>,
    )
    const inputNode = getByLabelText('Tokens')
    const focusableOutsideComponentNode = getByText('Focus me')
    const allTokenLabels = mockTokens.map(token => token.text)
    const truncatedTokenCountNode = getByText('+6')

    act(() => {
      vi.runAllTimers()
    })

    fireEvent.focus(inputNode)

    setTimeout(() => {
      for (const tokenLabel of allTokenLabels) {
        const tokenNode = getByText(tokenLabel)
        expect(tokenNode).toBeDefined()
      }
    }, 0)

    act(() => {
      vi.runAllTimers()
      // onBlur isn't called on input unless we specifically fire the "blur" event
    })

    fireEvent.focus(focusableOutsideComponentNode)

    setTimeout(() => {
      expect(truncatedTokenCountNode).toBeDefined()

      for (const tokenLabel of allTokenLabels) {
        const tokenNode = getByText(tokenLabel)
        if (allTokenLabels.indexOf(tokenLabel) > visibleTokenCount) {
          expect(tokenNode).toBeDefined()
        } else {
          expect(tokenNode).not.toBeDefined()
        }
      }
    }, 0)
  })

  it('does not hide tokens when blurring the input to focus within the component (when visibleTokenCount is set)', () => {
    const onRemoveMock = vi.fn()
    const visibleTokenCount = 2
    const {getByLabelText, getByText} = HTMLRender(
      <>
        <LabelledTextInputWithTokens
          tokens={mockTokens}
          onTokenRemove={onRemoveMock}
          visibleTokenCount={visibleTokenCount}
        />
        <button type="button" id="focusableOutsideComponent">
          Focus me
        </button>
      </>,
    )
    const inputNode = getByLabelText('Tokens')
    const firstTokenNode = getByText(mockTokens[visibleTokenCount - 1].text)
    const allTokenLabels = mockTokens.map(token => token.text)
    const truncatedTokenCountNode = getByText('+6')

    fireEvent.focus(inputNode)
    fireEvent.focus(firstTokenNode)

    expect(truncatedTokenCountNode).toBeDefined()

    for (const tokenLabel of allTokenLabels) {
      const tokenNode = getByText(tokenLabel)
      expect(tokenNode).toBeDefined()
    }
  })

  it('focuses the first token when keying ArrowRight in the input', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText, getByText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
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
    const onRemoveMock = vi.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})
    expect(onRemoveMock).toHaveBeenCalledWith(mockTokens[lastTokenIndex].id)
  })

  it("sets the input text to the last token's text when keying Backspace in an empty input", () => {
    const onRemoveMock = vi.fn()
    const {getByDisplayValue, getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />,
    )
    const inputNode = getByLabelText('Tokens')
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})

    expect(getByDisplayValue(mockTokens[lastTokenIndex].text).id).toEqual(inputNode.id)
  })

  it('does not call onTokenRemove on the last token when keying Backspace in an input that has a value', () => {
    const onRemoveMock = vi.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} defaultValue="test" />,
    )
    const inputNode = getByLabelText('Tokens')

    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'Backspace'})
    expect(onRemoveMock).not.toHaveBeenCalled()
  })

  it('calls onTokenRemove on the focused token when keying Backspace and moves focus to the next token', () => {
    const onRemoveMock = vi.fn()
    const {getByText} = HTMLRender(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getByText(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    expect(onRemoveMock).toHaveBeenCalledWith(mockTokens[4].id)
  })

  it('moves focus to the next token when removing the first token', async () => {
    function TestComponent() {
      const [tokens, setTokens] = React.useState(mockTokens.slice(0, 2))
      return (
        <TextInputWithTokens
          tokens={tokens}
          onTokenRemove={id => {
            setTokens(
              tokens.filter(token => {
                return token.id !== id
              }),
            )
          }}
        />
      )
    }

    const {getByText} = HTMLRender(<TestComponent />)
    const tokenNode = getByText(mockTokens[0].text)

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    act(() => {
      vi.runAllTimers()
    })

    expect(document.activeElement?.textContent).toContain(mockTokens[1].text)
  })

  it('moves focus to the input when the last token is removed', () => {
    function TestComponent() {
      const [tokens, setTokens] = React.useState([mockTokens[0]])
      return (
        <LabelledTextInputWithTokens
          tokens={tokens}
          onTokenRemove={id => {
            setTokens(tokens => {
              return tokens.filter(token => {
                return token.id !== id
              })
            })
          }}
        />
      )
    }

    const {getByText, getByLabelText} = HTMLRender(<TestComponent />)
    const tokenNode = getByText(mockTokens[0].text)
    const inputNode = getByLabelText('Tokens')

    fireEvent.focus(tokenNode)
    fireEvent.keyDown(tokenNode, {key: 'Backspace'})

    act(() => {
      vi.runAllTimers()
    })

    expect(document.activeElement?.id).toBe(inputNode.id)
  })

  it('calls onKeyDown', () => {
    const onRemoveMock = vi.fn()
    const onKeyDownMock = vi.fn()
    const {getByLabelText} = HTMLRender(
      <LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} onKeyDown={onKeyDownMock} />,
    )
    const inputNode = getByLabelText('Tokens')

    expect(onKeyDownMock).not.toHaveBeenCalled()
    fireEvent.focus(inputNode)
    fireEvent.keyDown(inputNode, {key: 'a'})
    expect(onKeyDownMock).toHaveBeenCalled()
  })
})
