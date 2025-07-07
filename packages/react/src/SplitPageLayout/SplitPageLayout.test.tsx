import {describe, expect, it, vi, beforeAll, afterEach} from 'vitest'
import {render} from '@testing-library/react'
import 'react-intersection-observer/test-utils'
import {SplitPageLayout} from '../SplitPageLayout/SplitPageLayout'

function mockMatchMedia({defaultMatch = false} = {}) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: defaultMatch,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('SplitPageLayout', () => {
  beforeAll(() => {
    mockMatchMedia()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders default layout', () => {
    const {container} = render(
      <SplitPageLayout>
        <SplitPageLayout.Header>Header</SplitPageLayout.Header>
        <SplitPageLayout.Content>Content</SplitPageLayout.Content>
        <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
        <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
      </SplitPageLayout>,
    )

    expect(container.firstChild).toBeInTheDocument()
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
