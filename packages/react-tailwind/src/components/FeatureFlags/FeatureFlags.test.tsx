import {cleanup, render, screen} from '@testing-library/react'
import {memo} from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {FeatureFlags, useFeatureFlag} from './index'

describe('FeatureFlags', () => {
  afterEach(cleanup)

  it('merges nested flags and gives nested values precedence', () => {
    function Flags() {
      return (
        <output>{`${useFeatureFlag('enabled')}:${useFeatureFlag('disabled')}:${useFeatureFlag('missing')}`}</output>
      )
    }

    render(
      <FeatureFlags flags={{enabled: true, disabled: false}}>
        <FeatureFlags flags={{enabled: false}}>
          <Flags />
        </FeatureFlags>
      </FeatureFlags>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('false:false:false')
  })

  it('keeps the context value stable for equivalent flag values', () => {
    let renders = 0
    const flags = {enabled: true}
    const Consumer = memo(function Consumer() {
      renders += 1
      useFeatureFlag('enabled')
      return null
    })

    const {rerender} = render(
      <FeatureFlags flags={flags}>
        <Consumer />
      </FeatureFlags>,
    )

    rerender(
      <FeatureFlags flags={flags}>
        <Consumer />
      </FeatureFlags>,
    )

    expect(renders).toBe(1)
  })
})
