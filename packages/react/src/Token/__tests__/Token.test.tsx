import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi} from 'vitest'
import {render as HTMLRender, act} from '@testing-library/react'
import type React from 'react'
import Token from '../Token'
import type {TokenSizeKeys} from '../TokenBase'
import {tokenSizes} from '../constants'
import {IssueLabelToken} from '..'
import {implementsClassName} from '../../utils/testing'
import classes from '../Token.module.css'
import issueClasses from '../IssueLabelToken.module.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testTokenComponent = (Component: React.ComponentType<React.PropsWithChildren<any>>) => {
  it('renders with a remove button', async () => {
    const onRemoveMock = vi.fn()
    HTMLRender(<Component text="token" onRemove={onRemoveMock} />)
    await expect.element(page.getByRole('button')).toBeInTheDocument()
  })

  it('renders button inside the token when the token also has a remove button', () => {
    const onRemoveMock = vi.fn()
    HTMLRender(<Component as="button" text="token" onRemove={onRemoveMock} />)

    expect(
      page
        .getByRole('button', {name: /^token/})
        .element()
        .tagName.toLowerCase(),
    ).toEqual('button')
  })

  it('renders anchor inside the token when the token also has a remove button', () => {
    const onRemoveMock = vi.fn()
    HTMLRender(<Component as="a" text="token" onRemove={onRemoveMock} />)

    expect(
      page
        .getByText(/^token/)
        .element()
        .tagName.toLowerCase(),
    ).toEqual('a')
  })

  it('renders all sizes', () => {
    const onRemoveMock = vi.fn()
    const tokenSizeKeys = Object.keys(tokenSizes)

    for (const tokenSizeKey of tokenSizeKeys) {
      const {container} = HTMLRender(
        <Component text="token" size={tokenSizeKey as TokenSizeKeys} onRemove={onRemoveMock} />,
      )
      expect(container.firstChild).toBeInTheDocument()
    }
  })

  it('calls onRemove when the user clicks the remove button', async () => {
    const onRemove = vi.fn()
    HTMLRender(<Component text="token" onRemove={onRemove} />)

    await userEvent.click(page.getByRole('button'))

    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onRemove when the user keys Backspace on a focused Token', async () => {
    const onRemoveMock = vi.fn()
    HTMLRender(<Component text="token" onRemove={onRemoveMock} tabIndex={0} data-testid="token" />)
    const domNode = page.getByTestId('token')
    act(() => domNode.element().focus())
    await expect.element(domNode).toHaveFocus()
    await userEvent.keyboard('{Backspace}')

    expect(onRemoveMock).toHaveBeenCalled()
  })

  it('adds className to rendered component', () => {
    HTMLRender(<Component text="token" className="testing-class" />)
    const domNode = page.getByText('token')

    expect(domNode.element().parentElement).toHaveClass('testing-class')
  })

  it.each(['Backspace', 'Delete'])('allows onKeyDown to cancel removal with %s', key => {
    const onRemove = vi.fn()
    const onKeyDown = vi.fn((event: React.KeyboardEvent) => event.preventDefault())
    const {getByText} = HTMLRender(<Component text="token" onRemove={onRemove} onKeyDown={onKeyDown} />)

    fireEvent.keyDown(getByText('token'), {key})

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onRemove).not.toHaveBeenCalled()
  })

  it.each(['Backspace', 'Delete'])('removes with %s when onKeyDown does not cancel the event', key => {
    const onRemove = vi.fn()
    const onKeyDown = vi.fn()
    const {getByText} = HTMLRender(<Component text="token" onRemove={onRemove} onKeyDown={onKeyDown} />)

    fireEvent.keyDown(getByText('token'), {key})

    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('renders with correct data-cursor-is-interactive attribute for button element', () => {
    HTMLRender(<Component as="button" text="token" />)
    const domNode = page.getByText('token')

    expect(domNode.element().parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for anchor element', () => {
    HTMLRender(<Component as="a" text="token" />)
    const domNode = page.getByText('token')

    expect(domNode.element().parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for span with onClick', () => {
    const onClick = vi.fn()
    HTMLRender(<Component text="token" onClick={onClick} />)
    const domNode = page.getByText('token')

    expect(domNode.element().parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for non-interactive span', () => {
    HTMLRender(<Component text="token" />)
    const domNode = page.getByText('token')

    expect(domNode.element().parentElement).toHaveAttribute('data-cursor-is-interactive', 'false')
  })
}

describe('Token components', () => {
  describe('Token', () => {
    implementsClassName(Token, classes.Token)
    testTokenComponent(Token)

    it('renders with a leadingVisual', () => {
      const {container} = HTMLRender(
        <Token text="token" leadingVisual={() => <div style={{backgroundColor: 'blue'}} />} />,
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('IssueLabelToken', () => {
    implementsClassName(IssueLabelToken, issueClasses.IssueLabel)
    testTokenComponent(IssueLabelToken)

    it('renders default fill color', () => {
      const onRemoveMock = vi.fn()
      const {container} = HTMLRender(<IssueLabelToken text="token" onRemove={onRemoveMock} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders custom fill color', () => {
      const onRemoveMock = vi.fn()
      const {container} = HTMLRender(<IssueLabelToken text="token" fillColor="#0366d6" onRemove={onRemoveMock} />)
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
