import React from 'react'
import Flex from '../Flex'
import {FLEX_CONTAINER} from '../constants'
import {render} from '../utils/testing'

describe('Flex', () => {
  it('implements system props', () => {
    expect(Flex).toImplementSystemProps(FLEX_CONTAINER)
  })

  it('has default theme', () => {
    expect(Flex).toSetDefaultTheme()
  })

  it('gets display: flex by default', () => {
    expect(render(<Flex />)).toHaveStyleRule('display', 'flex')
  })

  it('respects flexWrap', () => {
    expect(render(<Flex flexWrap="nowrap" />)).toMatchSnapshot()
  })

  it('respects flexDirection', () => {
    expect(render(<Flex flexDirection="row" />)).toMatchSnapshot()
  })

  it('respects justifyContent', () => {
    expect(render(<Flex justifyContent="start" />)).toMatchSnapshot()
  })

  it('respects alignItems', () => {
    expect(render(<Flex alignItems="start" />)).toMatchSnapshot()
  })

  it('respects alignContent', () => {
    expect(render(<Flex alignContent="start" />)).toMatchSnapshot()
  })

  it('respects display', () => {
    expect(render(<Flex display="inline-flex" />)).toHaveStyleRule('display', 'inline-flex')
  })

  it('respects responsive display', () => {
    expect(render(<Flex display={['flex', 'inline-flex']} />)).toMatchSnapshot()
  })

  it('respects the "as" prop', () => {
    expect(render(<Flex as="span" />).type).toEqual('span')
  })

  it('renders a div by default', () => {
    expect(render(<Flex />).type).toEqual('div')
  })
})
