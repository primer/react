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
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
