import React from 'react'
import TabNav from '../TabNav'
import {mount, render, rendersClass} from '../utils/testing'
import {COMMON} from '../constants'

describe('TabNav', () => {
  it('implements system props', () => {
    expect(TabNav).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(TabNav).toSetDefaultTheme()
  })

  it('renders a <nav>', () => {
    expect(render(<TabNav />).type).toEqual('nav')
  })

  it('adds the TabNav class', () => {
    expect(rendersClass(<TabNav />, 'TabNav')).toEqual(true)
  })

  it('sets aria-label appropriately', () => {
    expect(render(<TabNav aria-label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('wraps its children in an "TabNav-body" div', () => {
    const children = <b>children</b>
    const wrapper = mount(<TabNav>{children}</TabNav>)
    const body = wrapper.find('.TabNav-body')
    expect(body.exists()).toEqual(true)
    expect(body.childAt(0).type()).toEqual('b')
  })
})
