import React from 'react'
import {Button, ButtonPrimary, ButtonDanger, ButtonOutline} from '..'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

function noop() {}

describe('Button', () => {
  it('renders a <button>', () => {
    expect(render(mount(<Button />)).type).toEqual('button')
  })

  it('respects the "as" prop', () => {
    expect(render(mount(<Button as="a" />)).type).toEqual('a')
  })

  it('implements common system props', () => {
    expect(Button).toImplementSystemProps(COMMON)
  })

  it('respects width props', () => {
    expect(render(mount(<Button width={200} />))).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', () => {
    expect(render(mount(<Button disabled />)).props.disabled).toEqual(true)
  })

  it('respects the "scheme" prop', () => {
    expect(render(mount(<Button scheme="danger" />)).props.className).toContain('btn-danger')
    expect(render(mount(<Button scheme="primary" />)).props.className).toContain('btn-primary')
  })

  it('respects the "size" prop', () => {
    expect(render(mount(<Button size="sm" />)).props.className).toContain('btn-sm')
    expect(render(mount(<Button size="large" />)).props.className).toContain('btn-large')
  })

  it('preserves "onClick" prop', () => {
    expect(render(mount(<Button onClick={noop} />)).props.onClick).toEqual(noop)
  })

  it('ignores onClick if disabled', () => {
    expect(render(mount(<Button disabled onClick={noop} />)).props.onClick).toEqual(undefined)
  })
})

describe('ButtonPrimary', () => {
  it('renders a <button>', () => {
    expect(render(mount(<ButtonPrimary />)).type).toEqual('button')
    expect(render(mount(<ButtonPrimary />)).props.className).toContain('btn-primary')
  })
})

describe('ButtonDanger', () => {
  it('renders a <button>', () => {
    expect(render(mount(<ButtonDanger />)).type).toEqual('button')
    expect(render(mount(<ButtonDanger />)).props.className).toContain('btn-danger')
  })

  xit('renders children', () => {
    expect(
      render(mount(
        <ButtonDanger>
          foo <b>bar</b>
        </ButtonDanger>
      ))
    ).toEqual(
      render(mount(
        <button className="btn btn-danger" type="button">
          foo <b>bar</b>
        </button>
      ))
    )
  })
})

describe('ButtonOutline', () => {
  it('renders a <button> by default', () => {
    expect(render(mount(<ButtonOutline />)).type).toEqual('button')
    expect(render(mount(<ButtonOutline />)).props.className).toContain('btn-outline')
  })
})
