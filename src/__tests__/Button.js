import React from 'react'
import {layout} from 'styled-system'
import {Button, ButtonPrimary, ButtonDanger, ButtonOutline, ButtonGroup} from '..'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

function noop() {}

describe('Button', () => {
  it('renders a <button>', () => {
    expect(render(<Button />).type).toEqual('button')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Button>Click here</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
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

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop} />).props.onClick).toEqual(noop)
  })

  it('respects width props', () => {
    expect(render(<Button width={200} />)).toHaveStyleRule('width', '200px')
  })

  it('respects the "disabled" prop', () => {
    const item = render(<Button disabled />)
    expect(item.props.disabled).toEqual(true)
    expect(item).toMatchSnapshot()
  })

  it('respects the "variant" prop', () => {
    expect(render(<Button variant="small" />)).toHaveStyleRule('font-size', '12px')
    expect(render(<Button variant="large" />)).toHaveStyleRule('font-size', '16px')
  })

  it('respects the "fontSize" prop over the "variant" prop', () => {
    expect(render(<Button variant="small" fontSize={20} />)).toHaveStyleRule('font-size', '20px')
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
