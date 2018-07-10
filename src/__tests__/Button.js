import React from 'react'
import Button from '../Button'
import ButtonDanger from '../ButtonDanger'
import ButtonLink from '../ButtonLink'
import ButtonOutline from '../ButtonOutline'
import {render, renderClasses} from '../utils/testing'

function noop() {}

describe('Button', () => {
  it('renders a <button>', () => {
    expect(render(<Button />)).toEqual(render(<button className="btn" type="button" />))
  })

  it('renders children', () => {
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
    expect(renderClasses(<Button block />)).toEqual(['btn', 'btn-block'])
  })

  it('respects the "disabled" prop', () => {
    expect(render(<Button disabled />).props.disabled).toEqual(true)
  })

  it('respects the "linkStyle" prop', () => {
    expect(renderClasses(<Button linkStyle />)).toEqual(['btn-link'])
  })

  it('respects the "scheme" prop', () => {
    expect(renderClasses(<Button scheme="danger" />)).toEqual(['btn', 'btn-danger'])
    expect(renderClasses(<Button scheme="primary" />)).toEqual(['btn', 'btn-primary'])
    expect(renderClasses(<Button scheme="octicon" />)).toEqual(['btn-link', 'text-inherit'])
    // non-truthy values should not result in any new classes
    const hush = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    expect(renderClasses(<Button scheme={null} />)).toEqual(['btn'])
    expect(renderClasses(<Button scheme={false} />)).toEqual(['btn'])
    hush.mockRestore()
  })

  it('respects the "size" prop', () => {
    expect(renderClasses(<Button size="sm" />)).toEqual(['btn', 'btn-sm'])
    expect(renderClasses(<Button size="large" />)).toEqual(['btn', 'btn-large'])
  })

  it('preserves "onClick" prop', () => {
    expect(render(<Button onClick={noop} />).props.onClick).toEqual(noop)
  })

  it('ignores onClick if disabled', () => {
    expect(render(<Button disabled onClick={noop} />).props.onClick).toEqual(undefined)
  })
})

describe('ButtonDanger', () => {
  it('renders a <button>', () => {
    expect(render(<ButtonDanger />)).toEqual(render(<button className="btn btn-danger" type="button" />))
  })

  it('renders children', () => {
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
    expect(render(<ButtonLink />)).toEqual(render(<button className="btn-link" type="button" />))
  })
})

describe('ButtonOutline', () => {
  it('renders a <button> by default', () => {
    expect(render(<ButtonOutline />)).toEqual(render(<button className="btn btn-outline" type="button" />))
  })
})
