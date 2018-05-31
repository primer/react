import React from 'react'
import Button from '../Button'
import renderer from 'react-test-renderer'

const render = component => {
  const node = renderer.create(component).toJSON()
  for (const [key, val] of Object.entries(node.props)) {
    if (val === undefined) {
      delete node.props[key]
    }
  }
  return node
}

function noop() {}

describe('Button', () => {
  it('renders a <button>', () => {
    expect(render(<Button />))
      .toEqual(render(<button className='btn' type='button' />))
  })

  it('renders children', () => {
    expect(render(<Button>foo <b>bar</b></Button>))
      .toEqual(render(<button className='btn' type='button'>foo <b>bar</b></button>))
  })

  it('respects the "block" prop', () => {
    expect(render(<Button block />).props.className).toEqual('btn btn-block')
  })

  it('respects the "disabled" prop', () => {
    expect(render(<Button disabled />).props.disabled).toEqual(true)
  })

  it('respects the "linkStyle" prop', () => {
    expect(render(<Button linkStyle />).props.className).toEqual('btn-link')
  })

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop} />).props.onClick).toEqual(noop)
  })
})
