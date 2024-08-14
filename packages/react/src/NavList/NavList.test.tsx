import {render, fireEvent} from '@testing-library/react'
import React from 'react'
import {ThemeProvider} from '..'
import {NavList} from './NavList'
import {FeatureFlags} from '../FeatureFlags'

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}

const ReactRouterLikeLink = React.forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, children, ...props}, ref) => {
    return (
      <a ref={ref} href={to} {...props}>
        {children}
      </a>
    )
  },
)

type NextJSLinkProps = {href: string; children: React.ReactNode}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, NextJSLinkProps>(
  ({href, children}, ref): React.ReactElement => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

describe('NavList', () => {
  it('renders a simple list', () => {
    const {container} = render(
      <ThemeProvider>
        <NavList>
          <NavList.Item href="/" aria-current="page">
            Home
          </NavList.Item>
          <NavList.Item href="/about">About</NavList.Item>
          <NavList.Item href="/contact">Contact</NavList.Item>
        </NavList>
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with groups', () => {
    const {container} = render(
      <ThemeProvider>
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
      </ThemeProvider>,
    )
    expect(container).toMatchSnapshot()
  })

  it('supports TrailingAction', async () => {
    const {getByRole} = render(
      <NavList>
        <NavList.Item>
          Item 1
          <NavList.TrailingAction label="Some trailing action" />
        </NavList.Item>
      </NavList>,
    )

    const trailingAction = getByRole('button', {name: 'Some trailing action'})
    expect(trailingAction).toBeInTheDocument()
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
      </NavList>,
    )

    const homeLink = getByRole('link', {name: 'Home'})
    const aboutLink = getByRole('link', {name: 'About'})

    expect(homeLink).toHaveAttribute('aria-current', 'page')
    expect(aboutLink).not.toHaveAttribute('aria-current')
  })

  it('is compatiable with React-Router-like link components', () => {
    const {getByRole} = render(
      <NavList>
        <NavList.Item as={ReactRouterLikeLink} to={'/'} aria-current="page">
          React Router link
        </NavList.Item>
      </NavList>,
    )

    const link = getByRole('link', {name: 'React Router link'})

    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('href', '/')
  })

  it('is compatible with NextJS-like link components', () => {
    const {getByRole} = render(
      <NavList>
        <NextJSLikeLink href="/">
          <NavList.Item aria-current="page">NextJS link</NavList.Item>
        </NextJSLikeLink>
      </NavList>,
    )

    const link = getByRole('link', {name: 'NextJS link'})

    expect(link).toHaveAttribute('href', '/')
    expect(link).toHaveAttribute('aria-current', 'page')
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
      </ThemeProvider>,
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
      </ThemeProvider>,
    )

    // Starts open
    expect(queryByRole('list', {name: 'Item'})).toBeVisible()

    // Snapshot styles
    expect(container).toMatchSnapshot()
  })

  it('prevents more than 4 levels of nested SubNavs', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      // Suppress error message in test output
      .mockImplementation(() => null)

    const {getByRole} = render(
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item href="#">
          Item 2{/* NOTE: Don't nest SubNavs. For testing purposes only */}
          <NavList.SubNav>
            <NavList.Item href="#">
              Sub item 1
              <NavList.SubNav>
                <NavList.Item href="#">
                  Sub item 1.1
                  <NavList.SubNav>
                    <NavList.Item href="#">Sub item 1.1.1</NavList.Item>
                    <NavList.Item href="#">
                      Sub item 1.1.2
                      <NavList.SubNav>
                        <NavList.Item href="#">Sub item 1.1.2.1</NavList.Item>
                        <NavList.Item href="#">
                          Sub item 1.1.2.2
                          <NavList.SubNav>
                            <NavList.Item href="#" aria-current="page">
                              Sub item 1.1.2.2.1
                            </NavList.Item>
                            <NavList.Item href="#">Sub item 1.1.2.2.2</NavList.Item>
                          </NavList.SubNav>
                        </NavList.Item>
                      </NavList.SubNav>
                    </NavList.Item>
                  </NavList.SubNav>
                </NavList.Item>
                <NavList.Item href="#">Sub item 1.2</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
            <NavList.Item href="#">Sub item 2</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
        <NavList.Item href="#">Item 3</NavList.Item>
      </NavList>,
    )

    const item = getByRole('button', {name: 'Item 2'})
    fireEvent.click(item)

    expect(consoleSpy).toHaveBeenCalled()
  })

  it('is compatiable with React-Router-like link components', () => {
    function NavLink({href, children}: {href: string; children: React.ReactNode}) {
      // In a real app, you'd check if the href matches the url of the current page. For testing purposes, we'll use the text of the link to determine if it's current
      const isCurrent = children === 'Current'
      return (
        <NavList.Item as={ReactRouterLikeLink} to={href} aria-current={isCurrent ? 'page' : false}>
          {children}
        </NavList.Item>
      )
    }

    const {queryByRole} = render(
      <NavList>
        <NavLink href="/">Item 1</NavLink>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavLink href="/sub-item-1">Current</NavLink>
            <NavLink href="/sub-item-2">Sub item 2</NavLink>
          </NavList.SubNav>
        </NavList.Item>
        <NavLink href="/">Item 3</NavLink>
      </NavList>,
    )

    const currentLink = queryByRole('link', {name: 'Current'})
    expect(currentLink).toBeVisible()
  })

  describe('TrailingAction', () => {
    function NavListWithSubNavAndTrailingAction() {
      return (
        <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
          <NavList>
            <NavList.Item href="#">
              Item
              <NavList.TrailingAction label="This should not be rendered" />
              <NavList.SubNav>
                <NavList.Item href="#">
                  Sub Item 1
                  <NavList.TrailingAction label="Trailing Action for Sub Item 1" />
                </NavList.Item>
                <NavList.Item href="#">Sub Item 2</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </FeatureFlags>
      )
    }

    it('does not render TrailingAction alongside SubNav', async () => {
      const {queryByRole} = render(<NavListWithSubNavAndTrailingAction />)

      const trailingAction = queryByRole('button', {name: 'This should not be rendered'})
      expect(trailingAction).toBeNull()
    })

    it('supports TrailingAction within an Item inside SubNav', async () => {
      const {getByRole, queryByRole} = render(<NavListWithSubNavAndTrailingAction />)

      const itemWithSubNav = getByRole('button', {name: 'Item'})
      fireEvent.click(itemWithSubNav)

      expect(queryByRole('link', {name: 'Sub Item 1'})).toBeVisible()
      expect(queryByRole('button', {name: 'Trailing Action for Sub Item 1'})).toBeVisible()
    })
  })
})
