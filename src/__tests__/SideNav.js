import React from 'react'
import SideNav from '../SideNav'
import {render, behavesAsComponent} from '../utils/testing'
import {BORDER, COMMON, LAYOUT, FLEX, TYPOGRAPHY} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('SideNav', () => {
  behavesAsComponent(SideNav, [BORDER, LAYOUT, COMMON, FLEX])

  describe('SideNav.Link', () => {
    behavesAsComponent(SideNav.Link, [COMMON, TYPOGRAPHY])
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <SideNav>
        <SideNav.Link href="#">One</SideNav.Link>
        <SideNav.Link href="#" selected>
          Two
        </SideNav.Link>
      </SideNav>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders a <nav> and <a>', () => {
    expect(render(<SideNav />).type).toEqual('nav')
    expect(render(<SideNav.Link />).type).toEqual('a')
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
    const rendered = render(elem)
    const [link1, link2] = rendered.children
    expect(link1.props['aria-current']).toBeUndefined()
    expect(link2.props['aria-current']).toEqual('page')
  })

  it('sets different styles for SideNavs with the lightweight variant', () => {
    const regular = render(<SideNav />)
    const lightweight = render(<SideNav variant="lightweight" />)
    expect(regular.props.className).toEqual(expect.stringContaining('variant-normal'))
    expect(lightweight.props.className).toEqual(expect.stringContaining('variant-lightweight'))
  })

  it('sets different styles for SideNav.Links with the full variant', () => {
    const elem = (
      <SideNav>
        <SideNav.Link href="#one">One</SideNav.Link>
        <SideNav.Link href="#two">Two</SideNav.Link>
        <SideNav.Link href="#three" variant="full">
          Three
        </SideNav.Link>
      </SideNav>
    )
    const rendered = render(elem)
    const [link1, link2, link3] = rendered.children
    expect(link1.props.className).toEqual(link2.props.className)
    expect(link1.props.className).not.toEqual(link3.props.className)
  })
})
