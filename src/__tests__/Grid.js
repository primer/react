import React from 'react'
import Grid from '../Grid'
import {GRID} from '../constants'
import {render} from '../utils/testing'

describe('Grid', () => {
  it('implements system props', () => {
    expect(Grid).toImplementSystemProps(GRID)
  })

  it('has default theme', () => {
    expect(Grid).toSetDefaultTheme()
  })

  it('gets display: grid by default', () => {
    expect(render(<Grid />)).toHaveStyleRule('display', 'grid')
  })

  it('respects gridGap', () => {
    expect(render(<Grid gridGap={1} />)).toMatchSnapshot()
  })

  it('respects gridColumnGap', () => {
    expect(render(<Grid gridColumnGap={2} />)).toMatchSnapshot()
  })

  it('respects gridRowGap', () => {
    expect(render(<Grid gridRowGap={2} />)).toMatchSnapshot()
  })

  it('respects gridColumn', () => {
    expect(render(<Grid gridColumn="1 / 2" />)).toMatchSnapshot()
  })

  it('respects gridRow', () => {
    expect(render(<Grid gridRow="1 / 2" />)).toMatchSnapshot()
  })

  it('respects gridArea', () => {
    expect(render(<Grid gridArea="sidebar" />)).toMatchSnapshot()
  })

  it('respects gridAutoFlow', () => {
    expect(render(<Grid gridAutoFlow="row" />)).toMatchSnapshot()
  })

  it('respects gridAutoRows', () => {
    expect(render(<Grid gridAutoRows="1fr" />)).toMatchSnapshot()
  })

  it('respects gridAutoColumns', () => {
    expect(render(<Grid gridAutoColumns="1fr" />)).toMatchSnapshot()
  })

  it('respects gridTemplateColumns', () => {
    expect(render(<Grid gridTemplateColumns="200px 1fr" />)).toMatchSnapshot()
  })

  it('respects gridTemplateRows', () => {
    expect(render(<Grid gridTemplateRows=" 200px 1fr" />)).toMatchSnapshot()
  })

  it('respects gridTemplateAreas', () => {
    expect(render(<Grid gridTemplateAreas="sidebar  main" />)).toMatchSnapshot()
  })

  it('respects responsive display', () => {
    expect(render(<Grid display={['grid', 'inline-grid']} />)).toMatchSnapshot()
  })

  it('respects the "as" prop', () => {
    expect(render(<Grid as="span" />).type).toEqual('span')
  })

  it('renders a div by default', () => {
    expect(render(<Grid />).type).toEqual('div')
  })
})
