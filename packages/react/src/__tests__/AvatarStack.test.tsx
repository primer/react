import React from 'react'
import {AvatarStack} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {FeatureFlags} from '../FeatureFlags'

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

  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <AvatarStack className={'test-class-name'}>
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
        <img src="https://avatars.githubusercontent.com/primer" alt="" />
        <img src="https://avatars.githubusercontent.com/github" alt="" />
      </AvatarStack>
    )
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_team: true,
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(HTMLRender(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
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
