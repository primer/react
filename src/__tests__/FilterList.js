import React from 'react'
import FilterList from '../FilterList'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('FilterList', () => {
  it("should have no axe violations", async () => {
    const {container} = HTMLRender(<FilterList>Hello</FilterList>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('implements system props', () => {
    expect(FilterList).toImplementSystemProps(COMMON)
  })

  it('renders a <ul>', () => {
    expect(render(<FilterList />).type).toEqual('ul')
  })

  it('wraps children in <li>', () => {
    expect(render(<FilterList>Hello</FilterList>).children.pop().type).toEqual('li')
  })

  it('has default theme', () => {
    expect(FilterList).toSetDefaultTheme()
  })
})
