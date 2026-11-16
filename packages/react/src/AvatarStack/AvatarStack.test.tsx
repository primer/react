import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import AvatarStack from '.'
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
    it('renders AvatarStack with data-component attribute', async () => {
      const {container} = render(avatarComp)
      const root = container.querySelector<HTMLElement>('[data-component="AvatarStack"]')
      await expect.element(root).toBeInTheDocument()
    })

    it('renders AvatarStack.Body with data-component attribute', async () => {
      const {container} = render(avatarComp)
      const body = container.querySelector<HTMLElement>('[data-component="AvatarStack.Body"]')
      await expect.element(body).toBeInTheDocument()
    })
  })

  it('respects alignRight props', async () => {
    const {container} = render(rightAvatarComp)
    const root = container.querySelector<HTMLElement>('[data-component="AvatarStack"]')
    await expect.element(root).toHaveAttribute('data-align-right', '')
  })

  it('should have a tabindex of 0 if there are no interactive children', async () => {
    const {container} = render(avatarComp)
    await expect.element(container.querySelector<HTMLElement>('[tabindex="0"]')).toBeInTheDocument()
  })

  it('should not have a tabindex if there are interactive children', async () => {
    const {container} = render(
      <AvatarStack>
        <button type="button">Click me</button>
      </AvatarStack>,
    )
    await expect.element(container.querySelector<HTMLElement>('[tabindex="0"]')).not.toBeInTheDocument()
  })

  it('should not have a tabindex if disableExpand is true', async () => {
    const {container} = render(
      <AvatarStack disableExpand>
        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    await expect.element(container.querySelector<HTMLElement>('[tabindex="0"]')).not.toBeInTheDocument()
  })

  it('should support `style` prop on the outermost element', async () => {
    const style = {backgroundColor: 'red'}
    const {container} = render(
      <AvatarStack style={style}>
        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="AvatarStack"]'))
      .toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
