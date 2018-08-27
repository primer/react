import React from 'react'
import FlexItem from '../FlexItem'
import {FLEX_ITEM} from '../system-props'
import {render} from '../utils/testing'

describe('FlexItem', () => {
  it('is a system component', () => {
    expect(FlexItem.systemComponent).toEqual(true)
  })

  it('implements FLEX_ITEM props', () => {
    expect(FlexItem).toImplementSystemProps(FLEX_ITEM)
  })

  it('respects alignSelf', () => {
    expect(render(<FlexItem alignSelf="center" />)).toMatchSnapshot()
  })

  it('renders as correct tag', () => {
    const item = render(
      <FlexItem is="button" alignSelf="center">
        hi
      </FlexItem>
    )
    expect(item.type).toEqual('button')
    expect(item).toMatchSnapshot()
  })
})
