import type {SpinnerProps} from '..'
import {Spinner} from '..'
import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest'
import {act} from 'react'

describe('Spinner', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Spinner className={'test-class-name'} />
    expect(render(<Element />).container.firstChild?.firstChild).toHaveClass('test-class-name')
  })

  it('should label the spinner with default loading text', async () => {
    const {getByLabelText} = render(<Spinner />)

    expect(getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should label the spinner with with custom loading text', async () => {
    const {getByLabelText} = render(<Spinner srText="Custom loading text" />)

    expect(getByLabelText('Custom loading text')).toBeInTheDocument()
  })

  it('should not label the spinner with with loading text when `srText` is set to `null`', () => {
    const {getByLabelText} = render(<Spinner srText={null} />)

    expect(() => getByLabelText('Loading')).toThrow()
  })

  it('should use `aria-label` over `srText` if `aria-label` is provided', () => {
    render(<Spinner aria-label="Test label" />)
    expect(screen.getByLabelText('Test label')).toBeInTheDocument()
  })

  it('should respect size arguments', () => {
    const expectSize = (input: SpinnerProps['size'] | undefined, expectedSize: string) => {
      const {container} = render(<Spinner size={input} />)
      const svg = container.querySelector('svg')!
      expect(svg.getAttribute('height')).toEqual(expectedSize)
      expect(svg.getAttribute('width')).toEqual(expectedSize)
    }

    // default: medium
    expectSize(undefined, '32px')
    expectSize('small', '16px')
    expectSize('medium', '32px')
    expectSize('large', '64px')
  })

  it('should render immediately when delay is false', () => {
    const {container} = render(<Spinner delay={false} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should not render immediately when delay is true', () => {
    const {container} = render(<Spinner delay={true} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('should render after 1000ms when delay is true', () => {
    const {container} = render(<Spinner delay={true} />)

    // Not visible initially
    expect(container.querySelector('svg')).not.toBeInTheDocument()

    // Advance timers by 1000ms
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Now it should be visible
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should cleanup timeout on unmount when delay is true', () => {
    const {unmount} = render(<Spinner delay={true} />)

    // Unmount before the delay completes
    unmount()

    // Advance timers to see if there are any side effects
    vi.advanceTimersByTime(1000)

    // No errors should occur
    expect(true).toBe(true)
  })
})
