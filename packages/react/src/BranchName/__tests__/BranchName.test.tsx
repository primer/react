import React from 'react'
import BranchName from '../BranchName'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {FeatureFlags} from '../../FeatureFlags'

describe('BranchName', () => {
  behavesAsComponent({
    Component: BranchName,
    options: {
      skipDisplayName: true,
    },
  })

  checkExports('BranchName', {
    default: BranchName,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BranchName />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('renders an <a> by default', () => {
    expect(render(<BranchName />).type).toEqual('a')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <BranchName className={'test-class-name'} />
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
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
})
