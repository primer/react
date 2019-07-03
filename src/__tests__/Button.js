import React from 'react'
import {layout} from 'styled-system'
import {Button, ButtonPrimary, ButtonDanger, ButtonOutline, ButtonGroup} from '..'
import {render} from '../utils/testing'
import {COMMON} from '../constants'

function noop() {}

describe('Button', () => {
  it('renders a <button>', () => {
    expect(render(<Button />).type).toEqual('button')
  })

  it('has default theme', () => {
    expect(Button).toSetDefaultTheme()
  })

  it('respects the "as" prop', () => {
    expect(render(<Button as="a" />).type).toEqual('a')
  })

  it('implements system props', () => {
    expect(Button).toImplementSystemProps(COMMON)
    expect(Button).toImplementSystemProps(layout)
  })

  it('respects width props', () => {
    expect(render(<Button width={200} />)).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', () => {
    expect(render(<Button disabled />).props.disabled).toEqual(true)
  })

  it('respects the "size" prop', () => {
    expect(render(<Button size="sm" />)).toHaveStyleRule('font-size', '12px')
    expect(render(<Button size="large" />)).toHaveStyleRule('font-size', '16px')
  })

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop} />).props.onClick).toEqual(noop)
  })
})

describe('ButtonPrimary', () => {
  it('renders a <button>', () => {
    expect(render(<ButtonPrimary />).type).toEqual('button')
  })
})

describe('ButtonDanger', () => {
  it('renders a <button>', () => {
    expect(render(<ButtonDanger />).type).toEqual('button')
  })
})

describe('ButtonOutline', () => {
  it('renders a <button> by default', () => {
    expect(render(<ButtonOutline />).type).toEqual('button')
  })
})

describe('ButtonGroup', () => {
  it('respects the "as" prop', () => {
    expect(render(<ButtonGroup as="a" />).type).toEqual('a')
  })

  it('implements system props', () => {
    expect(ButtonGroup).toImplementSystemProps(COMMON)
    expect(ButtonGroup).toImplementSystemProps(layout)
  })
})
