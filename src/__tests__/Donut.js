import React from 'react'
import Donut from '../Donut'
import theme, {colors} from '../theme'
import {render} from '../utils/testing'

const {state} = colors

describe('Donut', () => {
  it('renders the data prop', () => {
    const donut = render(<Donut data={{error: 1}} />)
    expect(donut).toMatchSnapshot()

    expect(donut.type).toEqual('svg')
    expect(donut.props.width).toEqual(30)
    expect(donut.props.height).toEqual(30)
    expect(donut.children).toHaveLength(1)

    const [g] = donut.children
    expect(g.type).toEqual('g')
    expect(g.children).toHaveLength(1)

    const [slice] = g.children
    expect(slice.type).toEqual('path')
    // expect(slice.props.fill).toEqual(colors.state.error)
  })

  xit('has default theme', () => {
    expect(Donut).toSetDefaultTheme()
  })

  it('renders Donut.Slice children', () => {
    const donut = render(
      <Donut>
        <Donut.Slice state="success" value={1} />
        <Donut.Slice state="failure" value={1} />
      </Donut>
    )
    expect(donut).toMatchSnapshot()
    expect(donut.children).toHaveLength(1)
    const slices = donut.children[0].children
    expect(slices).toHaveLength(2)
    expect(slices.map(slice => slice.type)).toEqual(['path', 'path'])
    expect(slices[0].props.fill).toEqual(colors.state.success)
    expect(slices[1].props.fill).toEqual(colors.state.failure)
  })

  it('renders a single Donut.Slice child', () => {
    const donut = render(
      <Donut>
        <Donut.Slice state="success" value={1} />
      </Donut>
    )
    expect(donut).toMatchSnapshot()
    expect(donut.type).toEqual('svg')
  })

  it('respects margin utility prop', () => {
    expect(render(<Donut m={4} data={{error: 1}} />)).toHaveStyleRule('margin', `${theme.space[4]}px`)
  })

  it('respects padding utility prop', () => {
    expect(render(<Donut p={4} data={{error: 1}} />)).toHaveStyleRule('padding', `${theme.space[4]}px`)
  })

  describe('Donut.Slice', () => {
    it('renders known states as colors', () => {
      expect(render(<Donut.Slice state="error" />).props.fill).toEqual(state.error)
      expect(render(<Donut.Slice state="pending" />).props.fill).toEqual(state.pending)
      expect(render(<Donut.Slice state="success" />).props.fill).toEqual(state.success)
      expect(render(<Donut.Slice state="unknown" />).props.fill).toEqual(state.unknown)
    })

    it('respects the fill attribute', () => {
      expect(render(<Donut.Slice fill="pink" />).props.fill).toEqual('pink')
    })
  })
})
