import {render} from '@testing-library/react'
import React from 'react'
import {FeatureFlags} from '../../../FeatureFlags'
import {SkeletonText} from '../SkeletonText'

describe('SkeletonText', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <SkeletonText className={'test-class-name'} />
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
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })
})
