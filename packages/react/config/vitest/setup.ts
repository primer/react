import {afterEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// @ts-expect-error this is needed for act() from React
// @see https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act
globalThis.IS_REACT_ACT_ENVIRONMENT = true
