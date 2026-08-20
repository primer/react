import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import 'react-intersection-observer/test-utils'
import {SplitPageLayout} from '../SplitPageLayout/SplitPageLayout'
import {implementsClassName} from '../utils/testing'

describe('SplitPageLayout', () => {
  implementsClassName(SplitPageLayout)

  it('renders data-component attributes for all components', () => {
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Header>Header</SplitPageLayout.Header>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
        <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
        <SplitPageLayout.Sidebar>Sidebar</SplitPageLayout.Sidebar>
        <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
      </SplitPageLayout>,
    )

    expect(container.firstChild).toHaveAttribute('data-component', 'SplitPageLayout')
    expect(container.querySelector('[data-component="SplitPageLayout.Header"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="SplitPageLayout.Content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="SplitPageLayout.Pane"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="SplitPageLayout.Sidebar"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="SplitPageLayout.Footer"]')).toBeInTheDocument()
  })

  it('renders Pane with a custom ID', () => {
    const {getByText} = render(
      <SplitPageLayout>
        <SplitPageLayout.Pane id="customId">Pane Content</SplitPageLayout.Pane>
      </SplitPageLayout>,
    )

    const pane = getByText('Pane Content')

    expect(pane.getAttribute('id')).toBe('customId')
  })

  it('applies custom className', () => {
    const {container} = render(
      <SplitPageLayout className="custom-class">
        <SplitPageLayout.Header>Header</SplitPageLayout.Header>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
        <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
        <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
      </SplitPageLayout>,
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})
