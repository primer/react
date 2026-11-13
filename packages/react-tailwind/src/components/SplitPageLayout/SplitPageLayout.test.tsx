import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {SplitPageLayout} from './SplitPageLayout'

describe('SplitPageLayout', () => {
  it('forwards PageLayout wrapper and content row styling classes', () => {
    const {container} = render(
      <SplitPageLayout wrapperClassName="split-wrapper" contentRowClassName="split-content-row">
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
      </SplitPageLayout>,
    )

    expect(container.querySelector('.split-wrapper')).toContainElement(container.querySelector('.split-content-row'))
    expect(container.querySelector('.split-content-row')).toContainElement(screen.getByRole('main'))
  })

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
    expect(wrapper).toHaveClass('primer:gap-y-0')
    expect(wrapper?.firstElementChild).toHaveClass('primer:gap-x-0', 'primer:gap-y-0')
  })

  it('keeps the default sidebar in normal flow', () => {
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Sidebar>Navigation</SplitPageLayout.Sidebar>
      </SplitPageLayout>,
    )
    expect(container.querySelector('[data-component="SplitPageLayout.Sidebar"]')).not.toHaveClass(
      'primer:sticky',
      'primer:top-0',
    )
  })

  it('forwards fill width mode and the outer rail ref to PageLayout', () => {
    const ref = React.createRef<HTMLDivElement>()
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Sidebar ref={ref} widthMode="fill" style={{width: '60%'}}>
          Navigation
        </SplitPageLayout.Sidebar>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
      </SplitPageLayout>,
    )
    const pane = container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Sidebar"]')
    expect(ref.current).toHaveStyle({width: '60%'})
    expect(ref.current).toHaveClass('primer:w-full', 'primer:min-w-0')
    expect(ref.current).toContainElement(pane)
    expect(pane).toHaveClass('primer:w-full', 'primer:flex-1')
    expect(pane).not.toHaveClass('primer:md:flex-none')
  })
})
