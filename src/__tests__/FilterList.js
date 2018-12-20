import React from 'react'
import FilterList from '../FilterList'
import {render, rendersClass} from '../utils/testing'
import {COMMON} from '../constants'

describe('FilterList', () => {
  it('implements system props', () => {
    expect(FilterList).toImplementSystemProps(COMMON)
  })

  it('renders a <ul>', () => {
    expect(render(<FilterList />).type).toEqual('ul')
  })

  it('wraps children in <li>', () => {
    expect(render(<FilterList>Hello</FilterList>).children.pop().type).toEqual('li')
  })

  it('adds the filter-list class', () => {
    expect(rendersClass(<FilterList />, 'filter-list')).toEqual(true)
  })

  it('respects the "small" prop', () => {
    expect(rendersClass(<FilterList small />, 'small')).toEqual(true)
  })

  it('has default theme', () => {
    expect(FilterList).toSetDefaultTheme()
  })
})
