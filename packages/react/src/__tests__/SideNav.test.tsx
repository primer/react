import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import SideNav from '../SideNav'
import classes from '../SideNav.module.css'
import {implementsClassName} from '../utils/testing'

describe('SideNav', () => {
  implementsClassName(SideNav, classes.SideNav)
  implementsClassName(SideNav.Link, classes.SideNavLink)
  it('renders a <nav> and <a>', () => {
    render(<SideNav />)
    expect(page.getByRole('navigation').element()).toHaveProperty('tagName', 'NAV')
    expect(render(<SideNav.Link />).container.firstChild).toHaveProperty('tagName', 'A')
  })

  it('renders data-component attributes', async () => {
    render(
      <SideNav aria-label="Label">
        <SideNav.Link href="#one">One</SideNav.Link>
      </SideNav>,
    )

    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-component', 'SideNav')
    await expect
      .element(page.getByRole('link', {name: 'One', exact: true}))
      .toHaveAttribute('data-component', 'SideNav.Link')
  })

  it('sets aria-label appropriately', async () => {
    render(<SideNav aria-label="Label" />)
    await expect.element(page.getByRole('navigation')).toHaveAttribute('aria-label', 'Label')
  })

  it('sets aria-current on a selected link', async () => {
    render(
      <SideNav>
        <SideNav.Link href="#one">One</SideNav.Link>
        <SideNav.Link href="#two" selected>
          Two
        </SideNav.Link>
      </SideNav>,
    )
    await expect.element(page.getByRole('link', {name: 'Two', exact: true})).toHaveAttribute('aria-current', 'page')
  })

  it('sets different styles for SideNavs with the lightweight variant', () => {
    render(<SideNav />)
    render(<SideNav variant="lightweight" />)
    const navs = page.getByRole('navigation')
    expect(navs.nth(0).element().className).toEqual(expect.stringContaining('variant-normal'))
    expect(navs.nth(1).element().className).toEqual(expect.stringContaining('variant-lightweight'))
  })
})
