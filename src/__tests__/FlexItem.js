import React from 'react'
import FlexItem from '../FlexItem'
import {FLEX_ITEM} from '../system-props'
import theme from '../theme'
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

  xit('margin utility', () => {
    expect(render(<FlexItem m={2} them={theme} />)).toMatchSnapshot()
  })

  xit('padding utility', () => {
    expect(render(<FlexItem p={1} them={theme} />)).toMatchSnapshot()
  })
})
