import React from 'react'
import {Breadcrumb} from '..'
import {render, behavesAsComponent} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Breadcrumb.Item', () => {
  behavesAsComponent(Breadcrumb.Item, [COMMON])

  it('renders an <a> by default', () => {
    expect(render(<Breadcrumb.Item />).type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumb.Item />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the "selected" prop', () => {
    expect(render(<Breadcrumb.Item selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Mock = jest.fn(() => <div />)
    render(<Breadcrumb.Item as={Mock} to="#" />)
    expect(Mock.mock.calls[0][0].to).toEqual('#')
    expect(Mock.mock.calls[0][0].activeClassName).toEqual('selected')
  })
})
