import React from 'react'
import SubNav from '../SubNav'
import {mount, render, rendersClass} from '../utils/testing'
import {COMMON} from '../constants'

describe('SubNav', () => {
  it('implements system props', () => {
    expect(SubNav).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(SubNav).toSetDefaultTheme()
  })

  it('renders a <nav>', () => {
    expect(render(<SubNav />).type).toEqual('nav')
  })

  it('adds the SubNav class', () => {
    expect(rendersClass(<SubNav />, 'SubNav')).toEqual(true)
  })

  it('sets aria-label to the "label" prop', () => {
    expect(render(<SubNav label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('wraps its children in an "SubNav-body" div', () => {
    const children = <b>yo</b>
    const wrapper = mount(<SubNav>{children}</SubNav>)
    const body = wrapper.find('.SubNav-body')
    expect(body.exists()).toEqual(true)
    expect(body.childAt(0).type()).toEqual('b')
  })

  it('respects the "actions" prop', () => {
    const content = <h1>hi!</h1>
    const wrapper = mount(<SubNav actions={content} />)
    const actions = wrapper.find('.SubNav-actions')
    expect(actions.exists()).toEqual(true)
    expect(actions.text()).toEqual('hi!')
  })
})
