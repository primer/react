import {afterEach, vi} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Mock CSS modules
vi.mock('*.module.css', () => {
  return new Proxy({}, {
    get: (_, prop) => {
      // Return prop as the class name
      return prop
    }
  })
})

afterEach(() => {
  cleanup()
})
