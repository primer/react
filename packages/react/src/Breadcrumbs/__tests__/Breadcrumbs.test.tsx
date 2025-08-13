import Breadcrumbs from '..'
import type React from 'react'
import {render as HTMLRender, screen, waitFor} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import userEvent from '@testing-library/user-event'
import {ThemeProvider} from '../../ThemeProvider'
import theme from '../../theme'

// Helper function to render with theme
const renderWithTheme = (component: React.ReactElement) => {
  return HTMLRender(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

// Mock ResizeObserver for tests
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}))

describe('Breadcrumbs', () => {
  it('should support `className` on the outermost element', () => {
    expect(HTMLRender(<Breadcrumbs className={'test-class-name'} />).container.firstChild).toHaveClass(
      'test-class-name',
    )
  })

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

  it('sets data-overflow attribute when overflow is menu', () => {
    const {container} = renderWithTheme(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(container.firstChild).toHaveAttribute('data-overflow', 'menu')
  })

  it('sets data-overflow attribute when overflow is wrap', () => {
    const {container} = HTMLRender(
      <Breadcrumbs overflow="wrap">
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(container.firstChild).toHaveAttribute('data-overflow', 'wrap')
  })

  it('defaults to wrap overflow behavior', () => {
    const {container} = HTMLRender(
      <Breadcrumbs>
        <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(container.firstChild).toHaveAttribute('data-overflow', 'wrap')
  })

  it('renders all items when overflow is wrap', () => {
    HTMLRender(
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
    )

    // Should have overflow menu button
    expect(screen.getByRole('button', {name: /more breadcrumb items/i})).toBeInTheDocument()

    // Last 4 items should be visible
    expect(screen.getByText('Item 3')).toBeInTheDocument()
    expect(screen.getByText('Item 4')).toBeInTheDocument()
    expect(screen.getByText('Item 5')).toBeInTheDocument()
    expect(screen.getByText('Item 6')).toBeInTheDocument()
  })

  it('hideRoot prop defaults to true', () => {
    // This is more of an integration test - the exact behavior
    // depends on container width, so we just verify the prop is accepted
    expect(() => {
      renderWithTheme(
        <Breadcrumbs overflow="menu">
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        </Breadcrumbs>,
      )
    }).not.toThrow()
  })

  it('accepts hideRoot prop set to false', () => {
    expect(() => {
      renderWithTheme(
        <Breadcrumbs overflow="menu" hideRoot={false}>
          <Breadcrumbs.Item href="/home">Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/docs">Docs</Breadcrumbs.Item>
        </Breadcrumbs>,
      )
    }).not.toThrow()
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
    )

    const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
    expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows overflow menu during resize when items exceed container width', () => {
    let resizeCallback: ((entries: ResizeObserverEntry[]) => void) | undefined

    const mockResizeObserver = vi.fn().mockImplementation(callback => {
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

    const mockResizeObserver = vi.fn().mockImplementation(callback => {
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
    )

    expect(resizeCallback).toBeDefined()

    // Initially should show overflow menu for >5 items
    const menuButton = screen.getByRole('button', {name: /more breadcrumb items/i})
    expect(menuButton).toBeInTheDocument()

    // Open the overflow menu
    await user.click(menuButton)

    // Verify menu items are present (first 3 items should be in overflow for 7 total items)
    await waitFor(() => {
      expect(screen.getByRole('menuitem', {name: 'Home'})).toBeInTheDocument()
      expect(screen.getByRole('menuitem', {name: 'Category'})).toBeInTheDocument()
      expect(screen.getByRole('menuitem', {name: 'Subcategory'})).toBeInTheDocument()
    })

    // Verify that the last 4 items are visible as regular breadcrumb items (not in menu)
    expect(screen.getByRole('link', {name: 'Product'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()

    // Close menu by clicking outside
    await user.click(document.body)
    await waitFor(() => {
      expect(screen.queryByRole('menuitem', {name: 'Category'})).not.toBeInTheDocument()
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
      expect(screen.getByRole('menuitem', {name: 'Home'})).toBeInTheDocument()
      expect(screen.getByRole('menuitem', {name: 'Category'})).toBeInTheDocument()
      expect(screen.getByRole('menuitem', {name: 'Subcategory'})).toBeInTheDocument()
    })

    // Verify visible breadcrumb items are still accessible (last 4 items)
    expect(screen.getByRole('link', {name: 'Product'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Details'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Specifications'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Reviews'})).toBeInTheDocument()
  })
})
