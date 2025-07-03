import {render} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import 'react-intersection-observer/test-utils'
import {SplitPageLayout} from '../SplitPageLayout/SplitPageLayout'

let matchMedia: MatchMediaMock

describe('SplitPageLayout', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
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

    expect(container).toMatchSnapshot()
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
