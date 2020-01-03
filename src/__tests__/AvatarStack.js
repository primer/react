/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import AvatarStack from '../AvatarStack'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const avatarComp = (
  <AvatarStack>
    <img src="https://avatars.githubusercontent.com/primer" alt="" />
    <img src="https://avatars.githubusercontent.com/github" alt=""/>
    <img src="https://avatars.githubusercontent.com/primer" alt=""/>
    <img src="https://avatars.githubusercontent.com/github" alt=""/>
  </AvatarStack>
)

const rightAvatarComp = (
  <AvatarStack alignRight>
    <img src="https://avatars.githubusercontent.com/primer" alt=""/>
    <img src="https://avatars.githubusercontent.com/github" alt=""/>
    <img src="https://avatars.githubusercontent.com/primer" alt=""/>
    <img src="https://avatars.githubusercontent.com/github" alt=""/>
  </AvatarStack>
)

describe('Avatar', () => {
  it('implements common system props', () => {
    expect(AvatarStack).toImplementSystemProps(COMMON)
  })

  it("should have no axe violations", async () => {
    const {container} = HTMLRender(avatarComp)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(AvatarStack).toSetDefaultTheme()
  })

  it('matches snapshot', () => {
    expect(render(avatarComp)).toMatchSnapshot()
  })

  it('respects alignRight props', () => {
    expect(render(rightAvatarComp)).toMatchSnapshot()
  })
})
