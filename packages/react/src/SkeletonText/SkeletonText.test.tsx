import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SkeletonText} from '../SkeletonText'
import {implementsClassName} from '../utils/testing'
import classes from './SkeletonText.module.css'

describe('SkeletonText', () => {
  implementsClassName(SkeletonText, classes.SkeletonText)

  it('should support spreading extra props on the outermost element', () => {
    const {container} = render(<SkeletonText data-testid="skeleton-text" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'skeleton-text')
  })

  it('should render with the correct size', () => {
    const {container} = render(<SkeletonText size="display" />)
    expect(container.firstChild).toHaveAttribute('data-text-skeleton-size', 'display')
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

  it('renders multiline children as SkeletonBox instances', () => {
    const {container} = render(<SkeletonText lines={3} />)
    const children = Array.from(container.firstChild?.childNodes ?? [])

    expect(children).toHaveLength(3)

    for (const child of children) {
      expect(child).toHaveAttribute('data-component', 'SkeletonBox')
    }
  })
})
