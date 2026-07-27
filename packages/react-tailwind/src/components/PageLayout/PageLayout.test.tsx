import type React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {PageLayout} from './PageLayout'

describe('PageLayout', () => {
  it('preserves authored layout parts and forwards root props', () => {
    render(
      <PageLayout data-testid="layout">
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Content>Main</PageLayout.Content>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )
    expect(screen.getByTestId('layout')).toHaveAttribute('data-component', 'PageLayout')
    expect(screen.getByRole('main')).toHaveTextContent('Main')
  })

  it('lays Content beside Pane from the regular range onward', () => {
    const {container} = render(
      <PageLayout rowGap="condensed" columnGap="normal">
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    const layout = container.querySelector('[data-component="PageLayout"]') as HTMLElement
    const layoutRow = layout.querySelector('[data-component="PageLayout.Content"]')?.parentElement as HTMLElement
    expect(layout).toHaveClass('[--page-layout-column-gap:1rem]', 'lg:[--page-layout-column-gap:1.5rem]')
    expect(layoutRow).toHaveClass('md:flex-row', 'gap-y-4', 'gap-x-4', 'lg:gap-x-6')
    expect(layout.querySelector('[data-component="PageLayout.Pane"]')).toHaveClass('md:w-[var(--pane-width)]')
    expect(layout.querySelector('[data-component="PageLayout.Content"]')).toHaveClass('md:basis-0')
  })

  it('uses Primer container widths instead of the nearest Tailwind default', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Content width="large">Content</PageLayout.Content>
      </PageLayout>,
    )

    expect(container.querySelector('[data-component="PageLayout.Content"] > div')).toHaveClass('max-w-[1012px]')
  })

  it('uses the regular-range pane width below 1012px', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: 992})
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane width="medium">Pane</PageLayout.Pane>
      </PageLayout>,
    )
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: originalInnerWidth})

    expect(container.querySelector('[data-component="PageLayout.Pane"]')).toHaveStyle('--pane-width: 256px')
  })

  it('orders panes for every responsive viewport range', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane position={{narrow: 'end', regular: 'start', wide: 'end'}}>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout.Pane"]')?.parentElement).toHaveClass(
      'order-3',
      'md:order-1',
      '2xl:order-3',
    )
  })

  it('extracts a sticky sidebar into a root-level layout region', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Sidebar sticky>Sidebar</PageLayout.Sidebar>
        <PageLayout.Content>Content</PageLayout.Content>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout"]')).toHaveClass('flex', 'flex-row')
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')?.parentElement?.parentElement).toHaveClass(
      'sticky',
      'top-0',
      'h-screen',
    )
  })

  it('keeps header and footer outside the pane and content row', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header>Header</PageLayout.Header>
        <PageLayout.Pane>Pane</PageLayout.Pane>
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Footer>Footer</PageLayout.Footer>
      </PageLayout>,
    )

    const content = container.querySelector('[data-component="PageLayout.Content"]')
    const contentRow = content?.parentElement
    expect(contentRow).toContainElement(container.querySelector('[data-component="PageLayout.Pane"]'))
    expect(contentRow).not.toContainElement(container.querySelector('[data-component="PageLayout.Header"]'))
    expect(contentRow).not.toContainElement(container.querySelector('[data-component="PageLayout.Footer"]'))
  })

  it('restores a layout box for fullscreen sidebars in the narrow range', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Sidebar responsiveVariant="fullscreen">Sidebar</PageLayout.Sidebar>
      </PageLayout>,
    )
    expect(container.querySelector('[data-component="PageLayout.Sidebar"]')?.parentElement?.parentElement).toHaveClass(
      'max-md:block',
      'max-md:fixed',
      'max-md:h-screen',
      'max-md:w-screen',
    )
  })

  it('renders responsive divider utilities from static class maps', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Header divider={{narrow: 'filled', regular: 'line'}}>Header</PageLayout.Header>
      </PageLayout>,
    )
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass(
      'mt-[var(--page-layout-row-gap)]',
      'box-border',
      'h-2',
      'border-y',
      'border-default',
      'bg-inset',
      'md:h-px',
      'md:bg-default',
      '2xl:h-px',
    )
  })

  it('uses a horizontal narrow divider and a vertical regular divider for panes', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane divider={{narrow: 'filled', regular: 'line', wide: 'none'}}>Pane</PageLayout.Pane>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    const dividers = pane?.parentElement?.querySelectorAll(':scope > div[aria-hidden="true"]') ?? []
    expect(dividers[0]).toHaveClass(
      'box-border',
      'h-2',
      'border-y',
      'border-default',
      'bg-inset',
      'order-first',
      'md:hidden',
      '2xl:hidden',
    )
    expect(dividers[1]).toHaveClass('hidden', 'md:block', 'md:w-px', 'md:bg-default', '2xl:hidden')
    expect(dividers[1]).toHaveClass(
      'md:mr-[var(--page-layout-column-gap)]',
      'md:ml-0',
      '2xl:mr-[var(--page-layout-column-gap)]',
      '2xl:ml-0',
    )
  })

  it('resizes a pane with its keyboard-operable slider', () => {
    const onResizeEnd = vi.fn()
    render(
      <PageLayout>
        <PageLayout.Pane resizable onResizeEnd={onResizeEnd}>
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = screen.getByRole('slider')
    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenCalled()
  })

  it('keeps the resizable divider visible and uses the regular position below the named wide range', () => {
    const originalInnerWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: 1200})
    const onResizeEnd = vi.fn()
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane position={{narrow: 'end', regular: 'start', wide: 'end'}} resizable onResizeEnd={onResizeEnd}>
          Pane
        </PageLayout.Pane>
      </PageLayout>,
    )
    const handle = container.querySelector('[role="slider"]') as HTMLElement
    const divider = handle.parentElement
    expect(divider).toHaveClass('md:block', 'md:w-px', 'md:order-last')
    expect(divider).not.toHaveClass('md:hidden')

    fireEvent.keyDown(handle, {key: 'ArrowRight'})
    fireEvent.keyUp(handle, {key: 'ArrowRight'})
    expect(onResizeEnd).toHaveBeenLastCalledWith(299)
    Object.defineProperty(window, 'innerWidth', {configurable: true, value: originalInnerWidth})
  })

  it('uses full-height filled vertical dividers', () => {
    const {container} = render(
      <PageLayout>
        <PageLayout.Pane divider={{regular: 'filled'}}>Pane</PageLayout.Pane>
      </PageLayout>,
    )
    const pane = container.querySelector('[data-component="PageLayout.Pane"]')
    const dividers = pane?.parentElement?.querySelectorAll(':scope > div[aria-hidden="true"]') ?? []
    expect(dividers[0]).toHaveClass('self-stretch', 'md:block', 'md:w-2', 'md:border-x', '2xl:w-2')
    expect(dividers[0]).not.toHaveClass('md:h-px')
  })

  it('accepts a region prop so a custom component can fill a region without a marker', () => {
    const CustomSidebar = ({children}: {children?: React.ReactNode}) => <div data-testid="custom">{children}</div>

    render(
      <PageLayout sidebar={<CustomSidebar>side</CustomSidebar>}>
        <PageLayout.Content>content</PageLayout.Content>
      </PageLayout>,
    )

    expect(screen.getByTestId('custom')).toHaveTextContent('side')
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('prefers a region prop over a matching child', () => {
    render(
      <PageLayout header={<div data-testid="from-prop">prop</div>}>
        <PageLayout.Header>from child</PageLayout.Header>
        <PageLayout.Content>content</PageLayout.Content>
      </PageLayout>,
    )

    expect(screen.getByTestId('from-prop')).toBeInTheDocument()
    expect(screen.queryByText('from child')).not.toBeInTheDocument()
  })
})
