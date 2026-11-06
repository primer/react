import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import {SkeletonText} from '../SkeletonText'
import {implementsClassName} from '../utils/testing'
import classes from './SkeletonText.module.css'

describe('SkeletonText', () => {
  implementsClassName(SkeletonText, classes.SkeletonText)

  it('should support spreading extra props on the outermost element', async () => {
    render(<SkeletonText data-testid="skeleton-text" />)
    await expect.element(page.getByTestId('skeleton-text')).toHaveAttribute('data-testid', 'skeleton-text')
  })

  it.each([
    {
      size: 'display',
      height: '40px',
      borderRadius: '6px',
    },
    {
      size: 'titleLarge',
      height: '32px',
      borderRadius: '6px',
    },
    {
      size: 'bodySmall',
      height: '12px',
      borderRadius: '3px',
    },
  ] as const)('renders the $size size and shape', async ({size, height, borderRadius}) => {
    render(<SkeletonText size={size} data-testid="skeleton-text" />)

    await expect.element(page.getByTestId('skeleton-text')).toHaveStyle({
      height,
      borderRadius,
    })
  })

  it('should render with the correct size attribute', async () => {
    render(<SkeletonText data-testid="skeleton-text" size="display" />)
    await expect.element(page.getByTestId('skeleton-text')).toHaveAttribute('data-text-skeleton-size', 'display')
  })

  it('should render the correct number of lines', () => {
    render(<SkeletonText data-testid="skeleton-text" lines={3} />)
    expect(page.getByTestId('skeleton-text').all()).toHaveLength(3)
  })

  it('should apply maxWidth style', async () => {
    render(<SkeletonText data-testid="skeleton-text" maxWidth="200px" />)
    await expect.element(page.getByTestId('skeleton-text')).toHaveStyle({maxWidth: '200px'})
  })

  it('renders data-component="SkeletonText" for a single line', async () => {
    render(<SkeletonText data-testid="skeleton-text" />)
    await expect.element(page.getByTestId('skeleton-text')).toHaveAttribute('data-component', 'SkeletonText')
  })

  // update below to data-component="SkeletonText" in next major
  it('renders data-component="multilineContainer" for the multiline wrapper', async () => {
    render(<SkeletonText data-testid="skeleton-text" lines={3} />)
    const wrapper = page.getByTestId('skeleton-text').first().element().parentElement
    if (!wrapper) {
      throw new Error('Expected multiline wrapper')
    }
    await expect.element(wrapper).toHaveAttribute('data-component', 'multilineContainer')
  })

  it('renders multiline children as SkeletonBox instances', async () => {
    render(<SkeletonText data-testid="skeleton-text" lines={3} />)
    const children = page.getByTestId('skeleton-text').all()

    expect(children).toHaveLength(3)

    for (const child of children) {
      await expect.element(child).toHaveAttribute('data-component', 'SkeletonText')
    }
  })

  it('preserves multiline sizing and loading appearance', async () => {
    const {container} = render(<SkeletonText lines={3} size="display" />)
    const lines = container.querySelectorAll<HTMLDivElement>('[data-component="SkeletonText"]')

    for (const line of lines) {
      await expect.element(line).toHaveStyle({
        height: '40px',
        borderRadius: '6px',
      })
      expect(getComputedStyle(line).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(line).animationName).not.toBe('none')
    }
  })

  it('preserves dimension overrides and inline styles', async () => {
    render(
      <SkeletonText
        height={32}
        width={200}
        style={{
          height: 24,
        }}
        data-testid="skeleton-text"
      />,
    )

    await expect.element(page.getByTestId('skeleton-text')).toHaveStyle({
      height: '24px',
      width: '200px',
    })
  })
})
