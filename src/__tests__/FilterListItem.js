import React from 'react'
import FilterList from '../FilterList'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('FilterList.Item', () => {
  it('has default theme', () => {
    expect(FilterList.Item).toSetDefaultTheme()
  })

  it("should have no axe violations", async () => {
    const {container} = HTMLRender(<FilterList.Item>stuff</FilterList.Item>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('implements system props', () => {
    expect(FilterList.Item).toImplementSystemProps(COMMON)
  })

  it('renders an <a> by default', () => {
    expect(render(<FilterList.Item />).type).toEqual('a')
  })

  it('renders the given "as" prop', () => {
    const Type = props => <b {...props} />
    expect(render(<FilterList.Item as={Type} />)).toMatchSnapshot()
  })

  it('respects the "selected" prop', () => {
    expect(render(<FilterList.Item selected />)).toMatchSnapshot()
  })

  it('respects "count" prop', () => {
    const CountMock = render(<FilterList.Item count="400" />).children.pop()
    expect(CountMock.type).toEqual('span')
  })
})
