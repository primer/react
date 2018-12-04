import React from 'react'
import FilterList from '../FilterList'
import {render, rendersClass, renderClasses, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('FilterList', () => {
  it('implements common system props', () => {
    expect(FilterList).toImplementSystemProps(COMMON)
  })

  it('renders a <ul>', () => {
    expect(render(mount(<FilterList />)).type).toEqual('ul')
  })

  it('wraps children in <li>', () => {
    expect(render(mount(<FilterList>Hello</FilterList>)).children.pop().type).toEqual('li')
  })

  it('adds the filter-list class', () => {
    expect(rendersClass(mount(<FilterList />), 'filter-list')).toEqual(true)
  })

  it('respects the "small" prop', () => {
    expect(rendersClass(mount(<FilterList small />), 'small')).toEqual(true)
  })
})
