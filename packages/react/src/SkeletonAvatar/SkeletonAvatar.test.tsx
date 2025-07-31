import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'

describe('SkeletonAvatar', () => {
  it('applies the given size', () => {
    const {container} = render(<SkeletonAvatar size={48} />)
    expect(container.firstChild).toHaveStyle('--avatarSize-regular: 48px;')
  })

  it('uses the default size when size is not provided', () => {
    const {container} = render(<SkeletonAvatar />)
    expect(container.firstChild).toHaveStyle(`--avatarSize-regular: ${DEFAULT_AVATAR_SIZE}px`)
  })

  it('renders as a square when square prop is true', () => {
    const {container} = render(<SkeletonAvatar square />)
    expect(container.firstChild).toHaveAttribute('data-square')
  })

  it('applies the given className', () => {
    const {container} = render(<SkeletonAvatar className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('spreads extra props on the outermost element', () => {
    const {container} = render(<SkeletonAvatar data-testid="avatar" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'avatar')
  })
})
