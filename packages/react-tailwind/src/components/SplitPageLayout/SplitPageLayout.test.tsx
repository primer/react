import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SplitPageLayout} from './SplitPageLayout'

describe('SplitPageLayout', () => {
  it('composes PageLayout with split defaults', () => {
    render(
      <SplitPageLayout data-testid="layout">
        <SplitPageLayout.Pane>Navigation</SplitPageLayout.Pane>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
      </SplitPageLayout>,
    )
    expect(screen.getByTestId('layout')).toHaveAttribute('data-layout', 'split')
    expect(screen.getByTestId('layout')).toHaveAttribute('data-component', 'SplitPageLayout')
    // Like Primer React, the pane adds no landmark of its own; consumers choose one for its content.
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(document.querySelector('[data-component="SplitPageLayout.Pane"]')).toHaveTextContent('Navigation')
    expect(screen.getByRole('main')).toHaveAttribute('data-component', 'SplitPageLayout.Content')
    expect(screen.getByRole('main')).toHaveTextContent('Content')
  })

  it('defaults both root gaps to none', () => {
    const {container} = render(<SplitPageLayout />)
    const layout = container.querySelector('[data-component="SplitPageLayout"]')
    const wrapper = layout?.firstElementChild
    expect(wrapper).toHaveClass('gap-y-0')
    expect(wrapper?.firstElementChild).toHaveClass('gap-x-0', 'gap-y-0')
  })

  it('keeps the default sidebar in normal flow', () => {
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Sidebar>Navigation</SplitPageLayout.Sidebar>
      </SplitPageLayout>,
    )
    expect(container.querySelector('[data-component="SplitPageLayout.Sidebar"]')).not.toHaveClass('sticky', 'top-0')
  })
})
