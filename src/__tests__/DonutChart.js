import React from 'react'
import DonutChart, {DonutSlice} from '../DonutChart'
import theme from '../theme'
import {render} from '../utils/testing'

describe('DonutChart', () => {
  it('renders the data prop', () => {
    const donut = render(<DonutChart data={{error: 1}} />)

    expect(donut.type).toEqual('svg')
    expect(donut.props.width).toEqual(40)
    expect(donut.props.height).toEqual(40)
    expect(donut.children.length).toEqual(1)

    const [g] = donut.children
    expect(g.type).toEqual('g')
    expect(g.children.length).toEqual(1)

    const [slice] = g.children
    expect(slice.type).toEqual('path')
    expect(slice.props.fill).toEqual(theme.colors.red[5])
  })

  xit('renders DonutSlice children', () => {
    const donut = render((
      <DonutChart>
        <DonutSlice state='success' value={1} />
      </DonutChart>
    ))
    expect(donut.type).toEqual('svg')
  })
})
