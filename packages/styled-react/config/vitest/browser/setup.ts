import './global.css'

import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import {beforeEach} from 'vitest'
import {updateGlobalTheme} from '../../../src/test-helpers/themes'

beforeEach(() => {
  cleanup()
  updateGlobalTheme('light')
})

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-color-mode', 'auto')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-light-theme', 'light')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-dark-theme', 'dark')
