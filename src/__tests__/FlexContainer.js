import React from 'react'
import FlexContainer from '../FlexContainer'
import {FLEX_CONTAINER} from '../system-props'
import {render} from '../utils/testing'

describe('FlexContainer', () => {
  it('is a system component', () => {
    expect(FlexContainer.systemComponent).toEqual(true)
  })

  it('implements flex system props', () => {
    expect(FlexContainer).toImplementSystemProps(FLEX_CONTAINER)
  })

  it('gets display: flex by default', () => {
    expect(render(<FlexContainer />)).toHaveStyleRule('display', 'flex')
  })

  it('respects flexWrap', () => {
    expect(render(<FlexContainer flexWrap="nowrap" />)).toMatchSnapshot()
  })

  it('respects flexDirection', () => {
    expect(render(<FlexContainer flexDirection="row" />)).toMatchSnapshot()
  })

  it('respects justifyContent', () => {
    expect(render(<FlexContainer justifyContent="start" />)).toMatchSnapshot()
  })

  it('respects alignItems', () => {
    expect(render(<FlexContainer alignItems="start" />)).toMatchSnapshot()
  })

  it('respects alignContent', () => {
    expect(render(<FlexContainer alignContent="start" />)).toMatchSnapshot()
  })

  it('respects display', () => {
    expect(render(<FlexContainer display="inline-flex" />)).toHaveStyleRule('display', 'inline-flex')
  })

  it('respects responsive display', () => {
    expect(render(<FlexContainer display={['flex', 'inline-flex']} />)).toMatchSnapshot()
  })
})
