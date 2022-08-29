import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {Breadcrumbs} from '..'
import {behavesAsComponent, render} from '../utils/testing'
expect.extend(toHaveNoViolations)

describe('Breadcrumbs.Item', () => {
  behavesAsComponent({Component: Breadcrumbs.Item})

  it('renders an <a> by default', () => {
    expect(render(<Breadcrumbs.Item />).type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "selected" prop', () => {
    expect(render(<Breadcrumbs.Item selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Link = ({theme: _ignoredTheme, ...props}: Record<string, unknown>) => <div {...props} />
    expect(render(<Breadcrumbs.Item as={Link} to="#" />)).toMatchSnapshot()
  })
})
