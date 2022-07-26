import React from 'react'
import {act, render} from '@testing-library/react'
import MatchMediaMock from 'jest-matchmedia-mock'
import {ThemeProvider} from '..'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {PageLayout} from './PageLayout'

let matchMedia: MatchMediaMock

describe('PageLayout', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterEach(() => {
    matchMedia.clear()
  })

  it('renders default layout', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders condensed layout', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout padding="condensed" rowGap="condensed" columnGap="condensed">
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with dividers', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header divider="line" dividerWhenNarrow="filled">
            Header
          </PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane position="start" divider="line" dividerWhenNarrow="filled">
            Pane
          </PageLayout.Pane>
          <PageLayout.Footer dividerWhenNarrow="line">Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders pane in different position when narrow', () => {
    const {container} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane positionWhenNarrow="start">Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('can hide pane when narrow', () => {
    // Set narrow viewport
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    const {getByText} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )

    expect(getByText('Pane')).not.toBeVisible()
  })

  it('shows all subcomponents by default', () => {
    // Set regular viewport
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.regular)
    })

    const {getByText} = render(
      <ThemeProvider>
        <PageLayout>
          <PageLayout.Header>Header</PageLayout.Header>
          <PageLayout.Content>Content</PageLayout.Content>
          <PageLayout.Pane hidden={{narrow: true}}>Pane</PageLayout.Pane>
          <PageLayout.Footer>Footer</PageLayout.Footer>
        </PageLayout>
      </ThemeProvider>
    )

    expect(getByText('Pane')).toBeVisible()
  })
})
