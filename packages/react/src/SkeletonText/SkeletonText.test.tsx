import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import {SkeletonText} from '../SkeletonText'
import {implementsClassName} from '../utils/testing'
import classes from './SkeletonText.module.css'

describe('SkeletonText', () => {
  implementsClassName(SkeletonText, classes.SkeletonText)

  it('should support spreading extra props on the outermost element', () => {
    const {container} = render(<SkeletonText data-testid="skeleton-text" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'skeleton-text')
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

  it('should render the correct number of lines', () => {
    const {container} = render(<SkeletonText lines={3} />)
    // Assuming each line is rendered as a child element (e.g., <span> or <div>)
    // Adjust the selector as needed based on implementation
    expect(container.firstChild?.childNodes.length).toBe(3)
  })

  it('should apply maxWidth style', () => {
    const {container} = render(<SkeletonText maxWidth="200px" />)
    expect(container.firstChild).toHaveStyle({maxWidth: '200px'})
  })

  it('renders data-component="SkeletonText" for a single line', () => {
    const {container} = render(<SkeletonText />)
    expect(container.firstChild).toHaveAttribute('data-component', 'SkeletonText')
  })

  // update below to data-component="SkeletonText" in next major
  it('renders data-component="multilineContainer" for the multiline wrapper', () => {
    const {container} = render(<SkeletonText lines={3} />)
    expect(container.firstChild).toHaveAttribute('data-component', 'multilineContainer')
  })

  it('renders multiline children with stable component identifiers', () => {
    const {container} = render(<SkeletonText lines={3} />)
    const children = Array.from(container.firstChild?.childNodes ?? [])

    expect(children).toHaveLength(3)

    for (const child of children) {
      expect(child).toHaveAttribute('data-component', 'SkeletonText')
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
