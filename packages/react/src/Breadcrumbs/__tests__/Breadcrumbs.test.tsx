import Breadcrumbs from '..'
import {act, render as HTMLRender} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {FeatureFlags} from '../../FeatureFlags'
import {implementsClassName} from '../../utils/testing'
import classes from '../Breadcrumbs.module.css'
import Link from '../../Link'

// Helper function to render with theme and feature flags
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithTheme = (component: React.ReactElement<any>, flags?: Record<string, boolean>) => {
  const wrappedComponent = flags ? <FeatureFlags flags={flags}>{component}</FeatureFlags> : <>{component}</>
  return HTMLRender(wrappedComponent)
}

// Mock ResizeObserver for tests
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

globalThis.ResizeObserver = vi.fn().mockImplementation(function () {
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }
})

describe('Breadcrumbs', () => {
  implementsClassName(Breadcrumbs, classes.BreadcrumbsBase)

  it('renders a <nav>', () => {
    HTMLRender(<Breadcrumbs />)
    expect(page.getByRole('navigation').element().nodeName).toEqual('NAV')
  })

  it('renders data-component attributes', async () => {
    const {container} = renderWithTheme(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    await expect.element(container.querySelector<HTMLElement>('[data-component="Breadcrumbs"]')).toBeInTheDocument()

    await expect
      .element(
        container.querySelector<HTMLElement>('[data-component="Breadcrumbs"] [data-component="Breadcrumbs.Item"]'),
      )
      .toBeInTheDocument()
  })

  it('renders breadcrumb items correctly', async () => {
    HTMLRender(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/components" selected>
          Components
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    await expect.element(page.getByText('Home')).toBeInTheDocument()
    await expect.element(page.getByText('Docs')).toBeInTheDocument()
    await expect.element(page.getByText('Components')).toBeInTheDocument()
  })

  it('sets aria-current="page" on selected item', async () => {
    HTMLRender(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/docs" selected>
          Docs
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    const selectedItem = page.getByText('Docs')
    await expect.element(selectedItem).toHaveAttribute('aria-current', 'page')
  })

  it('sets data-overflow attribute when overflow is menu', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-overflow', 'menu')
  })

  it('sets data-overflow attribute when overflow is wrap', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    await expect.element(page.getByRole('navigation')).toHaveAttribute('data-overflow', 'wrap')
  })

  it('renders all items when overflow is wrap', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    // All items should be visible in wrap mode
    await expect.element(page.getByText('Item 1')).toBeInTheDocument()
    await expect.element(page.getByText('Item 2')).toBeInTheDocument()
    await expect.element(page.getByText('Item 3')).toBeInTheDocument()
    await expect.element(page.getByText('Item 4')).toBeInTheDocument()
    await expect.element(page.getByText('Item 5')).toBeInTheDocument()
    await expect.element(page.getByText('Item 6')).toBeInTheDocument()
  })

  it('shows overflow menu when more than 5 items in menu mode', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    // Should have overflow menu button
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Last 4 items should be visible
    await expect.element(page.getByText('Item 3')).toBeInTheDocument()
    await expect.element(page.getByText('Item 4')).toBeInTheDocument()
    await expect.element(page.getByText('Item 5')).toBeInTheDocument()
    await expect.element(page.getByText('Item 6')).toBeInTheDocument()
  })

  it('updates overflow menu items when children change with same item count', async () => {
    const {rerender} = renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/home">Old Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Old Category</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/product">Product</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/details">Details</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/reviews">Reviews</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
    await userEvent.click(menuButton)

    const oldMenu = menuButton.element().closest('details')
    expect(oldMenu).not.toBeNull()
    await expect.element(page.elementLocator(oldMenu!).getByRole('link', {name: 'Old Home'})).toBeInTheDocument()

    await userEvent.click(menuButton)

    rerender(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/new-home">New Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/new-category">New Category</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/product">Product</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/details">Details</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/reviews">Reviews</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    await userEvent.click(page.getByRole('button', {name: /more breadcrumb items/i}))

    const updatedMenu = page
      .getByRole('button', {name: /more breadcrumb items/i})
      .element()
      .closest('details')
    expect(updatedMenu).not.toBeNull()
    await expect.element(page.elementLocator(updatedMenu!).getByRole('link', {name: 'New Home'})).toBeInTheDocument()
    await expect
      .element(page.elementLocator(updatedMenu!).getByRole('link', {name: 'Old Home'}))
      .not.toBeInTheDocument()
  })

  it('show root in menu', () => {
    expect(() => {
      renderWithTheme(
        <Breadcrumbs overflow="menu-with-root">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        </Breadcrumbs>,
      )
    }).not.toThrow()
  })

  it('includes root item in overflow menu when overflow is menu-with-root', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu-with-root">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/product">Product</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/details">Details</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/specifications">Specifications</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/reviews" selected>
          Reviews
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    // Should have overflow menu button
    const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
    await expect.element(menuButton).toBeInTheDocument()

    // Open the overflow menu
    await userEvent.click(menuButton)

    // Find the <details> element that contains the overflow menu
    const detailsEl = menuButton.element().closest('details')
    expect(detailsEl).not.toBeNull()
    const detailsScope = page.elementLocator(detailsEl!)

    await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()

    // These links should be inside the details (overflow) content
    await expect.element(detailsScope.getByRole('link', {name: 'Category'})).toBeInTheDocument()
    await expect.element(detailsScope.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
    await expect.element(detailsScope.getByRole('link', {name: 'Product'})).toBeInTheDocument()

    // Verify that the last few items are visible as regular breadcrumb items
    await expect.element(page.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()

    // Verify the selected item (Reviews) has aria-current in the visible breadcrumb
    const selectedBreadcrumb = page.getByRole('link', {name: 'Reviews'})
    await expect.element(selectedBreadcrumb).toHaveAttribute('aria-current', 'page')
  })

  it('renders accessible overflow menu', async () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
    await expect.element(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows overflow menu during resize when items exceed container width', async () => {
    let resizeCallback: ((entries: ResizeObserverEntry[]) => void) | undefined

    const mockResizeObserver = vi.fn().mockImplementation(function (callback) {
      resizeCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      }
    })
    globalThis.ResizeObserver = mockResizeObserver

    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(resizeCallback).toBeDefined()

    // Initially should show overflow menu for >5 items
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a wide container resize
    if (resizeCallback) {
      const callback = resizeCallback
      act(() => {
        callback([
          {
            contentRect: {width: 800, height: 40},
          } as ResizeObserverEntry,
        ])
      })
    }

    // Should still have overflow menu for 6 items (>5 rule)
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a narrow container resize
    if (resizeCallback) {
      const callback = resizeCallback
      act(() => {
        callback([
          {
            contentRect: {width: 250, height: 40},
          } as ResizeObserverEntry,
        ])
      })
    }

    // Should maintain overflow menu for narrow container
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Verify the navigation element is still present after resizes
    await expect.element(page.getByRole('navigation')).toBeInTheDocument()
  })

  it('correctly populates overflow menu during resize events', async () => {
    let resizeCallback: ((entries: ResizeObserverEntry[]) => void) | undefined

    const mockResizeObserver = vi.fn().mockImplementation(function (callback) {
      resizeCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      }
    })
    globalThis.ResizeObserver = mockResizeObserver

    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/subcategory">Subcategory</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/product">Product</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/details">Details</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/specifications">Specifications</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/reviews">Reviews</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(resizeCallback).toBeDefined()

    // Initially should show overflow menu for >5 items
    const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
    await expect.element(menuButton).toBeInTheDocument()

    // Open the overflow menu
    await userEvent.click(menuButton)

    // Verify menu items are present (first 3 items should be in overflow for 7 total items)
    await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Category'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Product'})).toBeInTheDocument()

    // Verify that the last 4 items are visible as regular breadcrumb items (not in menu)
    await expect.element(page.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()

    // Close menu by clicking outside
    await userEvent.click(page.elementLocator(document.body), {position: {x: 0, y: 0}})
    await expect.element(menuButton).toHaveAttribute('aria-expanded', 'false')

    // Simulate a very narrow container resize that would affect overflow calculation
    if (resizeCallback) {
      const callback = resizeCallback
      act(() => {
        callback([
          {
            contentRect: {width: 200, height: 40},
          } as ResizeObserverEntry,
        ])
      })
    }

    // Menu button should still be present
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a very wide container resize
    if (resizeCallback) {
      const callback = resizeCallback
      act(() => {
        callback([
          {
            contentRect: {width: 1200, height: 40},
          } as ResizeObserverEntry,
        ])
      })
    }

    // Menu button should still be present (7 items > 5)
    await expect.element(page.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Open menu again to verify it still works after resize
    await userEvent.click(page.getByRole('button', {name: /more breadcrumb items/i}))

    // Verify menu still contains expected items (first 3 items)
    await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Category'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Product'})).toBeInTheDocument()

    // Verify visible breadcrumb items are still accessible (last 4 items)
    await expect.element(page.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    await expect.element(page.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()
  })

  describe('BreadcrumbsMenuItem interactions', () => {
    it('closes menu on Escape key press', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/components">Components</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/breadcrumbs">Breadcrumbs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/examples">Examples</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/advanced" selected>
            Advanced
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      // Open the overflow menu
      const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
      // Initially collapsed
      await expect.element(menuButton).toHaveAttribute('aria-expanded', 'false')
      await userEvent.click(menuButton)

      // Verify menu is open
      await expect.element(menuButton).toHaveAttribute('aria-expanded', 'true')

      // Press Escape key
      await userEvent.keyboard('{Escape}')

      // Verify menu is closed
      await expect.element(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes menu when clicking outside', async () => {
      renderWithTheme(
        <div>
          <button type="button" data-testid="outside-button">
            Outside Button
          </button>
          <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/components">Components</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/breadcrumbs">Breadcrumbs</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/examples">Examples</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/advanced" selected>
              Advanced
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </div>,
      )

      // Open the overflow menu
      const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
      await userEvent.click(menuButton)

      // Verify menu is open
      await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()

      // Click outside element
      const outsideButton = page.getByTestId('outside-button')
      await userEvent.click(outsideButton)

      // Verify menu is closed
      await expect.element(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('allows tab navigation through menu items', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/components">Components</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/breadcrumbs">Breadcrumbs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/examples">Examples</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/advanced" selected>
            Advanced
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      // Open the overflow menu
      const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
      await userEvent.click(menuButton)

      // Verify menu is open
      await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()

      // Tab through menu items
      await userEvent.keyboard('{Tab}')
      const homeMenuItem = page.getByRole('link', {name: 'Home'})
      await expect.element(homeMenuItem).toHaveFocus()

      await userEvent.keyboard('{Tab}')
      const docsMenuItem = page.getByRole('link', {name: 'Docs'})
      await expect.element(docsMenuItem).toHaveFocus()

      await userEvent.keyboard('{Tab}')
      const componentsMenuItem = page.getByRole('link', {name: 'Components'})
      await expect.element(componentsMenuItem).toHaveFocus()
    })

    it('maintains focus on menu button when menu is closed', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/components">Components</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/breadcrumbs">Breadcrumbs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/examples">Examples</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/advanced" selected>
            Advanced
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})

      // Focus the menu button
      act(() => {
        menuButton.element().focus()
      })
      await expect.element(menuButton).toHaveFocus()

      // Open menu with Enter key
      await userEvent.keyboard('{Enter}')

      // Verify menu is open
      await expect.element(page.getByRole('link', {name: 'Home'})).toBeInTheDocument()

      // Close with Escape
      await userEvent.keyboard('{Escape}')

      // Verify focus returns to button
      await expect.element(menuButton).toHaveFocus()
    })
  })

  describe('variant prop', () => {
    it('sets data-variant="normal" by default', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs" selected>
            Docs
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )
      await expect.element(page.getByRole('navigation')).toHaveAttribute('data-variant', 'normal')
    })

    it('sets data-variant="spacious" when variant prop provided', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu" variant="spacious">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs" selected>
            Docs
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )
      await expect.element(page.getByRole('navigation')).toHaveAttribute('data-variant', 'spacious')
    })
  })

  describe('as prop', () => {
    it('supports polymorphic Breadcrumbs.Item with as prop', () => {
      renderWithTheme(
        <Breadcrumbs>
          <Breadcrumbs.Item as="span">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item as="span" selected>
            Docs
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      const homeItem = page.getByText('Home')
      const docsItem = page.getByText('Docs')

      expect(homeItem.element().nodeName).toEqual('SPAN')
      expect(docsItem.element().nodeName).toEqual('SPAN')
    })

    it('passes through additional props to the element specified by as', async () => {
      renderWithTheme(
        <Breadcrumbs>
          <Breadcrumbs.Item as={Link} href="/home" data-testid="home-link" inline>
            Home
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      const homeLink = page.getByTestId('home-link')
      await expect.element(homeLink).toHaveAttribute('href', '/home')
      await expect.element(homeLink).toHaveAttribute('data-inline', 'true')
    })

    it('passes through additional props to the element specified by as in overflow menu', async () => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item as={Link} href="/home" data-testid="home-link" inline>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/components">Components</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/breadcrumbs">Breadcrumbs</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/examples">Examples</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/advanced" selected>
            Advanced
          </Breadcrumbs.Item>
        </Breadcrumbs>,
      )

      // Open the overflow menu
      const menuButton = page.getByRole('button', {name: /more breadcrumb items/i})
      await userEvent.click(menuButton)

      // Verify the custom link in the overflow menu has the correct href
      const homeLink = page.getByTestId('home-link')
      await expect.element(homeLink).toHaveAttribute('href', '/home')
    })
  })
})
