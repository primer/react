import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {AvatarStack} from '..'

const avatarComp = (
  <AvatarStack>
    <img src="https://avatars.githubusercontent.com/primer" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
    <img src="https://avatars.githubusercontent.com/primer" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
  </AvatarStack>
)

const rightAvatarComp = (
  <AvatarStack alignRight>
    <img src="https://avatars.githubusercontent.com/primer" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
    <img src="https://avatars.githubusercontent.com/primer" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt="" />
  </AvatarStack>
)

describe('AvatarStack', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <AvatarStack className={'test-class-name'}>
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>
    )
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('respects alignRight props', () => {
    const {container} = render(rightAvatarComp)
    expect(container.firstChild).toMatchSnapshot()
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
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    expect(container.querySelector('[tabindex="0"]')).not.toBeInTheDocument()
  })

  it('should support `style` prop on the outermost element', () => {
    const style = {backgroundColor: 'red'}
    const {container} = render(
      <AvatarStack style={style}>
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>,
    )
    expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)')
  })
})
