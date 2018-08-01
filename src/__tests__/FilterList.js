import React from 'react'
import FilterList from '../FilterList'
import {render, rendersClass} from '../utils/testing'

describe('FilterList', () => {
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

  it('respects margin utility prop', () => {
    expect(rendersClass(<FilterList m={4} />, 'm-4')).toEqual(true)
  })

  it('respects padding utility prop', () => {
    expect(rendersClass(<FilterList p={4} />, 'p-4')).toEqual(true)
  })
})
