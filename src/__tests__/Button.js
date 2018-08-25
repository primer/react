import React from 'react'
import {Button, ButtonPrimary, ButtonDanger, ButtonLink, ButtonOutline} from '..'
import {render} from '../utils/testing'
import {COMMON} from '../system-props'

function noop() {}

describe('Button', () => {
  it('is a system component', () => {
    expect(Button.systemComponent).toEqual(true)
  })

  it('renders a <button>', () => {
    expect(render(<Button />).type).toEqual('button')
  })

  it('respects the "is" prop', () => {
    expect(render(<Button is="a" />).type).toEqual('a')
  })

  it('implements common system props', () => {
    expect(Button).toImplementSystemProps(COMMON)
  })

  xit('renders children', () => {
    expect(
      render(
        <Button>
          foo <b>bar</b>
        </Button>
      )
    ).toEqual(
      render(
        <button className="btn" type="button">
          foo <b>bar</b>
        </button>
      )
    )
  })

  it('respects the "block" prop', () => {
    expect(render(<Button block />).props.className).toContain('btn-block')
  })

  it('respects the "disabled" prop', () => {
    expect(render(<Button disabled />).props.disabled).toEqual(true)
  })

  it('respects the "linkStyle" prop', () => {
    expect(render(<Button linkStyle />).props.className).toContain('btn-link')
  })

  it('respects the "scheme" prop', () => {
    expect(render(<Button scheme="danger" />).props.className).toContain('btn-danger')
    expect(render(<Button scheme="primary" />).props.className).toContain('btn-primary')
  })

  it('respects the "size" prop', () => {
    expect(render(<Button size="sm" />).props.className).toContain('btn-sm')
    expect(render(<Button size="large" />).props.className).toContain('btn-large')
  })

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop} />).props.onClick).toEqual(noop)
  })

  it('ignores onClick if disabled', () => {
    expect(render(<Button disabled onClick={noop} />).props.onClick).toEqual(undefined)
  })
})

describe('ButtonPrimary', () => {
  it('renders a <button>', () => {
    expect(render(<ButtonPrimary />).type).toEqual('button')
    expect(render(<ButtonPrimary />).props.className).toContain('btn-primary')
  })
})

describe('ButtonDanger', () => {
  it('renders a <button>', () => {
    expect(render(<ButtonDanger />).type).toEqual('button')
    expect(render(<ButtonDanger />).props.className).toContain('btn-danger')
  })

  xit('renders children', () => {
    expect(
      render(
        <ButtonDanger>
          foo <b>bar</b>
        </ButtonDanger>
      )
    ).toEqual(
      render(
        <button className="btn btn-danger" type="button">
          foo <b>bar</b>
        </button>
      )
    )
  })
})

describe('ButtonLink', () => {
  it('renders a <button> by default', () => {
    expect(render(<ButtonLink />).type).toEqual('button')
    expect(render(<ButtonLink />).props.className).toContain('btn-link')
  })
})

describe('ButtonOutline', () => {
  it('renders a <button> by default', () => {
    expect(render(<ButtonOutline />).type).toEqual('button')
    expect(render(<ButtonOutline />).props.className).toContain('btn-outline')
  })
})
