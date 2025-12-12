import {describe, it, expect, vi} from 'vitest'
import {render, fireEvent, act} from '@testing-library/react'
import React from 'react'
import {NavList} from './NavList'
import {FeatureFlags} from '../FeatureFlags'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'
import {implementsClassName} from '../utils/testing'

type NextJSLinkProps = {href: string; children: React.ReactNode}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, NextJSLinkProps>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({href, children}, ref): React.ReactElement<any> => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    // eslint-disable-next-line react-hooks/refs
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

describe('NavList', () => {
  implementsClassName(NavList)

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
  implementsClassName(NavList.Item)
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

  it('is compatible with React-Router-like link components', () => {
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

  it('toggles visibility of SubNav when clicked', () => {
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

  it('prevents more than 4 levels of nested SubNavs', () => {
    const consoleSpy = vi
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

  it('is compatible with React-Router-like link components', () => {
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

describe('NavList.GroupExpand', () => {
  function NavListWithExpand() {
    const items = [
      {text: 'Item 3', href: '#'},
      {text: 'Item 4', href: '#'},
    ]

    return (
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.GroupExpand label="More" items={items} />
      </NavList>
    )
  }

  it('renders with button', () => {
    const {queryByRole} = render(<NavListWithExpand />)
    const button = queryByRole('button', {name: 'More'})
    expect(button).toBeInTheDocument()
  })

  it('renders button as child of <ul>', () => {
    const {queryByRole} = render(<NavListWithExpand />)
    const button = queryByRole('button', {name: 'More'})
    const buttonParent = button!.parentElement as HTMLButtonElement

    expect(buttonParent).toBeInTheDocument()
    expect(buttonParent.tagName).toEqual('LI')
    expect(buttonParent.parentElement?.tagName).toEqual('UL')
  })

  it('hides items inside of NavList.ShowMoreItem by default', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    expect(queryByRole('link', {name: 'Item 1'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 2'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 3'})).not.toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 4'})).not.toBeInTheDocument()
  })

  it('shows items inside of NavList.ShowMoreItem when expand button is activated', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    act(() => {
      queryByRole('button', {name: 'More'})?.click()
    })

    expect(queryByRole('link', {name: 'Item 1'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 2'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 3'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 4'})).toBeInTheDocument()

    expect(queryByRole('button', {name: 'More'})).not.toBeInTheDocument()
  })

  it('removes expand button after it is activated', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    act(() => {
      queryByRole('button', {name: 'More'})?.click()
    })

    expect(queryByRole('button', {name: 'More'})).not.toBeInTheDocument()
  })

  it('places focus on the first of the newly shown list item', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    act(() => {
      queryByRole('button', {name: 'More'})?.click()
    })

    expect(queryByRole('link', {name: 'Item 3'})).toHaveFocus()
  })
})

describe('NavList.GroupExpand with Group', () => {
  function NavListWithExpand() {
    const items1 = [
      {text: 'Item 1D', href: '#'},
      {text: 'Item 1E', href: '#'},
      {text: 'Item 1F', href: '#'},
    ]

    const items2 = [
      {text: 'Item 2D', href: '#'},
      {text: 'Item 2E', href: '#'},
      {text: 'Item 2F', href: '#'},
    ]

    return (
      <NavList>
        <NavList.Group title="Group 1">
          <NavList.Item aria-current="true" href="#">
            Item 1A
          </NavList.Item>
          <NavList.Item href="#">Item 1B</NavList.Item>
          <NavList.Item href="#">Item 1C</NavList.Item>
          <NavList.GroupExpand label="More" items={items1} />
        </NavList.Group>
        <NavList.Group title="Group 2">
          <NavList.Item href="#">Item 2A</NavList.Item>
          <NavList.Item href="#">Item 2B</NavList.Item>
          <NavList.Item href="#">Item 2C</NavList.Item>
          <NavList.GroupExpand label="Show" items={items2} />
        </NavList.Group>
      </NavList>
    )
  }

  it('renders expand buttons for each group', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    expect(queryByRole('button', {name: 'More'})).toBeInTheDocument()
    expect(queryByRole('button', {name: 'Show'})).toBeInTheDocument()
  })

  it('renders expand buttons as within <ul>', () => {
    const {queryByRole} = render(<NavListWithExpand />)

    const group1Button = queryByRole('button', {name: 'More'})
    const buttonParent = group1Button?.parentElement as HTMLUListElement

    expect(buttonParent).toBeInTheDocument()
    expect(buttonParent.tagName).toEqual('LI')
    expect(buttonParent.parentElement!.tagName).toEqual('UL')
  })
})

describe('NavList.ShowMoreItem with pages', () => {
  function NavListExpandWithPages() {
    const items = [
      {text: 'Item 3', href: '#'},
      {text: 'Item 4', href: '#'},
      {text: 'Item 5', href: '#'},
      {text: 'Item 6', href: '#'},
      {text: 'Item 7', href: '#'},
    ]

    return (
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
        <NavList.GroupExpand pages={2} label="More" items={items} />
      </NavList>
    )
  }

  it('renders an expand button', () => {
    const {queryByRole} = render(<NavListExpandWithPages />)

    expect(queryByRole('button', {name: 'More'})).toBeInTheDocument()
  })

  it('expands the list when the expand button is clicked', () => {
    const {queryByRole} = render(<NavListExpandWithPages />)
    const button = queryByRole('button', {name: 'More'})

    act(() => {
      button?.click()
    })

    expect(queryByRole('link', {name: 'Item 3'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 4'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 5'})).toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 6'})).not.toBeInTheDocument()
    expect(queryByRole('link', {name: 'Item 7'})).not.toBeInTheDocument()
  })
})
