import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonBox} from '../SkeletonBox'
import classes from '../SkeletonBox.module.css'
import {implementsClassName} from '../../utils/testing'

describe('SkeletonBox', () => {
  implementsClassName(SkeletonBox, classes.SkeletonBox)

  it('uses the default size when size is not provided', () => {
    const {container} = render(<SkeletonBox width={200} height={100} />)
    expect(container.firstChild).toHaveStyle('height: 100px')
    expect(container.firstChild).toHaveStyle('width: 200px')
  })
})
