import '@primer/primitives/dist/css/base/motion/motion.css'
import '@primer/primitives/dist/css/base/size/size.css'
import '@primer/primitives/dist/css/base/typography/typography.css'
import '@primer/primitives/dist/css/functional/size/border.css'
import '@primer/primitives/dist/css/functional/size/breakpoints.css'
import '@primer/primitives/dist/css/functional/size/size-coarse.css'
import '@primer/primitives/dist/css/functional/size/size-fine.css'
import '@primer/primitives/dist/css/functional/size/size.css'
import '@primer/primitives/dist/css/functional/size/viewport.css'
import '@primer/primitives/dist/css/functional/themes/dark-colorblind.css'
import '@primer/primitives/dist/css/functional/themes/dark-dimmed.css'
import '@primer/primitives/dist/css/functional/themes/dark-high-contrast.css'
import '@primer/primitives/dist/css/functional/themes/dark-tritanopia.css'
import '@primer/primitives/dist/css/functional/themes/dark.css'
import '@primer/primitives/dist/css/functional/themes/light-colorblind.css'
import '@primer/primitives/dist/css/functional/themes/light-high-contrast.css'
import '@primer/primitives/dist/css/functional/themes/light-tritanopia.css'
import '@primer/primitives/dist/css/functional/themes/light.css'
import '@primer/primitives/dist/css/functional/typography/typography.css'
import './global.css'

import {beforeEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import failOnConsole from 'vitest-fail-on-console'

beforeEach(() => {
  cleanup()
})

// @ts-expect-error this is needed for act() from React
// @see https://react.dev/reference/react/act#error-the-current-testing-environment-is-not-configured-to-support-act
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-color-mode', 'auto')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-light-theme', 'light')
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
document.documentElement.setAttribute('data-dark-theme', 'dark')

failOnConsole()
