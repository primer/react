import React from 'react'
import Flex from '../Flex'
import {FLEX_ITEM, COMMON} from '../constants'
import {render} from '../utils/testing'

describe('Flex.Item', () => {
  it('implements system props', () => {
    expect(Flex.Item).toImplementSystemProps(FLEX_ITEM)
    expect(Flex.Item).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Flex.Item).toSetDefaultTheme()
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
