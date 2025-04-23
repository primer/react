import {render} from '@testing-library/react'
import React from 'react'
import {SkeletonText} from '../SkeletonText'

describe('SkeletonText', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<SkeletonText className={'test-class-name'} />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it.todo('should support spreading extra props on the outermost element')

  it.todo('size')

  it.todo('lines')

  it.todo('maxWidth')
})
