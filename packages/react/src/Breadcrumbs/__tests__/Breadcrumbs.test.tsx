import Breadcrumbs from '..'
import {render as HTMLRender, screen, waitFor, within} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {FeatureFlags} from '../../FeatureFlags'

// Helper function to render with theme and feature flags
const renderWithTheme = (component: React.ReactElement, flags?: Record<string, boolean>) => {
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
  it('renders a <nav>', () => {
    const {container} = HTMLRender(<Breadcrumbs />)
    expect(container.firstChild?.nodeName).toEqual('NAV')
  })

  it('renders breadcrumb items correctly', () => {
    HTMLRender(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/components" selected>
          Components
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
    expect(screen.getByText('Components')).toBeInTheDocument()
  })

  it('sets aria-current="page" on selected item', () => {
    HTMLRender(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/docs" selected>
          Docs
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    const selectedItem = screen.getByText('Docs')
    expect(selectedItem).toHaveAttribute('aria-current', 'page')
  })

  it('sets data-overflow attribute when overflow is menu with feature flag', () => {
    const {container} = renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    expect(container.firstChild).toHaveAttribute('data-overflow', 'menu')
  })

  it('sets data-overflow attribute when overflow is wrap', () => {
    const {container} = renderWithTheme(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    expect(container.firstChild).toHaveAttribute('data-overflow', 'wrap')
  })

  it('renders all items when overflow is wrap', () => {
    renderWithTheme(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    // All items should be visible in wrap mode
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
    expect(screen.getByText('Item 5')).toBeInTheDocument()
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('shows overflow menu when more than 5 items in menu mode', () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    // Should have overflow menu button
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Last 4 items should be visible
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
    expect(screen.getByText('Item 5')).toBeInTheDocument()
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('show root in menu', () => {
    expect(() => {
      renderWithTheme(
        <Breadcrumbs overflow="menu-with-root">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        </Breadcrumbs>,
        {primer_react_breadcrumbs_overflow_menu: true},
      )
    }).not.toThrow()
  })

  it('includes root item in overflow menu when overflow is menu-with-root', async () => {
    const user = userEvent.setup()

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
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    // Should have overflow menu button
    const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
    expect(menuButton).toBeInTheDocument()

    // Open the overflow menu
    await user.click(menuButton)

    // Find the <details> element that contains the overflow menu
    const detailsEl = menuButton.closest('details') as HTMLElement | null
    expect(detailsEl).not.toBeNull()
    const detailsScope = within(detailsEl!)

    await waitFor(() => {
      expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
    })

    // These links should be inside the details (overflow) content
    expect(detailsScope.getByRole('link', {name: 'Category'})).toBeInTheDocument()
    expect(detailsScope.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
    expect(detailsScope.getByRole('link', {name: 'Product'})).toBeInTheDocument()

    // Verify that the last few items are visible as regular breadcrumb items
    expect(screen.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()

    // Verify the selected item (Reviews) has aria-current in the visible breadcrumb
    const selectedBreadcrumb = screen.getByRole('link', {name: 'Reviews'})
    expect(selectedBreadcrumb).toHaveAttribute('aria-current', 'page')
  })

  it('renders accessible overflow menu', () => {
    renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/1">Item 1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/2">Item 2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/3">Item 3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/4">Item 4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/5">Item 5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/6">Item 6</Breadcrumbs.Item>
      </Breadcrumbs>,
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows overflow menu during resize when items exceed container width', () => {
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
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    expect(resizeCallback).toBeDefined()

    // Initially should show overflow menu for >5 items
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a wide container resize
    if (resizeCallback) {
      resizeCallback([
        {
          contentRect: {width: 800, height: 40},
        } as ResizeObserverEntry,
      ])
    }

    // Should still have overflow menu for 6 items (>5 rule)
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a narrow container resize
    if (resizeCallback) {
      resizeCallback([
        {
          contentRect: {width: 250, height: 40},
        } as ResizeObserverEntry,
      ])
    }

    // Should maintain overflow menu for narrow container
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Verify the navigation element is still present after resizes
    expect(screen.getByRole('navigation')).toBeInTheDocument()
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

    const user = userEvent.setup()

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
      {primer_react_breadcrumbs_overflow_menu: true},
    )

    expect(resizeCallback).toBeDefined()

    // Initially should show overflow menu for >5 items
    const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
    expect(menuButton).toBeInTheDocument()

    // Open the overflow menu
    await user.click(menuButton)

    // Verify menu items are present (first 3 items should be in overflow for 7 total items)
    await waitFor(() => {
      expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Category'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Product'})).toBeInTheDocument()
    })

    // Verify that the last 4 items are visible as regular breadcrumb items (not in menu)
    expect(screen.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()

    // Close menu by clicking outside
    await user.click(document.body)
    await waitFor(() => {
      expect
    })

    // Simulate a very narrow container resize that would affect overflow calculation
    if (resizeCallback) {
      resizeCallback([
        {
          contentRect: {width: 200, height: 40},
        } as ResizeObserverEntry,
      ])
    }

    // Menu button should still be present
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Simulate a very wide container resize
    if (resizeCallback) {
      resizeCallback([
        {
          contentRect: {width: 1200, height: 40},
        } as ResizeObserverEntry,
      ])
    }

    // Menu button should still be present (7 items > 5)
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Open menu again to verify it still works after resize
    await user.click(screen.getByRole('button', {name: /more breadcrumb items/i}))

    // Verify menu still contains expected items (first 3 items)
    await waitFor(() => {
      expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Category'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Subcategory'})).toBeInTheDocument()
      expect(screen.getByRole('link', {name: 'Product'})).toBeInTheDocument()
    })

    // Verify visible breadcrumb items are still accessible (last 4 items)
    expect(screen.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()
  })

  describe('BreadcrumbsMenuItem interactions', () => {
    it('closes menu on Escape key press', async () => {
      const user = userEvent.setup()

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
        {primer_react_breadcrumbs_overflow_menu: true},
      )

      // Open the overflow menu
      const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
      // Initially collapsed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      await user.click(menuButton)

      // Verify menu is open
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      })

      // Press Escape key
      await user.keyboard('{Escape}') // sometimes tooltip swallows this escape

      // Verify menu is closed
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('closes menu when clicking outside', async () => {
      const user = userEvent.setup()

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
        {primer_react_breadcrumbs_overflow_menu: true},
      )

      // Open the overflow menu
      const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
      await user.click(menuButton)

      // Verify menu is open
      await waitFor(() => {
        expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
      })

      // Click outside element
      const outsideButton = screen.getByTestId('outside-button')
      await user.click(outsideButton)

      // Verify menu is closed
      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      })
    })

    it('allows tab navigation through menu items', async () => {
      const user = userEvent.setup()

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
        {primer_react_breadcrumbs_overflow_menu: true},
      )

      // Open the overflow menu
      const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
      await user.click(menuButton)

      // Verify menu is open
      await waitFor(() => {
        expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
      })

      // Tab through menu items
      await user.keyboard('{Tab}')
      const homeMenuItem = screen.getByRole('link', {name: 'Home'})
      expect(homeMenuItem).toHaveFocus()

      await user.keyboard('{Tab}')
      const docsMenuItem = screen.getByRole('link', {name: 'Docs'})
      expect(docsMenuItem).toHaveFocus()

      await user.keyboard('{Tab}')
      const componentsMenuItem = screen.getByRole('link', {name: 'Components'})
      expect(componentsMenuItem).toHaveFocus()
    })

    it('maintains focus on menu button when menu is closed', async () => {
      const user = userEvent.setup()

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
        {primer_react_breadcrumbs_overflow_menu: true},
      )

      const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})

      // Focus the menu button
      menuButton.focus()
      expect(menuButton).toHaveFocus()

      // Open menu with Enter key
      await user.keyboard('{Enter}')

      // Verify menu is open
      await waitFor(() => {
        expect(screen.getByRole('link', {name: 'Home'})).toBeInTheDocument()
      })

      // Close with Escape
      await user.keyboard('{Escape}')

      // Verify focus returns to button
      expect(menuButton).toHaveFocus()
    })
  })

  describe('variant prop (feature flag on)', () => {
    it('sets data-variant="normal" by default', () => {
      const {container} = renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs" selected>
            Docs
          </Breadcrumbs.Item>
        </Breadcrumbs>,
        {primer_react_breadcrumbs_overflow_menu: true},
      )
      expect(container.firstChild).toHaveAttribute('data-variant', 'normal')
    })

    it('sets data-variant="spacious" when variant prop provided', () => {
      const {container} = renderWithTheme(
        <Breadcrumbs overflow="menu" variant="spacious">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs" selected>
            Docs
          </Breadcrumbs.Item>
        </Breadcrumbs>,
        {primer_react_breadcrumbs_overflow_menu: true},
      )
      expect(container.firstChild).toHaveAttribute('data-variant', 'spacious')
    })
  })
})
