import React from 'react'
import {TabNav} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('TabNav', () => {
  behavesAsComponent({Component: TabNav})

  checkExports('TabNav', {
    default: TabNav
  })

  describe('TabNav.Link', () => {
    behavesAsComponent({Component: TabNav.Link})
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TabNav aria-label="main" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('sets aria-label appropriately', () => {
    const {getByLabelText} = HTMLRender(<TabNav aria-label="stuff" />)
    expect(getByLabelText('stuff')).toBeTruthy()
    expect(getByLabelText('stuff').tagName).toEqual('NAV')
  })
})
