import React from 'react'
import Flex from '../Flex'
import {FLEX_CONTAINER} from '../system-props'
import {render, mount} from '../utils/testing'

describe('Flex', () => {
  it('implements flex system props', () => {
    expect(Flex).toImplementSystemProps(FLEX_CONTAINER)
  })

  it('gets display: flex by default', () => {
    expect(render(mount(<Flex />))).toHaveStyleRule('display', 'flex')
  })

  it('respects flexWrap', () => {
    expect(render(mount(<Flex flexWrap="nowrap" />))).toMatchSnapshot()
  })

  it('respects flexDirection', () => {
    expect(render(mount(<Flex flexDirection="row" />))).toMatchSnapshot()
  })

  it('respects justifyContent', () => {
    expect(render(mount(<Flex justifyContent="start" />))).toMatchSnapshot()
  })

  it('respects alignItems', () => {
    expect(render(mount(<Flex alignItems="start" />))).toMatchSnapshot()
  })

  it('respects alignContent', () => {
    expect(render(mount(<Flex alignContent="start" />))).toMatchSnapshot()
  })

  it('respects display', () => {
    expect(render(mount(<Flex display="inline-flex" />))).toHaveStyleRule('display', 'inline-flex')
  })

  it('respects responsive display', () => {
    expect(render(mount(<Flex display={['flex', 'inline-flex']} />))).toMatchSnapshot()
  })

  it('respects the "as" prop', () => {
    expect(render(mount(<Flex as="span" />)).type).toEqual('span')
  })

  it('renders a div by default', () => {
    expect(render(mount(<Flex />)).type).toEqual('div')
  })
})
