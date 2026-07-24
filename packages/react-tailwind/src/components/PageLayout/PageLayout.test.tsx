import React from 'react'
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
    const layoutRow = layout.firstElementChild as HTMLElement
    expect(layoutRow).toHaveClass('md:flex-row', 'gap-y-4', 'gap-x-6')
    expect(layout.querySelector('[data-component="PageLayout.Pane"]')).toHaveClass('md:w-[var(--pane-width)]')
    expect(layout.querySelector('[data-component="PageLayout.Content"]')).toHaveClass('md:basis-0')
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
})
