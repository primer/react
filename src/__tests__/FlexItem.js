import React from 'react'
import Flex from '../Flex'
import {FLEX_ITEM} from '../constants'
import {render} from '../utils/testing'

describe('Flex.Item', () => {
  it('implements system props', () => {
    expect(Flex.Item).toImplementSystemProps(FLEX_ITEM)
  })

  it('has default theme', () => {
    expect(Flex.Item).toSetDefaultTheme()
  })

  it('respects alignSelf', () => {
    expect(render(<Flex.Item alignSelf="center" />)).toMatchSnapshot()
  })

  it('renders as correct tag', () => {
    const item = render(
      <Flex.Item as="button" alignSelf="center">
        hi
      </Flex.Item>
    )
    expect(item.type).toEqual('button')
    expect(item).toMatchSnapshot()
  })
})
