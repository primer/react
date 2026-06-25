import {beforeEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

beforeEach(() => {
  cleanup()
})

globalThis.IS_REACT_ACT_ENVIRONMENT = true
