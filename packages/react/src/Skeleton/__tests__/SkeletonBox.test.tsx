import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonBox} from '../SkeletonBox'

describe('SkeletonBox', () => {
  it('should support `className` on the outermost element', () => {
    expect(render(<SkeletonBox className={'test-class-name'} />).container.firstChild).toHaveClass('test-class-name')
  })

  it('uses the default size when size is not provided', () => {
    const {container} = render(<SkeletonBox width={200} height={100} />)
    expect(container.firstChild).toHaveStyle('height: 100px')
    expect(container.firstChild).toHaveStyle('width: 200px')
  })
})
