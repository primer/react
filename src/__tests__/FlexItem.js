import React from 'react'
import Flex from '../Flex'
import {FLEX_ITEM} from '../system-props'
import {render} from '../utils/testing'

describe('Flex.Item', () => {
  it('is a system component', () => {
    expect(Flex.Item.systemComponent).toEqual(true)
  })

  it('implements FLEX_ITEM props', () => {
    expect(Flex.Item).toImplementSystemProps(FLEX_ITEM)
  })

  it('respects alignSelf', () => {
    expect(render(<Flex.Item alignSelf="center" />)).toMatchSnapshot()
  })

  it('renders as correct tag', () => {
    const item = render(
      <Flex.Item is="button" alignSelf="center">
        hi
      </Flex.Item>
    )
    expect(item.type).toEqual('button')
    expect(item).toMatchSnapshot()
  })
})
