import {render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import {SkeletonAvatar} from '../SkeletonAvatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import {implementsClassName} from '../utils/testing'
import classes from './SkeletonAvatar.module.css'
import skeletonBoxClasses from '../Skeleton/SkeletonBox.module.css'

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

  describe('when SkeletonBox styles load last', () => {
    let style: HTMLStyleElement
    let viewport: {
      width: number
      height: number
    }

    beforeEach(() => {
      viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      const rules = Array.from(document.styleSheets).flatMap(stylesheet => {
        return Array.from(stylesheet.cssRules).filter(rule => {
          return rule.cssText.includes(`.${skeletonBoxClasses.SkeletonBox}`)
        })
      })
      style = document.createElement('style')
      style.textContent = rules
        .map(rule => {
          return rule.cssText
        })
        .join('\n')
      document.head.append(style)
    })

    afterEach(async () => {
      style.remove()
      await page.viewport(viewport.width, viewport.height)
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
