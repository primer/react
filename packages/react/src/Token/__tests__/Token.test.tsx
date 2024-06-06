import {render as HTMLRender, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Token from '../Token'
import {render, behavesAsComponent} from '../../utils/testing'
import axe from 'axe-core'
import type {TokenSizeKeys} from '../TokenBase'
import {tokenSizes} from '../TokenBase'
import {IssueLabelToken, AvatarToken} from '..'
import type {AvatarTokenProps} from '../AvatarToken'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testTokenComponent = (Component: React.ComponentType<React.PropsWithChildren<any>>) => {
  behavesAsComponent({Component: Token})

  it('renders a <span>', () => {
    expect(render(<Component text="token" />).type).toEqual('span')
  })

  it('renders a <button> or <a> when specified', () => {
    expect(render(<Component as="button" text="token" />).type).toEqual('button')
    expect(render(<Component as="a" text="token" />).type).toEqual('a')
  })

  it('renders with a remove button', () => {
    const onRemoveMock = jest.fn()
    expect(render(<Component text="token" onRemove={onRemoveMock} />)).toMatchSnapshot()
  })

  it('renders button inside the token when the token also has a remove button', () => {
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(<Component as="button" text="token" onRemove={onRemoveMock} />)

    expect(render(<Component as="button" text="token" onRemove={onRemoveMock} />).type).not.toEqual('button')
    expect(getByText('token').tagName.toLowerCase()).toEqual('button')
  })

  it('renders anchor inside the token when the token also has a remove button', () => {
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(<Component as="a" text="token" onRemove={onRemoveMock} />)

    expect(render(<Component as="a" text="token" onRemove={onRemoveMock} />).type).not.toEqual('a')
    expect(getByText('token').tagName.toLowerCase()).toEqual('a')
  })

  it('renders isSelected', () => {
    expect(render(<Component text="token" isSelected />)).toMatchSnapshot()
  })

  it('renders all sizes', () => {
    const onRemoveMock = jest.fn()
    const tokenSizeKeys = Object.keys(tokenSizes)

    for (const tokenSizeKey of tokenSizeKeys) {
      expect(
        render(<Component text="token" size={tokenSizeKey as TokenSizeKeys} onRemove={onRemoveMock} />),
      ).toMatchSnapshot()
    }
  })

  it('calls onRemove when the user clicks the remove button', async () => {
    const user = userEvent.setup()
    const onRemove = jest.fn()
    const {getByRole} = HTMLRender(<Component text="token" onRemove={onRemove} />)

    await user.click(getByRole('button'))

    expect(onRemove).toHaveBeenCalled()
  })

  it('calls onRemove when the user keys Backspace on a focused Token', () => {
    const onRemoveMock = jest.fn()
    const {getByText} = HTMLRender(<Component text="token" onRemove={onRemoveMock} />)
    const domNode = getByText('token')
    fireEvent.keyDown(domNode, {key: 'Backspace'})

    expect(onRemoveMock).toHaveBeenCalled()
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Component text="token" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })
}

describe('Token components', () => {
  describe('Token', () => {
    testTokenComponent(Token)

    it('renders with a leadingVisual', () => {
      expect(
        render(<Token text="token" leadingVisual={() => <div style={{backgroundColor: 'blue'}} />} />),
      ).toMatchSnapshot()
    })
  })

  describe('IssueLabelToken', () => {
    testTokenComponent(IssueLabelToken)

    it('renders default fill color', () => {
      const onRemoveMock = jest.fn()
      expect(render(<IssueLabelToken text="token" onRemove={onRemoveMock} />)).toMatchSnapshot()
    })

    it('renders custom fill color', () => {
      const onRemoveMock = jest.fn()
      expect(render(<IssueLabelToken text="token" fillColor="#0366d6" onRemove={onRemoveMock} />)).toMatchSnapshot()
    })
  })

  describe('AvatarToken', () => {
    const AvatarTokenWithDefaultAvatar = ({
      avatarSrc = 'https://avatars.githubusercontent.com/mperrotti',
      ...rest
    }: Omit<AvatarTokenProps, 'ref'>) => <AvatarToken avatarSrc={avatarSrc} {...rest} />

    testTokenComponent(AvatarTokenWithDefaultAvatar)
  })
})
