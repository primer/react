import React from 'react'
import {render} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import 'react-intersection-observer/test-utils'
import {ThemeProvider} from '..'
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
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Header>Header</SplitPageLayout.Header>
          <SplitPageLayout.Content>Content</SplitPageLayout.Content>
          <SplitPageLayout.Pane>Pane</SplitPageLayout.Pane>
          <SplitPageLayout.Footer>Footer</SplitPageLayout.Footer>
        </SplitPageLayout>
      </ThemeProvider>,
    )

    expect(container).toMatchSnapshot()
  })

  it('renders Pane with a custom ID', () => {
    const {getByText} = render(
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Pane id="customId">Pane Content</SplitPageLayout.Pane>
        </SplitPageLayout>
      </ThemeProvider>,
    )

    const pane = getByText('Pane Content')

    expect(pane.getAttribute('id')).toBe('customId')
  })

  it('renders Pane with a heading', () => {
    const {getByText} = render(
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Pane>
            <SplitPageLayout.PaneHeading as="h2">Custom Heading</SplitPageLayout.PaneHeading>
          </SplitPageLayout.Pane>
        </SplitPageLayout>
      </ThemeProvider>,
    )
    const heading = getByText('Custom Heading')

    expect(heading.tagName).toBe('H2')
  })

  it('renders Pane with a custom level heading', () => {
    const {getByText} = render(
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Pane>
            <SplitPageLayout.PaneHeading as="h3">Custom Heading</SplitPageLayout.PaneHeading>
          </SplitPageLayout.Pane>
        </SplitPageLayout>
      </ThemeProvider>,
    )
    const heading = getByText('Custom Heading')

    expect(heading.tagName).toBe('H3')
  })

  it('renders Pane with a heading in the correct spot', () => {
    const {getByText, getAllByTestId} = render(
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Pane aria-label="Custom Pane">
            <div data-testid="content">Some Content</div>
            <SplitPageLayout.PaneHeading as="h3" data-testid="content">
              Custom Heading
            </SplitPageLayout.PaneHeading>
          </SplitPageLayout.Pane>
        </SplitPageLayout>
      </ThemeProvider>,
    )
    const paneContents = getAllByTestId('content')[0]
    const heading = getByText('Custom Heading')

    expect(paneContents).toBe(heading)
  })
})
