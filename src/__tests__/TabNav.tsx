import React from 'react'
import {TabNav} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('TabNav', () => {
  behavesAsComponent({Component: TabNav, systemPropArray: [COMMON]})

  checkExports('TabNav', {
    default: TabNav
  })

  describe('TabNav.Link', () => {
    behavesAsComponent({Component: TabNav.Link, systemPropArray:[COMMON]})
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TabNav aria-label="main" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('sets aria-label appropriately', () => {
    const {getByLabelText} = HTMLRender(<TabNav aria-label="stuff"/>)
    expect(getByLabelText("stuff")).toBeTruthy();
    expect(getByLabelText("stuff").tagName).toEqual("NAV")
  })
})
