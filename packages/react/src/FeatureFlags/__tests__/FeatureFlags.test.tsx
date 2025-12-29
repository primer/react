import {describe, expect, it, beforeEach} from 'vitest'
import {render} from '@testing-library/react'
import {FeatureFlags, useFeatureFlag} from '../../FeatureFlags'

describe('FeatureFlags', () => {
  beforeEach(() => {
    // Clean up body attributes between tests
    document.body.removeAttribute('data-dialog-scroll-optimized')
  })

  it('should allow a component to check if a feature flag is enabled', () => {
    const calls: Array<boolean> = []

    render(
      <FeatureFlags
        flags={{
          enabledFlag: true,
          disabledFlag: false,
        }}
      >
        <TestFeatureFlag />
      </FeatureFlags>,
    )

    function TestFeatureFlag() {
      calls.push(useFeatureFlag('enabledFlag'))
      calls.push(useFeatureFlag('disabledFlag'))
      return null
    }

    expect(calls).toEqual([true, false])
  })

  it('should set flags that are not defined to `false`', () => {
    const calls: Array<boolean> = []

    render(
      <FeatureFlags flags={{}}>
        <TestFeatureFlag />
      </FeatureFlags>,
    )

    function TestFeatureFlag() {
      calls.push(useFeatureFlag('unknownFlag'))
      return null
    }

    expect(calls).toEqual([false])
  })

  describe('data-dialog-scroll-optimized attribute management', () => {
    it('should set data-dialog-scroll-optimized attribute when primer_react_css_has_selector_perf is enabled', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      const {unmount} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Content</div>
        </FeatureFlags>,
      )

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      unmount()

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })

    it('should not set data-dialog-scroll-optimized attribute when primer_react_css_has_selector_perf is disabled', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      const {unmount} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: false}}>
          <div>Content</div>
        </FeatureFlags>,
      )

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      unmount()

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })

    it('should handle ref counting correctly with multiple FeatureFlags providers', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      // Mount first provider
      const {unmount: unmount1} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Provider 1</div>
        </FeatureFlags>,
      )

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Mount second provider
      const {unmount: unmount2} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Provider 2</div>
        </FeatureFlags>,
      )

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Unmount first provider - attribute should still be present
      unmount1()
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Unmount second provider - attribute should be removed
      unmount2()
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })

    it('should handle nested providers with different flag values correctly', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      const {unmount} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Outer provider with flag enabled</div>
          <FeatureFlags flags={{primer_react_css_has_selector_perf: false}}>
            <div>Inner provider with flag disabled</div>
          </FeatureFlags>
        </FeatureFlags>,
      )

      // Outer provider sets the attribute, inner provider inherits but doesn't override
      // (inner provider flag is false, so it won't add to count)
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      unmount()

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })

    it('should handle nested providers where parent has flag disabled and child has flag enabled', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      const {unmount} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: false}}>
          <div>Outer provider with flag disabled</div>
          <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
            <div>Inner provider with flag enabled</div>
          </FeatureFlags>
        </FeatureFlags>,
      )

      // Inner provider enables the flag, so attribute should be set
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      unmount()

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })

    it('should only remove attribute when all providers with flag enabled have unmounted', () => {
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)

      // Mount three providers with flag enabled
      const {unmount: unmount1} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Provider 1</div>
        </FeatureFlags>,
      )

      const {unmount: unmount2} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Provider 2</div>
        </FeatureFlags>,
      )

      const {unmount: unmount3} = render(
        <FeatureFlags flags={{primer_react_css_has_selector_perf: true}}>
          <div>Provider 3</div>
        </FeatureFlags>,
      )

      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Unmount first provider
      unmount1()
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Unmount second provider
      unmount2()
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(true)

      // Unmount third provider - now attribute should be removed
      unmount3()
      expect(document.body.hasAttribute('data-dialog-scroll-optimized')).toBe(false)
    })
  })
})
