import React from 'react'
import {AvatarStack} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

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

describe('Avatar', () => {
  behavesAsComponent({
    Component: AvatarStack,
    toRender: () => avatarComp,
    options: {skipAs: true},
  })

  checkExports('AvatarStack', {
    default: AvatarStack,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(avatarComp)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects alignRight props', () => {
    expect(render(rightAvatarComp)).toMatchSnapshot()
  })
})
