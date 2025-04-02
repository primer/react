import {render} from '@testing-library/react'
import React from 'react'
import {SkeletonBox} from '../SkeletonBox'

describe('SkeletonBox', () => {
  it('should support `className` on the outermost element', () => {
    expect(render(<SkeletonBox className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })
})
