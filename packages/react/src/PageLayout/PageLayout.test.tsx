import {describe, it, expect, vi} from 'vitest'
import {page} from 'vitest/browser'
import {act, fireEvent, render, screen} from '@testing-library/react'
import 'react-intersection-observer/test-utils'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {PageLayout} from './PageLayout'
import {Placeholder} from '../Placeholder'
import {implementsClassName} from '../utils/testing'
import classes from './PageLayout.module.css'

describe('PageLayout', async () => {
  implementsClassName(PageLayout, classes.PageLayoutRoot)

  await page.viewport(1280, 800)
  it('renders default layout', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders condensed layout', () => {
    const {container} = render(
      <PageLayout padding="condensed" rowGap="condensed" columnGap="condensed">
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with dividers', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header divider="line" dividerWhenNarrow="filled">
          Header
        </PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane position="start" divider="line" dividerWhenNarrow="filled">
          Pane
        </PageLayout.Pane>
        <PageLayout.Footer dividerWhenNarrow="line">Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(container).toMatchSnapshot()
  })

  it('renders pane in different position when narrow', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane positionWhenNarrow="start">Pane</PageLayout.Pane>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(container).toMatchSnapshot()
  })

  // The test suite can't compute styles so skipping
  it.todo('can hide pane when narrow', () => {
    // Set narrow viewport
    act(() => {
      window.matchMedia(viewportRanges.narrow)
    })

    const {getByText} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )

    expect(getByText('Pane')).not.toBeVisible()
  })

  // The test suite can't compute styles so skipping
  it.todo('shows all subcomponents by default', () => {
    // Set regular viewport
    act(() => {
      matchMedia(viewportRanges.regular)
    })

    const {getByText} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )

    expect(getByText('Pane')).toBeVisible()
  })

  it('should support labeling landmarks through `aria-label`', () => {
    render(
      <PageLayout>
        <PageLayout.Header aria-label="Header">Header</PageLayout.Header>
        <PageLayout.Content aria-label="Content">Content</PageLayout.Content>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Footer aria-label="Footer">Footer</PageLayout.Footer>
      </PageLayout>,
    )

    expect(screen.getByRole('banner')).toHaveAccessibleName('Header')
    expect(screen.getByRole('main')).toHaveAccessibleName('Content')
    expect(screen.getByRole('contentinfo')).toHaveAccessibleName('Footer')
  })

  it('should support labeling landmarks through `aria-labelledby`', () => {
    render(
      <PageLayout>
        <PageLayout.Header aria-labelledby="header-label">
          <span id="header-label">header</span>
        </PageLayout.Header>
        <PageLayout.Content aria-labelledby="content-label">
          <span id="content-label">content</span>
        </PageLayout.Content>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Footer aria-labelledby="footer-label">
          <span id="footer-label">footer</span>
        </PageLayout.Footer>
      </PageLayout>,
    )

    expect(screen.getByRole('banner')).toHaveAccessibleName('header')
    expect(screen.getByRole('main')).toHaveAccessibleName('content')
    expect(screen.getByRole('contentinfo')).toHaveAccessibleName('footer')
  })

  describe('PageLayout.Pane', () => {
    implementsClassName(PageLayout.Pane, classes.PaneWrapper)
    it('should support a ref on the element wrapping the contents of Pane', () => {
      const ref = vi.fn()
      render(
        <PageLayout>
          <PageLayout.Pane ref={ref}>
            <div data-testid="content">Pane</div>
          </PageLayout.Pane>
        </PageLayout>,
      )
      expect(ref).toHaveBeenCalledWith(screen.getByTestId('content').parentNode)
    })

    it('should be resizable if `resizable` is set correctly', async () => {
      render(
        <PageLayout>
          <PageLayout.Pane resizable>
            <Placeholder height={320} label="Pane" />
          </PageLayout.Pane>
          <PageLayout.Content>
            <Placeholder height={640} label="Content" />
          </PageLayout.Content>
        </PageLayout>,
      )

      const placeholder = await screen.findByText('Pane')
      const pane = placeholder.parentNode as HTMLElement | null
      const initialWidth = pane?.style.getPropertyValue('--pane-width')
      const divider = await screen.findByRole('slider')

      // Moving divider should resize pane.
      fireEvent.focus(divider)
      //move it right 3 times
      fireEvent.keyDown(divider, {key: 'ArrowRight'})
      fireEvent.keyDown(divider, {key: 'ArrowRight'})
      fireEvent.keyDown(divider, {key: 'ArrowRight'})

      const finalWidth = pane?.style.getPropertyValue('--pane-width')
      expect(finalWidth).not.toEqual(initialWidth)
    })

    it('should set optimization styles during pointer drag', async () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Pane resizable>
            <Placeholder height={320} label="Pane" />
          </PageLayout.Pane>
          <PageLayout.Content>
            <Placeholder height={640} label="Content" />
          </PageLayout.Content>
        </PageLayout>,
      )

      const contentWrapper = container.querySelector<HTMLElement>('[class*="ContentWrapper"]')
      const divider = await screen.findByRole('slider')

      // Before drag - no data-dragging attribute
      expect(contentWrapper).not.toHaveAttribute('data-dragging')

      // Start drag - optimization attribute is set
      fireEvent.pointerDown(divider, {clientX: 300, clientY: 200, pointerId: 1})
      expect(contentWrapper).toHaveAttribute('data-dragging', 'true')
      // End drag - pointer capture lost ends the drag and removes optimization attribute
      fireEvent.lostPointerCapture(divider, {pointerId: 1})
      expect(contentWrapper).not.toHaveAttribute('data-dragging')
    })

    it('should set optimization styles during keyboard resize', async () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Pane resizable>
            <Placeholder height={320} label="Pane" />
          </PageLayout.Pane>
          <PageLayout.Content>
            <Placeholder height={640} label="Content" />
          </PageLayout.Content>
        </PageLayout>,
      )

      const contentWrapper = container.querySelector<HTMLElement>('[class*="ContentWrapper"]')
      const divider = await screen.findByRole('slider')

      // Before interaction - no data-dragging attribute
      expect(contentWrapper).not.toHaveAttribute('data-dragging')

      // Start keyboard resize (focus first)
      fireEvent.focus(divider)
      fireEvent.keyDown(divider, {key: 'ArrowRight'})
      expect(contentWrapper).toHaveAttribute('data-dragging', 'true')

      // End keyboard resize - removes optimization attribute
      fireEvent.keyUp(divider, {key: 'ArrowRight'})
      expect(contentWrapper).not.toHaveAttribute('data-dragging')
    })

    it('should not add will-change during drag', async () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Pane resizable>
            <Placeholder height={320} label="Pane" />
          </PageLayout.Pane>
          <PageLayout.Content>
            <Placeholder height={640} label="Content" />
          </PageLayout.Content>
        </PageLayout>,
      )

      const pane = container.querySelector<HTMLElement>('[class*="Pane"][data-resizable]')
      const divider = await screen.findByRole('slider')

      // Before drag - no will-change
      expect(pane!.style.willChange).toBe('')

      // Start drag - will-change should still not be set (removed optimization)
      fireEvent.pointerDown(divider, {clientX: 300, clientY: 200, pointerId: 1})
      expect(pane!.style.willChange).toBe('')
      // End drag - will-change remains unset
      fireEvent.lostPointerCapture(divider, {pointerId: 1})
      expect(pane!.style.willChange).toBe('')
    })
  })

  describe('PageLayout.Content', () => {
    implementsClassName(PageLayout.Content, classes.ContentWrapper)
    it('should support a custom element type with the `as` prop', () => {
      const {container} = render(
        <PageLayout.Content as="div">
          <main>Content</main>
        </PageLayout.Content>,
      )
      expect(container.firstChild?.nodeName).toEqual('DIV')
    })
  })

  describe('PageLayout.Sidebar', () => {
    it('SidebarWrapper should prevent shrinking', () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar resizable width={{min: '256px', default: '296px', max: '768px'}}>
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>,
      )

      const sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()

      const style = getComputedStyle(sidebarWrapper!)
      expect(style.flexShrink).toBe('0')
    })

    it('renders a resize handle and supports keyboard interaction when resizable', () => {
      render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar resizable width={{min: '256px', default: '296px', max: '768px'}}>
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>,
      )

      const handle = screen.getByRole('separator')
      expect(handle).toBeInTheDocument()

      // Exercise keyboard handler (e.g. arrow keys) without asserting
      // exact width math, to avoid coupling to implementation details.
      handle.focus()
      fireEvent.keyDown(handle, {key: 'ArrowLeft'})
      fireEvent.keyDown(handle, {key: 'ArrowRight'})
      fireEvent.keyDown(handle, {key: 'Home'})
      fireEvent.keyDown(handle, {key: 'End'})
    })

    it('toggles data-dragging attribute on the sidebar wrapper during pointer drag', () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar resizable width={{min: '256px', default: '296px', max: '768px'}}>
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>,
      )

      const sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()
      expect(sidebarWrapper?.getAttribute('data-dragging')).toBeNull()

      const handle = sidebarWrapper?.querySelector<HTMLElement>('[role="separator"]')
      expect(handle).not.toBeNull()

      act(() => {
        fireEvent.pointerDown(handle!, {clientX: 300})
      })

      expect(sidebarWrapper?.getAttribute('data-dragging')).toBe('true')

      act(() => {
        fireEvent.pointerUp(handle!)
      })

      expect(sidebarWrapper?.getAttribute('data-dragging')).toBeNull()
    })

    it('applies aria-label to the sidebar landmark element', () => {
      render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar aria-label="Primary sidebar">Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      const sidebar = screen.getByLabelText('Primary sidebar')
      expect(sidebar).toBeInTheDocument()
    })

    it('supports aria-labelledby on the sidebar landmark element', () => {
      render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar aria-labelledby="sidebar-heading">
            <h2 id="sidebar-heading">Sidebar heading</h2>
            Sidebar
          </PageLayout.Sidebar>
        </PageLayout>,
      )

      const heading = screen.getByText('Sidebar heading')
      expect(heading).toBeInTheDocument()

      const sidebar = heading.closest('[role="complementary"], aside')
      expect(sidebar).not.toBeNull()
      expect(sidebar).toHaveAttribute('aria-labelledby', 'sidebar-heading')
    })

    it('respects different position values (start, end)', () => {
      const {rerender, container} = render(
        <PageLayout>
          <PageLayout.Sidebar position="start">Sidebar</PageLayout.Sidebar>
          <PageLayout.Content>Content</PageLayout.Content>
        </PageLayout>,
      )

      let sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()
      expect(sidebarWrapper?.getAttribute('data-position') ?? 'start').toBe('start')

      rerender(
        <PageLayout>
          <PageLayout.Sidebar position="end">Sidebar</PageLayout.Sidebar>
          <PageLayout.Content>Content</PageLayout.Content>
        </PageLayout>,
      )

      sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()
      expect(sidebarWrapper?.getAttribute('data-position') ?? 'end').toBe('end')
    })

    it('supports sticky positioning', () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar sticky>Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      const sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()

      const style = getComputedStyle(sidebarWrapper!)
      expect(style.position === 'sticky' || style.position === 'webkit-sticky').toBe(true)
    })

    it('can render fullscreen when narrow with whenNarrow="fullscreen"', () => {
      const {container} = render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar whenNarrow="fullscreen">Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      const sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()
    })

    it('supports hidden responsive values', () => {
      const {container, rerender} = render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar hidden={{narrow: true}}>Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      let sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).toBeNull()

      rerender(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar hidden={{wide: true}}>Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      sidebarWrapper = container.querySelector<HTMLElement>('[class*="SidebarWrapper"]')
      expect(sidebarWrapper).not.toBeNull()
    })

    it('forwards refs to the underlying sidebar element', () => {
      const ref = {current: null as HTMLElement | null}

      render(
        <PageLayout>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Sidebar ref={ref}>Sidebar</PageLayout.Sidebar>
        </PageLayout>,
      )

      expect(ref.current).not.toBeNull()
      expect(ref.current instanceof HTMLElement).toBe(true)
    })
  })
})
