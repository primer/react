import {screen, render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import SideNav from '../SideNav'
import classes from '../SideNav.module.css'
import {implementsClassName} from '../utils/testing'

describe('SideNav', () => {
  implementsClassName(SideNav, classes.SideNav)
  implementsClassName(SideNav.Link, classes.SideNavLink)
  it('renders a <nav> and <a>', () => {
    expect(render(<SideNav />).container.firstChild).toHaveProperty('tagName', 'NAV')
    expect(render(<SideNav.Link />).container.firstChild).toHaveProperty('tagName', 'A')
  })

  it('sets aria-label appropriately', () => {
    render(<SideNav aria-label="Label" />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Label')
  })

  it('sets aria-current on a selected link', () => {
    const {getByRole} = render(
      <SideNav>
        <SideNav.Link href="#one">One</SideNav.Link>
        <SideNav.Link href="#two" selected>
          Two
        </SideNav.Link>
      </SideNav>,
    )
    expect(getByRole('link', {name: 'Two'})).toHaveAttribute('aria-current', 'page')
  })

  it('sets different styles for SideNavs with the lightweight variant', () => {
    const {container: regular} = render(<SideNav />)
    const {container: lightweight} = render(<SideNav variant="lightweight" />)
    expect(regular.firstElementChild?.className).toEqual(expect.stringContaining('variant-normal'))
    expect(lightweight.firstElementChild?.className).toEqual(expect.stringContaining('variant-lightweight'))
  })
})
