import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {SkeletonText} from '../SkeletonText'

describe('SkeletonText', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<SkeletonText className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })
})
