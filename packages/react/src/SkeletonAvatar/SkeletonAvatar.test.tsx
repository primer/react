import {render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {SkeletonBox} from '../Skeleton'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import {implementsClassName} from '../utils/testing'
import classes from './SkeletonAvatar.module.css'

describe('SkeletonAvatar', () => {
  implementsClassName(SkeletonAvatar, classes.SkeletonAvatar)

  it('renders data-component attribute', () => {
    const {container} = render(<SkeletonAvatar />)
    expect(container.firstChild).toHaveAttribute('data-component', 'SkeletonAvatar')
  })

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

  it.each([
    {
      square: false,
      borderRadius: '50%',
    },
    {
      square: true,
      borderRadius: '6px',
    },
  ])('preserves size and shape with square=$square', async ({square, borderRadius}) => {
    render(<SkeletonAvatar size={40} square={square} data-testid="avatar" />)

    await expect.element(page.getByTestId('avatar')).toHaveStyle({
      width: '40px',
      height: '40px',
      borderRadius,
      display: 'inline-block',
    })
  })

  it('preserves dimension overrides and inline styles', async () => {
    render(
      <SkeletonAvatar
        size={40}
        height={32}
        width={32}
        style={{
          height: 24,
        }}
        data-testid="avatar"
      />,
    )

    await expect.element(page.getByTestId('avatar')).toHaveStyle({
      width: '32px',
      height: '24px',
    })
  })

  it('shares the loading appearance without sharing box geometry', async () => {
    render(
      <>
        <SkeletonAvatar size={40} data-testid="avatar" />
        <SkeletonBox data-testid="box" />
      </>,
    )

    await expect.element(page.getByTestId('avatar')).toHaveStyle({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
    })
    await expect.element(page.getByTestId('box')).toHaveStyle({
      height: '16px',
      borderRadius: '3px',
      display: 'block',
    })

    const avatarStyles = getComputedStyle(page.getByTestId('avatar').element())
    const boxStyles = getComputedStyle(page.getByTestId('box').element())
    expect(avatarStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(avatarStyles.backgroundColor).toBe(boxStyles.backgroundColor)
    expect(avatarStyles.animationName).not.toBe('none')
    expect(avatarStyles.animationName).toBe(boxStyles.animationName)
    expect(avatarStyles.maskImage).not.toBe('none')
    expect(avatarStyles.maskImage).toBe(boxStyles.maskImage)
  })

  describe('responsive sizing', () => {
    let viewport: {
      width: number
      height: number
    }

    beforeEach(() => {
      viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    })

    afterEach(async () => {
      await page.viewport(viewport.width, viewport.height)
    })

    it.each([
      {
        width: 600,
        size: '24px',
      },
      {
        width: 1000,
        size: '40px',
      },
      {
        width: 1500,
        size: '64px',
      },
    ])('preserves responsive sizing at $width px', async ({width, size}) => {
      await page.viewport(width, 600)
      render(
        <SkeletonAvatar
          size={{
            narrow: 24,
            regular: 40,
            wide: 64,
          }}
          data-testid="avatar"
        />,
      )

      await expect.element(page.getByTestId('avatar')).toHaveStyle({
        width: size,
        height: size,
        borderRadius: '50%',
      })
    })
  })
})
