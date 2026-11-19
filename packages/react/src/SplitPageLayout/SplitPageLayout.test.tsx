import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import 'react-intersection-observer/test-utils'
import {SplitPageLayout} from '../SplitPageLayout/SplitPageLayout'
import {implementsClassName} from '../utils/testing'

describe('SplitPageLayout', () => {
  implementsClassName(SplitPageLayout)

  it('renders data-component attributes for all components', async () => {
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Header>Header</SplitPageLayout.Header>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
        <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
        <SplitPageLayout.Sidebar>Sidebar</SplitPageLayout.Sidebar>
        <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
      </SplitPageLayout>,
    )

    await expect
      .element(container.querySelector<HTMLElement>(':first-child'))
      .toHaveAttribute('data-component', 'SplitPageLayout')
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Header"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Content"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Pane"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Sidebar"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SplitPageLayout.Footer"]'))
      .toBeInTheDocument()
  })

  it('renders Pane with a custom ID', async () => {
    render(
      <SplitPageLayout>
        <SplitPageLayout.Pane id="customId">Pane Content</SplitPageLayout.Pane>
      </SplitPageLayout>,
    )

    const pane = page.getByText('Pane Content')

    await expect.element(pane).toHaveAttribute('id', 'customId')
  })

  it('applies custom className', async () => {
    const {container} = render(
      <SplitPageLayout className="custom-class">
        <SplitPageLayout.Header>Header</SplitPageLayout.Header>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
        <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
        <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
      </SplitPageLayout>,
    )

    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveClass('custom-class')
  })
})
