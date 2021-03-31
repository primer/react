import React from 'react'
import {UnderlineNav} from '..'
import {COMMON} from '../constants'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('UnderlineNav.Link', () => {
  behavesAsComponent({Component: UnderlineNav.Link, systemPropArray: [COMMON]})

  it('renders an <a> by default', () => {
    expect(render(<UnderlineNav.Link />).type).toEqual('a')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<UnderlineNav.Link href="www.github.com">Go to GitHub</UnderlineNav.Link>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the "selected" prop', () => {
    expect(render(<UnderlineNav.Link selected />)).toMatchSnapshot()
  })

  it('adds activeClassName={SELECTED_CLASS} when it gets a "to" prop', () => {
    const Link = ({theme: _ignoredTheme, ...props}: any) => <div {...props} />
    expect(render(<UnderlineNav.Link as={Link} to="#" />)).toMatchSnapshot()
  })
})
