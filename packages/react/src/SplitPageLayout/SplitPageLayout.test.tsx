import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import 'react-intersection-observer/test-utils'
import {SplitPageLayout} from '../SplitPageLayout/SplitPageLayout'
import {implementsClassName} from '../utils/testing'

describe('SplitPageLayout', () => {
  implementsClassName(SplitPageLayout)

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
