import {beforeEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

beforeEach(() => {
  cleanup()
})

globalThis.IS_REACT_ACT_ENVIRONMENT = true
