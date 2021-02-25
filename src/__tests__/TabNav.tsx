import React from 'react'
import {TabNav} from '..'
import {mount, render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
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
    const {container} = HTMLRender(<TabNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <nav>', () => {
    expect(render(<TabNav />).type).toEqual('nav')
  })


  it('sets aria-label appropriately', () => {
    expect(render(<TabNav aria-label="foo" />).props['aria-label']).toEqual('foo')
  })
})
