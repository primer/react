import React from 'react'
import Breadcrumb from '../Breadcrumbs'
import {mount, render, rendersClass} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Breadcrumb', () => {
  it('implements system props', () => {
    expect(Breadcrumb).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Breadcrumb).toSetDefaultTheme()
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

  it('sets aria-label to the "aria-label" prop', () => {
    expect(render(<Breadcrumb aria-label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('has aria-hidden set to true', () => {
    expect(render(<Breadcrumb />).props['aria-hidden']).toEqual(true)
  })

  it('wraps its children in an "Breadcrumb-item" li', () => {
    const children = <Breadcrumb.Item>yo</Breadcrumb.Item>
    const wrapper = mount(<Breadcrumb>{children}</Breadcrumb>)
    const list = wrapper.find('ol')
    const item = wrapper.find('.Breadcrumb-item')
    expect(list.exists()).toEqual(true)
    expect(list.childAt(0).type()).toEqual(Breadcrumb.Wrapper)
    expect(item.childAt(0).type()).toEqual(Breadcrumb.Item)
  })
})
