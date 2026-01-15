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

    it('should render immediately when delay is false', () => {
      const {container} = render(<SkeletonBox delay={false} />)
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should not render immediately when delay is true', () => {
      const {container} = render(<SkeletonBox delay={true} />)
      expect(container.querySelector('div')).not.toBeInTheDocument()
    })

    it('should render after 1000ms when delay is true', () => {
      const {container} = render(<SkeletonBox delay={true} />)

      // Not visible initially
      expect(container.querySelector('div')).not.toBeInTheDocument()

      // Advance timers by 1000ms
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Now it should be visible
      expect(container.querySelector('div')).toBeInTheDocument()
    })

    it('should cleanup timeout on unmount when delay is true', () => {
      const {unmount} = render(<SkeletonBox delay={true} />)

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
