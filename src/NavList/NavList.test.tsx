import {render, fireEvent} from '@testing-library/react'
import React from 'react'
import {ThemeProvider, SSRProvider} from '..'
import {NavList} from './NavList'

describe('NavList', () => {
  it('renders a simple list', () => {
    const {container} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Item href="/" aria-current="page">
              Home
            </NavList.Item>
            <NavList.Item href="/about">About</NavList.Item>
            <NavList.Item href="/contact">Contact</NavList.Item>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with groups', () => {
    const {container} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Group title="Overview">
              <NavList.Item href="/getting-started" aria-current="page">
                Getting started
              </NavList.Item>
            </NavList.Group>
            <NavList.Group title="Components">
              <NavList.Item href="/Avatar">Avatar</NavList.Item>
            </NavList.Group>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('NavList.Item', () => {
  it('passes aria-current prop to the underlying link', () => {
    const {getByRole} = render(
      <NavList>
        <NavList.Item href="/" aria-current="page">
          Home
        </NavList.Item>
        <NavList.Item href="/about">About</NavList.Item>
        <NavList.Item href="/contact">Contact</NavList.Item>
      </NavList>
    )

    const homeLink = getByRole('link', {name: 'Home'})
    const aboutLink = getByRole('link', {name: 'About'})

    expect(homeLink).toHaveAttribute('aria-current', 'page')
    expect(aboutLink).not.toHaveAttribute('aria-current')
  })
})

describe('NavList.Item with NavList.SubNav', () => {
  function NavListWithSubNav() {
    return (
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item href="#">
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#">Sub Item 1</NavList.Item>
            <NavList.Item href="#">Sub Item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    )
  }

  function NavListWithCurrentSubNav() {
    return (
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item href="#">
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#" aria-current="page">
              Sub Item 1
            </NavList.Item>
            <NavList.Item href="#">Sub Item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>
    )
  }

  it('renders as a button', () => {
    const {queryByRole} = render(<NavListWithSubNav />)
    const itemWithSubNav = queryByRole('button', {name: 'Item 2'})
    expect(itemWithSubNav).toBeInTheDocument()
  })

  it('ignores aria-current prop', () => {
    const {queryByRole} = render(<NavListWithSubNav />)
    const itemWithSubNav = queryByRole('button', {name: 'Item 2'})
    expect(itemWithSubNav).not.toHaveAttribute('aria-current')
  })

  it('shows SubNav by default if SubNav contains the current item', () => {
    const {queryByRole, getByRole} = render(<NavListWithCurrentSubNav />)

    // Starts open
    expect(queryByRole('list', {name: 'Item 2'})).toBeVisible()

    // Click to close
    const itemWithSubNav = getByRole('button', {name: 'Item 2'})
    fireEvent.click(itemWithSubNav)
    expect(queryByRole('list', {name: 'Item 2'})).toBeNull()
  })

  it('hides SubNav by default if SubNav does not contain the current item', () => {
    const {queryByRole} = render(<NavListWithSubNav />)
    const subNav = queryByRole('list', {name: 'Item 2'})
    expect(subNav).toBeNull()
  })

  it('toggles visiblility of SubNav when clicked', () => {
    const {getByRole, queryByRole} = render(<NavListWithSubNav />)
    const itemWithSubNav = getByRole('button', {name: 'Item 2'})

    // Starts closed
    expect(queryByRole('list', {name: 'Item 2'})).toBeNull()

    // Click to open
    fireEvent.click(itemWithSubNav)
    expect(queryByRole('list', {name: 'Item 2'})).toBeVisible()

    // Click to close
    fireEvent.click(itemWithSubNav)
    expect(queryByRole('list', {name: 'Item 2'})).toBeNull()
  })

  it('has active styles if SubNav contains the current item and is closed', () => {
    const {container, getByRole, queryByRole} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Item>
              Item
              <NavList.SubNav>
                <NavList.Item href="#" aria-current="page">
                  Sub Item
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )

    const button = getByRole('button')

    // Starts open
    expect(queryByRole('list', {name: 'Item'})).toBeVisible()

    // Click to close
    fireEvent.click(button)
    expect(queryByRole('list', {name: 'Item'})).toBeNull()

    // Snapshot styles
    expect(container).toMatchSnapshot()
  })

  it('does not have active styles if SubNav contains the current item and is open', () => {
    const {container, queryByRole} = render(
      <ThemeProvider>
        <SSRProvider>
          <NavList>
            <NavList.Item>
              Item
              <NavList.SubNav>
                <NavList.Item href="#" aria-current="page">
                  Sub Item
                </NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </SSRProvider>
      </ThemeProvider>
    )

    // Starts open
    expect(queryByRole('list', {name: 'Item'})).toBeVisible()

    // Snapshot styles
    expect(container).toMatchSnapshot()
  })

  it('prevents multiple levels of nested SubNavs', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      // Suppress error message in test output
      .mockImplementation(() => null)

    const {getByRole} = render(
      <NavList>
        <NavList.Item>
          Item
          <NavList.SubNav>
            <NavList.Item>
              Sub item
              {/* NOTE: Don't nest SubNavs. For testing purposes only */}
              <NavList.SubNav>
                <NavList.Item href="#">Sub sub item</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
      </NavList>
    )

    const item = getByRole('button', {name: 'Item'})
    fireEvent.click(item)

    expect(consoleSpy).toHaveBeenCalled()
  })
})
