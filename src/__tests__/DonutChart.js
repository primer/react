import React from 'react'
import DonutChart, {DonutSlice} from '../DonutChart'
import theme from '../theme'
import {render} from '../utils/testing'

describe('DonutChart', () => {
  it('renders the data prop', () => {
    const donut = render(<DonutChart data={{error: 1}} />)

    expect(donut.type).toEqual('svg')
    expect(donut.props.width).toEqual(30)
    expect(donut.props.height).toEqual(30)
    expect(donut.children.length).toEqual(1)

    const [g] = donut.children
    expect(g.type).toEqual('g')
    expect(g.children.length).toEqual(1)

    const [slice] = g.children
    expect(slice.type).toEqual('path')
    expect(slice.props.fill).toEqual(theme.colors.red[5])
  })

  it('renders DonutSlice children', () => {
    const donut = render((
      <DonutChart>
        <DonutSlice state='success' value={1} />
        <DonutSlice state='failure' value={1} />
      </DonutChart>
    ))
    expect(donut.children.length).toEqual(1)
    const slices = donut.children[0].children
    expect(slices.length).toEqual(2)
    expect(slices.map(slice => slice.type)).toEqual(['path', 'path'])
    expect(slices[0].props.fill).toEqual(theme.colors.green[5])
    expect(slices[1].props.fill).toEqual(theme.colors.red[5])
  })

  it('renders a single DonutSlice child', () => {
    const donut = render((
      <DonutChart>
        <DonutSlice state='success' value={1} />
      </DonutChart>
    ))
    expect(donut.type).toEqual('svg')
  })
})
