import React from 'react'
import SideNav from '../SideNav'
import {render} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('SideNav', () => {
  it('implements system props', () => {
    expect(SideNav).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SideNav />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('has default theme', () => {
    expect(SideNav).toSetDefaultTheme()
  })

  it('renders a <nav>', () => {
    expect(render(<SideNav />).type).toEqual('nav')
  })

  it('sets aria-label appropriately', () => {
    expect(render(<SideNav aria-label="foo" />).props['aria-label']).toEqual('foo')
  })

  it('sets aria-current on a selected link', () => {
    const elem = (
      <SideNav>
        <SideNav.Link href="#one">One</SideNav.Link>
        <SideNav.Link href="#two" selected>
          Two
        </SideNav.Link>
      </SideNav>
    )
    expect(render(elem)).toMatchSnapshot()
  })

  it('sets different styles for SideNav.Links with the full variant', () => {
    const elem = (
      <SideNav>
        <SideNav.Link href="#one">One</SideNav.Link>
        <SideNav.Link href="#two" variant="full">
          Two
        </SideNav.Link>
      </SideNav>
    )
    expect(render(elem)).toMatchSnapshot()
  })
})
