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
    expect(screen.getByRole('complementary')).toHaveAttribute('data-component', 'SplitPageLayout.Pane')
    expect(screen.getByRole('main')).toHaveAttribute('data-component', 'SplitPageLayout.Content')
    expect(screen.getByRole('main')).toHaveTextContent('Content')
  })

  it('defaults both root gaps to none', () => {
    const {container} = render(<SplitPageLayout />)
    expect(container.querySelector('[data-component="SplitPageLayout"] > div')).toHaveClass('gap-x-0', 'gap-y-0')
  })
})
