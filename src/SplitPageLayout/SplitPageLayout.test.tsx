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
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
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
    expect(spy).toHaveBeenCalled()

    expect(container).toMatchSnapshot()
  })

  it('renders Pane with a custom ID', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const {getByText} = render(
      <ThemeProvider>
        <SplitPageLayout>
          <SplitPageLayout.Pane id="customId">Pane Content</SplitPageLayout.Pane>
        </SplitPageLayout>
      </ThemeProvider>,
    )
    expect(spy).toHaveBeenCalled()

    const pane = getByText('Pane Content')

    expect(pane.getAttribute('id')).toBe('customId')
  })
})
