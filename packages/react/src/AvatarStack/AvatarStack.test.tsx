import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {AvatarStack} from '..'
import {implementsClassName} from '../utils/testing'
import classes from './AvatarStack.module.css'

const avatarComp = (
  <AvatarStack>
    <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
    <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
  </AvatarStack>
)

const rightAvatarComp = (
  <AvatarStack alignRight>
    <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
    <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
  </AvatarStack>
)

describe('AvatarStack', () => {
  implementsClassName(AvatarStack, classes.AvatarStack)

  describe('AvatarStack data-component attributes', () => {
    it('renders AvatarStack with data-component attribute', () => {
      const {container} = render(avatarComp)
      const root = container.querySelector('[data-component="AvatarStack"]')
      expect(root).toBeInTheDocument()
    })

    it('renders AvatarStack.Body with data-component attribute', () => {
      const {container} = render(avatarComp)
      const body = container.querySelector('[data-component="AvatarStack.Body"]')
      expect(body).toBeInTheDocument()
    })
  })

  it('respects alignRight props', () => {
    const {container} = render(rightAvatarComp)
    const root = container.querySelector('[data-component="AvatarStack"]')
    expect(root).toHaveAttribute('data-align-right', '')
  })

  it('should have a tabindex of 0 if there are no interactive children', () => {
    const {container} = render(avatarComp)
    expect(container.querySelector('[tabindex="0"]')).toBeInTheDocument()
  })

  it('should not have a tabindex if there are interactive children', () => {
    const {container} = render(
      <AvatarStack>
        <button type="button">Click me</button>
      </AvatarStack>,
    )
    expect(container.querySelector('[tabindex="0"]')).not.toBeInTheDocument()
  })

  it('should not have a tabindex if disableExpand is true', () => {
    const {container} = render(
      <AvatarStack disableExpand>
        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    expect(container.querySelector('[tabindex="0"]')).not.toBeInTheDocument()
  })

  it('should support `style` prop on the outermost element', () => {
    const style = {backgroundColor: 'red'}
    const {container} = render(
      <AvatarStack style={style}>
        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
