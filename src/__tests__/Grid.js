import React from 'react'
import {Grid} from '..'
import {COMMON, FLEX, LAYOUT, GRID} from '../constants'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Grid', () => {
  behavesAsComponent(Grid, [COMMON, FLEX, LAYOUT, GRID])

  checkExports('Grid', {
    default: Grid,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Grid />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
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

  it('renders a div by default', () => {
    expect(render(<Grid />).type).toEqual('div')
  })
})
