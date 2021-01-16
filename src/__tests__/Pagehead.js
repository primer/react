import React from 'react'
import {Pagehead} from '..'
import {COMMON} from '../constants'
import theme from '../theme'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Pagehead', () => {
  behavesAsComponent(Pagehead, [COMMON])

  checkExports('Pagehead', {
    default: Pagehead
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Pagehead theme={theme}>Pagehead</Pagehead>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
