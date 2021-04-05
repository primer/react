import {cleanup, render as HTMLRender} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {Breadcrumb} from '..'
import {COMMON} from '../constants'
import {behavesAsComponent, render} from '../utils/testing'
expect.extend(toHaveNoViolations)

describe('Breadcrumb.Item', () => {
  behavesAsComponent({Component: Breadcrumb.Item, systemPropArray: [COMMON]})

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
    const Link = ({theme: _ignoredTheme, ...props}: Record<string, unknown>) => <div {...props} />
    expect(render(<Breadcrumb.Item as={Link} to="#" />)).toMatchSnapshot()
  })
})
