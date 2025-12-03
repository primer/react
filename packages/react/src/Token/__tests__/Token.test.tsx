import {describe, expect, it, vi} from 'vitest'
import {render as HTMLRender, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import Token from '../Token'
import type {TokenSizeKeys} from '../TokenBase'
import {tokenSizes} from '../TokenBase'
import {IssueLabelToken} from '..'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testTokenComponent = (Component: React.ComponentType<React.PropsWithChildren<any>>) => {
  it('renders with a remove button', () => {
    const onRemoveMock = vi.fn()
    const {container} = HTMLRender(<Component text="token" onRemove={onRemoveMock} />)
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('renders button inside the token when the token also has a remove button', () => {
    const onRemoveMock = vi.fn()
    const {getByText} = HTMLRender(<Component as="button" text="token" onRemove={onRemoveMock} />)

    expect(getByText('token').tagName.toLowerCase()).toEqual('button')
  })

  it('renders anchor inside the token when the token also has a remove button', () => {
    const onRemoveMock = vi.fn()
    const {getByText} = HTMLRender(<Component as="a" text="token" onRemove={onRemoveMock} />)

    expect(getByText('token').tagName.toLowerCase()).toEqual('a')
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
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const {getByRole} = HTMLRender(<Component text="token" onRemove={onRemove} />)

    await user.click(getByRole('button'))

    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onRemove when the user keys Backspace on a focused Token', () => {
    const onRemoveMock = vi.fn()
    const {getByText} = HTMLRender(<Component text="token" onRemove={onRemoveMock} />)
    const domNode = getByText('token')
    fireEvent.keyDown(domNode, {key: 'Backspace'})

    expect(onRemoveMock).toHaveBeenCalled()
  })

  it('adds className to rendered component', () => {
    const {getByText} = HTMLRender(<Component text="token" className="testing-class" />)
    const domNode = getByText('token')

    expect(domNode.parentElement).toHaveClass('testing-class')
  })

  it('renders with correct data-cursor-is-interactive attribute for button element', () => {
    const {getByText} = HTMLRender(<Component as="button" text="token" />)
    const domNode = getByText('token')

    expect(domNode.parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for anchor element', () => {
    const {getByText} = HTMLRender(<Component as="a" text="token" />)
    const domNode = getByText('token')

    expect(domNode.parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for span with onClick', () => {
    const onClick = vi.fn()
    const {getByText} = HTMLRender(<Component text="token" onClick={onClick} />)
    const domNode = getByText('token')

    expect(domNode.parentElement).toHaveAttribute('data-cursor-is-interactive', 'true')
  })

  it('renders with correct data-cursor-is-interactive attribute for non-interactive span', () => {
    const {getByText} = HTMLRender(<Component text="token" />)
    const domNode = getByText('token')

    expect(domNode.parentElement).toHaveAttribute('data-cursor-is-interactive', 'false')
  })
}

describe('Token components', () => {
  describe('Token', () => {
    testTokenComponent(Token)

    it('renders with a leadingVisual', () => {
      const {container} = HTMLRender(
        <Token text="token" leadingVisual={() => <div style={{backgroundColor: 'blue'}} />} />,
      )
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('IssueLabelToken', () => {
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
