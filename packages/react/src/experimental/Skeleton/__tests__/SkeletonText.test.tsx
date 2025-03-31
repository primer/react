import {render} from '@testing-library/react'
import React from 'react'
import {describe, expect, it} from 'vitest'
import {SkeletonText} from '../SkeletonText'

describe('SkeletonText', () => {
  it('should support `className` on the outermost element', () => {
    expect(render(<SkeletonText className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })
})
