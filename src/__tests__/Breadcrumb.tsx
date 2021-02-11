import React from 'react'
import {Breadcrumb} from '..'
import {mount, render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Breadcrumb', () => {
  behavesAsComponent({Component: Breadcrumb, systemPropArray: [COMMON]})

  checkExports('Breadcrumb', {
    default: Breadcrumb
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumb />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <nav>', () => {
    expect(render(<Breadcrumb />).type).toEqual('nav')
  })

  it('adds the Breadcrumb class', () => {
    expect(rendersClass(<Breadcrumb />, 'Breadcrumb')).toEqual(true)
  })
})
