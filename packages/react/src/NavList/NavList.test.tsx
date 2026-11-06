import {describe, it, expect, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {NavList, type NavListGroupHeadingProps} from './NavList'
import {ReactRouterLikeLink} from '../Pagination/mocks/ReactRouterLink'
import {implementsClassName} from '../utils/testing'
import {FeatureFlags} from '../FeatureFlags'
import {asSlot} from '../utils/as-slot'

type NextJSLinkProps = {href: string; children: React.ReactNode}

const NextJSLikeLink = React.forwardRef<HTMLAnchorElement, NextJSLinkProps>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({href, children}, ref): React.ReactElement<any> => {
    const child = React.Children.only(children)
    const childProps = {
      ref,
      href,
    }
    return <>{React.isValidElement(child) ? React.cloneElement(child, childProps) : null}</>
  },
)

describe('NavList', () => {
  implementsClassName(NavList)

  it('renders data-component attributes for NavList, NavList.Item, and NavList.SubNav', async () => {
    const {container} = render(
      <NavList>
        <NavList.Item href="#">Item 1</NavList.Item>
        <NavList.Item>
          Item 2
          <NavList.SubNav>
            <NavList.Item href="#">Sub Item 1</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
      </NavList>,
    )

    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('data-component', 'NavList')

    const item1Link = page.getByRole('link', {name: 'Item 1'}).element()
    expect(item1Link).toBeInTheDocument()
    expect(item1Link).toHaveAttribute('data-component', 'NavList.Item')

    const item2Button = page.getByRole('button', {name: 'Item 2'})
    expect(item2Button.element()).toBeInTheDocument()
    expect(item2Button.element()).toHaveAttribute('data-component', 'NavList.Item')

    const subNav = container.querySelector('[data-component="NavList.SubNav"]')
    expect(subNav).toBeInTheDocument()

    // Expand so nested links are in the accessible tree
    await userEvent.click(item2Button)

    const subItem1Link = page.getByRole('link', {name: 'Sub Item 1'}).element()
    expect(subItem1Link).toBeInTheDocument()
    expect(subItem1Link).toHaveAttribute('data-component', 'NavList.Item')
  })

  it('supports TrailingAction', async () => {
    render(
      <NavList>
        <NavList.Item>
          Item 1
          <NavList.TrailingAction label="Some trailing action" />
        </NavList.Item>
      </NavList>,
    )

    const trailingAction = page.getByRole('button', {name: 'Some trailing action'}).element()
    expect(trailingAction).toBeInTheDocument()
  })
})

describe('NavList.Item', () => {
  implementsClassName(NavList.Item)

  it('preserves a focused link and its visual when a sibling status changes', () => {
    const renderItems = (working: boolean) => (
      <NavList>
        <NavList.Item href="#first">
          <NavList.LeadingVisual>
            <span data-testid="working-visual">Working</span>
          </NavList.LeadingVisual>
          First session
        </NavList.Item>
        <NavList.Item href="#second">Second session {working ? 'working' : 'completed'}</NavList.Item>
      </NavList>
    )
    const {getByRole, getByTestId, rerender} = render(renderItems(false))
    const link = getByRole('link', {name: 'First session'})
    const visual = getByTestId('working-visual')
    link.focus()

    rerender(renderItems(true))

    expect(getByRole('link', {name: 'First session'})).toBe(link)
    expect(getByTestId('working-visual')).toBe(visual)
    expect(link).toHaveFocus()
    expect(getByRole('link', {name: 'Second session working'})).toBeInTheDocument()
  })

  it('renders a tooltip inside a link item when tooltipText is provided', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const {container} = render(
      <NavList>
        <NavList.Item ref={ref} href="#" tooltipText="Tooltip for item 1">
          Item 1
        </NavList.Item>
        <NavList.Item href="#">Item 2</NavList.Item>
      </NavList>,
    )

    const link = page.getByRole('link', {name: 'Item 1'}).element()
    const tooltip = container.querySelector('[data-component="Tooltip"]')
    const list = container.querySelector('[data-component="ActionList"]')

    expect(tooltip).not.toBeNull()
    expect(ref.current).toBe(link)
    expect(link).toHaveAttribute('aria-describedby', (tooltip as HTMLElement).id)
    expect(tooltip).toHaveTextContent('Tooltip for item 1')
    expect(tooltip?.closest('li')).toBe(link.closest('li'))
    expect(list?.children).toHaveLength(2)
    expect(container.querySelectorAll('[data-component="Tooltip"]')).toHaveLength(1)
  })

  it('renders a tooltip inside an expandable item when tooltipText is provided', () => {
    const {container} = render(
      <NavList>
        <NavList.Item tooltipText="Tooltip for parent item">
          Parent item
          <NavList.SubNav>
            <NavList.Item href="#">Child item</NavList.Item>
          </NavList.SubNav>
        </NavList.Item>
      </NavList>,
    )

    const button = page.getByRole('button', {name: 'Parent item'}).element()
    const tooltip = container.querySelector('[data-component="Tooltip"]')

    expect(tooltip).not.toBeNull()
    expect(button).toHaveAttribute('aria-describedby', (tooltip as HTMLElement).id)
    expect(tooltip).toHaveTextContent('Tooltip for parent item')
    expect(tooltip?.closest('li')).toBe(button.closest('li'))
  })

  it('passes aria-current prop to the underlying link', () => {
    render(
      <NavList>
        <NavList.Item href="/" aria-current="page">
          Home
        </NavList.Item>
        <NavList.Item href="/about">About</NavList.Item>
        <NavList.Item href="/contact">Contact</NavList.Item>
      </NavList>,
    )

    const homeLink = page.getByRole('link', {name: 'Home'}).element()
    const aboutLink = page.getByRole('link', {name: 'About'}).element()

    expect(homeLink).toHaveAttribute('aria-current', 'page')
    expect(aboutLink).not.toHaveAttribute('aria-current')
  })

  it('is compatible with React-Router-like link components', () => {
    render(
      <NavList>
        <NavList.Item as={ReactRouterLikeLink} to={'/'} aria-current="page">
          React Router link
        </NavList.Item>
      </NavList>,
    )

    const link = page.getByRole('link', {name: 'React Router link'}).element()

    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('href', '/')
  })

  it('is compatible with NextJS-like link components', () => {
    render(
      <NavList>
        <NextJSLikeLink href="/">
          <NavList.Item aria-current="page">NextJS link</NavList.Item>
        </NextJSLikeLink>
      </NavList>,
    )

    const link = page.getByRole('link', {name: 'NextJS link'}).element()

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
    render(<NavListWithSubNav />)
    const itemWithSubNav = page.getByRole('button', {name: 'Item 2'}).elements()[0] ?? null
    expect(itemWithSubNav).toBeInTheDocument()
  })

  it('ignores aria-current prop', () => {
    render(<NavListWithSubNav />)
    const itemWithSubNav = page.getByRole('button', {name: 'Item 2'}).elements()[0] ?? null
    expect(itemWithSubNav).not.toHaveAttribute('aria-current')
  })

  it('shows SubNav by default if SubNav contains the current item', async () => {
    render(<NavListWithCurrentSubNav />)

    // Starts open
    expect(page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null).toBeVisible()

    // Click to close
    const itemWithSubNav = page.getByRole('button', {name: 'Item 2'})
    await userEvent.click(itemWithSubNav)
    expect(page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null).toBeNull()
  })

  it('renders parent item expanded on initial static render when SubNav contains the current item', () => {
    // intentionally suppress the expected React SSR useLayoutEffect warning
    // this test focuses specifically on the initial SSR render
    const container = document.createElement('div')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => null)
    try {
      container.innerHTML = renderToStaticMarkup(<NavListWithCurrentSubNav />)
    } finally {
      consoleSpy.mockRestore()
    }

    const item2Button = container.querySelector('button[aria-expanded]')
    expect(item2Button).not.toBeNull()
    expect(item2Button).toHaveAttribute('aria-expanded', 'true')
    expect(item2Button?.textContent).toBe('Item 2')
  })

  it('hides SubNav by default if SubNav does not contain the current item', () => {
    render(<NavListWithSubNav />)
    const subNav = page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null
    expect(subNav).toBeNull()
  })

  it('toggles visibility of SubNav when clicked', async () => {
    render(<NavListWithSubNav />)
    const itemWithSubNav = page.getByRole('button', {name: 'Item 2'})

    // Starts closed
    expect(page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null).toBeNull()

    // Click to open
    await userEvent.click(itemWithSubNav)
    expect(page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null).toBeVisible()

    // Click to close
    await userEvent.click(itemWithSubNav)
    expect(page.getByRole('list', {name: 'Item 2'}).elements()[0] ?? null).toBeNull()
  })

  it('prevents more than 4 levels of nested SubNavs', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      // Suppress error message in test output
      .mockImplementation(() => null)

    render(
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

    const item = page.getByRole('button', {name: 'Item 2'})
    await userEvent.click(item)

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

    render(
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

    const currentLink = page.getByRole('link', {name: 'Current'}).elements()[0] ?? null
    expect(currentLink).toBeVisible()
  })

  describe('TrailingAction', () => {
    function NavListWithSubNavAndTrailingAction() {
      return (
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
      )
    }

    it('does not render TrailingAction alongside SubNav', async () => {
      render(<NavListWithSubNavAndTrailingAction />)

      const trailingAction = page.getByRole('button', {name: 'This should not be rendered'}).elements()[0] ?? null
      expect(trailingAction).toBeNull()
    })

    it('supports TrailingAction within an Item inside SubNav', async () => {
      render(<NavListWithSubNavAndTrailingAction />)

      const itemWithSubNav = page.getByRole('button', {name: 'Item'})
      await userEvent.click(itemWithSubNav)

      expect(page.getByRole('link', {name: 'Sub Item 1'}).elements()[0] ?? null).toBeVisible()
      expect(page.getByRole('button', {name: 'Trailing Action for Sub Item 1'}).elements()[0] ?? null).toBeVisible()
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
    render(<NavListWithExpand />)
    const button = page.getByRole('button', {name: 'More'}).element()
    expect(button).toBeInTheDocument()
  })

  it('renders button as child of <ul>', () => {
    render(<NavListWithExpand />)
    const button = page.getByRole('button', {name: 'More'}).element()
    const buttonParent = button!.parentElement as HTMLButtonElement

    expect(buttonParent).toBeInTheDocument()
    expect(buttonParent.tagName).toEqual('LI')
    expect(buttonParent.parentElement?.tagName).toEqual('UL')
  })

  it('hides items inside of NavList.ShowMoreItem by default', () => {
    render(<NavListWithExpand />)

    expect(page.getByRole('link', {name: 'Item 1'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 2'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 3'}).elements()[0] ?? null).not.toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 4'}).elements()[0] ?? null).not.toBeInTheDocument()
  })

  it('shows items inside of NavList.ShowMoreItem when expand button is activated', async () => {
    render(<NavListWithExpand />)

    await userEvent.click(page.getByRole('button', {name: 'More'}))

    expect(page.getByRole('link', {name: 'Item 1'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 2'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 3'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 4'}).elements()[0] ?? null).toBeInTheDocument()

    expect(page.getByRole('button', {name: 'More'}).elements()[0] ?? null).not.toBeInTheDocument()
  })

  it('removes expand button after it is activated', async () => {
    render(<NavListWithExpand />)

    await userEvent.click(page.getByRole('button', {name: 'More'}))

    expect(page.getByRole('button', {name: 'More'}).elements()[0] ?? null).not.toBeInTheDocument()
  })

  it('places focus on the first of the newly shown list item', async () => {
    render(<NavListWithExpand />)

    await userEvent.click(page.getByRole('button', {name: 'More'}))

    expect(page.getByRole('link', {name: 'Item 3'}).elements()[0] ?? null).toHaveFocus()
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
    render(<NavListWithExpand />)

    expect(page.getByRole('button', {name: 'More'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('button', {name: 'Show'}).elements()[0] ?? null).toBeInTheDocument()
  })

  it('renders expand buttons as within <ul>', () => {
    render(<NavListWithExpand />)

    const group1Button = page.getByRole('button', {name: 'More'}).element()
    const buttonParent = group1Button.parentElement as HTMLUListElement

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
    render(<NavListExpandWithPages />)

    expect(page.getByRole('button', {name: 'More'}).elements()[0] ?? null).toBeInTheDocument()
  })

  it('expands the list when the expand button is clicked', async () => {
    render(<NavListExpandWithPages />)
    const button = page.getByRole('button', {name: 'More'})

    await userEvent.click(button)

    expect(page.getByRole('link', {name: 'Item 3'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 4'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 5'}).elements()[0] ?? null).toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 6'}).elements()[0] ?? null).not.toBeInTheDocument()
    expect(page.getByRole('link', {name: 'Item 7'}).elements()[0] ?? null).not.toBeInTheDocument()
  })

  it('passes through as props to the link items', async () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {custom: boolean}
    >(({children, custom, ...props}, ref) => (
      <a ref={ref} data-custom-link={custom} {...props}>
        {children}
      </a>
    ))
    CustomLink.displayName = 'CustomLink'

    render(
      <NavList>
        <NavList.Item as={CustomLink} href="#item1" custom={true}>
          Item 1
        </NavList.Item>
        <NavList.Item as={CustomLink} href="#item2" custom={false}>
          Item 2
        </NavList.Item>
        <NavList.GroupExpand
          label="More"
          items={[
            {text: 'Item 3', href: '#item3'},
            {text: 'Item 4', href: '#item4'},
          ]}
        />
      </NavList>,
    )

    await userEvent.click(page.getByRole('button', {name: 'More'}))

    expect(page.getByRole('link', {name: 'Item 1'}).elements()[0] ?? null).toHaveAttribute('href', '#item1')
    expect(page.getByRole('link', {name: 'Item 1'}).elements()[0] ?? null).toHaveAttribute('data-custom-link', 'true')
    expect(page.getByRole('link', {name: 'Item 2'}).elements()[0] ?? null).toHaveAttribute('href', '#item2')
    expect(page.getByRole('link', {name: 'Item 2'}).elements()[0] ?? null).toHaveAttribute('data-custom-link', 'false')
    expect(page.getByRole('link', {name: 'Item 3'}).elements()[0] ?? null).toHaveAttribute('href', '#item3')
    expect(page.getByRole('link', {name: 'Item 4'}).elements()[0] ?? null).toHaveAttribute('href', '#item4')
  })

  describe('item gap feature flag', () => {
    it('does not set data-item-gap on the underlying ActionList by default', () => {
      const {container} = render(
        <NavList>
          <NavList.Item href="#" aria-current="page">
            Home
          </NavList.Item>
          <NavList.Item href="#">About</NavList.Item>
        </NavList>,
      )

      expect(container.querySelector('[data-component="ActionList"]')).not.toHaveAttribute('data-item-gap')
    })

    it('sets data-item-gap on the underlying ActionList when the primer_react_action_list_item_gap feature flag is enabled', () => {
      const {container} = render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <NavList>
            <NavList.Item href="#" aria-current="page">
              Home
            </NavList.Item>
            <NavList.Item href="#">About</NavList.Item>
          </NavList>
        </FeatureFlags>,
      )

      expect(container.querySelector('[data-component="ActionList"]')).toHaveAttribute('data-item-gap', '')
    })

    it('does not set data-item-gap when disableItemGap is set and the feature flag is enabled', () => {
      const {container} = render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <NavList disableItemGap>
            <NavList.Item href="#" aria-current="page">
              Home
            </NavList.Item>
            <NavList.Item href="#">About</NavList.Item>
          </NavList>
        </FeatureFlags>,
      )

      expect(container.querySelector('[data-component="ActionList"]')).not.toHaveAttribute('data-item-gap')
      expect(container.querySelector('nav')).not.toHaveAttribute('disableitemgap')
    })

    it('adds a gap between a parent item and the first item of its expanded sub-nav when the feature flag is enabled', () => {
      const {container} = render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <NavList>
            <NavList.Item defaultOpen href="#">
              Item 1
              <NavList.SubNav>
                <NavList.Item href="#">Sub item 1</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </FeatureFlags>,
      )

      const subGroup = container.querySelector('ul[aria-labelledby]')
      expect(subGroup).not.toBeNull()
      expect(getComputedStyle(subGroup as HTMLElement).marginBlockStart).toBe('2px')
    })

    it('does not add a gap before a sub-nav when the feature flag is disabled', () => {
      const {container} = render(
        <NavList>
          <NavList.Item defaultOpen href="#">
            Item 1
            <NavList.SubNav>
              <NavList.Item href="#">Sub item 1</NavList.Item>
            </NavList.SubNav>
          </NavList.Item>
        </NavList>,
      )

      const subGroup = container.querySelector('ul[aria-labelledby]')
      expect(subGroup).not.toBeNull()
      expect(getComputedStyle(subGroup as HTMLElement).marginBlockStart).toBe('0px')
    })

    it('does not add a gap before a sub-nav when disableItemGap is set and the feature flag is enabled', () => {
      const {container} = render(
        <FeatureFlags flags={{primer_react_action_list_item_gap: true}}>
          <NavList disableItemGap>
            <NavList.Item defaultOpen href="#">
              Item 1
              <NavList.SubNav>
                <NavList.Item href="#">Sub item 1</NavList.Item>
              </NavList.SubNav>
            </NavList.Item>
          </NavList>
        </FeatureFlags>,
      )

      const subGroup = container.querySelector('ul[aria-labelledby]')
      expect(subGroup).not.toBeNull()
      expect(getComputedStyle(subGroup as HTMLElement).marginBlockStart).toBe('0px')
    })
  })

  describe('NavList.Heading', () => {
    it('renders an h2 heading by default', () => {
      render(
        <NavList>
          <NavList.Heading>Settings</NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 2, name: 'Settings'}).element()).toBeInTheDocument()
    })

    it('respects an explicit heading level via the `as` prop', () => {
      render(
        <NavList>
          <NavList.Heading as="h3">Settings</NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 3, name: 'Settings'}).element()).toBeInTheDocument()
    })

    it('labels the nav landmark with the heading', () => {
      render(
        <NavList>
          <NavList.Heading>Settings</NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      const nav = page.getByRole('navigation', {name: 'Settings'}).element()
      const heading = page.getByRole('heading', {name: 'Settings'}).element()
      expect(nav).toHaveAttribute('aria-labelledby', heading.id)
    })

    it('does not override a consumer-supplied aria-label', () => {
      render(
        <NavList aria-label="Custom label">
          <NavList.Heading>Settings</NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      const nav = page.getByRole('navigation', {name: 'Custom label'}).element()
      expect(nav).not.toHaveAttribute('aria-labelledby')
    })

    it('defaults group headings to one level below the NavList.Heading', () => {
      render(
        <NavList>
          <NavList.Heading>Settings</NavList.Heading>
          <NavList.Group title="Account">
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 2, name: 'Settings'}).element()).toBeInTheDocument()
      expect(page.getByRole('heading', {level: 3, name: 'Account'}).element()).toBeInTheDocument()
    })

    it('derives group headings to h4 when the NavList.Heading is an h3', () => {
      render(
        <NavList>
          <NavList.Heading as="h3">Settings</NavList.Heading>
          <NavList.Group title="Account">
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 3, name: 'Settings'}).element()).toBeInTheDocument()
      expect(page.getByRole('heading', {level: 4, name: 'Account'}).element()).toBeInTheDocument()
    })

    it('keeps the h3 group heading default when there is no NavList.Heading', () => {
      render(
        <NavList>
          <NavList.Group title="Account">
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 3, name: 'Account'}).element()).toBeInTheDocument()
    })

    it('lets group headings override their computed level with `as`', () => {
      render(
        <NavList>
          <NavList.Heading>Settings</NavList.Heading>
          <NavList.Group>
            <NavList.GroupHeading as="h4">Account</NavList.GroupHeading>
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 4, name: 'Account'}).element()).toBeInTheDocument()
    })

    it('keeps a visually hidden heading in the accessibility tree', () => {
      render(
        <NavList>
          <NavList.Heading visuallyHidden>Settings</NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      const heading = page.getByRole('heading', {level: 2, name: 'Settings'}).element()
      expect(heading).toBeInTheDocument()
      expect(page.getByRole('navigation', {name: 'Settings'}).element()).toBeInTheDocument()
      // The visually-hidden styles are applied to the heading itself, not a wrapping element.
      expect(heading.parentElement?.tagName).not.toBe('SPAN')
    })

    it('forwards standard HTML attributes to the heading element', () => {
      render(
        <NavList>
          <NavList.Heading data-testid="nav-heading" title="Section navigation">
            Settings
          </NavList.Heading>
          <NavList.Item href="#">Item 1</NavList.Item>
        </NavList>,
      )

      const heading = page.getByRole('heading', {level: 2, name: 'Settings'}).element()
      expect(heading).toHaveAttribute('data-testid', 'nav-heading')
      expect(heading).toHaveAttribute('title', 'Section navigation')
    })
  })

  describe('NavList.Group', () => {
    it('renders the group heading outside of the nested list', () => {
      const {container} = render(
        <NavList>
          <NavList.Group aria-label="Project templates" data-testid="group">
            <NavList.GroupHeading as="h2">Project templates</NavList.GroupHeading>
            <NavList.Item href="#featured">Featured</NavList.Item>
            <NavList.Item href="#recent">Recent</NavList.Item>
            <NavList.Item href="#mine">Mine</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      const group = container.querySelector('[data-testid="group"]')
      const list = group?.querySelector(':scope > ul')
      const heading = page.getByRole('heading', {level: 2, name: 'Project templates'}).element()

      expect(group).not.toBeNull()
      expect(list).not.toBeNull()
      expect(list?.children).toHaveLength(3)
      expect(list).not.toContainElement(heading)
      expect(heading.parentElement?.parentElement).toBe(group)
      expect(list).toHaveAttribute('aria-labelledby', heading.id)
    })

    it('prefers a fragment-wrapped group heading over the title prop', () => {
      const {container} = render(
        <NavList>
          <NavList.Group title="Overview" data-testid="group">
            <>
              <NavList.GroupHeading>Project templates</NavList.GroupHeading>
            </>
            <NavList.Item href="#featured">Featured</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      const group = container.querySelector('[data-testid="group"]')
      const list = container.querySelector('[data-testid="group"] > ul')
      const heading = page.getByRole('heading', {level: 3, name: 'Project templates'}).element()

      expect(page.getByText('Overview').elements()[0] ?? null).not.toBeInTheDocument()
      expect(page.getByRole('heading').element()).toBe(heading)
      expect(container.querySelectorAll(`#${CSS.escape(heading.id)}`)).toHaveLength(1)
      expect(heading.parentElement?.parentElement).toBe(group)
      expect(list).toHaveAttribute('aria-labelledby', heading.id)
      expect(list?.children).toHaveLength(1)
    })

    it('prefers an explicit group heading over the title prop', () => {
      render(
        <NavList>
          <NavList.Group title="Overview">
            <NavList.GroupHeading>Project templates</NavList.GroupHeading>
            <NavList.Item href="#featured">Featured</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(page.getByRole('heading', {level: 3, name: 'Project templates'}).element()).toBeInTheDocument()
      expect(page.getByText('Overview').elements()[0] ?? null).not.toBeInTheDocument()
    })

    it('recognizes a group heading wrapper created with asSlot', () => {
      const WrappedGroupHeading = asSlot(
        ({children, ...props}: NavListGroupHeadingProps) => (
          <NavList.GroupHeading {...props}>{children}</NavList.GroupHeading>
        ),
        NavList.GroupHeading,
      )
      const {container} = render(
        <NavList>
          <NavList.Group title="Overview" data-testid="group">
            <WrappedGroupHeading id="project-templates-heading">Project templates</WrappedGroupHeading>
            <NavList.Item href="#featured">Featured</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      const group = container.querySelector('[data-testid="group"]')
      const list = group?.querySelector(':scope > ul')
      const heading = page.getByRole('heading', {level: 3, name: 'Project templates'}).element()

      expect(page.getByText('Overview').elements()[0] ?? null).not.toBeInTheDocument()
      expect(heading.parentElement?.parentElement).toBe(group)
      expect(list).toHaveAttribute('aria-labelledby', 'project-templates-heading')
    })

    it('renders a divider before the group by default', () => {
      const {container} = render(
        <NavList>
          <NavList.Group title="Account">
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(container.querySelector('[data-component="ActionList.Divider"]')).toBeInTheDocument()
    })

    it('does not render a divider when hideDivider is set', () => {
      const {container} = render(
        <NavList>
          <NavList.Group title="Account" hideDivider>
            <NavList.Item href="#">Profile</NavList.Item>
          </NavList.Group>
        </NavList>,
      )

      expect(container.querySelector('[data-component="ActionList.Divider"]')).not.toBeInTheDocument()
    })
  })
})
