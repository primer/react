import {beforeEach} from 'vitest'
import './global.css'
import {updateGlobalTheme} from '../../../src/test-helpers/themes'

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-color-mode', 'auto')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-light-theme', 'light')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-dark-theme', 'dark')

beforeEach(() => {
  updateGlobalTheme('light')
})
