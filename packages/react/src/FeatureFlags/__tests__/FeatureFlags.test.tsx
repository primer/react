import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {FeatureFlags, useFeatureFlag} from '../../FeatureFlags'

describe('FeatureFlags', () => {
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
})
