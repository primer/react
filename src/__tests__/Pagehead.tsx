import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {Pagehead} from '..'
import {COMMON} from '../constants'
import theme from '../theme'
import {Theme} from '../ThemeProvider'
import {behavesAsComponent, checkExports} from '../utils/testing'
expect.extend(toHaveNoViolations)

const pageheadTheme = theme as Theme

describe('Pagehead', () => {
  behavesAsComponent({Component: Pagehead, systemPropArray: [COMMON]})

  checkExports('Pagehead', {
    default: Pagehead
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Pagehead theme={pageheadTheme}>Pagehead</Pagehead>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
