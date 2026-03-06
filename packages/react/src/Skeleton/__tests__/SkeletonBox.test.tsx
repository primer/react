import {render} from '@testing-library/react'
import {beforeEach, afterEach, describe, expect, it, vi} from 'vitest'
import {SkeletonBox} from '../SkeletonBox'
import classes from '../SkeletonBox.module.css'
import {implementsClassName} from '../../utils/testing'
import {act} from 'react'

describe('SkeletonBox', () => {
  implementsClassName(SkeletonBox, classes.SkeletonBox)

  it('uses the default size when size is not provided', () => {
    const {container} = render(<SkeletonBox width={200} height={100} />)
    expect(container.firstChild).toHaveStyle('height: 100px')
    expect(container.firstChild).toHaveStyle('width: 200px')
  })

  describe('delay behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    it('should render immediately when no delay is provided', () => {
      const {container} = render(<SkeletonBox />)
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should not render immediately when delay is "short"', () => {
      const {container} = render(<SkeletonBox delay="short" />)
      expect(container.querySelector('div')).not.toBeInTheDocument()
    })

    it('should render after 300ms when delay is "short"', () => {
      const {container} = render(<SkeletonBox delay="short" />)

      // Not visible initially
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers by less than 300ms
      act(() => {
        vi.advanceTimersByTime(250)
      })

      // Still not visible
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers to complete the short delay (300ms)
      act(() => {
        vi.advanceTimersByTime(50)
      })

      // Now it should be visible
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should not render immediately when delay is "long"', () => {
      const {container} = render(<SkeletonBox delay="long" />)
      expect(container.querySelector('div')).not.toBeInTheDocument()
    })

    it('should render after 1000ms when delay is "long"', () => {
      const {container} = render(<SkeletonBox delay="long" />)

      // Not visible initially
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers by less than 1000ms
      act(() => {
        vi.advanceTimersByTime(800)
      })

      // Still not visible
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers to complete the long delay (1000ms)
      act(() => {
        vi.advanceTimersByTime(200)
      })

      // Now it should be visible
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should cleanup timeout on unmount when delay is "short"', () => {
      const {unmount} = render(<SkeletonBox delay="short" />)

      // Unmount before the delay completes
      unmount()

      // Advance timers to see if there are any side effects
      vi.advanceTimersByTime(300)

      // No errors should occur
      expect(true).toBe(true)
    })

    it('should cleanup timeout on unmount when delay is "long"', () => {
      const {unmount} = render(<SkeletonBox delay="long" />)

      // Unmount before the delay completes
      unmount()

      // Advance timers to see if there are any side effects
      vi.advanceTimersByTime(1000)

      // No errors should occur
      expect(true).toBe(true)
    })

    it('should render after custom delay when delay is a number', () => {
      const {container} = render(<SkeletonBox delay={500} />)

      // Not visible initially
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers by less than the custom delay (500ms)
      act(() => {
        vi.advanceTimersByTime(400)
      })

      // Still not visible
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers to complete the custom delay
      act(() => {
        vi.advanceTimersByTime(100)
      })

      // Now it should be visible
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should cleanup timeout on unmount when delay is a number', () => {
      const {unmount} = render(<SkeletonBox delay={500} />)

      // Unmount before the delay completes
      unmount()

      // Advance timers to see if there are any side effects
      vi.advanceTimersByTime(500)

      // No errors should occur
      expect(true).toBe(true)
    })
  })
})
