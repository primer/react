import React from 'react'
import {Breadcrumb} from '..'
import {mount, render, rendersClass, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Breadcrumb', () => {
  behavesAsComponent(Breadcrumb, [COMMON])

  checkExports('Breadcrumb', {
    default: Breadcrumb,
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

  it('wraps its children in an li', () => {
    const children = <Breadcrumb.Item>yo</Breadcrumb.Item>
    const wrapper = mount(<Breadcrumb>{children}</Breadcrumb>)
    const list = wrapper.find('ol')
    expect(list.exists()).toEqual(true)
    expect(render(list.childAt(0)).type).toEqual('li')
  })
})
