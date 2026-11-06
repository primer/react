import React from 'react'
import {page, userEvent} from 'vitest/browser'
import {render, act} from '@testing-library/react'
import {describe, expect, it, vi, afterEach} from 'vitest'
import type {TokenSizeKeys} from '../Token/TokenBase'
import {tokenSizes} from '../Token/constants'
import {IssueLabelToken} from '../Token'
import type {TextInputWithTokensProps} from '../TextInputWithTokens'
import TextInputWithTokens from '../TextInputWithTokens'
import {MarkGithubIcon} from '@primer/octicons-react'
import {implementsClassName} from '../utils/testing'
import classes from './TextInputWithTokens.module.css'

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

function getToken(text: string) {
  const token = page.getByText(text, {exact: false}).element().closest('[data-component="TextInputWithTokens.Token"]')
  if (!token) throw new Error(`Could not find token for "${text}"`)
  return page.elementLocator(token)
}

const LabelledTextInputWithTokens: React.FC<React.PropsWithChildren<TextInputWithTokensProps>> = ({
  onTokenRemove,
  tokens,
  ...rest
}) => (
  <>
    <label htmlFor="tokenInput" id="tokenLabel">
      Tokens
    </label>
    <TextInputWithTokens tokens={tokens} onTokenRemove={onTokenRemove} id="tokenInput" {...rest} />
  </>
)

afterEach(() => {
  vi.useRealTimers()
})

describe('TextInputWithTokens', () => {
  implementsClassName(props => <TextInputWithTokens {...props} tokens={[]} />, classes.TextInputWrapper)

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

  it('announces selected token values when used as a combobox', () => {
    const onRemoveMock = vi.fn()
    render(
      <LabelledTextInputWithTokens
        role="combobox"
        tokens={[
          {text: 'css', id: 'css'},
          {text: 'react', id: 'react'},
        ]}
        onTokenRemove={onRemoveMock}
      />,
    )

    const combobox = page.getByRole('combobox', {name: 'Tokens'})
    const describedByIds = combobox.element().getAttribute('aria-describedby')

    expect(describedByIds).toBeTruthy()

    const describedByNodes = describedByIds
      ? describedByIds.split(' ').map(descriptionId => document.getElementById(descriptionId))
      : []

    expect(describedByNodes.some(node => node?.textContent === 'Selected: css, react')).toBe(true)
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
    vi.useFakeTimers()
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

  it('focuses the previous token when keying ArrowLeft', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const lastTokenIndex = mockTokens.length - 1
    const lastTokenNode = getToken(mockTokens[lastTokenIndex].text)

    await expect.element(lastTokenNode).not.toHaveFocus()

    act(() => inputNode.element().focus())
    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(lastTokenNode).toHaveFocus()

    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(getToken(mockTokens[lastTokenIndex - 1].text)).toHaveFocus()
  })

  it('focuses the next token when keying ArrowRight', async () => {
    const onRemoveMock = vi.fn()
    render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getToken(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    act(() => tokenNode.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(getToken(mockTokens[5].text)).toHaveFocus()
  })

  it('focuses the input when keying ArrowLeft on the first token', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const firstTokenNode = getToken(mockTokens[0].text)

    await expect.element(firstTokenNode).not.toHaveFocus()

    act(() => firstTokenNode.element().focus())
    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(inputNode).toHaveFocus()
  })

  it('focuses the input when keying ArrowRight on the last token', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const lastTokenNode = getToken(mockTokens[mockTokens.length - 1].text)

    await expect.element(lastTokenNode).not.toHaveFocus()

    act(() => lastTokenNode.element().focus())
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(inputNode).toHaveFocus()
  })

  it('focuses the input when keying Escape when focused on a token', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const lastTokenNode = getToken(mockTokens[mockTokens.length - 1].text)

    await expect.element(inputNode).not.toHaveFocus()

    act(() => lastTokenNode.element().focus())
    await expect.element(lastTokenNode).toHaveFocus()
    await userEvent.keyboard('{Escape}')

    await expect.element(lastTokenNode).not.toHaveFocus()
    await expect.element(inputNode).toHaveFocus()
  })

  it('does not focus the input when clicking a token', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const tokenNode = getToken(mockTokens[0].text)

    await expect.element(inputNode).not.toHaveFocus()
    await userEvent.click(tokenNode)
    await expect.element(inputNode).not.toHaveFocus()
  })

  it('focuses the input when clicking somewhere in the component besides the tokens', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const truncatedTokenCount = page.getByText('+6')

    await expect.element(inputNode).not.toHaveFocus()
    await userEvent.click(truncatedTokenCount)
    await expect.element(inputNode).toHaveFocus()
  })

  it('shows all tokens when the input is focused and hides them when it is blurred (when visibleTokenCount is set)', async () => {
    const onRemoveMock = vi.fn()
    const visibleTokenCount = 2
    render(
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
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const focusableOutsideComponentNode = page.getByText('Focus me')
    const allTokenLabels = mockTokens.map(token => token.text)
    const truncatedTokenCountNode = page.getByText('+6')

    await expect.element(truncatedTokenCountNode).toBeInTheDocument()
    act(() => inputNode.element().focus())

    for (const tokenLabel of allTokenLabels) {
      await expect.element(page.getByText(tokenLabel, {exact: false})).toBeInTheDocument()
    }
    await expect.element(truncatedTokenCountNode).not.toBeInTheDocument()

    act(() => focusableOutsideComponentNode.element().focus())

    await expect.element(truncatedTokenCountNode).toBeInTheDocument()
    for (const [index, tokenLabel] of allTokenLabels.entries()) {
      const tokenNode = page.getByText(tokenLabel, {exact: false})
      if (index < visibleTokenCount) {
        await expect.element(tokenNode).toBeInTheDocument()
      } else {
        await expect.element(tokenNode).not.toBeInTheDocument()
      }
    }
  })

  it('does not hide tokens when blurring the input to focus within the component (when visibleTokenCount is set)', async () => {
    const onRemoveMock = vi.fn()
    const visibleTokenCount = 2
    vi.useFakeTimers()
    render(
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
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const firstTokenNode = getToken(mockTokens[visibleTokenCount - 1].text)
    const allTokenLabels = mockTokens.map(token => token.text)
    const truncatedTokenCountNode = page.getByText('+6')

    act(() => inputNode.element().focus())
    act(() => firstTokenNode.element().focus())
    act(() => vi.advanceTimersByTime(0))

    await expect.element(truncatedTokenCountNode).not.toBeInTheDocument()

    for (const tokenLabel of allTokenLabels) {
      const tokenNode = page.getByText(tokenLabel, {exact: false})
      await expect.element(tokenNode).toBeInTheDocument()
    }
  })

  it('focuses the first token when keying ArrowRight in the input', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const firstTokenNode = getToken(mockTokens[0].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    act(() => inputNode.element().focus())
    await userEvent.keyboard('{ArrowRight}')

    await expect.element(inputNode).not.toHaveFocus()
    await expect.element(firstTokenNode).toHaveFocus()
  })

  it('calls onTokenRemove on the last token when keying Backspace in an empty input', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    act(() => inputNode.element().focus())
    await userEvent.keyboard('{Backspace}')
    expect(onRemoveMock).toHaveBeenCalledWith(mockTokens[lastTokenIndex].id)
  })

  it("sets the input text to the last token's text when keying Backspace in an empty input", async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})
    const lastTokenIndex = mockTokens.length - 1

    expect(onRemoveMock).not.toHaveBeenCalled()

    act(() => inputNode.element().focus())
    await userEvent.keyboard('{Backspace}')

    await expect.element(inputNode).toHaveValue(mockTokens[lastTokenIndex].text)
  })

  it('does not call onTokenRemove on the last token when keying Backspace in an input that has a value', async () => {
    const onRemoveMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} defaultValue="test" />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})

    act(() => inputNode.element().focus())
    await userEvent.keyboard('{Backspace}')
    expect(onRemoveMock).not.toHaveBeenCalled()
  })

  it('calls onTokenRemove on the focused token when keying Backspace and moves focus to the next token', async () => {
    const onRemoveMock = vi.fn()
    render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)
    const tokenNode = getToken(mockTokens[4].text)

    expect(onRemoveMock).not.toHaveBeenCalled()

    act(() => tokenNode.element().focus())
    await userEvent.keyboard('{Backspace}')

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

    render(<TestComponent />)
    const tokenNode = getToken(mockTokens[0].text)

    act(() => tokenNode.element().focus())
    await userEvent.keyboard('{Backspace}')

    await expect.element(getToken(mockTokens[1].text)).toHaveFocus()
  })

  it('moves focus to the input when the last token is removed', async () => {
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

    render(<TestComponent />)
    const tokenNode = getToken(mockTokens[0].text)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})

    act(() => tokenNode.element().focus())
    await userEvent.keyboard('{Backspace}')

    await expect.element(inputNode).toHaveFocus()
  })

  it('calls onKeyDown', async () => {
    const onRemoveMock = vi.fn()
    const onKeyDownMock = vi.fn()
    render(<LabelledTextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} onKeyDown={onKeyDownMock} />)
    const inputNode = page.getByRole('textbox', {name: 'Tokens'})

    expect(onKeyDownMock).not.toHaveBeenCalled()
    act(() => inputNode.element().focus())
    await userEvent.keyboard('a')
    expect(onKeyDownMock).toHaveBeenCalled()
  })

  describe('data-component attributes', () => {
    it('renders TextInputWithTokens with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(<TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} />)

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInputWithTokens"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.Input with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(<TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} />)

      await expect
        .element(container.querySelector<HTMLInputElement>('[data-component="TextInputWithTokens.Input"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.Token with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(<TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} />)

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInputWithTokens.Token"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.Icon with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(<TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} icon={MarkGithubIcon} />)

      await expect
        .element(container.querySelector<SVGElement>('[data-component="TextInputWithTokens.Icon"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.LeadingVisual with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(
        <TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} leadingVisual={MarkGithubIcon} />,
      )

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInputWithTokens.LeadingVisual"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.TrailingVisual with data-component attribute', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(
        <TextInputWithTokens tokens={[]} onTokenRemove={onRemoveMock} trailingVisual={MarkGithubIcon} />,
      )

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInputWithTokens.TrailingVisual"]'))
        .toBeInTheDocument()
    })

    it('renders TextInputWithTokens.OverflowCount with data-component attribute when tokens are truncated', async () => {
      const onRemoveMock = vi.fn()
      const {container} = render(
        <TextInputWithTokens tokens={mockTokens} onTokenRemove={onRemoveMock} visibleTokenCount={2} />,
      )

      await expect
        .element(container.querySelector<HTMLElement>('[data-component="TextInputWithTokens.OverflowCount"]'))
        .toBeInTheDocument()
    })
  })
})
